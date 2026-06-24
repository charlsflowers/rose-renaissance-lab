// Meta Conversions API forwarder.
// Receives ViewContent / AddToCart events from the browser and re-sends them
// server-side to Meta with the SAME eventID for deduplication against the
// browser Pixel. Enriches with hashed Advanced Matching + fbp/fbc/IP/UA.

const PIXEL_ID = "1631820708074499";
const ACCESS_TOKEN = Deno.env.get("META_CAPI_ACCESS_TOKEN") ?? "";
const GRAPH_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_EVENTS = new Set([
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "Lead",
  "Search",
  "PageView",
]);

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const norm = (v: unknown): string =>
  typeof v === "string" ? v.trim().toLowerCase() : "";

const normPhone = (v: unknown): string =>
  typeof v === "string" ? v.replace(/[^\d]/g, "") : "";

async function hashOrEmpty(value: string): Promise<string | undefined> {
  if (!value) return undefined;
  return await sha256Hex(value);
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || "";
}

type IncomingEvent = {
  event_name: string;
  event_id?: string;
  event_time?: number;
  event_source_url?: string;
  action_source?: string;
  custom_data?: Record<string, unknown>;
  user_data?: {
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    external_id?: string;
    fbp?: string;
    fbc?: string;
  };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!ACCESS_TOKEN) {
    return new Response(
      JSON.stringify({ error: "META_CAPI_ACCESS_TOKEN not configured" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  let body: { events?: IncomingEvent[]; test_event_code?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const events = Array.isArray(body?.events) ? body!.events! : [];
  if (events.length === 0) {
    return new Response(JSON.stringify({ error: "no_events" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const clientIp = getClientIp(req);
  const userAgent = req.headers.get("user-agent") || "";

  const built = await Promise.all(
    events
      .filter((e) => e && ALLOWED_EVENTS.has(e.event_name))
      .map(async (e) => {
        const u = e.user_data || {};
        const user_data: Record<string, unknown> = {
          client_ip_address: clientIp || undefined,
          client_user_agent: userAgent || undefined,
          fbp: u.fbp || undefined,
          fbc: u.fbc || undefined,
        };

        const em = await hashOrEmpty(norm(u.email));
        if (em) user_data.em = [em];
        const ph = await hashOrEmpty(normPhone(u.phone));
        if (ph) user_data.ph = [ph];
        const fn = await hashOrEmpty(norm(u.first_name));
        if (fn) user_data.fn = [fn];
        const ln = await hashOrEmpty(norm(u.last_name));
        if (ln) user_data.ln = [ln];
        const ct = await hashOrEmpty(norm(u.city));
        if (ct) user_data.ct = [ct];
        const st = await hashOrEmpty(norm(u.state));
        if (st) user_data.st = [st];
        const zp = await hashOrEmpty(norm(u.zip));
        if (zp) user_data.zp = [zp];
        const country = await hashOrEmpty(norm(u.country));
        if (country) user_data.country = [country];
        const ext = await hashOrEmpty(norm(u.external_id));
        if (ext) user_data.external_id = [ext];

        // Strip undefined
        Object.keys(user_data).forEach(
          (k) => user_data[k] === undefined && delete user_data[k]
        );

        return {
          event_name: e.event_name,
          event_time: e.event_time || Math.floor(Date.now() / 1000),
          event_id: e.event_id, // critical for dedup with browser Pixel
          event_source_url: e.event_source_url,
          action_source: e.action_source || "website",
          user_data,
          custom_data: e.custom_data || {},
        };
      })
  );

  if (built.length === 0) {
    return new Response(JSON.stringify({ error: "no_valid_events" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const payload: Record<string, unknown> = { data: built };
  if (body.test_event_code) payload.test_event_code = body.test_event_code;

  try {
    const res = await fetch(
      `${GRAPH_URL}?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const text = await res.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }

    return new Response(
      JSON.stringify({ ok: res.ok, status: res.status, meta: parsed }),
      {
        status: res.ok ? 200 : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    // Keep error detail server-side only; do not leak internals to the client.
    console.error("meta-capi network_error:", err);
    return new Response(
      JSON.stringify({ error: "network_error" }),
      {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});