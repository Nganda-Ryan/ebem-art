"use client";

import Link from "next/link";
import { CartIcon } from "@/components/ui/icons";
import { useCart } from "@/components/cart/CartProvider";

type Props = {
  iconColor: string;
  className?: string;
};

export function CartNavLink({ iconColor, className = "p-2.5" }: Props) {
  const { count, ready } = useCart();

  return (
    <Link
      href="/panier"
      aria-label={count > 0 ? `Panier, ${count} article${count > 1 ? "s" : ""}` : "Panier"}
      className={`relative transition-opacity hover:opacity-70 ${className}`}
      style={{ color: iconColor }}
    >
      <CartIcon />
      {ready && count > 0 ? (
        <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C55C2E] px-1 text-[10px] font-semibold text-white">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}
