"use client";

import Image from "next/image";
import { COLORS } from "@/constants/colors";
import { SECTION_LABELS } from "@/constants/landing";
import { MOCK_WORKS } from "@/data/mock";
import { formatPrice } from "@/lib/format/price";
import { useReveal } from "@/hooks/use-reveal";

/**
 * Mid-funnel bridge - after Explorer, before Ateliers / Galerie.
 *
 * One job: convert browse intent into a single next step (AIDA: Desire → Action).
 *
 * Why this pattern (not a dark Stripe billboard):
 * 1. Same visual language as Thème du Jour - square artwork + reading plane
 *    (page consistency > isolated “conversion” skin).
 * 2. Concrete exemplar - show a real work (concreteness effect); abstract
 *    “explore the collection” after Explorer is circular and weak.
 * 3. One primary CTA → Galerie (forward in the scroll path); Hick’s Law.
 * 4. Soft section, not ink/terra - those peaks belong to Hero & Newsletter
 *    (Kahneman peak–end; avoid mid-page fatigue from competing loud bands).
 * 5. Fitts - large image + solid button as joint primary target.
 *
 * Refs:
 * - nngroup.com - single primary action; proximity of CTA to related content
 * - Unbounce / AIDA sequencing - mid-page CTA after value is clear
 * - Apple product storytelling - object first, invite second
 * - Fogg Behavior Model - motivation + clear prompt after ability (filters used)
 */
export function CtaIntermediaire() {
  const ref = useReveal();
  const copy = SECTION_LABELS.ctaIntermediaire;
  const featured = MOCK_WORKS[0];

  return (
    <section
      ref={ref}
      className="border-t py-16 md:py-24"
      style={{ background: COLORS.bg, borderColor: COLORS.border }}
    >
      <div className="reveal mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-12">
          <a
            href={copy.ctaHref}
            className="group relative aspect-square w-full shrink-0 overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 lg:w-[min(40%,380px)]"
            style={{ outlineColor: COLORS.terra }}
            aria-label={`${featured.title} - ${copy.ctaLabel}`}
          >
            <Image
              src={featured.img}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 380px"
            />
          </a>

          <div className="flex flex-1 flex-col justify-center">
            <span
              className="text-xs tracking-widest"
              style={{ color: COLORS.terra, fontFamily: "var(--sans)" }}
            >
              {copy.eyebrow}
            </span>

            <h2
              className="mt-3 font-serif text-3xl leading-tight md:text-4xl lg:text-[2.75rem]"
              style={{ color: COLORS.ink, fontFamily: "var(--serif)" }}
            >
              {copy.title}
            </h2>

            <p
              className="mt-4 max-w-[40ch] text-base"
              style={{
                color: COLORS.inkMid,
                lineHeight: 1.75,
                fontFamily: "var(--sans)",
              }}
            >
              {copy.description}
            </p>

            <div
              className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t pt-6"
              style={{ borderColor: COLORS.border }}
            >
              <span
                className="font-serif text-lg"
                style={{ color: COLORS.ink }}
              >
                {featured.title}
              </span>
              <span
                className="text-sm"
                style={{ color: COLORS.muted, fontFamily: "var(--sans)" }}
              >
                {featured.artist}
              </span>
              <span
                className="w-full font-mono text-xs sm:ml-auto sm:w-auto"
                style={{ color: COLORS.terra }}
              >
                {formatPrice(featured.price)}
              </span>
            </div>

            <div className="mt-8">
              <a
                href={copy.ctaHref}
                className="inline-flex items-center px-8 py-4 text-sm font-medium tracking-wider text-white transition-colors"
                style={{ background: COLORS.terra, fontFamily: "var(--sans)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = COLORS.terraHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = COLORS.terra;
                }}
              >
                {copy.ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
