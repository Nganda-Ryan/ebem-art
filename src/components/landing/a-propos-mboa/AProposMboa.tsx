"use client";

import Image from "next/image";
import { COLORS } from "@/constants/colors";
import { SECTION_LABELS } from "@/constants/landing";
import { useReveal } from "@/hooks/use-reveal";

/**
 * À propos - portrait + note du directeur (Mission / Valeur).
 *
 * Layout rule: never stretch the reading column to the portrait height with
 * justify-between - that clips body copy when content exceeds the image.
 * Align tops; let text define its own height (standard editorial split).
 */
export function AProposMboa() {
  const ref = useReveal();
  const copy = SECTION_LABELS.aPropos;
  const { promoter } = copy;

  return (
    <section
      id="a-propos"
      ref={ref}
      className="border-t py-10 md:py-14"
      style={{ background: COLORS.bg, borderColor: COLORS.border }}
      aria-labelledby="a-propos-name"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-12">
        <div className="reveal grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <figure className="lg:col-span-5">
            <div className="relative aspect-4/5 overflow-hidden">
              <Image
                src={promoter.img}
                alt={promoter.alt}
                fill
                className="object-cover object-[center_20%]"
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
              />
            </div>
            <figcaption
              className="mt-4 font-mono text-xs"
              style={{ color: COLORS.muted }}
            >
              {promoter.role} · {promoter.location}
            </figcaption>
          </figure>

          <div className="flex flex-col gap-8 lg:col-span-7 lg:gap-10">
            <header>
              <span
                className="text-xs tracking-widest"
                style={{ color: COLORS.terra, fontFamily: "var(--sans)" }}
              >
                {copy.eyebrow}
              </span>
              <h2
                id="a-propos-name"
                className="mt-3 font-serif text-4xl leading-[1.05] md:text-5xl"
                style={{ color: COLORS.ink, fontFamily: "var(--serif)" }}
              >
                {promoter.name}
              </h2>
            </header>

            <blockquote
              className="border-l-2 pl-5"
              style={{ borderColor: COLORS.terra }}
            >
              <p
                className="max-w-[34ch] font-serif text-xl leading-snug md:text-2xl"
                style={{ color: COLORS.ink, fontFamily: "var(--serif)" }}
              >
                {copy.quote}
              </p>
            </blockquote>

            <div
              className="flex flex-col gap-8 border-t pt-8"
              style={{ borderColor: COLORS.border }}
            >
              <div>
                <h3
                  className="text-xs tracking-widest"
                  style={{ color: COLORS.terra, fontFamily: "var(--sans)" }}
                >
                  {copy.mission.label}
                </h3>
                <p
                  className="mt-3 max-w-[48ch] text-base"
                  style={{
                    color: COLORS.inkMid,
                    lineHeight: 1.75,
                    fontFamily: "var(--sans)",
                  }}
                >
                  {copy.mission.text}
                </p>
              </div>

              <div>
                <h3
                  className="text-xs tracking-widest"
                  style={{ color: COLORS.terra, fontFamily: "var(--sans)" }}
                >
                  {copy.valeur.label}
                </h3>
                <p
                  className="mt-3 max-w-[48ch] text-base"
                  style={{
                    color: COLORS.inkMid,
                    lineHeight: 1.75,
                    fontFamily: "var(--sans)",
                  }}
                >
                  {copy.valeur.text}
                </p>
              </div>
            </div>

            <a
              href={copy.continueHref}
              className="group inline-flex w-fit items-center gap-2 border-b pb-1 text-sm font-medium tracking-wider transition-opacity hover:opacity-70"
              style={{
                color: COLORS.terra,
                borderColor: COLORS.terra,
                fontFamily: "var(--sans)",
              }}
            >
              {copy.continueLabel}
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
