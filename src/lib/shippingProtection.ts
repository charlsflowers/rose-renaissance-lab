import { storefrontApiRequest } from "@/lib/shopify";

/**
 * Shipping Protection add-on. Product + variant already exist in Shopify;
 * we only fetch live image + price by GID so it auto-updates from admin.
 */

export const SHIPPING_PROTECTION_PRODUCT_GID =
  "gid://shopify/Product/10344738062468";
export const SHIPPING_PROTECTION_VARIANT_GID =
  "gid://shopify/ProductVariant/51903531745412";
export const SHIPPING_PROTECTION_VARIANT_NUMERIC_ID = "51903531745412";

const QUERY = `
  query ShippingProtection($id: ID!) {
    product(id: $id) {
      id
      featuredImage { url altText }
      images(first: 1) { edges { node { url altText } } }
      variants(first: 1) {
        edges { node { id price { amount currencyCode } } }
      }
    }
  }
`;

export interface ShippingProtectionInfo {
  imageUrl: string | null;
  imageAlt: string | null;
  amount: number;
  currencyCode: string;
  variantGid: string;
  available: boolean;
}

let cached: ShippingProtectionInfo | null = null;
let inflight: Promise<ShippingProtectionInfo | null> | null = null;

export async function getShippingProtectionInfo(): Promise<ShippingProtectionInfo | null> {
  if (cached) return cached;
  if (inflight) return inflight;

  inflight = storefrontApiRequest(QUERY, { id: SHIPPING_PROTECTION_PRODUCT_GID })
    .then((data) => {
      const product = data?.data?.product;
      if (!product) {
        inflight = null;
        return null;
      }
      const featured = product.featuredImage ?? product.images?.edges?.[0]?.node ?? null;
      const variant = product.variants?.edges?.[0]?.node;
      const amount = variant?.price?.amount ? parseFloat(variant.price.amount) : 8;
      const info: ShippingProtectionInfo = {
        imageUrl: featured?.url ?? null,
        imageAlt: featured?.altText ?? "Shipping Protection",
        amount,
        currencyCode: variant?.price?.currencyCode ?? "USD",
        variantGid: variant?.id ?? SHIPPING_PROTECTION_VARIANT_GID,
        available: Boolean(product && variant?.id),
      };
      cached = info;
      inflight = null;
      return info;
    })
    .catch((err) => {
      inflight = null;
      console.warn("[shippingProtection] fetch failed", err);
      return null;
    });

  return inflight;
}

export function getShippingProtectionFallback(): ShippingProtectionInfo {
  return {
    imageUrl: null,
    imageAlt: "Shipping Protection",
    amount: 8,
    currencyCode: "USD",
    variantGid: SHIPPING_PROTECTION_VARIANT_GID,
    available: false,
  };
}