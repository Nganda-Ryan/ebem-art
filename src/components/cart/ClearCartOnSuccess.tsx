"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

/** Clears the local cart after a successful Stripe checkout. */
export function ClearCartOnSuccess() {
  const { clear, ready } = useCart();

  useEffect(() => {
    if (!ready) return;
    clear();
  }, [ready, clear]);

  return null;
}
