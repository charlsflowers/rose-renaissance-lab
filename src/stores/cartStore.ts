import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  // Local display data
  id: string;
  productName: string;
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
  customerNotes?: string;
  // Mother's Day Edition flag — accessories are bundled into the variant price.
  isMothersDay?: boolean;
  structuredAddress?: {
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
  // Shopify variant id (GID). Empty string for "Coming Soon" categories.
  shopifyVariantId: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  duplicateItem: (id: string) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  cartTotal: number;
}

/**
 * Local-only cart store.
 *
 * The Shopify cart is NOT created here — it is created in a single call
 * from `performApiCheckout()` at the moment the user clicks "Continue to
 * Safe Checkout". This guarantees that any checkoutUrl Shopify ever sees
 * (Shop Pay, abandoned-cart emails, express checkouts) already contains
 * the service fee, delivery fee, and order notes.
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),

      get totalItems() {
        return get().items.length;
      },

      get cartTotal() {
        return get().items.reduce((sum, i) => sum + i.totalPrice, 0);
      },

      addItem: async (item) => {
        const localId = item.id && item.id.length > 0 ? item.id : crypto.randomUUID();
        const newItem: CartItem = { ...(item as CartItem), id: localId };
        set({ items: [...get().items, newItem], isOpen: true });
      },

      removeItem: async (id) => {
        const newItems = get().items.filter((i) => i.id !== id);
        if (newItems.length === 0) {
          get().clearCart();
        } else {
          set({ items: newItems });
        }
      },

      duplicateItem: async (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        const newItem: CartItem = { ...item, id: crypto.randomUUID() };
        set({ items: [...get().items, newItem] });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'charls-shopify-cart',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // Migrate from v1 (which persisted cartId/checkoutUrl) by dropping them.
      migrate: (persistedState: unknown, _version: number) => {
        if (persistedState && typeof persistedState === 'object') {
          const s = persistedState as Record<string, unknown>;
          return { items: Array.isArray(s.items) ? s.items : [] };
        }
        return { items: [] };
      },
      partialize: (state) => ({ items: state.items }),
    }
  )
);
