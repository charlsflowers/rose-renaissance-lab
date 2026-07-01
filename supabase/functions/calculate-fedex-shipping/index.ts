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
  GROUND_HOME_DELIVERY: "Ground Home Delivery",
};

// Only these 3 services are offered to the customer.
const ALLOWED_SERVICES = new Set([
  "STANDARD_OVERNIGHT",
  "PRIORITY_OVERNIGHT",
  "GROUND_HOME_DELIVERY",
]);

// Minimum business days per service (fallback when FedEx doesn't return a
// delivery date). Overnight = 1, Home Delivery = 3 (approx; real transit
// comes from FedEx returnTransitTimes).
const SERVICE_MIN_BUSINESS_DAYS: Record<string, number> = {
  PRIORITY_OVERNIGHT: 1,
  STANDARD_OVERNIGHT: 1,
  GROUND_HOME_DELIVERY: 3,
};

// Subtract N business days from an ISO date (skipping Sat/Sun).
function subtractBusinessDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  let left = n;
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() - 1);
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) left--;
  }
  return d.toISOString().slice(0, 10);
}

// Earliest allowed ship day = today in Miami (America/New_York), bumped to
// next weekday if it lands on Sat/Sun. Backend guard; frontend enforces the
// 11am cutoff.
function earliestShipISO(): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const iso = fmt.format(new Date());
  const d = new Date(`${iso}T12:00:00Z`);
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return d.toISOString().slice(0, 10);
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

    const earliestShip = earliestShipISO();
    // Overnight ship day = deliveryDate − 1 business day.
    const overnightShip = subtractBusinessDays(deliveryDate, 1);

    const token = await getFedExToken();

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

    async function fetchRates(shipDateStamp: string): Promise<FedExRate[]> {
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
      const res = await fetch(`${FEDEX_BASE}/rate/v1/rates/quotes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-locale": "en_US",
        },
        body: JSON.stringify(ratePayload),
      });
      const j = await res.json();
      if (!res.ok) {
        console.error("FedEx rate error:", JSON.stringify(j));
        throw new Error("fedex_rate_error");
      }
      return (j?.output?.rateReplyDetails ?? []) as FedExRate[];
    }

    function estimatedDeliveryOf(r: FedExRate): string {
      const raw =
        r.operationalDetail?.deliveryDate ||
        r.commit?.dateDetail?.dayFormat ||
        r.deliveryDate ||
        "";
      return raw ? raw.slice(0, 10) : "";
    }

    // Collect (rate, shipDate) pairs to consider.
    const candidates: Array<{ rate: FedExRate; shipDate: string }> = [];

    // ---- Call A: overnight ship date ----
    // Only worth calling if overnightShip is not before the earliest possible
    // ship day.
    let overnightRates: FedExRate[] = [];
    if (overnightShip >= earliestShip) {
      try {
        overnightRates = await fetchRates(overnightShip);
      } catch {
        return json({ error: "Error procesando la solicitud" }, 502);
      }
      for (const r of overnightRates) {
        if (r.serviceType === "STANDARD_OVERNIGHT" || r.serviceType === "PRIORITY_OVERNIGHT") {
          candidates.push({ rate: r, shipDate: overnightShip });
        }
      }
    }

    // ---- Home Delivery: derive proper ship date from transit ----
    // Use overnight response if available to read Home Delivery's transit,
    // otherwise probe with earliestShip.
    let homeProbe: FedExRate | undefined = overnightRates.find(
      (r) => r.serviceType === "GROUND_HOME_DELIVERY",
    );
    let homeProbeShip = overnightShip;
    if (!homeProbe) {
      try {
        const probeRates = await fetchRates(earliestShip);
        homeProbe = probeRates.find((r) => r.serviceType === "GROUND_HOME_DELIVERY");
        homeProbeShip = earliestShip;
      } catch {
        // ignore, home delivery just won't be offered
      }
    }

    if (homeProbe) {
      const probeDelivery = estimatedDeliveryOf(homeProbe);
      let transitDays = probeDelivery
        ? businessDaysBetween(homeProbeShip, probeDelivery)
        : SERVICE_MIN_BUSINESS_DAYS.GROUND_HOME_DELIVERY;
      if (transitDays < 1) transitDays = SERVICE_MIN_BUSINESS_DAYS.GROUND_HOME_DELIVERY;
      const homeShip = subtractBusinessDays(deliveryDate, transitDays);
      if (homeShip >= earliestShip) {
        if (homeShip === homeProbeShip) {
          candidates.push({ rate: homeProbe, shipDate: homeShip });
        } else {
          try {
            const homeRates = await fetchRates(homeShip);
            const homeRate = homeRates.find((r) => r.serviceType === "GROUND_HOME_DELIVERY");
            if (homeRate) candidates.push({ rate: homeRate, shipDate: homeShip });
          } catch {
            // skip home delivery on error
          }
        }
      }
    }

    const options = candidates
      .map(({ rate: r, shipDate }) => {
        const code = r.serviceType || "";
        if (!ALLOWED_SERVICES.has(code)) return null;
        // Always prefer the ACCOUNT (negotiated) rate. LIST is requested only
        // so FedEx returns both, but we must never charge LIST to the client.
        const rated =
          r.ratedShipmentDetails?.find((d) => d.rateType === "ACCOUNT") ??
          r.ratedShipmentDetails?.[0];
        const amount = rated?.totalNetCharge;
        if (typeof amount !== "number") return null;
        // Show the service ONLY if FedEx's estimated delivery === deliveryDate
        // and the ship day is not before the earliest allowed ship day.
        const estimatedDate = estimatedDeliveryOf(r);
        let matches = false;
        if (estimatedDate) {
          matches = estimatedDate === deliveryDate;
        } else {
          const minDays = SERVICE_MIN_BUSINESS_DAYS[code];
          if (typeof minDays === "number") {
            matches = businessDaysBetween(shipDate, deliveryDate) >= minDays;
          }
        }
        if (!matches) return null;
        if (shipDate < earliestShip) return null;
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
      shipDateStamp: overnightShip,
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