// Generates SANDBOX FedEx shipping labels (PDF, 4x6) for validation by the
// FedEx Label Analysis Group. Calls https://apis-sandbox.fedex.com with the
// TEST credentials and produces one label per service. Uploads each PDF to
// the private `fedex-test-labels` bucket and returns signed download URLs.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FEDEX_BASE = "https://apis-sandbox.fedex.com";
const BUCKET = "fedex-test-labels";

const SERVICES = [
  "STANDARD_OVERNIGHT",
  "PRIORITY_OVERNIGHT",
  "FIRST_OVERNIGHT",
  "GROUND_HOME_DELIVERY",
];

const SHIPPER = {
  contact: {
    personName: "Charls Flowers",
    phoneNumber: "9044424042",
    companyName: "Charls Flowers",
  },
  address: {
    streetLines: ["7261 NW 12th St"],
    city: "Miami",
    stateOrProvinceCode: "FL",
    postalCode: "33126",
    countryCode: "US",
  },
};

const RECIPIENT = {
  contact: {
    personName: "John Doe",
    phoneNumber: "2125551234",
  },
  address: {
    streetLines: ["350 5th Ave"],
    city: "New York",
    stateOrProvinceCode: "NY",
    postalCode: "10118",
    countryCode: "US",
    residential: true,
  },
};

const PACKAGE = {
  weight: { units: "LB", value: 11 },
  dimensions: { length: 28, width: 13, height: 13, units: "IN" },
};

async function getToken(): Promise<string> {
  const clientId = Deno.env.get("FEDEX_TEST_CLIENT_ID");
  const clientSecret = Deno.env.get("FEDEX_TEST_CLIENT_SECRET");
  if (!clientId || !clientSecret) throw new Error("Missing FedEx test credentials");
  const res = await fetch(`${FEDEX_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const j = await res.json();
  if (!res.ok || !j.access_token) {
    throw new Error(`FedEx OAuth failed: ${JSON.stringify(j)}`);
  }
  return j.access_token as string;
}

function todayStamp(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function createLabel(token: string, accountNumber: string, serviceType: string) {
  const payload = {
    labelResponseOptions: "LABEL",
    accountNumber: { value: accountNumber },
    requestedShipment: {
      shipper: SHIPPER,
      recipients: [RECIPIENT],
      shipDatestamp: todayStamp(),
      serviceType,
      packagingType: "YOUR_PACKAGING",
      pickupType: "USE_SCHEDULED_PICKUP",
      shippingChargesPayment: { paymentType: "SENDER" },
      labelSpecification: {
        labelStockType: "PAPER_4X6",
        imageType: "PDF",
        labelFormatType: "COMMON2D",
      },
      requestedPackageLineItems: [PACKAGE],
    },
  };

  const res = await fetch(`${FEDEX_BASE}/ship/v1/shipments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-locale": "en_US",
    },
    body: JSON.stringify(payload),
  });
  const j = await res.json();
  if (!res.ok) {
    return { ok: false as const, error: j };
  }
  const shipment = j?.output?.transactionShipments?.[0];
  const tracking = shipment?.masterTrackingNumber
    || shipment?.pieceResponses?.[0]?.trackingNumber
    || "unknown";
  const pkg = shipment?.pieceResponses?.[0]?.packageDocuments?.[0];
  const encoded = pkg?.encodedLabel || pkg?.parts?.[0]?.image;
  if (!encoded) {
    return { ok: false as const, error: { message: "No encodedLabel in response", raw: j } };
  }
  return { ok: true as const, tracking, pdf: base64ToBytes(encoded) };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const accountNumber = Deno.env.get("FEDEX_TEST_ACCOUNT_NUMBER");
    if (!accountNumber) throw new Error("FEDEX_TEST_ACCOUNT_NUMBER not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const token = await getToken();
    const runId = new Date().toISOString().replace(/[:.]/g, "-");

    const results: Array<Record<string, unknown>> = [];

    for (const service of SERVICES) {
      try {
        const r = await createLabel(token, accountNumber, service);
        if (!r.ok) {
          results.push({ service, success: false, error: r.error });
          continue;
        }
        const path = `${runId}/${service}.pdf`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, r.pdf, { contentType: "application/pdf", upsert: true });
        if (upErr) {
          results.push({ service, success: false, error: { upload: upErr.message } });
          continue;
        }
        const { data: signed, error: signErr } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days
        if (signErr || !signed) {
          results.push({ service, success: false, error: { sign: signErr?.message } });
          continue;
        }
        results.push({
          service,
          success: true,
          trackingNumber: r.tracking,
          downloadUrl: signed.signedUrl,
          fileName: `${service}.pdf`,
        });
      } catch (err) {
        results.push({ service, success: false, error: { message: (err as Error).message } });
      }
    }

    return new Response(
      JSON.stringify({ runId, results }, null, 2),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("generate-fedex-test-labels error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});