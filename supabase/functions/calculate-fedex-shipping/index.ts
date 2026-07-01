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
  return { length: 30, width: 18, height: 18, weight: 18, tier: "large", boxPrice: 18, serviceFee: 40 };
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

// Express services have a fixed transit by service definition (FedEx
// guarantees these): overnight = 1 business day, 2 Day = 2, Express Saver = 3.
// Used as the transit source for Express services because the FedEx Rate API
// in this account does not return commit/transit data.
const SERVICE_MIN_BUSINESS_DAYS: Record<string, number> = {
  FIRST_OVERNIGHT: 1,
  PRIORITY_OVERNIGHT: 1,
  STANDARD_OVERNIGHT: 1,
  FEDEX_2_DAY_AM: 2,
  FEDEX_2_DAY: 2,
  FEDEX_EXPRESS_SAVER: 3,
  GROUND_HOME_DELIVERY: 3,
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

    if (roses > 100) {
      return json({ error: "FedEx no disponible para ramos de más de 100 rosas" }, 200);
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
            residential: true,
          },
        },
        shipDateStamp,
        pickupType: "USE_SCHEDULED_PICKUP",
        rateRequestType: ["ACCOUNT", "LIST"],
        rateRequestControlParameters: { returnTransitTimes: true },
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
      operationalDetail?: { deliveryDate?: string };
      deliveryDate?: string;
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
        // Transit source per service:
        //  - Prefer FedEx-returned estimated delivery date (operationalDetail
        //    or commit). Show the service ONLY if that date === deliveryDate.
        //  - If FedEx does not return a date, fall back to minimum business
        //    days per service definition.
        const rawEstimated =
          r.operationalDetail?.deliveryDate ||
          r.commit?.dateDetail?.dayFormat ||
          r.deliveryDate ||
          "";
        const estimatedDate = rawEstimated ? rawEstimated.slice(0, 10) : "";
        let matches = false;
        if (estimatedDate) {
          matches = estimatedDate === deliveryDate;
        } else {
          const minDays = SERVICE_MIN_BUSINESS_DAYS[code];
          if (typeof minDays === "number") {
            matches = businessDaysBetween(shipDateStamp, deliveryDate) >= minDays;
          }
        }
        if (!matches) return null;
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
          commit: estimatedDate || null,
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