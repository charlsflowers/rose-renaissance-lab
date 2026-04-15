import { bouquetProducts } from "@/lib/catalogData";
import { getCachedPaperColor, fetchVariantsByHandle } from "@/lib/shopifyVariants";

/**
 * Get the correct paper color for a cart item.
 * For custom bouquets, returns null (caller should use item.paperColor).
 * For predefined bouquets, reads from Shopify metafield (custom.paper_color).
 * If the cache is empty, forces a fetch to ensure the metafield is loaded.
 */
export async function getPaperForCartItem(productName: string, bouquetType: string): Promise<string | null> {
  if (bouquetType === "custom") return null;

  const product = bouquetProducts.find((p) => p.name === productName);
  if (!product) return null;

  // Try from cache first
  let paper = getCachedPaperColor(product.shopifyHandle);
  if (paper) return paper;

  // Cache empty: force fetch of the metafield
  await fetchVariantsByHandle(product.shopifyHandle);
  paper = getCachedPaperColor(product.shopifyHandle);
  if (paper) return paper;

  // If still null, the metafield doesn't exist in Shopify
  console.warn(`[paperHelper] No paper color found for handle: ${product.shopifyHandle}`);
  return null;
}
