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

// Max FedEx options returned to the client (cheapest first).
const MAX_FEDEX_OPTIONS = 3;

// Box dimensions and weight by rose count tier (inches / lb).
// Dimensions ordered as Height x Width x Depth (mapped to FedEx length/width/height).
// Each tier has a fixed box price + handling/service fee added on top of FedEx rate.
function pickBox(roses: number) {
  if (roses <= 25) {
    return { length: 22, width: 11, height: 11, weight: 9, tier: "small", boxPrice: 10, serviceFee: 22 };
  }
  if (roses <= 50) {
    return { length: 28, width: 13, height: 13, weight: 11, tier: "medium", boxPrice: 12, serviceFee: 25 };
  }
  if (roses <= 100) {
    return { length: 30, width: 18, height: 18, weight: 18, tier: "large", boxPrice: 18, serviceFee: 40 };
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

// shipDateStamp = delivery date − 1 day, in UTC YYYY-MM-DD. No time-of-day bump.
function computeShipDateStamp(deliveryDateISO: string): string {
  const delivery = new Date(`${deliveryDateISO}T12:00:00Z`);
  const ship = new Date(delivery);
  ship.setUTCDate(ship.getUTCDate() - 1);
  return ship.toISOString().slice(0, 10);
}

function businessDaysBetween(startISO: string, endISO: string): number {
  const start = new Date(`${startISO}T00:00:00Z`);
  const end = new Date(`${endISO}T00:00:00Z`);
  if (end <= start) return 0;
  let count = 0;
  const cur = new Date(start);
  while (cur < end) {
    cur.setUTCDate(cur.getUTCDate() + 1);
    const day = cur.getUTCDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count;
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
        rateRequestControlParameters: {
          returnTransitTimes: true,
        },
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
      return json({ error: "Error procesando la solicitud" }, 502);
    }

    const reply = rateJson?.output?.rateReplyDetails ?? [];

    // Companion call to FedEx Service Availability API to obtain the real
    // committed delivery date per service. The Rate API in this account does
    // not return commit data, so this dedicated endpoint is our source of
    // truth for transit times.
    const transitPayload = {
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
        packagingType: "YOUR_PACKAGING",
        pickupType: "USE_SCHEDULED_PICKUP",
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
      carrierCodes: ["FDXE", "FDXG"],
    };
    const transitDates = new Map<string, string>(); // serviceType -> YYYY-MM-DD
    try {
      const ttRes = await fetch(`${FEDEX_BASE}/availability/v1/transittimes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-locale": "en_US",
        },
        body: JSON.stringify(transitPayload),
      });
      const ttJson = await ttRes.json();
      if (!ttRes.ok) {
        console.error("FedEx transit times error:", JSON.stringify(ttJson));
      } else {
        const options = ttJson?.output?.transitTimes?.[0]?.serviceOptions
          ?? ttJson?.output?.serviceOptions
          ?? [];
        for (const o of options as any[]) {
          const code = o?.serviceType || o?.service || "";
          // Various shapes documented across FedEx accounts.
          const raw =
            o?.commit?.derivedDeliveryDate ||
            o?.commit?.dateDetail?.dayFormat ||
            o?.commitTimestamp ||
            o?.deliveryDate ||
            "";
          const date = typeof raw === "string" ? raw.slice(0, 10) : "";
          if (code && date) transitDates.set(code, date);
        }
        console.log("FEDEX_TT_MAP", JSON.stringify(Array.from(transitDates.entries())));
      }
    } catch (e) {
      console.error("FedEx transit times call failed:", e);
    }

    type FedExRate = {
      serviceType?: string;
      serviceName?: string;
      ratedShipmentDetails?: Array<{
        totalNetCharge?: number;
        currency?: string;
        rateType?: string;
        shipmentRateDetail?: { rateZone?: string };
      }>;
      commit?: { dateDetail?: { dayFormat?: string } };
    };

    const options = (reply as FedExRate[])
      .map((r) => {
        // Always prefer the ACCOUNT (negotiated) rate. LIST is requested only
        // so FedEx returns both, but we must never charge LIST to the client.
        const rated =
          r.ratedShipmentDetails?.find((d) => d.rateType === "ACCOUNT") ??
          r.ratedShipmentDetails?.[0];
        const amount = rated?.totalNetCharge;
        if (typeof amount !== "number") return null;
        const code = r.serviceType || "";
        // FedEx is the sole authority on transit. Use the committed delivery
        // date returned by /rate (commit.dateDetail.dayFormat) or, if absent,
        // by /availability/v1/transittimes. If FedEx returns no date for a
        // service, drop it — never invent a transit time.
        const rateCommitRaw = r.commit?.dateDetail?.dayFormat || "";
        const rateCommitDate = rateCommitRaw ? rateCommitRaw.slice(0, 10) : "";
        const fedexDeliveryDate = rateCommitDate || transitDates.get(code) || "";
        if (!fedexDeliveryDate) return null;
        // Service arrives in time if FedEx's committed date is on or before
        // the customer's requested delivery date.
        if (fedexDeliveryDate > deliveryDate) return null;
        const fedexAmount = Math.round(amount * 100) / 100;
        const surcharge = box.boxPrice + box.serviceFee;
        const total = Math.round((fedexAmount + surcharge) * 100) / 100;
        return {
          serviceCode: code,
          serviceLabel: SERVICE_LABELS[code] || r.serviceName || code,
          amount: total,
          fedexAmount,
          boxPrice: box.boxPrice,
          serviceFee: box.serviceFee,
          currency: rated?.currency || "USD",
          commit: fedexDeliveryDate,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a!.amount - b!.amount))
      .slice(0, MAX_FEDEX_OPTIONS);

    return json({
      options,
      shipDateStamp,
      boxTier: box.tier,
      boxDimensions: { height: box.length, width: box.width, depth: box.height, weightLb: box.weight },
      boxPrice: box.boxPrice,
      serviceFee: box.serviceFee,
    }, 200);
  } catch (err) {
    console.error("calculate-fedex-shipping error:", err);
    return json({ error: "Error procesando la solicitud" }, 500);
  }
});

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}