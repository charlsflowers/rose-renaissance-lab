import { useCartStore } from "@/stores/cartStore";

const SHOPIFY_CART_BASE_URL = "https://charls-flowers.myshopify.com/cart";
const DELIVERY_FEE_VARIANT_NUMERIC_ID = "51629708935300"; // SKU: DELIVERY-FEE ($0.01)

type CheckoutDeliveryOptions = {
  deliveryMethod?: "pickup" | "delivery";
  deliveryCost?: number;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryZip?: string;
  deliveryDate?: string;
  deliveryTime?: string;
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

  return {
    address1,
    city: parsedCity,
    zip: parsedZip,
    state,
  };
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

  if (options?.deliveryMethod === "delivery" && options.deliveryCost && options.deliveryCost > 0) {
    const deliveryCents = Math.round(options.deliveryCost * 100);
    lineItems.push(`${DELIVERY_FEE_VARIANT_NUMERIC_ID}:${deliveryCents}`);
  }

  let checkoutUrl = `${SHOPIFY_CART_BASE_URL}/${lineItems.join(",")}`;

  if (options?.deliveryMethod === "delivery" && options.deliveryAddress) {
    const parsed = parseAddress(options.deliveryAddress, options.deliveryCity, options.deliveryZip);
    const params = new URLSearchParams();

    if (parsed.address1) params.set("checkout[shipping_address][address1]", parsed.address1);
    if (parsed.city) params.set("checkout[shipping_address][city]", parsed.city);
    if (parsed.state) params.set("checkout[shipping_address][province]", parsed.state);
    if (parsed.zip) params.set("checkout[shipping_address][zip]", parsed.zip);
    params.set("checkout[shipping_address][country]", "US");

    const query = params.toString();
    if (query) checkoutUrl += `?${query}`;
  }

  return checkoutUrl;
}

export function openCheckoutInNewTab(checkoutUrl: string) {
  window.location.href = checkoutUrl;
}
