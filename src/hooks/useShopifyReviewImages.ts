import { useState, useEffect } from "react";
import { storefrontApiRequest } from "@/lib/shopify";
import { bouquetProducts } from "@/lib/catalogData";
import type { ReviewData } from "@/components/ReviewCard";

const GET_PRODUCTS_IMAGES_QUERY = `
  query getProductsImages($handles: [String!]!) {
    nodes(ids: []) {
      id
    }
  }
`;

// Query products by handle one-by-one is inefficient; use a single bulk query
const BULK_IMAGES_QUERY = `
  query getProductImages($query: String!) {
    products(first: 50, query: $query) {
      edges {
        node {
          handle
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

// Map productLabel → shopifyHandle using bouquetProducts catalog
const labelToHandle = new Map<string, string>();
for (const bp of bouquetProducts) {
  labelToHandle.set(bp.name, bp.shopifyHandle);
}

// Cache to avoid re-fetching
let imageCache: Map<string, string> | null = null;
let fetchPromise: Promise<Map<string, string>> | null = null;

async function fetchReviewImages(handles: string[]): Promise<Map<string, string>> {
  if (imageCache) return imageCache;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    const map = new Map<string, string>();
    if (handles.length === 0) return map;

    try {
      // Build search query: handle:x OR handle:y ...
      const searchQuery = handles.map((h) => `handle:${h}`).join(" OR ");
      const data = await storefrontApiRequest(BULK_IMAGES_QUERY, { query: searchQuery });

      const products = data?.data?.products?.edges || [];
      for (const { node } of products) {
        const images = node.images?.edges || [];
        // Use the 3rd image (index 2) if available
        const thirdImage = images[2]?.node?.url;
        if (thirdImage) {
          map.set(node.handle, thirdImage);
        }
      }
    } catch (err) {
      console.error("Failed to fetch Shopify review images:", err);
    }

    imageCache = map;
    return map;
  })();

  return fetchPromise;
}

/**
 * Hook that returns a map of review.id → Shopify 3rd image URL
 * Only for bouquet reviews (excluding zodiac, room decor, extras, etc.)
 */
export function useShopifyReviewImages(reviews: ReviewData[]) {
  const [imageMap, setImageMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    // Collect unique shopify handles for bouquet reviews (non-zodiac)
    const excludedPrefixes = ["bq-zodiac"];
    const handleSet = new Set<string>();
    const reviewToHandle = new Map<string, string>();

    for (const review of reviews) {
      if (review.category !== "bouquets") continue;
      if (excludedPrefixes.some((p) => review.id.startsWith(p))) continue;

      const handle = labelToHandle.get(review.productLabel);
      if (handle) {
        handleSet.add(handle);
        reviewToHandle.set(review.id, handle);
      }
    }

    if (handleSet.size === 0) return;

    fetchReviewImages(Array.from(handleSet)).then((shopifyMap) => {
      const result = new Map<string, string>();
      for (const [reviewId, handle] of reviewToHandle) {
        const url = shopifyMap.get(handle);
        if (url) result.set(reviewId, url);
      }
      setImageMap(result);
    });
  }, [reviews]);

  return imageMap;
}
