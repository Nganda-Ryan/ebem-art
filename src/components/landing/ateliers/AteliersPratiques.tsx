"use client";

import { COLORS } from "@/constants/colors";
import { SECTION_LABELS } from "@/constants/landing";
import { MOCK_WORKSHOPS } from "@/data/mock";
import { WorkshopCard } from "@/components/landing/workshop-card";
import { useReveal } from "@/hooks/use-reveal";

export function AteliersPratiques() {
  const ref = useReveal();
  const labels = SECTION_LABELS.ateliers;

  return (
    <section
      id="ateliers"
      ref={ref}
      className="py-10 md:py-14"
      style={{ background: COLORS.bgAlt, borderTop: `1px solid ${COLORS.border}` }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 grid items-baseline gap-4 md:grid-cols-2">
          <div className="reveal">
            <span className="font-mono text-xs tracking-widest" style={{ color: COLORS.terra }}>
              {labels.code}
            </span>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl" style={{ color: COLORS.ink }}>
              {labels.title}
            </h2>
            <p className="mt-4 text-sm" style={{ color: COLORS.muted, lineHeight: 1.75 }}>
              {labels.description}
            </p>
          </div>
          <div className="reveal reveal-delay-1 md:text-right">
            <button
              type="button"
              className="font-mono text-xs tracking-widest transition-all"
              style={{ color: COLORS.terra }}
            >
              VOIR TOUS LES ATELIERS →
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {MOCK_WORKSHOPS.map((workshop, index) => (
            <WorkshopCard key={workshop.id} workshop={workshop} revealDelay={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
