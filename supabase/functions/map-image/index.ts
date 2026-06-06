// Server-side proxy for Google Static Maps. Keeps GOOGLE_MAPS_API_KEY on the
// server — clients only get a PNG, never the key.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const STORE_ADDRESS = "7261 NW 12th St, Miami, FL 33126";
const MAX_LEN = 250;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const destination = (url.searchParams.get("destination") || "").trim();
    const origin = (url.searchParams.get("origin") || STORE_ADDRESS).trim();

    if (!destination || destination.length > MAX_LEN || origin.length > MAX_LEN) {
      return new Response("Bad Request", { status: 400, headers: corsHeaders });
    }

    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!apiKey) {
      console.error("map-image: GOOGLE_MAPS_API_KEY not configured");
      return new Response("Service unavailable", { status: 500, headers: corsHeaders });
    }

    const originEnc = encodeURIComponent(origin);
    const destEnc = encodeURIComponent(destination);
    const googleUrl =
      `https://maps.googleapis.com/maps/api/staticmap` +
      `?size=640x300&scale=2` +
      `&markers=color:0x96103b%7Clabel:A%7C${originEnc}` +
      `&markers=color:0x96103b%7Clabel:B%7C${destEnc}` +
      `&path=color:0x96103bcc%7Cweight:3%7C${originEnc}%7C${destEnc}` +
      `&key=${apiKey}`;

    const res = await fetch(googleUrl);
    if (!res.ok) {
      console.error("map-image: Google returned", res.status);
      return new Response("Map unavailable", { status: 502, headers: corsHeaders });
    }
    const bytes = new Uint8Array(await res.arrayBuffer());
    return new Response(bytes, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("map-image error:", err);
    return new Response("Internal error", { status: 500, headers: corsHeaders });
  }
});