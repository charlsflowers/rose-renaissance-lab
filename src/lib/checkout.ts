/**
 * Build a Shopify cart permalink from a known variant GID.
 * Format: https://charls-flowers.myshopify.com/cart/NUMERIC_ID:1
 */
export function buildCheckoutUrl(variantId: string): string {
  const numericId = variantId.split("/").pop();
  return `https://charls-flowers.myshopify.com/cart/${numericId}:1`;
}

export function openCheckoutInNewTab(checkoutUrl: string) {
  const link = document.createElement("a");
  link.href = checkoutUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
