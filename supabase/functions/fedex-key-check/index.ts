import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(() => {
  const id = Deno.env.get("FEDEX_CLIENT_ID") || "";
  const acct = Deno.env.get("FEDEX_ACCOUNT_NUMBER") || "";
  return new Response(JSON.stringify({
    client_id_last6: id.slice(-6),
    client_id_length: id.length,
    has_client_secret: !!Deno.env.get("FEDEX_CLIENT_SECRET"),
    account_last4: acct.slice(-4),
  }), { headers: { "Content-Type": "application/json" } });
});