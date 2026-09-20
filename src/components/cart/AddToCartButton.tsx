"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import type { CartItem } from "@/modules/cart/types";

type Props = {
  item: CartItem;
  artworkStatus: string;
};

export function AddToCartButton({ item, artworkStatus }: Props) {
  const { addItem, hasItem, ready } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isAvailable = artworkStatus === "AVAILABLE";
  const inCart = ready && hasItem(item.artworkId);

  if (!isAvailable) {
    return (
      <p className="mt-4 text-sm text-gray-500">
        {artworkStatus === "SOLD" ? "Vendue" : "Réservée"} — non disponible à
        l&apos;achat.
      </p>
    );
  }

  if (inCart || justAdded) {
    return (
      <div className="mt-4 space-y-3">
        <p className="text-sm text-gray-600">Œuvre ajoutée au panier.</p>
        <Link
          href="/panier"
          className="flex w-full items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700"
        >
          Voir le panier
        </Link>
      </div>
    );
  }

  function handleAdd() {
    const result = addItem(item);
    if (result.ok) {
      setJustAdded(true);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!ready}
      className="mt-4 w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
    >
      Ajouter au panier
    </button>
  );
}
