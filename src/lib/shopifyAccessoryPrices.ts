import { storefrontApiRequest } from "@/lib/shopify";
import {
  NOTES_VARIANT_ID,
  BUTTERFLIES_VARIANT_ID,
} from "@/lib/accessoryVariants";

/**
 * Fetches the live Shopify price for an accessory variant (e.g. Note, Butterfly)
 * so the cart never hardcodes "$3" — if the merchant changes the price in
 * Shopify, it flows straight through here.
 */

const QUERY = `
  query AccessoryPrices($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        price { amount currencyCode }
      }
    }
  }
`;

function toGid(numericId: string) {
  return numericId.startsWith("gid://")
    ? numericId
    : `gid://shopify/ProductVariant/${numericId}`;
}

export interface AccessoryPrice {
  amount: number;
  currencyCode: string;
}

const cache = new Map<string, AccessoryPrice>();
let inflight: Promise<Map<string, AccessoryPrice>> | null = null;

async function loadAccessoryPrices(): Promise<Map<string, AccessoryPrice>> {
  if (cache.size > 0) return cache;
  if (inflight) return inflight;

  const ids = [NOTES_VARIANT_ID, BUTTERFLIES_VARIANT_ID].map(toGid);

  inflight = storefrontApiRequest(QUERY, { ids })
    .then((data) => {
      const nodes = (data?.data?.nodes ?? []) as Array<
        { id: string; price?: { amount: string; currencyCode: string } } | null
      >;
      nodes.forEach((node) => {
        if (!node?.id || !node.price?.amount) return;
        cache.set(node.id, {
          amount: parseFloat(node.price.amount),
          currencyCode: node.price.currencyCode,
        });
      });
      inflight = null;
      return cache;
    })
    .catch((err) => {
      inflight = null;
      console.warn("[shopifyAccessoryPrices] fetch failed", err);
      return cache;
    });

  return inflight;
}

export async function getAccessoryPrice(
  numericVariantId: string
): Promise<AccessoryPrice | null> {
  const gid = toGid(numericVariantId);
  const map = await loadAccessoryPrices();
  return map.get(gid) ?? null;
}

export async function getNotePrice() {
  return getAccessoryPrice(NOTES_VARIANT_ID);
}

export async function getButterflyPrice() {
  return getAccessoryPrice(BUTTERFLIES_VARIANT_ID);
}