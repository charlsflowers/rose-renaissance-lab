import { useEffect, useState } from "react";
import { storefrontApiRequest } from "@/lib/shopify";

/** True while the page is being prerendered (flag set by scripts/prerender.mjs). */
const isPrerenderEnv = (): boolean =>
  typeof window !== "undefined" &&
  !!(window as Window & { __CF_PRERENDER__?: boolean }).__CF_PRERENDER__;

/**
 * Fetches product images live from Shopify Storefront API by handle.
 * Order returned: [primary, secondary, review]. The third image is reserved
 * for the reviews section (do NOT use it as primary/secondary in PDP).
 *
 * Cached in-memory per handle so we don't refetch on every render.
 */

const QUERY = `
  query getImages($handle: String!) {
    productByHandle(handle: $handle) {
      images(first: 10) {
        edges { node { url altText } }
      }
    }
  }
`;

type ImageSet = { primary?: string; secondary?: string; review?: string; all?: string[] };

/**
 * Force a display width on a Shopify CDN image URL so we don't download the
 * full-resolution master (often 2048px) for a small tile. Sets/replaces the
 * `width` query param; returns the URL untouched if it can't be parsed.
 */
export function shopifyImageWidth(url: string, width: number): string {
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(width));
    return u.toString();
  } catch {
    return url;
  }
}

const cache = new Map<string, ImageSet>();
const inflight = new Map<string, Promise<ImageSet>>();

async function fetchImages(handle: string): Promise<ImageSet> {
  if (cache.has(handle)) return cache.get(handle)!;
  if (inflight.has(handle)) return inflight.get(handle)!;

  const promise = (async () => {
    const result: ImageSet = {};
    try {
      const data = await storefrontApiRequest(QUERY, { handle });
      const edges = data?.data?.productByHandle?.images?.edges ?? [];
      const urls: string[] = edges.map((e: any) => e?.node?.url).filter(Boolean);
      result.all = urls;
      result.primary = urls[0];
      result.secondary = urls[1];
      result.review = urls[2];
    } catch (err) {
      console.error(`[useShopifyProductImages] Failed for ${handle}:`, err);
    }
    cache.set(handle, result);
    return result;
  })();

  inflight.set(handle, promise);
  return promise;
}

/** Hook: returns live Shopify images for a single handle. */
export function useShopifyProductImages(handle: string | undefined): ImageSet {
  const [images, setImages] = useState<ImageSet>(() =>
    handle ? cache.get(handle) ?? {} : {}
  );

  useEffect(() => {
    if (!handle) return;
    // Skip the live fetch during prerender: otherwise the prerender resolves the
    // Shopify image while the client's first (hydration) render still shows the
    // catalog fallback (product.image) → React #418 image mismatch. Leaving the
    // prerender on the fallback makes server === client at hydration; the client
    // then upgrades to the live Shopify image after mount.
    if (isPrerenderEnv()) return;
    let active = true;
    fetchImages(handle).then((res) => {
      if (active) setImages(res);
    });
    return () => {
      active = false;
    };
  }, [handle]);

  return images;
}

/** Hook: returns a Map<handle, ImageSet> for many handles at once. */
export function useShopifyProductImagesBatch(handles: string[]): Map<string, ImageSet> {
  const key = handles.join(",");
  const [map, setMap] = useState<Map<string, ImageSet>>(() => {
    const m = new Map<string, ImageSet>();
    handles.forEach((h) => {
      const c = cache.get(h);
      if (c) m.set(h, c);
    });
    return m;
  });

  useEffect(() => {
    if (isPrerenderEnv()) return; // same hydration-safety gate as the single hook
    let active = true;
    Promise.all(
      handles.map(async (h) => [h, await fetchImages(h)] as const)
    ).then((entries) => {
      if (!active) return;
      const m = new Map<string, ImageSet>();
      entries.forEach(([h, set]) => m.set(h, set));
      setMap(m);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return map;
}