import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  createShopifyCart,
  addLineToShopifyCart,
  removeLineFromShopifyCart,
  fetchShopifyCart,
  createCheckoutFromCartLines,
} from '@/lib/shopify';

export interface CartItem {
  // Local display data
  id: string;
  bouquetType: string;
  color: string;
  roses: number;
  price: number; // base product price (no delivery)
  deliveryCost: number;
  totalPrice: number;
  addons: string[];
  accessory: string;
  accessoryText: string;
  ribbonText: string;
  crownSize: string;
  specialText: string;
  heartColor: string;
  glitter: boolean;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryName: string;
  deliveryPhone: string;
  deliveryEmail: string;
  deliveryAddress: string;
  deliveryZip: string;
  deliveryDate: string;
  deliveryHour: string;
  deliveryMiles: number | null;
  paperColor: string;
  image?: string;
  // Shopify-specific
  shopifyVariantId: string;
  shopifyLineId: string | null;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (item: Omit<CartItem, 'shopifyLineId'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  createCheckoutUrl: () => Promise<string | null>;
  totalItems: number;
  cartTotal: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,

      get totalItems() {
        return get().items.length;
      },

      get cartTotal() {
        return get().items.reduce((sum, i) => sum + i.totalPrice, 0);
      },

      addItem: async (item) => {
        const { cartId, clearCart } = get();
        const localId = crypto.randomUUID();
        const newItem: CartItem = { ...item, id: localId, shopifyLineId: null };

        set({ isLoading: true });
        try {
          if (!cartId) {
            // Create new Shopify cart
            const result = await createShopifyCart(item.shopifyVariantId, 1);
            if (result) {
              newItem.shopifyLineId = result.lineId;
              set({
                cartId: result.cartId,
                checkoutUrl: result.checkoutUrl,
                items: [...get().items, newItem],
              });
            } else {
              // Still add locally even if Shopify fails
              set({ items: [...get().items, newItem] });
            }
          } else {
            // Add line to existing cart
            const result = await addLineToShopifyCart(cartId, item.shopifyVariantId, 1);
            if (result.cartNotFound) {
              // Cart expired, create new one
              const newResult = await createShopifyCart(item.shopifyVariantId, 1);
              if (newResult) {
                newItem.shopifyLineId = newResult.lineId;
                // Keep only the new item since old cart is gone
                set({
                  cartId: newResult.cartId,
                  checkoutUrl: newResult.checkoutUrl,
                  items: [newItem],
                });
              }
            } else if (result.success) {
              newItem.shopifyLineId = result.lineId ?? null;
              set({ items: [...get().items, newItem] });
            } else {
              set({ items: [...get().items, newItem] });
            }
          }
        } catch (error) {
          console.error('Failed to add item to Shopify cart:', error);
          set({ items: [...get().items, newItem] });
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (id) => {
        const { items, cartId, clearCart } = get();
        const item = items.find(i => i.id === id);
        if (!item) return;

        set({ isLoading: true });
        try {
          if (cartId && item.shopifyLineId) {
            const result = await removeLineFromShopifyCart(cartId, item.shopifyLineId);
            if (result.cartNotFound) {
              clearCart();
              return;
            }
          }
          const newItems = get().items.filter(i => i.id !== id);
          if (newItems.length === 0) {
            clearCart();
          } else {
            set({ items: newItems });
          }
        } catch (error) {
          console.error('Failed to remove item:', error);
          set({ items: get().items.filter(i => i.id !== id) });
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;

        set({ isSyncing: true });
        try {
          const result = await fetchShopifyCart(cartId);
          if (!result.exists || result.totalQuantity === 0) {
            clearCart();
          }
        } catch (error) {
          console.error('Failed to sync cart:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      createCheckoutUrl: async () => {
        const items = get().items;
        if (items.length === 0) return null;

        const lines = items
          .filter((item) => item.shopifyVariantId)
          .map((item) => {
            const attrs: Array<{ key: string; value: string }> = [];

            if (item.glitter) {
              const glitterCost = Math.ceil(item.roses / 25) * 8;
              attrs.push({ key: "Glitter", value: `Con glitter (+$${glitterCost})` });
            }
            if (item.accessory && item.accessory !== "none") {
              attrs.push({ key: "Accesorio", value: `${item.accessory}${item.accessoryText ? `: ${item.accessoryText}` : ""}` });
            }
            if (item.ribbonText) {
              attrs.push({ key: "Cinta", value: item.ribbonText });
            }
            if (item.specialText) {
              attrs.push({ key: "Letras/Números", value: item.specialText });
            }
            if (item.crownSize) {
              attrs.push({ key: "Corona", value: item.crownSize });
            }
            if (item.paperColor) {
              attrs.push({ key: "Color papel", value: item.paperColor });
            }
            if (item.deliveryMethod === "delivery") {
              attrs.push({ key: "Envío", value: `Delivery (+$${item.deliveryCost})` });
              if (item.deliveryAddress) attrs.push({ key: "Dirección", value: item.deliveryAddress });
              if (item.deliveryName) attrs.push({ key: "Nombre destinatario", value: item.deliveryName });
              if (item.deliveryPhone) attrs.push({ key: "Teléfono", value: item.deliveryPhone });
            } else {
              attrs.push({ key: "Envío", value: "Pickup in store" });
            }
            if (item.deliveryDate) {
              attrs.push({ key: "Fecha", value: item.deliveryDate });
            }
            if (item.deliveryHour) {
              attrs.push({ key: "Hora", value: item.deliveryHour });
            }

            return {
              variantId: item.shopifyVariantId,
              quantity: 1,
              customAttributes: attrs,
            };
          });

        if (lines.length === 0) return null;

        try {
          const checkoutUrl = await createCheckoutFromCartLines(lines);
          if (!checkoutUrl) return null;

          set({ checkoutUrl });
          return checkoutUrl;
        } catch (error) {
          console.error('Failed to create checkout URL:', error);
          return null;
        }
      },
    }),
    {
      name: 'charls-shopify-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
      }),
    }
  )
);
