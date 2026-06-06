// FedEx Rate Quote Edge Function (Production).
// Returns up to 3 shipping options for a US destination (excludes HI, PR, AK).
// Origin: Charls Flowers HQ Miami. Box auto-picked by rose count.
// Hard cutoff: 11:00 AM America/New_York for same-day pickup.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FEDEX_BASE = "https://apis.fedex.com";

const ORIGIN = {
  streetLines: ["7261 NW 12th St"],
  city: "Miami",
  stateOrProvinceCode: "FL",
  postalCode: "33126",
  countryCode: "US",
  residential: false,
};

const BLOCKED_STATES = new Set(["HI", "PR", "AK"]);

// Box dimensions and weight by rose count tier (inches / lb).
function pickBox(roses: number) {
  if (roses <= 25) {
    return { length: 12, width: 12, height: 18, weight: 5, tier: "small" };
  }
  if (roses <= 50) {
    return { length: 16, width: 16, height: 24, weight: 10, tier: "medium" };
  }
  if (roses <= 100) {
    return { length: 20, width: 20, height: 30, weight: 18, tier: "large" };
  }
  return null; // > 100 not supported via FedEx
}

// Human-readable FedEx service labels.
const SERVICE_LABELS: Record<string, string> = {
  STANDARD_OVERNIGHT: "Standard Overnight",
  PRIORITY_OVERNIGHT: "Priority Overnight",
  FIRST_OVERNIGHT: "First Overnight",
  FEDEX_2_DAY: "2 Day",
  FEDEX_2_DAY_AM: "2 Day AM",
  FEDEX_EXPRESS_SAVER: "Express Saver (3 Day)",
  FEDEX_GROUND: "Ground",
  GROUND_HOME_DELIVERY: "Ground Home Delivery",
};

// Returns Miami (America/New_York) hour:minute right now.
function miamiNow(): { hours: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parseInt(parts.find((p) => p.type === t)?.value || "0");
  return { hours: get("hour"), minutes: get("minute") };
}

// shipDateStamp = (delivery date - 1 day) as YYYY-MM-DD in UTC.
// If past 11:00 Miami time and the desired ship date is today, push to tomorrow.
function computeShipDateStamp(deliveryDateISO: string): string {
  const delivery = new Date(`${deliveryDateISO}T12:00:00Z`);
  const ship = new Date(delivery);
  ship.setUTCDate(ship.getUTCDate() - 1);

  const todayUTC = new Date();
  const todayStr = `${todayUTC.getUTCFullYear()}-${String(todayUTC.getUTCMonth() + 1).padStart(2, "0")}-${String(todayUTC.getUTCDate()).padStart(2, "0")}`;
  const shipStr = `${ship.getUTCFullYear()}-${String(ship.getUTCMonth() + 1).padStart(2, "0")}-${String(ship.getUTCDate()).padStart(2, "0")}`;

  if (shipStr <= todayStr) {
    const { hours } = miamiNow();
    const base = new Date();
    if (hours >= 11) {
      base.setUTCDate(base.getUTCDate() + 1);
    }
    return `${base.getUTCFullYear()}-${String(base.getUTCMonth() + 1).padStart(2, "0")}-${String(base.getUTCDate()).padStart(2, "0")}`;
  }
  return shipStr;
}

async function getFedExToken(): Promise<string> {
  const clientId = Deno.env.get("FEDEX_CLIENT_ID");
  const clientSecret = Deno.env.get("FEDEX_CLIENT_SECRET");
  if (!clientId || !clientSecret) {
    throw new Error("FedEx credentials not configured");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(`${FEDEX_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await res.json();
  if (!res.ok || !json.access_token) {
    throw new Error(`FedEx OAuth failed: ${JSON.stringify(json)}`);
  }
  return json.access_token as string;
}

interface RateRequestBody {
  recipient: {
    streetLines: string[];
    city: string;
    stateOrProvinceCode: string;
    postalCode: string;
    countryCode?: string;
    residential?: boolean;
  };
  roses: number;
  deliveryDate: string; // YYYY-MM-DD
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as RateRequestBody;
    const { recipient, roses, deliveryDate } = body;

    if (!recipient?.postalCode || !recipient?.stateOrProvinceCode) {
      return json({ error: "Missing recipient address" }, 400);
    }
    if (!deliveryDate) return json({ error: "Missing deliveryDate" }, 400);
    const country = (recipient.countryCode || "US").toUpperCase();
    if (country !== "US") {
      return json({ error: "FedEx shipping only available within the US." }, 200);
    }
    const stateCode = recipient.stateOrProvinceCode.toUpperCase();
    if (BLOCKED_STATES.has(stateCode)) {
      return json({ error: `FedEx shipping is not available for ${stateCode}.` }, 200);
    }

    const box = pickBox(roses);
    if (!box) {
      return json(
        { error: "FedEx shipping is not available for bouquets over 100 roses." },
        200,
      );
    }

    const accountNumber = Deno.env.get("FEDEX_ACCOUNT_NUMBER");
    if (!accountNumber) return json({ error: "FedEx account not configured" }, 500);

    const shipDateStamp = computeShipDateStamp(deliveryDate);

    const token = await getFedExToken();

    const ratePayload = {
      accountNumber: { value: accountNumber },
      requestedShipment: {
        shipper: { address: ORIGIN },
        recipient: {
          address: {
            streetLines: recipient.streetLines,
            city: recipient.city,
            stateOrProvinceCode: stateCode,
            postalCode: recipient.postalCode,
            countryCode: "US",
            residential: recipient.residential ?? true,
          },
        },
        shipDateStamp,
        pickupType: "USE_SCHEDULED_PICKUP",
        rateRequestType: ["ACCOUNT", "LIST"],
        requestedPackageLineItems: [
          {
            weight: { units: "LB", value: box.weight },
            dimensions: {
              length: box.length,
              width: box.width,
              height: box.height,
              units: "IN",
            },
          },
        ],
      },
    };

    const rateRes = await fetch(`${FEDEX_BASE}/rate/v1/rates/quotes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-locale": "en_US",
      },
      body: JSON.stringify(ratePayload),
    });
    const rateJson = await rateRes.json();
    if (!rateRes.ok) {
      console.error("FedEx rate error:", JSON.stringify(rateJson));
      return json({ error: "FedEx rate request failed", details: rateJson }, 502);
    }

    const reply = rateJson?.output?.rateReplyDetails ?? [];
    type FedExRate = {
      serviceType?: string;
      serviceName?: string;
      ratedShipmentDetails?: Array<{
        totalNetCharge?: number;
        currency?: string;
      }>;
      commit?: { dateDetail?: { dayFormat?: string } };
    };

    const options = (reply as FedExRate[])
      .map((r) => {
        const rated = r.ratedShipmentDetails?.[0];
        const amount = rated?.totalNetCharge;
        if (typeof amount !== "number") return null;
        const code = r.serviceType || "";
        return {
          serviceCode: code,
          serviceLabel: SERVICE_LABELS[code] || r.serviceName || code,
          amount: Math.round(amount * 100) / 100,
          currency: rated?.currency || "USD",
          commit: r.commit?.dateDetail?.dayFormat || null,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a!.amount - b!.amount))
      .slice(0, 3);

    return json({
      options,
      shipDateStamp,
      boxTier: box.tier,
    }, 200);
  } catch (err) {
    console.error("calculate-fedex-shipping error:", err);
    return json({ error: (err as Error).message || "Internal error" }, 500);
  }
});

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}