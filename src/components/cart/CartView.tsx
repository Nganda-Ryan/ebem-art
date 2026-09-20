"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { initiateCheckout } from "@/modules/orders/actions";

export function CartView() {
  const { items, totalCents, ready, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const result = await initiateCheckout({
        artworkIds: items.map((i) => i.artworkId),
      });
      if (result?.url) {
        window.location.href = result.url;
        return;
      }
      setError("Impossible de démarrer le paiement.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <p className="text-sm text-gray-500">Chargement du panier…</p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600">Votre panier est vide.</p>
        <Link
          href="/explorer"
          className="mt-6 inline-block rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700"
        >
          Explorer les œuvres
        </Link>
      </div>
    );
  }

  const currency = items[0]?.currency ?? "XAF";

  return (
    <div className="space-y-8">
      <ul className="divide-y divide-gray-200 border-y border-gray-200">
        {items.map((item) => (
          <li
            key={item.artworkId}
            className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center"
          >
            <Link
              href={`/oeuvres/${item.slug}`}
              className="shrink-0 overflow-hidden rounded-xl bg-gray-100"
            >
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-28 w-28 object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center text-xs text-gray-400">
                  Pas d&apos;image
                </div>
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={`/oeuvres/${item.slug}`}
                className="text-lg font-medium hover:underline"
              >
                {item.title}
              </Link>
              <p className="mt-1 text-sm text-gray-500">{item.artistName}</p>
              <p className="mt-2 font-medium">
                {item.priceCents.toLocaleString()} {item.currency}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.artworkId)}
              className="self-start text-sm text-gray-500 underline hover:text-gray-800 sm:self-center"
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">
            {totalCents.toLocaleString()} {currency}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="rounded-xl bg-gray-900 px-8 py-3 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? "Redirection vers le paiement…" : "Finaliser l'achat"}
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
