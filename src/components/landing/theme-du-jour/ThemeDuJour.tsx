"use client";

import Image from "next/image";
import Link from "next/link";
import { COLORS } from "@/constants/colors";
import { SECTION_LABELS } from "@/constants/landing";
import { useReveal } from "@/hooks/use-reveal";
import type { PublicArticle } from "@/modules/articles";

/**
 * Thème du Jour - museum feature banner (Met homepage pattern):
 * full-bleed artwork, left reading plane, right promo card.
 * Mobile: min-height grows with content so the title is never clipped.
 */
export function ThemeDuJour({ promo }: { promo?: PublicArticle | null }) {
  const ref = useReveal();
  const labels = SECTION_LABELS.themeDuJour;

  return (
    <section id="actualite" ref={ref} className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-12">
        <div className="reveal relative flex min-h-110 w-full flex-col justify-end overflow-hidden md:aspect-21/9 md:min-h-105 rounded-xl">
          <Image
            src={labels.img}
            alt={labels.imgAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />

          <span
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(12,10,8,0.78) 0%, rgba(12,10,8,0.4) 42%, rgba(12,10,8,0.25) 100%)",
            }}
            aria-hidden
          />

          <div className="relative z-10 flex flex-col gap-6 p-5 sm:gap-8 sm:p-6 md:flex-row md:items-end md:justify-between md:gap-10 md:p-10 lg:p-12">
            <div className="max-w-xl text-white md:pb-2">
              <h2
                className="font-serif font-semibold leading-[1.08]"
                style={{ fontSize: "clamp(1.75rem, 6vw, 3.5rem)" }}
              >
                {labels.title}
              </h2>
              <p
                className="mt-3 max-w-md font-sans leading-relaxed md:mt-4"
                style={{
                  fontSize: "clamp(0.95rem, 1.35vw, 1.125rem)",
                  opacity: 0.92,
                }}
              >
                {labels.subtitle}
              </p>
              <a
                href={labels.ctaHref}
                className="mt-5 inline-flex items-center gap-2 font-sans transition-opacity hover:opacity-80 md:mt-8"
                style={{
                  fontSize: "clamp(0.875rem, 1.1vw, 1rem)",
                  opacity: 0.95,
                }}
              >
                <span aria-hidden>→</span>
                <span>{labels.cta}</span>
              </a>
            </div>

            {promo && (
              <Link
                href={`/actualites/${promo.slug}`}
                className="group flex w-full max-w-sm shrink-0 items-center gap-3 rounded-xl p-3.5 text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 sm:gap-4 sm:p-4 md:w-auto"
                style={{ background: COLORS.terra, outlineColor: "#fff" }}
                aria-label={`${labels.promoEyebrow} - ${promo.title}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-[11px] font-semibold tracking-wider uppercase">
                    {labels.promoEyebrow}
                  </div>
                  <p
                    className="mt-1.5 line-clamp-3 font-sans text-sm leading-snug"
                    style={{ opacity: 0.92 }}
                  >
                    {promo.excerpt}
                  </p>
                </div>
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl sm:h-[72px] sm:w-[72px]">
                  {promo.coverUrl ? (
                    <Image
                      src={promo.coverUrl}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="72px"
                      aria-hidden
                    />
                  ) : (
                    <span
                      className="absolute inset-0"
                      style={{ background: "rgba(255,255,255,0.2)" }}
                      aria-hidden
                    />
                  )}
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
