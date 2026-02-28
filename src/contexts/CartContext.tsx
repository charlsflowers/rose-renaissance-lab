import { createContext, useContext, useState, type ReactNode } from "react";

export interface CartItem {
  id: string;
  bouquetType: string;
  color: string;
  roses: number;
  price: number;
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
  deliveryMethod: "pickup" | "delivery";
  deliveryName: string;
  deliveryPhone: string;
  deliveryEmail: string;
  deliveryAddress: string;
  deliveryZip: string;
  deliveryDate: string;
  deliveryHour: string;
  deliveryMiles: number | null;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => [...prev, { ...item, id: crypto.randomUUID() }]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.length;
  const cartTotal = items.reduce((sum, i) => sum + i.totalPrice, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalItems, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
