import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import type { Vegetable } from "../backend";

export interface CartItem {
  vegetable: Vegetable;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (vegetable: Vegetable) => void;
  removeFromCart: (id: bigint) => void;
  updateQuantity: (id: bigint, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((vegetable: Vegetable) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.vegetable.id === vegetable.id);
      if (existing) {
        return prev.map((item) =>
          item.vegetable.id === vegetable.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { vegetable, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: bigint) => {
    setItems((prev) => prev.filter((item) => item.vegetable.id !== id));
  }, []);

  const updateQuantity = useCallback((id: bigint, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.vegetable.id !== id));
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.vegetable.id === id ? { ...item, quantity } : item,
        ),
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.vegetable.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
