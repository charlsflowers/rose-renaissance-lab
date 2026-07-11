// TEMPORARY function to export secret values for migration. DELETE after use.
const AUTH_KEY = "jzYfO-jmUEPmRG-YrggFVz-WXwlhis0JZQ3STPoB-vVttpqCSy2LurCu41C_46wv";

const NAMES = [
  "FEDEX_CLIENT_ID",
  "FEDEX_CLIENT_SECRET",
  "FEDEX_ACCOUNT_NUMBER",
  "PRINTNODE_API_KEY",
  "PDFSHIFT_API_KEY",
  "RESEND_API_KEY",
  "SHOPIFY_ACCESS_TOKEN",
  "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  "SHOPIFY_WEBHOOK_SECRET",
  "META_CAPI_ACCESS_TOKEN",
  "INVOICE_PREVIEW_SECRET",
  "GOOGLE_MAPS_API_KEY",
];

Deno.serve((req) => {
  const url = new URL(req.url);
  const key = url.searchParams.get("key") || "";
  if (key.length !== AUTH_KEY.length || key !== AUTH_KEY) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const out: Record<string, string | null> = {};
  for (const n of NAMES) out[n] = Deno.env.get(n) ?? null;
  return new Response(JSON.stringify(out, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
});