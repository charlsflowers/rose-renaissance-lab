import { useEffect, useState } from "react";
import { storefrontApiRequest } from "@/lib/shopify";

/**
 * Fetches a product's description and SEO fields live from Shopify Storefront API
 * by handle. Returns:
 *   - description (EN, native field — plain text)
 *   - descriptionEs (ES, from custom.description_es metafield)
 *   - seoTitle / seoTitleEs (native seo.title + custom.seo_title_es)
 *   - seoDescription / seoDescriptionEs (native seo.description + custom.seo_description_es)
 *
 * Cached in-memory per handle so we don't refetch on every render.
 * Returns `loading: true` until the network response resolves.
 */

const QUERY = `
  query getProductDescription($handle: String!) {
    productByHandle(handle: $handle) {
      description
      seo { title description }
      descriptionEs: metafield(namespace: "custom", key: "description_es") { value }
      seoTitleEs: metafield(namespace: "custom", key: "seo_title_es") { value }
      seoDescriptionEs: metafield(namespace: "custom", key: "seo_description_es") { value }
    }
  }
`;

export interface ShopifyProductDescription {
  description?: string;
  descriptionEs?: string;
  seoTitle?: string;
  seoTitleEs?: string;
  seoDescription?: string;
  seoDescriptionEs?: string;
}

const cache = new Map<string, ShopifyProductDescription>();
const inflight = new Map<string, Promise<ShopifyProductDescription>>();

async function fetchDescription(handle: string): Promise<ShopifyProductDescription> {
  if (cache.has(handle)) return cache.get(handle)!;
  if (inflight.has(handle)) return inflight.get(handle)!;

  const promise = (async () => {
    const result: ShopifyProductDescription = {};
    try {
      const data = await storefrontApiRequest(QUERY, { handle });
      const p = data?.data?.productByHandle;
      if (p) {
        result.description = p.description || undefined;
        result.seoTitle = p.seo?.title || undefined;
        result.seoDescription = p.seo?.description || undefined;
        result.descriptionEs = p.descriptionEs?.value || undefined;
        result.seoTitleEs = p.seoTitleEs?.value || undefined;
        result.seoDescriptionEs = p.seoDescriptionEs?.value || undefined;
      }
    } catch (err) {
      console.error(`[useShopifyProductDescription] Failed for ${handle}:`, err);
    }
    cache.set(handle, result);
    return result;
  })();

  inflight.set(handle, promise);
  return promise;
}

export function useShopifyProductDescription(handle: string | undefined): {
  data: ShopifyProductDescription;
  loading: boolean;
} {
  const [data, setData] = useState<ShopifyProductDescription>(() =>
    handle ? cache.get(handle) ?? {} : {}
  );
  const [loading, setLoading] = useState<boolean>(() => !!handle && !cache.has(handle));

  useEffect(() => {
    if (!handle) {
      setData({});
      setLoading(false);
      return;
    }
    if (cache.has(handle)) {
      setData(cache.get(handle)!);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    fetchDescription(handle).then((res) => {
      if (!active) return;
      setData(res);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [handle]);

  return { data, loading };
}