import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const STORE_ADDRESS = "7255 NW 12th St, Miami, FL 33126";
const MAX_MILES = 87;
const PRICE_PER_MILE = 2;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { street, city, zip } = await req.json();

    if (!street || !city || !zip) {
      return new Response(
        JSON.stringify({ error: "Faltan campos de dirección (street, city, zip)" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const destination = `${street}, ${city}, FL ${zip}`;
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Google Maps API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
    url.searchParams.set("origins", STORE_ADDRESS);
    url.searchParams.set("destinations", destination);
    url.searchParams.set("units", "imperial");
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== "OK") {
      return new Response(
        JSON.stringify({ error: "Error de Google Maps API", details: data.status }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const element = data.rows?.[0]?.elements?.[0];

    if (!element || element.status !== "OK") {
      return new Response(
        JSON.stringify({ error: "No se pudo calcular la distancia. Verifica la dirección.", elementStatus: element?.status }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Distance in meters -> miles
    const distanceMeters = element.distance.value;
    const miles = Math.ceil(distanceMeters / 1609.344);
    const durationText = element.duration.text;

    if (miles > MAX_MILES) {
      return new Response(
        JSON.stringify({
          error: `La dirección está a ${miles} millas. El máximo de entrega es ${MAX_MILES} millas.`,
          miles,
          tooFar: true,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        miles,
        cost: miles * PRICE_PER_MILE,
        duration: durationText,
        destination,
        tooFar: false,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Error interno", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
