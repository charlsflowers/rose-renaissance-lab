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
