"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { COLORS } from "@/constants/colors";
import { FlipCard } from "@/components/ui/flip-card";
import { useCart } from "@/components/cart/CartProvider";
import type { CartItem } from "@/modules/cart/types";

export const NO_IMAGE_SRC = "/images/no_image.svg";

export type CatalogFlipCardProps = {
  imageUrl: string | null | undefined;
  imageAlt: string;
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  meta?: string | null;
  footer?: string | null;
  /** Detail page — used on the back face */
  href?: string;
  /** When set, shows “Ajouter au panier” on the front */
  cartItem?: CartItem | null;
  /** Front CTA when there is no cart (e.g. artist profile) */
  frontActionLabel?: string;
  frontActionHref?: string;
};

function stopFlip(event: React.SyntheticEvent) {
  event.stopPropagation();
}

export function CatalogFlipCard({
  imageUrl,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  meta,
  footer,
  href,
  cartItem,
  frontActionLabel,
  frontActionHref,
}: CatalogFlipCardProps) {
  const src = imageUrl?.trim() ? imageUrl : NO_IMAGE_SRC;
  const { addItem, hasItem, ready } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = Boolean(cartItem && ready && hasItem(cartItem.artworkId));

  function handleAdd(event: React.MouseEvent) {
    stopFlip(event);
    if (!cartItem) return;
    const result = addItem(cartItem);
    if (result.ok) setJustAdded(true);
  }

  const frontCta = cartItem ? (
    inCart || justAdded ? (
      <Link
        href="/panier"
        onClick={stopFlip}
        onPointerDown={stopFlip}
        onPointerUp={stopFlip}
        className="inline-flex w-full items-center justify-center px-3 py-2.5 font-mono text-[10px] tracking-wider text-white transition-opacity hover:opacity-90"
        style={{ background: COLORS.ink }}
      >
        VOIR LE PANIER
      </Link>
    ) : (
      <button
        type="button"
        onClick={handleAdd}
        onPointerDown={stopFlip}
        onPointerUp={stopFlip}
        disabled={!ready}
        className="w-full px-3 py-2.5 font-mono text-[10px] tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: COLORS.terra }}
      >
        AJOUTER AU PANIER
      </button>
    )
  ) : frontActionHref && frontActionLabel ? (
    <Link
      href={frontActionHref}
      onClick={stopFlip}
      onPointerDown={stopFlip}
      onPointerUp={stopFlip}
      className="inline-flex w-full items-center justify-center px-3 py-2.5 font-mono text-[10px] tracking-wider text-white transition-opacity hover:opacity-90"
      style={{ background: COLORS.terra }}
    >
      {frontActionLabel}
    </Link>
  ) : null;

  return (
    <div className="aspect-3/4 w-full">
      <FlipCard
        front={
          <div className="relative h-full w-full">
            <Image
              src={src}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              style={{ border: "none", outline: "none" }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(12,10,8,0.92) 0%, rgba(12,10,8,0.55) 38%, rgba(12,10,8,0.12) 68%, transparent 100%)",
              }}
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-3.5 sm:gap-3 sm:p-4 md:p-5">
              <div>
                {eyebrow ? (
                  <div className="font-mono text-[10px] tracking-widest text-white/70 uppercase">
                    {eyebrow}
                  </div>
                ) : null}
                <h3
                  className={`font-serif text-base leading-tight text-white sm:text-lg md:text-xl ${eyebrow ? "mt-1.5" : ""}`}
                >
                  {title}
                </h3>
                {subtitle ? (
                  <p className="mt-1 text-sm text-white/75">{subtitle}</p>
                ) : null}
                {meta ? (
                  <p className="mt-0.5 font-mono text-xs text-white/55">{meta}</p>
                ) : null}
              </div>
              {footer ? (
                <div className="font-serif text-base text-white md:text-lg">
                  {footer}
                </div>
              ) : null}
              {frontCta}
            </div>
          </div>
        }
        back={
          <div className="flex h-full flex-col justify-between p-5 md:p-6">
            <div>
              {eyebrow ? (
                <div
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: COLORS.terra }}
                >
                  {eyebrow}
                </div>
              ) : null}
              <h3
                className="mt-3 font-serif text-xl leading-tight md:text-2xl"
                style={{ color: "#f5f5f5" }}
              >
                {title}
              </h3>
              {subtitle || meta ? (
                <p className="mt-2 text-sm text-white/70">
                  {[subtitle, meta].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </div>
            <div className="space-y-3">
              {footer ? (
                <div className="font-serif text-lg text-white">{footer}</div>
              ) : null}
              {href ? (
                <Link
                  href={href}
                  onClick={stopFlip}
                  onPointerDown={stopFlip}
                  onPointerUp={stopFlip}
                  className="inline-flex w-full items-center justify-center px-3 py-2.5 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
                  style={{ background: COLORS.terra }}
                >
                  VOIR LE DÉTAIL
                </Link>
              ) : null}
            </div>
          </div>
        }
        axis="y"
        flipOnClick
        draggable
        dragDistance={0}
        tilt
        tiltMax={10}
        glare
        glareOpacity={0.28}
        hoverScale={1.04}
        perspective={1200}
        stiffness={200}
        damping={18}
        width="100%"
        height="100%"
        radius={22}
        background="#0C0A08"
        color="#f5f5f5"
        shadow
        shadowColor="#000000"
        shadowOpacity={0.4}
      />
    </div>
  );
}
