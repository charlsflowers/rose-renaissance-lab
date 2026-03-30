import { useCartStore } from "@/stores/cartStore";
import { DELIVERY_FEE_VARIANT_GID, type AccessoryLineItem } from "@/lib/accessoryVariants";
import {
  addLineToShopifyCart,
  updateCartNote,
  updateCartBuyerIdentity,
  fetchCartCheckoutUrl,
  type ShippingAddress,
} from "@/lib/shopify";

const SHOPIFY_CART_BASE_URL = "https://charls-flowers.myshopify.com/cart";
const DELIVERY_FEE_VARIANT_NUMERIC_ID = "51629708935300";
const SERVICE_FEE_VARIANT_NUMERIC_ID = "51654333595780";

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
 * Build a Shopify cart permalink.
 * If variantId is provided, builds a single-item URL.
 * Otherwise builds from all cart items.
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
  params.set("channel", "online_store");
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

  return checkoutUrl;
}

export function openCheckoutInNewTab(checkoutUrl: string) {
  window.location.href = checkoutUrl;
}

// ─── Storefront API checkout (replaces permalink flow) ───

const SERVICE_FEE_VARIANT_GID = "gid://shopify/ProductVariant/51654333595780";

export interface ApiCheckoutOptions {
  deliveryMethod: "pickup" | "delivery";
  deliveryCost: number;
  serviceFeeBase: number;
  deliveryAddress?: string;
  deliveryZip?: string;
  accessories: AccessoryLineItem[];
  note: string;
}

/**
 * Perform checkout via Shopify Storefront API.
 * Adds accessory / delivery / service-fee lines to the existing cart,
 * sets the order note & buyer identity, then returns the real checkout URL.
 */
export async function performApiCheckout(options: ApiCheckoutOptions): Promise<string | null> {
  const { cartId, checkoutUrl: storedCheckoutUrl } = useCartStore.getState();
  if (!cartId) return null;

  // Add accessory lines (convert numeric IDs → GIDs when needed)
  for (const acc of options.accessories) {
    const gid = acc.variantId.startsWith("gid://")
      ? acc.variantId
      : `gid://shopify/ProductVariant/${acc.variantId}`;
    await addLineToShopifyCart(cartId, gid, acc.quantity);
  }

  // Add delivery fee
  if (options.deliveryMethod === "delivery" && options.deliveryCost > 0) {
    await addLineToShopifyCart(cartId, DELIVERY_FEE_VARIANT_GID, Math.round(options.deliveryCost * 10));
  }

  // Add service fee (5% of base total)
  const serviceFeePrice = options.serviceFeeBase * 0.05;
  const serviceFeeQty = Math.round(serviceFeePrice / 0.10);
  if (serviceFeeQty > 0) {
    await addLineToShopifyCart(cartId, SERVICE_FEE_VARIANT_GID, serviceFeeQty);
  }

  // Update cart note
  if (options.note) {
    await updateCartNote(cartId, options.note);
  }

  // Update buyer identity for delivery
  if (options.deliveryMethod === "delivery" && options.deliveryAddress) {
    const parts = options.deliveryAddress.split(",").map(p => p.trim());
    const parsed: ShippingAddress = {
      address1: parts[0] || "",
      city: parts[1] || "",
      province: "",
      zip: options.deliveryZip || "",
      country: "US",
    };
    await updateCartBuyerIdentity(cartId, parsed);
  }

  // Fetch fresh checkout URL from Shopify
  const freshUrl = await fetchCartCheckoutUrl(cartId);
  return freshUrl || storedCheckoutUrl;
}
