import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STORE_ADDRESS = "7261 NW 12th St, Miami, FL 33126";
const MAX_MILES = 87;

function calculateCost(miles: number): number {
  if (miles <= 0) return 0;
  if (miles <= 5) return 25;
  return Math.round((25 + (miles - 5) * 1.6) * 100) / 100;
}

interface StructuredAddress {
  address1: string;
  city: string;
  province: string;
  zip: string;
  country: string;
}

async function fetchPlaceDetails(placeId: string, apiKey: string): Promise<StructuredAddress | null> {
  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "address_component");
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== "OK" || !data.result?.address_components) {
      console.error("Place Details error:", data.status, JSON.stringify(data));
      return null;
    }

    const components = data.result.address_components as Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;

    // Log FULL raw components array for debugging
    console.log("📍 [PlaceDetails] === RAW address_components START ===");
    for (const comp of components) {
      console.log(`📍 [PlaceDetails] Component: types=${JSON.stringify(comp.types)}, long_name="${comp.long_name}", short_name="${comp.short_name}"`);
    }
    console.log("📍 [PlaceDetails] === RAW address_components END ===");

    const get = (type: string, useShort = false) => {
      const comp = components.find((c) => c.types.includes(type));
      if (comp) {
        console.log(`📍 [PlaceDetails] Found ${type}: long_name="${comp.long_name}", short_name="${comp.short_name}", using ${useShort ? 'short' : 'long'}`);
      } else {
        console.log(`📍 [PlaceDetails] NOT FOUND: ${type}`);
      }
      return comp ? (useShort ? comp.short_name : comp.long_name) : "";
    };

    const streetNumber = get("street_number");
    const route = get("route");
    const address1 = [streetNumber, route].filter(Boolean).join(" ");

    const city = get("locality") || get("sublocality") || get("administrative_area_level_2");
    const province = get("administrative_area_level_1", true);
    const zip = get("postal_code");
    const country = get("country", true);

    const result = { address1, city, province, zip, country };
    console.log("📍 [PlaceDetails] Final structuredAddress:", JSON.stringify(result));

    return result;
  } catch (err) {
    console.error("Place Details fetch error:", err);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { street, city, zip, fullAddress, placeId } = await req.json();

    // Accept either fullAddress or street+city combo
    const destination = fullAddress || (street && city ? `${street}, ${city}, FL ${zip || ""}`.trim() : null);

    if (!destination) {
      return new Response(JSON.stringify({ error: "Faltan campos de dirección" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Google Maps API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
    url.searchParams.set("origins", STORE_ADDRESS);
    url.searchParams.set("destinations", destination);
    url.searchParams.set("units", "imperial");
    url.searchParams.set("key", apiKey);

    // Fetch distance and place details in parallel
    const [distanceResponse, structuredAddress] = await Promise.all([
      fetch(url.toString()).then((r) => r.json()),
      placeId ? fetchPlaceDetails(placeId, apiKey) : Promise.resolve(null),
    ]);

    if (distanceResponse.status !== "OK") {
      console.error("Distance Matrix API error status:", distanceResponse.status);
      return new Response(JSON.stringify({ error: "Servicio no disponible temporalmente" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const element = distanceResponse.rows?.[0]?.elements?.[0];

    if (!element || element.status !== "OK") {
      return new Response(
        JSON.stringify({
          error: "No se pudo calcular la distancia. Verifica la dirección.",
          elementStatus: element?.status,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Distance in meters -> miles
    const distanceMeters = element.distance.value;
    const miles = Math.ceil(distanceMeters / 1609.344);
    const durationText = element.duration.text;

    if (miles > MAX_MILES) {
      // Use the server-side proxy so the Google Maps key is never exposed.
      const supaUrl = Deno.env.get("SUPABASE_URL") || "";
      const mapImageUrl =
        `${supaUrl}/functions/v1/map-image` +
        `?origin=${encodeURIComponent(STORE_ADDRESS)}` +
        `&destination=${encodeURIComponent(destination)}`;
      return new Response(
        JSON.stringify({
          error: `La dirección está a ${miles} millas. El máximo de entrega es ${MAX_MILES} millas.`,
          miles,
          tooFar: true,
          structuredAddress: structuredAddress || null,
          destination,
          mapImageUrl,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const cost = calculateCost(miles);

    // Server-proxied static map (PNG). No API key is ever sent to the client.
    const supaUrl = Deno.env.get("SUPABASE_URL") || "";
    const mapUrl =
      `${supaUrl}/functions/v1/map-image` +
      `?origin=${encodeURIComponent(STORE_ADDRESS)}` +
      `&destination=${encodeURIComponent(destination)}`;

    return new Response(
      JSON.stringify({
        miles,
        cost,
        duration: durationText,
        destination,
        tooFar: false,
        mapUrl,
        structuredAddress: structuredAddress || null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("calculate-distance error:", err);
    return new Response(JSON.stringify({ error: "Error procesando la solicitud" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
