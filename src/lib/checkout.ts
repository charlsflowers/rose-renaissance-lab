import { useCartStore } from "@/stores/cartStore";

/**
 * Build a Shopify cart permalink from all items in the cart.
 * Format: https://charls-flowers.myshopify.com/cart/VARIANT_ID:QTY,VARIANT_ID:QTY,...
 */
export function buildCheckoutUrl(): string | null {
  const items = useCartStore.getState().items;
  if (items.length === 0) return null;

  const lineItems = items.map((item) => {
    const numericId = item.shopifyVariantId.split("/").pop();
    return `${numericId}:1`;
  });

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
