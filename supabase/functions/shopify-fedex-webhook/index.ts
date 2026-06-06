// Shopify orders/paid webhook → create FedEx shipment and Shopify fulfillment.
// Triggered only when the order's cart attributes contain FedEx metadata
// (`FedEx Service Code`, `FedEx Roses Count`, `FedEx Recipient Address`).
// Orders without those attributes are acknowledged with no action (local
// delivery / store pickup flows are unaffected).
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-shopify-hmac-sha256, x-shopify-topic, x-shopify-shop-domain",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FEDEX_BASE = "https://apis.fedex.com";
const SHOPIFY_API_VERSION = "2024-10";

const ORIGIN_SHIPPER = {
  contact: {
    personName: "Charls Flowers",
    phoneNumber: "3055551234",
    companyName: "Charls Flowers",
  },
  address: {
    streetLines: ["7261 NW 12th St"],
    city: "Miami",
    stateOrProvinceCode: "FL",
    postalCode: "33126",
    countryCode: "US",
  },
};

function pickBox(roses: number) {
  if (roses <= 25) return { length: 22, width: 11, height: 11, weight: 9 };
  if (roses <= 50) return { length: 28, width: 13, height: 13, weight: 11 };
  if (roses <= 100) return { length: 30, width: 18, height: 18, weight: 18 };
  return null;
}

// Constant-time HMAC verification of Shopify webhook body.
async function verifyShopifyHmac(rawBody: string, hmacHeader: string, secret: string): Promise<boolean> {
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

async function getFedExToken(): Promise<string> {
  const clientId = Deno.env.get("FEDEX_CLIENT_ID");
  const clientSecret = Deno.env.get("FEDEX_CLIENT_SECRET");
  if (!clientId || !clientSecret) throw new Error("FedEx credentials missing");
  const res = await fetch(`${FEDEX_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const j = await res.json();
  if (!res.ok || !j.access_token) throw new Error(`FedEx OAuth failed: ${JSON.stringify(j)}`);
  return j.access_token as string;
}

interface ShopifyOrder {
  id: number;
  name: string;
  note_attributes?: Array<{ name: string; value: string }>;
  attributes?: Array<{ key?: string; name?: string; value: string }>;
  shipping_address?: {
    name?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province_code?: string;
    zip?: string;
    country_code?: string;
  };
  email?: string;
}

function readAttribute(order: ShopifyOrder, name: string): string | null {
  const attrs = [...(order.note_attributes || []), ...(order.attributes || [])];
  for (const a of attrs) {
    const key = (a as { name?: string; key?: string }).name || (a as { key?: string }).key;
    if (key && key.toLowerCase() === name.toLowerCase()) return a.value;
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const rawBody = await req.text();
  const hmacHeader = req.headers.get("x-shopify-hmac-sha256") || "";
  const shopDomain = req.headers.get("x-shopify-shop-domain") || "";
  const secret = Deno.env.get("SHOPIFY_WEBHOOK_SECRET");

  if (!secret) {
    console.error("SHOPIFY_WEBHOOK_SECRET not configured");
    return new Response("Server misconfigured", { status: 500, headers: corsHeaders });
  }
  if (!hmacHeader || !(await verifyShopifyHmac(rawBody, hmacHeader, secret))) {
    console.warn("Invalid HMAC signature");
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  let order: ShopifyOrder;
  try {
    order = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
  }

  const serviceCode = readAttribute(order, "FedEx Service Code");
  const rosesStr = readAttribute(order, "FedEx Roses Count");
  const recipientStr = readAttribute(order, "FedEx Recipient Address");

  if (!serviceCode || !rosesStr || !recipientStr) {
    // Not a FedEx order — acknowledge and no-op (local delivery / pickup).
    return new Response(JSON.stringify({ skipped: true, reason: "no_fedex_metadata" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const roses = parseInt(rosesStr, 10);
  const box = pickBox(roses);
  if (!box) {
    console.error("Invalid roses count for FedEx:", rosesStr);
    return new Response(JSON.stringify({ error: "invalid_roses" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let recipientAddr: {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country?: string;
    name?: string;
    phone?: string;
  };
  try {
    recipientAddr = JSON.parse(recipientStr);
  } catch {
    console.error("Invalid recipient JSON:", recipientStr);
    return new Response(JSON.stringify({ error: "invalid_recipient" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Fall back to shopify shipping_address fields for name/phone when missing.
  const ship = order.shipping_address || {};
  const recipientName =
    recipientAddr.name ||
    ship.name ||
    [ship.first_name, ship.last_name].filter(Boolean).join(" ") ||
    "Recipient";
  const recipientPhone = recipientAddr.phone || ship.phone || "0000000000";

  try {
    const token = await getFedExToken();
    const accountNumber = Deno.env.get("FEDEX_ACCOUNT_NUMBER");
    if (!accountNumber) throw new Error("FedEx account missing");

    const shipPayload = {
      labelResponseOptions: "URL_ONLY",
      accountNumber: { value: accountNumber },
      requestedShipment: {
        shipper: ORIGIN_SHIPPER,
        recipients: [
          {
            contact: {
              personName: recipientName,
              phoneNumber: recipientPhone.replace(/\D/g, "").slice(-15) || "0000000000",
            },
            address: {
              streetLines: [recipientAddr.address1, recipientAddr.address2].filter(Boolean) as string[],
              city: recipientAddr.city,
              stateOrProvinceCode: recipientAddr.province,
              postalCode: recipientAddr.zip,
              countryCode: recipientAddr.country || "US",
              residential: true,
            },
          },
        ],
        shipDatestamp: (() => {
          const d = new Date();
          return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
        })(),
        serviceType: serviceCode,
        packagingType: "YOUR_PACKAGING",
        pickupType: "USE_SCHEDULED_PICKUP",
        shippingChargesPayment: { paymentType: "SENDER" },
        labelSpecification: {
          labelStockType: "PAPER_4X6",
          imageType: "PDF",
        },
        requestedPackageLineItems: [
          {
            weight: { units: "LB", value: box.weight },
            dimensions: { length: box.length, width: box.width, height: box.height, units: "IN" },
          },
        ],
      },
    };

    const shipRes = await fetch(`${FEDEX_BASE}/ship/v1/shipments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-locale": "en_US",
      },
      body: JSON.stringify(shipPayload),
    });
    const shipJson = await shipRes.json();
    if (!shipRes.ok) {
      console.error("FedEx ship error:", JSON.stringify(shipJson));
      return new Response(JSON.stringify({ error: "fedex_ship_failed", details: shipJson }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const completedShipment = shipJson?.output?.transactionShipments?.[0];
    const trackingNumber = completedShipment?.masterTrackingNumber || completedShipment?.pieceResponses?.[0]?.trackingNumber;
    const labelUrl = completedShipment?.pieceResponses?.[0]?.packageDocuments?.[0]?.url;

    console.log(`FedEx shipment created for order ${order.name}: ${trackingNumber} (${labelUrl})`);

    // Email the label PDF to the fulfillment team via Resend.
    try {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (resendKey && labelUrl && trackingNumber) {
        // Fetch the PDF (FedEx label URLs require the same bearer token).
        let pdfBytes: Uint8Array | null = null;
        try {
          const pdfRes = await fetch(labelUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (pdfRes.ok) {
            pdfBytes = new Uint8Array(await pdfRes.arrayBuffer());
          } else {
            // Some label URLs are publicly accessible without auth.
            const pdfRes2 = await fetch(labelUrl);
            if (pdfRes2.ok) pdfBytes = new Uint8Array(await pdfRes2.arrayBuffer());
          }
        } catch (e) {
          console.error("Label PDF fetch error:", e);
        }

        const serviceNames: Record<string, string> = {
          FIRST_OVERNIGHT: "FedEx First Overnight",
          PRIORITY_OVERNIGHT: "FedEx Priority Overnight",
          STANDARD_OVERNIGHT: "FedEx Standard Overnight",
          FEDEX_2_DAY_AM: "FedEx 2Day AM",
          FEDEX_2_DAY: "FedEx 2Day",
          FEDEX_EXPRESS_SAVER: "FedEx Express Saver",
          GROUND_HOME_DELIVERY: "FedEx Ground Home Delivery",
          FEDEX_GROUND: "FedEx Ground",
        };
        const serviceName = serviceNames[serviceCode] || serviceCode;
        const orderNumber = order.name || String(order.id);
        const addrLines = [
          recipientName,
          recipientAddr.address1,
          recipientAddr.address2 || "",
          `${recipientAddr.city}, ${recipientAddr.province} ${recipientAddr.zip}`,
          recipientAddr.country || "US",
        ]
          .filter(Boolean)
          .join("<br/>");

        const html = `
          <div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
            <h2 style="color:#96103b;margin:0 0 12px">Nueva etiqueta FedEx</h2>
            <p><strong>Pedido:</strong> ${orderNumber}</p>
            <p><strong>Servicio:</strong> ${serviceName}</p>
            <p><strong>Tracking:</strong>
              <a href="https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}">${trackingNumber}</a>
            </p>
            <p><strong>Destinatario:</strong><br/>${addrLines}</p>
            <p>Etiqueta adjunta en PDF${pdfBytes ? "" : ` (descarga directa: <a href="${labelUrl}">${labelUrl}</a>)`}.</p>
          </div>
        `;

        let pdfBase64 = "";
        if (pdfBytes) {
          let bin = "";
          const chunk = 0x8000;
          for (let i = 0; i < pdfBytes.length; i += chunk) {
            bin += String.fromCharCode(...pdfBytes.subarray(i, i + chunk));
          }
          pdfBase64 = btoa(bin);
        }

        const emailPayload: Record<string, unknown> = {
          from: "Charls Flowers <notifications@charlsflowers.com>",
          to: [
            "charlsflowerscorp@gmail.com",
            "rc@floralsuppliespoint.com",
            "theflowerspoint@hotmail.com",
          ],
          subject: `Nueva etiqueta FedEx — Charls Flowers — Pedido ${orderNumber}`,
          html,
        };
        if (pdfBase64) {
          emailPayload.attachments = [
            {
              filename: `fedex-label-${orderNumber.replace(/[^a-zA-Z0-9_-]/g, "_")}-${trackingNumber}.pdf`,
              content: pdfBase64,
            },
          ];
        }

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailPayload),
        });
        if (!emailRes.ok) {
          console.error("Resend email error:", emailRes.status, await emailRes.text());
        } else {
          console.log(`Label email sent for order ${orderNumber}`);
        }
      } else if (!resendKey) {
        console.warn("RESEND_API_KEY not configured; skipping label email");
      }
    } catch (e) {
      console.error("Send label email failed:", e);
    }

    // Create Shopify fulfillment with tracking
    const adminToken = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
    const domain = shopDomain || Deno.env.get("SHOPIFY_SHOP_DOMAIN");
    if (adminToken && domain && trackingNumber) {
      try {
        // Get fulfillment orders for this order
        const foRes = await fetch(
          `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/orders/${order.id}/fulfillment_orders.json`,
          { headers: { "X-Shopify-Access-Token": adminToken } },
        );
        const foJson = await foRes.json();
        const fulfillmentOrders = (foJson.fulfillment_orders || []).filter(
          (fo: { status: string }) => fo.status === "open",
        );

        if (fulfillmentOrders.length > 0) {
          await fetch(`https://${domain}/admin/api/${SHOPIFY_API_VERSION}/fulfillments.json`, {
            method: "POST",
            headers: {
              "X-Shopify-Access-Token": adminToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fulfillment: {
                line_items_by_fulfillment_order: fulfillmentOrders.map((fo: { id: number }) => ({
                  fulfillment_order_id: fo.id,
                })),
                tracking_info: {
                  number: trackingNumber,
                  company: "FedEx",
                  url: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
                },
                notify_customer: true,
              },
            }),
          });
        }
      } catch (e) {
        console.error("Shopify fulfillment error:", e);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, trackingNumber, labelUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("shopify-fedex-webhook error:", err);
    // Return 200 so Shopify doesn't retry forever; we logged the error.
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});