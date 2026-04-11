import { bouquetProducts } from "@/lib/catalogData";
import { getCachedPaperColor } from "@/lib/shopifyVariants";

/**
 * Extract the paper color from a product description string.
 * Looks for "Paper: X." pattern.
 * Kept as a fallback when metafield is not available.
 */
export function extractPaperFromDescription(description: string): string | null {
  const match = description.match(/Paper:\s*([^.\n]+)/i);
  return match ? match[1].trim() : null;
}

/**
 * Get the correct paper color for a cart item.
 * For custom bouquets, returns null (caller should use item.paperColor).
 * For predefined bouquets, reads from Shopify metafield (custom.paper_color)
 * with fallback to the local catalogData description.
 */
export function getPaperForCartItem(productName: string, bouquetType: string): string | null {
  if (bouquetType === "custom") return null;

  // Find the product to get its Shopify handle
  const product = bouquetProducts.find((p) => p.name === productName);
  if (!product) return null;

  // Priority 1: Shopify metafield (cached from Storefront API fetch)
  const metafieldPaper = getCachedPaperColor(product.shopifyHandle);
  if (metafieldPaper) return metafieldPaper;

  // Priority 2: Fallback to local description regex
  return extractPaperFromDescription(product.description);
}
