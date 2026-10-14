// ===== Cart Context =====
// Manages shopping cart state across all pages.
// Each cart item preserves the selected size and color so the cart
// and checkout pages show exactly what the customer chose.

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '@/types';

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: number, size: string, color: string) => void;
  updateQuantity: (productId: number, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Add a product to the cart — if the same product + size + color is already
  // there, increase the quantity instead of duplicating the entry.
  function addToCart(product: Product, size: string, color: string, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
    });
  }

  // Remove a specific cart line (matched by product + size + color)
  function removeFromCart(productId: number, size: string, color: string) {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
      )
    );
  }

  // Change the quantity of a specific cart line
  function updateQuantity(productId: number, size: string, color: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
