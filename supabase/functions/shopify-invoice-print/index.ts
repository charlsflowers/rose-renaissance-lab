// Shopify orders/paid webhook → render workshop invoice (same template/rules
// as shopify-invoice-preview) and send 3 copies to PrintNode.
//
// CRITICAL: A PrintNode failure (printer offline, API down, etc.) must NEVER
// block the webhook. Every print step is wrapped in try/catch and we always
// return 200 to Shopify so the order is not retried.
//
// This function does NOT touch FedEx, tracking, or Storefront/Admin tokens.
// It only:
//   1. Verifies Shopify HMAC.
//   2. Enriches line-item products via Storefront API (image + recipe metafield).
//   3. Renders the invoice via LiquidJS using the SHARED template.
//   4. Converts HTML → PDF via PDFShift.
//   5. Sends the PDF to PrintNode (printerId 75544825, qty 3).
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Liquid } from "npm:liquidjs@10.16.1";
import { INVOICE_TEMPLATE } from "./template.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "content-type, x-shopify-hmac-sha256, x-shopify-topic, x-shopify-shop-domain",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SHOP_DOMAIN = "charls-flowers.myshopify.com";
const STOREFRONT_API_VERSION = "2025-01";
const PRINTNODE_PRINTER_ID = 75544825;
const PRINTNODE_COPIES = 3;

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

async function verifyShopifyHmac(
  rawBody: string,
  hmacHeader: string,
  secret: string,
): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
    const bytes = new Uint8Array(sig);
    let bin = "";
    for (const b of bytes) bin += String.fromCharCode(b);
    const computed = btoa(bin);
    if (computed.length !== hmacHeader.length) return false;
    let diff = 0;
    for (let i = 0; i < computed.length; i++) {
      diff |= computed.charCodeAt(i) ^ hmacHeader.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
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
  try {
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
    const p = j?.data?.product;
    return {
      featured_image: p?.featuredImage?.url || "",
      preparation_recipe: p?.metafield?.value || "",
    };
  } catch (err) {
    console.error(`Storefront product ${productId} failed:`, err);
    return { featured_image: "", preparation_recipe: "" };
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

async function renderInvoicePdf(order: any): Promise<Uint8Array> {
  const storefrontToken = Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  const pdfshiftKey = Deno.env.get("PDFSHIFT_API_KEY");
  if (!storefrontToken) throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN missing");
  if (!pdfshiftKey) throw new Error("PDFSHIFT_API_KEY missing");

  const productIds = Array.from(
    new Set(
      (order.line_items || [])
        .map((li: any) => li.product_id)
        .filter((x: any): x is number => !!x),
    ),
  );
  const productMap = new Map<number, { featured_image: string; preparation_recipe: string }>();
  const enriched = await Promise.all(
    productIds.map(async (id) => [id, await storefrontProduct(id as number, storefrontToken)] as const),
  );
  for (const [id, data] of enriched) productMap.set(id as number, data);

  const liquidLineItems = (order.line_items || []).map((li: any) => {
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
          custom: { preparation_recipe: prod?.preparation_recipe || "" },
        },
      },
    };
  });

  const liquidShipping = (order.shipping_lines || []).map((s: any) => ({
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
    customer: order.customer || null,
    line_items: liquidLineItems,
    shipping_lines: liquidShipping,
  };

  const engine = new Liquid({ strictFilters: false, strictVariables: false });
  engine.registerFilter("money", money);
  engine.registerFilter("img_url", imgUrl);
  const bodyHtml = await engine.parseAndRender(INVOICE_TEMPLATE, { order: liquidOrder });
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${order.name}</title></head><body>${bodyHtml}</body></html>`;

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
  return new Uint8Array(await pdfRes.arrayBuffer());
}

async function sendToPrintNode(
  pdfBytes: Uint8Array,
  orderName: string,
  titlePrefix = "",
  qtyOverride?: number,
): Promise<void> {
  const key = Deno.env.get("PRINTNODE_API_KEY");
  if (!key) throw new Error("PRINTNODE_API_KEY missing");
  const pdfB64 = bytesToBase64(pdfBytes);
  const basic = btoa(`${key}:`);
  const res = await fetch("https://api.printnode.com/printjobs", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      printerId: PRINTNODE_PRINTER_ID,
      title: `${titlePrefix}Factura ${orderName}`,
      contentType: "pdf_base64",
      content: pdfB64,
      source: "Charls Factura",
      qty: qtyOverride && qtyOverride > 0 ? qtyOverride : PRINTNODE_COPIES,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`PrintNode ${res.status}: ${text}`);
  }
  console.log(`PrintNode job created for ${orderName}: ${text}`);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Always return 200 to Shopify. Wrap everything.
  try {
    const url = new URL(req.url);
    const titlePrefix = url.searchParams.get("title_prefix") || "";
    const qtyParam = url.searchParams.get("qty");
    const qtyOverride = qtyParam ? parseInt(qtyParam, 10) : undefined;
    const rawBody = await req.text();
    const hmac = req.headers.get("x-shopify-hmac-sha256") || "";
    const secret = Deno.env.get("SHOPIFY_WEBHOOK_SECRET");

    if (secret && hmac) {
      const ok = await verifyShopifyHmac(rawBody, hmac, secret);
      if (!ok) {
        console.error("Invalid Shopify HMAC on invoice-print webhook");
        return new Response(JSON.stringify({ ok: false, error: "invalid hmac" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    let order: any;
    try {
      order = JSON.parse(rawBody);
    } catch {
      return new Response(JSON.stringify({ ok: true, skipped: "invalid json" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!order || !Array.isArray(order.line_items)) {
      return new Response(JSON.stringify({ ok: true, skipped: "no line items" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Render + print in background so the webhook responds fast.
    const job = (async () => {
      try {
        const pdfBytes = await renderInvoicePdf(order);
        try {
          await sendToPrintNode(pdfBytes, order.name || `#${order.order_number}`, titlePrefix, qtyOverride);
        } catch (printErr) {
          // Printer offline / PrintNode down. Never bubble up.
          console.error("PrintNode send failed (ignored):", printErr);
        }
      } catch (renderErr) {
        console.error("Invoice render failed (ignored):", renderErr);
      }
    })();

    // Fire-and-forget when supported; otherwise await but still 200.
    // @ts-ignore - EdgeRuntime is provided by Supabase runtime
    if (typeof EdgeRuntime !== "undefined" && (EdgeRuntime as any).waitUntil) {
      // @ts-ignore
      (EdgeRuntime as any).waitUntil(job);
    } else {
      await job;
    }

    return new Response(
      JSON.stringify({ ok: true, order_name: order.name }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("shopify-invoice-print fatal (still returning 200):", err);
    return new Response(JSON.stringify({ ok: true, error: (err as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});