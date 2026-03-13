import { useCartStore } from "@/stores/cartStore";

/**
 * Build a Shopify cart permalink.
 * If variantId is provided, builds a single-item URL.
 * Otherwise builds from all cart items.
 * Format: https://charls-flowers.myshopify.com/cart/NUMERIC_ID:1,NUMERIC_ID:1,...
 */
export function buildCheckoutUrl(variantId?: string): string | null {
  if (variantId) {
    const numericId = variantId.split("/").pop();
    return `https://charls-flowers.myshopify.com/cart/${numericId}:1`;
  }

  const items = useCartStore.getState().items;
  if (items.length === 0) return null;

  const lineItems = items
    .filter((item) => item.shopifyVariantId)
    .map((item) => {
      const numericId = item.shopifyVariantId.split("/").pop();
      return `${numericId}:1`;
    });

  if (lineItems.length === 0) return null;
  return `https://charls-flowers.myshopify.com/cart/${lineItems.join(",")}`;
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
