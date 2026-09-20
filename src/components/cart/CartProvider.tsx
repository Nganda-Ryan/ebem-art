"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  type CartItem,
} from "@/modules/cart/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  totalCents: number;
  ready: boolean;
  addItem: (item: CartItem) => { ok: true } | { ok: false; reason: "already" };
  removeItem: (artworkId: string) => void;
  clear: () => void;
  hasItem: (artworkId: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as CartItem).artworkId === "string" &&
        typeof (item as CartItem).slug === "string" &&
        typeof (item as CartItem).title === "string" &&
        typeof (item as CartItem).priceCents === "number" &&
        typeof (item as CartItem).currency === "string" &&
        typeof (item as CartItem).artistName === "string"
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((item: CartItem) => {
    let already = false;
    setItems((prev) => {
      if (prev.some((i) => i.artworkId === item.artworkId)) {
        already = true;
        return prev;
      }
      return [...prev, item];
    });
    return already
      ? ({ ok: false, reason: "already" } as const)
      : ({ ok: true } as const);
  }, []);

  const removeItem = useCallback((artworkId: string) => {
    setItems((prev) => prev.filter((i) => i.artworkId !== artworkId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const hasItem = useCallback(
    (artworkId: string) => items.some((i) => i.artworkId === artworkId),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      totalCents: items.reduce((sum, i) => sum + i.priceCents, 0),
      ready,
      addItem,
      removeItem,
      clear,
      hasItem,
    }),
    [items, ready, addItem, removeItem, clear, hasItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
