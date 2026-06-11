// Preview-only endpoint: renders the workshop invoice (Order Printer Pro
// Liquid template) for a Shopify order, converts HTML to PDF via PDFShift,
// uploads to the `invoice-previews` Storage bucket, and returns a signed URL.
// NO PrintNode calls here — this is for visual QA before wiring up auto-print.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Liquid } from "npm:liquidjs@10.16.1";
import { createClient } from "npm:@supabase/supabase-js@2";
import { INVOICE_TEMPLATE } from "./template.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const SHOP_DOMAIN = Deno.env.get("SHOPIFY_SHOP_DOMAIN") || "charls-flowers.myshopify.com";
const API_VERSION = "2024-10";

function money(cents: number | string): string {
  const n = typeof cents === "string" ? parseFloat(cents) : cents;
  if (!isFinite(n as number)) return "$0.00";
  return "$" + ((n as number) / 100).toFixed(2);
}

function imgUrl(url: string, size?: string): string {
  if (!url || typeof url !== "string") return "";
  if (!size) return url;
  // Insert `_<size>` before the file extension. Handles ?query suffixes.
  return url.replace(/(\.(?:png|jpe?g|webp|gif|avif))(\?|$)/i, `_${size}$1$2`);
}

function toCents(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === "number") return Math.round(v * 100);
  const n = parseFloat(String(v));
  return isFinite(n) ? Math.round(n * 100) : 0;
}

interface ShopifyLineItemRest {
  id: number;
  title: string;
  name?: string;
  variant_title?: string | null;
  quantity: number;
  price: string;
  product_id: number | null;
}

interface ShopifyShippingLineRest {
  title: string;
  price: string;
}

interface ShopifyOrderRest {
  id: number;
  name: string;
  order_number: number;
  email: string | null;
  phone: string | null;
  note: string | null;
  created_at: string;
  note_attributes?: Array<{ name: string; value: string }>;
  line_items: ShopifyLineItemRest[];
  shipping_lines: ShopifyShippingLineRest[];
  billing_address?: Record<string, unknown> | null;
  shipping_address?: Record<string, unknown> | null;
  financial_status?: string;
}

async function shopifyAdmin(path: string, token: string): Promise<unknown> {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}${path}`, {
    headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Shopify ${path} → ${res.status}: ${await res.text()}`);
  return await res.json();
}

async function shopifyGraphQL(query: string, variables: Record<string, unknown>, token: string): Promise<unknown> {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const j = await res.json();
  if (!res.ok || j.errors) throw new Error(`Shopify GraphQL error: ${JSON.stringify(j)}`);
  return j;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const adminToken = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
    const pdfshiftKey = Deno.env.get("PDFSHIFT_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!adminToken) throw new Error("SHOPIFY_ACCESS_TOKEN missing");
    if (!pdfshiftKey) throw new Error("PDFSHIFT_API_KEY missing");

    const url = new URL(req.url);
    const orderIdParam = url.searchParams.get("order_id");
    const nameParam = url.searchParams.get("name");

    // 1) Resolve order
    let order: ShopifyOrderRest;
    if (orderIdParam) {
      const j = (await shopifyAdmin(`/orders/${orderIdParam}.json`, adminToken)) as { order: ShopifyOrderRest };
      order = j.order;
    } else if (nameParam) {
      const q = encodeURIComponent(nameParam.startsWith("#") ? nameParam : `#${nameParam}`);
      const j = (await shopifyAdmin(`/orders.json?status=any&name=${q}&limit=1`, adminToken)) as { orders: ShopifyOrderRest[] };
      if (!j.orders?.length) throw new Error(`Order not found: ${nameParam}`);
      order = j.orders[0];
    } else {
      // Latest paid order
      const j = (await shopifyAdmin(`/orders.json?status=any&financial_status=paid&limit=1`, adminToken)) as { orders: ShopifyOrderRest[] };
      if (!j.orders?.length) throw new Error("No paid orders found");
      order = j.orders[0];
    }

    // 2) Enrich products: featured_image + metafield custom.preparation_recipe
    const productIds = Array.from(
      new Set(order.line_items.map((li) => li.product_id).filter((x): x is number => !!x)),
    );
    const productMap = new Map<number, { featured_image: string; preparation_recipe: string }>();
    if (productIds.length) {
      const gids = productIds.map((id) => `gid://shopify/Product/${id}`);
      const gql = `
        query($ids:[ID!]!){
          nodes(ids:$ids){
            ... on Product {
              id
              featuredImage { url }
              metafield(namespace:"custom", key:"preparation_recipe"){ value }
            }
          }
        }
      `;
      const r = (await shopifyGraphQL(gql, { ids: gids }, adminToken)) as {
        data: { nodes: Array<{ id: string; featuredImage?: { url: string }; metafield?: { value: string } } | null> };
      };
      for (const node of r.data.nodes) {
        if (!node?.id) continue;
        const numId = parseInt(node.id.replace(/\D/g, ""), 10);
        productMap.set(numId, {
          featured_image: node.featuredImage?.url || "",
          preparation_recipe: node.metafield?.value || "",
        });
      }
    }

    // 3) Build Liquid context matching Shopify Order Printer Pro shape
    const liquidLineItems = order.line_items.map((li) => {
      const prod = li.product_id ? productMap.get(li.product_id) : undefined;
      const priceCents = toCents(li.price);
      return {
        title: li.title,
        variant_title: li.variant_title,
        quantity: li.quantity,
        original_price: priceCents,
        original_line_price: priceCents * (li.quantity || 1),
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

    // 4) Render Liquid
    const engine = new Liquid({ strictFilters: false, strictVariables: false });
    engine.registerFilter("money", money);
    engine.registerFilter("img_url", imgUrl);
    const bodyHtml = await engine.parseAndRender(INVOICE_TEMPLATE, { order: liquidOrder });

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${order.name}</title></head><body>${bodyHtml}</body></html>`;

    // 5) PDFShift
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

    // 6) Upload to Storage + signed URL (24h)
    const supa = createClient(supabaseUrl, serviceKey);
    const path = `preview/${order.name.replace(/[^a-zA-Z0-9_-]/g, "_")}_${Date.now()}.pdf`;
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