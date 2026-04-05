import { bouquetProducts } from "@/lib/catalogData";

/**
 * Extract the paper color from a product description string.
 * Looks for "Paper: X." pattern.
 */
export function extractPaperFromDescription(description: string): string | null {
  const match = description.match(/Paper:\s*([^.\n]+)/i);
  return match ? match[1].trim() : null;
}

/**
 * Get the correct paper color for a cart item.
 * For predefined bouquets, reads from the product description in catalogData.
 * For custom bouquets, returns null (caller should use item.paperColor).
 */
export function getPaperForCartItem(productName: string, bouquetType: string): string | null {
  if (bouquetType === "custom") return null;

  const product = bouquetProducts.find(
    (p) => p.name === productName
  );
  if (!product) return null;

  return extractPaperFromDescription(product.description);
}
