/**
 * Mother's Day collection — fetched live from Shopify Storefront API.
 *
 * Source of truth: Shopify collection with handle "mothers-day".
 * Adding/removing products in Shopify reflects automatically on the site.
 *
 * Each product is mapped to a virtual `BouquetProduct` so it can be rendered
 * by the existing BouquetProductDetail page with zero changes to that template.
 */
import { useEffect, useState } from "react";
import { storefrontApiRequest } from "@/lib/shopify";
import type { BouquetProduct } from "@/lib/catalogData";
import { MOTHERS_DAY_COLLECTION_HANDLE } from "@/lib/mothersDayPromo";

export interface MothersDayProductRaw {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  description: string;
  tags: string[];
  primaryImage?: string;
  secondaryImage?: string;
  minPrice: number;
  currencyCode: string;
}

const COLLECTION_QUERY = `
  query mothersDayCollection($handle: String!) {
    collection(handle: $handle) {
      id
      title
      products(first: 30) {
        edges {
          node {
            id
            handle
            title
            description
            descriptionHtml
            tags
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            images(first: 2) {
              edges { node { url altText } }
            }
          }
        }
      }
    }
  }
`;

let cache: MothersDayProductRaw[] | null = null;
let inflight: Promise<MothersDayProductRaw[]> | null = null;

export async function fetchMothersDayProducts(): Promise<MothersDayProductRaw[]> {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const data = await storefrontApiRequest(COLLECTION_QUERY, {
        handle: MOTHERS_DAY_COLLECTION_HANDLE,
      });
      const edges = data?.data?.collection?.products?.edges ?? [];
      const items: MothersDayProductRaw[] = edges.map((edge: any) => {
        const n = edge.node;
        const imgs = n.images?.edges ?? [];
        return {
          id: n.id,
          handle: n.handle,
          title: n.title,
          description: n.description ?? "",
          descriptionHtml: n.descriptionHtml ?? "",
          tags: n.tags ?? [],
          primaryImage: imgs[0]?.node?.url,
          secondaryImage: imgs[1]?.node?.url,
          minPrice: parseFloat(n.priceRange?.minVariantPrice?.amount ?? "0"),
          currencyCode: n.priceRange?.minVariantPrice?.currencyCode ?? "USD",
        };
      });
      cache = items;
      return items;
    } catch (err) {
      console.error("[mothersDayProducts] fetch failed", err);
      return [];
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

/** Map a raw Shopify Mother's Day product to a virtual BouquetProduct. */
export function toVirtualBouquet(raw: MothersDayProductRaw): BouquetProduct {
  // Detect single dominant color from tags (simple heuristic; same colors as standard bouquets)
  const colorTagToName: Record<string, string> = {
    white: "Blanco",
    pink: "Rosa",
    "hot-pink": "Rosa fuerte",
    purple: "Morado",
    orange: "Naranja",
    yellow: "Amarillo",
    red: "Rojo",
  };
  const colorTag = raw.tags.find((t) => colorTagToName[t]) ?? "white";
  const color = colorTagToName[colorTag] ?? "Blanco";

  return {
    id: raw.handle,
    name: raw.title,
    shopifyHandle: raw.handle,
    description: raw.description,
    image: raw.primaryImage ?? "",
    image2: raw.secondaryImage,
    color,
    type: "round",
    // Pricing tier is irrelevant — Mother's Day variants/prices come live from Shopify
    pricingTier: "standard",
  };
}

/** React hook: returns mapped Mother's Day virtual bouquets (live from Shopify). */
export function useMothersDayBouquets(): {
  products: BouquetProduct[];
  raw: MothersDayProductRaw[];
  loading: boolean;
} {
  const [raw, setRaw] = useState<MothersDayProductRaw[]>(cache ?? []);
  const [loading, setLoading] = useState<boolean>(!cache);

  useEffect(() => {
    let active = true;
    fetchMothersDayProducts().then((items) => {
      if (!active) return;
      setRaw(items);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { products: raw.map(toVirtualBouquet), raw, loading };
}

/** Resolve a single Mother's Day virtual bouquet by handle (used by product detail page). */
export function useMothersDayBouquetByHandle(handle: string | undefined): {
  product: BouquetProduct | null;
  loading: boolean;
} {
  const { products, loading } = useMothersDayBouquets();
  const product = handle ? products.find((p) => p.shopifyHandle === handle) ?? null : null;
  return { product, loading };
}
