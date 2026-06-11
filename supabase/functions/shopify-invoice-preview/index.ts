// Preview-only endpoint: renders the workshop invoice (Order Printer Pro
// Liquid template) for a Shopify order, converts HTML to PDF via PDFShift,
// uploads to the `invoice-previews` Storage bucket, and returns a signed URL.
//
// Data sources (NO Admin API, NO SHOPIFY_ACCESS_TOKEN):
//   - Order data: provided directly via POST body (orders/paid webhook payload).
//   - Product enrichment (featured image + custom.preparation_recipe metafield):
//     fetched via Storefront API using SHOPIFY_STOREFRONT_ACCESS_TOKEN.
//
// Usage:
//   POST /shopify-invoice-preview
//   Content-Type: application/json
//   Body: <orders/paid webhook JSON payload>
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Liquid } from "npm:liquidjs@10.16.1";
import { createClient } from "npm:@supabase/supabase-js@2";
import { INVOICE_TEMPLATE } from "./template.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const SHOP_DOMAIN = "charls-flowers.myshopify.com";
const STOREFRONT_API_VERSION = "2025-01";

function money(cents: number | string): string {
  const n = typeof cents === "string" ? parseFloat(cents) : cents;
  if (!isFinite(n as number)) return "$0.00";
  return "$" + ((n as number) / 100).toFixed(2);
}

function imgUrl(url: string, size?: string): string {
  if (!url || typeof url !== "string") return "";
  if (!size) return url;
  return url.replace(/(\.(?:png|jpe?g|webp|gif|avif))(\?|$)/i, `_${size}$1$2`);
}

function toCents(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === "number") return Math.round(v * 100);
  const n = parseFloat(String(v));
  return isFinite(n) ? Math.round(n * 100) : 0;
}

interface WebhookLineItem {
  id: number;
  title: string;
  name?: string;
  variant_title?: string | null;
  quantity: number;
  price: string;
  product_id: number | null;
  properties?: Array<{ name: string; value: string }>;
}

interface WebhookShippingLine {
  title: string;
  price: string;
}

interface WebhookOrder {
  id: number;
  name: string;
  order_number: number;
  email: string | null;
  phone: string | null;
  note: string | null;
  created_at: string;
  note_attributes?: Array<{ name: string; value: string }>;
  line_items: WebhookLineItem[];
  shipping_lines: WebhookShippingLine[];
  billing_address?: Record<string, unknown> | null;
  shipping_address?: Record<string, unknown> | null;
}

async function storefrontProduct(
  productId: number,
  token: string,
): Promise<{ featured_image: string; preparation_recipe: string }> {
  const query = `
    query($id: ID!) {
      product(id: $id) {
        featuredImage { url }
        metafield(namespace: "custom", key: "preparation_recipe") { value }
      }
    }
  `;
  const res = await fetch(
    `https://${SHOP_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query,
        variables: { id: `gid://shopify/Product/${productId}` },
      }),
    },
  );
  const j = await res.json();
  if (!res.ok || j.errors) {
    console.error(`Storefront product ${productId} error:`, JSON.stringify(j));
    return { featured_image: "", preparation_recipe: "" };
  }
  const p = j?.data?.product;
  return {
    featured_image: p?.featuredImage?.url || "",
    preparation_recipe: p?.metafield?.value || "",
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const storefrontToken = Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
    const pdfshiftKey = Deno.env.get("PDFSHIFT_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!storefrontToken) throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN missing");
    if (!pdfshiftKey) throw new Error("PDFSHIFT_API_KEY missing");

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          ok: false,
          message:
            "POST the orders/paid webhook JSON as request body. The function reads order data from the body and enriches products via Storefront API.",
        }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const order = (await req.json()) as WebhookOrder;
    if (!order || !Array.isArray(order.line_items)) {
      throw new Error("Invalid order payload: missing line_items");
    }

    // 1) Enrich products via Storefront API (parallel)
    const productIds = Array.from(
      new Set(order.line_items.map((li) => li.product_id).filter((x): x is number => !!x)),
    );
    const productMap = new Map<number, { featured_image: string; preparation_recipe: string }>();
    const enriched = await Promise.all(
      productIds.map(async (id) => [id, await storefrontProduct(id, storefrontToken)] as const),
    );
    for (const [id, data] of enriched) productMap.set(id, data);

    // 2) Build Liquid context matching Order Printer Pro shape
    const liquidLineItems = order.line_items.map((li) => {
      const prod = li.product_id ? productMap.get(li.product_id) : undefined;
      const priceCents = toCents(li.price);
      return {
        title: li.title,
        variant_title: li.variant_title,
        quantity: li.quantity,
        original_price: priceCents,
        original_line_price: priceCents * (li.quantity || 1),
        properties: li.properties || [],
        product: {
          title: li.title,
          featured_image: prod?.featured_image || "",
          metafields: {
            custom: {
              preparation_recipe: prod?.preparation_recipe || "",
            },
          },
        },
      };
    });

    const liquidShipping = (order.shipping_lines || []).map((s) => ({
      title: s.title,
      price: toCents(s.price),
    }));

    const liquidOrder = {
      order_number: order.order_number || order.name,
      name: order.name,
      created_at: order.created_at,
      email: order.email || "",
      phone: order.phone || "",
      note: order.note || "",
      attributes: order.note_attributes || [],
      billing_address: order.billing_address || {},
      shipping_address: order.shipping_address || {},
      line_items: liquidLineItems,
      shipping_lines: liquidShipping,
    };

    // 3) Render Liquid → HTML
    const engine = new Liquid({ strictFilters: false, strictVariables: false });
    engine.registerFilter("money", money);
    engine.registerFilter("img_url", imgUrl);
    const bodyHtml = await engine.parseAndRender(INVOICE_TEMPLATE, { order: liquidOrder });
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${order.name}</title></head><body>${bodyHtml}</body></html>`;

    // 4) HTML → PDF via PDFShift
    const pdfRes = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`api:${pdfshiftKey}`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: html,
        format: "A4",
        margin: "10mm",
        sandbox: false,
        use_print: false,
      }),
    });
    if (!pdfRes.ok) {
      const t = await pdfRes.text();
      throw new Error(`PDFShift ${pdfRes.status}: ${t}`);
    }
    const pdfBytes = new Uint8Array(await pdfRes.arrayBuffer());

    // 5) Upload to Storage + signed URL (24h)
    const supa = createClient(supabaseUrl, serviceKey);
    const safeName = (order.name || `order_${order.id}`).replace(/[^a-zA-Z0-9_-]/g, "_");
    const path = `preview/${safeName}_${Date.now()}.pdf`;
    const up = await supa.storage.from("invoice-previews").upload(path, pdfBytes, {
      contentType: "application/pdf",
      upsert: true,
    });
    if (up.error) throw new Error(`Storage upload: ${up.error.message}`);
    const signed = await supa.storage.from("invoice-previews").createSignedUrl(path, 60 * 60 * 24);
    if (signed.error) throw new Error(`Signed URL: ${signed.error.message}`);

    return new Response(
      JSON.stringify({
        ok: true,
        order_name: order.name,
        order_id: order.id,
        products_enriched: productIds.length,
        pdf_bytes: pdfBytes.length,
        download_url: signed.data.signedUrl,
        storage_path: path,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("shopify-invoice-preview error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});