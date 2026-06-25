/**
 * Generic live fetcher for any Shopify Storefront collection (by handle).
 * Used by occasion + flower-type collection pages so that the moment products
 * are added to a collection in Shopify, they show up on the site automatically.
 *
 * The shape mirrors mothersDayProducts.ts but is parameterised by handle and
 * keeps an independent in-memory cache per handle.
 */
import { useEffect, useMemo, useState } from "react";
import { storefrontApiRequest } from "@/lib/shopify";

export interface CollectionProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  tags: string[];
  primaryImage?: string;
  secondaryImage?: string;
  minPrice: number;
  currencyCode: string;
}

const COLLECTION_QUERY = `
  query collectionProducts($handle: String!) {
    collection(handle: $handle) {
      id
      title
      products(first: 50) {
        edges {
          node {
            id
            handle
            title
            description
            tags
            priceRange { minVariantPrice { amount currencyCode } }
            images(first: 2) { edges { node { url altText } } }
          }
        }
      }
    }
  }
`;

const cache = new Map<string, CollectionProduct[]>();
const inflight = new Map<string, Promise<CollectionProduct[]>>();

export async function fetchCollectionProducts(handle: string): Promise<CollectionProduct[]> {
  if (!handle) return [];
  const cached = cache.get(handle);
  if (cached) return cached;
  const pending = inflight.get(handle);
  if (pending) return pending;

  const p = (async () => {
    try {
      const data = await storefrontApiRequest(COLLECTION_QUERY, { handle });
      const edges = data?.data?.collection?.products?.edges ?? [];
      const items: CollectionProduct[] = edges.map((edge: any) => {
        const n = edge.node;
        const imgs = n.images?.edges ?? [];
        return {
          id: n.id,
          handle: n.handle,
          title: n.title,
          description: n.description ?? "",
          tags: n.tags ?? [],
          primaryImage: imgs[0]?.node?.url,
          secondaryImage: imgs[1]?.node?.url,
          minPrice: parseFloat(n.priceRange?.minVariantPrice?.amount ?? "0"),
          currencyCode: n.priceRange?.minVariantPrice?.currencyCode ?? "USD",
        };
      });
      cache.set(handle, items);
      return items;
    } catch (err) {
      // Collection might not exist yet (handle not created in Shopify) — treat as empty.
      console.warn(`[shopifyCollection] fetch failed for "${handle}":`, err);
      cache.set(handle, []);
      return [];
    } finally {
      inflight.delete(handle);
    }
  })();

  inflight.set(handle, p);
  return p;
}

/** React hook: live products for a collection handle. */
export function useCollectionProducts(handle: string | undefined): {
  products: CollectionProduct[];
  loading: boolean;
} {
  const [products, setProducts] = useState<CollectionProduct[]>(
    handle ? cache.get(handle) ?? [] : [],
  );
  const [loading, setLoading] = useState<boolean>(!!handle && !cache.has(handle));

  useEffect(() => {
    if (!handle) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(!cache.has(handle));
    fetchCollectionProducts(handle).then((items) => {
      if (!active) return;
      setProducts(items);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [handle]);

  return useMemo(() => ({ products, loading }), [products, loading]);
}

/**
 * Resolve the canonical web URL for a Shopify product fetched from a collection.
 *  - If the handle is known in BOUQUET_SLUGS → keyword-first PDP URL
 *    (/bouquets/<slug> or /es/bouquets/<slugEs>), keeping the exact same
 *    BouquetProductDetail page that already exists.
 *  - Otherwise → /products/<handle> which is the existing Shopify redirector
 *    (room decors + bouquet handles) and gracefully degrades.
 */
export function productLinkForHandle(
  handle: string,
  bouquetSlugs: Record<string, { slug: string; slugEs: string }>,
  language: "en" | "es",
): string {
  const mapping = bouquetSlugs[handle];
  if (mapping) {
    return language === "es"
      ? `/es/bouquets/${mapping.slugEs}`
      : `/bouquets/${mapping.slug}`;
  }
  return `/products/${handle}`;
}