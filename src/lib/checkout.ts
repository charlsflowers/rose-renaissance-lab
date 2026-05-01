import { useCartStore } from "@/stores/cartStore";
import {
  DELIVERY_FEE_VARIANT_GID,
  type AccessoryLineItem,
} from "@/lib/accessoryVariants";
import {
  createShopifyCartFull,
  type CartFullLine,
  type ShippingAddress,
} from "@/lib/shopify";
import { appendTrackingParamsToUrl } from "@/lib/trackingParams";

const DELIVERY_FEE_VARIANT_NUMERIC_ID = "51629708935300";
const SERVICE_FEE_VARIANT_NUMERIC_ID = "51654333595780";
const SERVICE_FEE_VARIANT_GID = `gid://shopify/ProductVariant/${SERVICE_FEE_VARIANT_NUMERIC_ID}`;

const SHOPIFY_CART_BASE_URL = "https://charls-flowers.myshopify.com/cart";

type CheckoutDeliveryOptions = {
  deliveryMethod?: "pickup" | "delivery";
  deliveryCost?: number;
  serviceFee?: number;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZip?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  accessories?: AccessoryLineItem[];
  note?: string;
};

type ParsedAddress = {
  address1: string;
  city: string;
  zip: string;
  state: string;
};

function toNumericVariantId(variantId?: string): string | null {
  if (!variantId) return null;
  const numericId = variantId.split("/").pop();
  return numericId || null;
}

function toGid(variantId: string): string {
  return variantId.startsWith("gid://")
    ? variantId
    : `gid://shopify/ProductVariant/${variantId}`;
}

function parseAddress(address: string, city = "", zip = ""): ParsedAddress {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  const address1 = parts[0] || "";
  const parsedCity = city || parts[1] || "";

  const fullText = [address, zip].filter(Boolean).join(" ");
  const zipMatch = fullText.match(/\b\d{5}(?:-\d{4})?\b/);
  const parsedZip = zip || (zipMatch ? zipMatch[0] : "");

  const stateMatch = fullText.match(/\b([A-Z]{2})\s+\d{5}(?:-\d{4})?\b/i);
  const state = stateMatch ? stateMatch[1].toUpperCase() : "";

  return { address1, city: parsedCity, zip: parsedZip, state };
}

/**
 * Legacy permalink builder. Still used by some "buy now" buttons that need a
 * shareable URL synchronously. Not used by the main checkout flow.
 */
export function buildCheckoutUrl(variantId?: string, options?: CheckoutDeliveryOptions): string | null {
  const lineItems: string[] = [];

  if (variantId) {
    const numericId = toNumericVariantId(variantId);
    if (!numericId) return null;
    lineItems.push(`${numericId}:1`);
  } else {
    const items = useCartStore.getState().items;
    if (items.length === 0) return null;

    const cartLineItems = items
      .filter((item) => item.shopifyVariantId)
      .map((item) => {
        const numericId = toNumericVariantId(item.shopifyVariantId);
        return numericId ? `${numericId}:1` : null;
      })
      .filter((line): line is string => Boolean(line));

    lineItems.push(...cartLineItems);
  }

  if (lineItems.length === 0) return null;

  if (options?.accessories) {
    for (const acc of options.accessories) {
      lineItems.push(`${acc.variantId}:${acc.quantity}`);
    }
  }

  if (options?.deliveryMethod === "delivery" && options.deliveryCost && options.deliveryCost > 0) {
    const deliveryQty = Math.round(options.deliveryCost * 10);
    lineItems.push(`${DELIVERY_FEE_VARIANT_NUMERIC_ID}:${deliveryQty}`);
  }

  if (options?.serviceFee && options.serviceFee > 0) {
    const serviceFeeQty = Math.round(options.serviceFee / 0.10);
    lineItems.push(`${SERVICE_FEE_VARIANT_NUMERIC_ID}:${serviceFeeQty}`);
  }

  // Consolidate duplicate variant IDs by summing quantities
  const consolidated = new Map<string, number>();
  for (const entry of lineItems) {
    const [vid, qtyStr] = entry.split(":");
    const qty = parseInt(qtyStr, 10) || 1;
    consolidated.set(vid, (consolidated.get(vid) || 0) + qty);
  }
  const finalLines = Array.from(consolidated.entries()).map(([vid, qty]) => `${vid}:${qty}`);

  let checkoutUrl = `${SHOPIFY_CART_BASE_URL}/${finalLines.join(",")}`;
  const params = new URLSearchParams();

  const deliveryType = options?.deliveryMethod === "delivery" ? "Home Delivery" : "Store Pickup";
  params.set("attributes[delivery_type]", deliveryType);

  if (options?.deliveryDate) {
    params.set("attributes[delivery_date]", options.deliveryDate);
  }
  if (options?.deliveryTime) {
    params.set("attributes[delivery_time]", options.deliveryTime);
  }
  if (options?.note) {
    params.set("note", options.note);
  }

  if (options?.deliveryMethod === "delivery" && options.deliveryAddress) {
    const parsed = parseAddress(options.deliveryAddress, options.deliveryCity, options.deliveryZip);

    if (parsed.address1) params.set("checkout[shipping_address][address1]", parsed.address1);
    if (parsed.city) params.set("checkout[shipping_address][city]", parsed.city);
    if (parsed.state) params.set("checkout[shipping_address][province]", parsed.state);
    if (parsed.zip) params.set("checkout[shipping_address][zip]", parsed.zip);
    params.set("checkout[shipping_address][country]", "US");
  }

  const query = params.toString();
  if (query) checkoutUrl += `?${query}`;

  return appendTrackingParamsToUrl(checkoutUrl);
}

export function openCheckoutInNewTab(checkoutUrl: string) {
  window.location.href = checkoutUrl;
}

// ─── Storefront API checkout (deferred-cart-creation flow) ───

export interface ApiCheckoutOptions {
  deliveryMethod: "pickup" | "delivery";
  deliveryCost: number;
  serviceFeeBase: number;
  deliveryAddress?: string;
  deliveryZip?: string;
  structuredAddress?: {
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
  accessories: AccessoryLineItem[];
  note: string;
}

/**
 * Build the full Shopify cart in a SINGLE API call (cartCreate) at the
 * moment the user clicks "Continue to Safe Checkout".
 *
 * This is the only path that creates a Shopify cart — there is no earlier
 * "lightweight" cart that could be picked up by Shop Pay or abandoned-cart
 * emails without the service fee / delivery / notes.
 */
export async function performApiCheckout(options: ApiCheckoutOptions): Promise<string | null> {
  const items = useCartStore.getState().items;

  // 1) Product lines (skip items without a Shopify variant — e.g. "Coming Soon" categories)
  const productLines: CartFullLine[] = items
    .filter((item) => item.shopifyVariantId && item.shopifyVariantId.length > 0)
    .map((item) => ({
      merchandiseId: toGid(item.shopifyVariantId),
      quantity: 1,
    }));

  // 2) Accessory lines
  const accessoryLines: CartFullLine[] = options.accessories.map((acc) => ({
    merchandiseId: toGid(acc.variantId),
    quantity: acc.quantity,
  }));

  // 3) Delivery fee line
  const deliveryLines: CartFullLine[] = [];
  if (options.deliveryMethod === "delivery" && options.deliveryCost > 0) {
    deliveryLines.push({
      merchandiseId: DELIVERY_FEE_VARIANT_GID,
      quantity: Math.round(options.deliveryCost * 10),
    });
  }

  // 4) Service fee (4.5% of subtotal + delivery)
  const serviceFeePrice = options.serviceFeeBase * 0.045;
  const serviceFeeQty = Math.round(serviceFeePrice / 0.10);
  const serviceLines: CartFullLine[] =
    serviceFeeQty > 0
      ? [{ merchandiseId: SERVICE_FEE_VARIANT_GID, quantity: serviceFeeQty }]
      : [];

  // Consolidate duplicate variant ids (sum quantities)
  const allLines = [...productLines, ...accessoryLines, ...deliveryLines, ...serviceLines];
  const consolidated = new Map<string, number>();
  for (const line of allLines) {
    consolidated.set(line.merchandiseId, (consolidated.get(line.merchandiseId) || 0) + line.quantity);
  }
  const finalLines: CartFullLine[] = Array.from(consolidated.entries()).map(
    ([merchandiseId, quantity]) => ({ merchandiseId, quantity })
  );

  if (finalLines.length === 0) {
    console.error("[performApiCheckout] No cart lines to send to Shopify");
    return null;
  }

  // 5) Buyer identity (shipping address)
  let deliveryAddress: ShippingAddress | undefined;
  if (options.deliveryMethod === "delivery" && options.deliveryAddress) {
    const itemStructured = items.find((i) => i.structuredAddress)?.structuredAddress;
    const source = options.structuredAddress || itemStructured;

    if (source && source.address1) {
      deliveryAddress = {
        address1: source.address1,
        city: source.city || "",
        province: source.province || "",
        zip: source.zip || options.deliveryZip || "",
        country: source.country || "US",
      };
    } else {
      const fallback = parseAddress(options.deliveryAddress, "", options.deliveryZip || "");
      deliveryAddress = {
        address1: fallback.address1,
        city: fallback.city,
        province: fallback.state,
        zip: fallback.zip,
        country: "US",
      };
    }
  }

  // 6) Single cartCreate call with everything baked in
  const result = await createShopifyCartFull({
    lines: finalLines,
    note: options.note,
    deliveryAddress,
  });

  if (!result?.checkoutUrl) return null;

  // Force pickup as the preselected delivery method when applicable.
  if (options.deliveryMethod === "pickup") {
    try {
      const url = new URL(result.checkoutUrl);
      url.searchParams.set("delivery_method", "pick-up");
      return appendTrackingParamsToUrl(url.toString());
    } catch {
      return appendTrackingParamsToUrl(result.checkoutUrl);
    }
  }

  return appendTrackingParamsToUrl(result.checkoutUrl);
}
