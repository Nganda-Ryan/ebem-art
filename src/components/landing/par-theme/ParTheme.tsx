"use client";

import Image from "next/image";
import { COLORS } from "@/constants/colors";
import { SECTION_LABELS } from "@/constants/landing";
import { MOCK_THEMES, MOCK_WORKS } from "@/data/mock";
import { useReveal } from "@/hooks/use-reveal";

export function ParTheme() {
  const ref = useReveal();
  const labels = SECTION_LABELS.themes;

  return (
    <section
      id="themes"
      ref={ref}
      className="py-10 md:py-14"
      style={{ background: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="reveal mb-12">
          <span className="font-mono text-xs tracking-widest" style={{ color: COLORS.gold }}>
            {labels.code}
          </span>
          <h2 className="mt-2 font-serif text-4xl md:text-5xl" style={{ color: COLORS.ink }}>
            {labels.title}
          </h2>
          <p className="mt-4 text-sm" style={{ color: COLORS.muted }}>
            {labels.description}
          </p>
        </div>

        <div className="no-scrollbar reveal reveal-delay-1 flex gap-4 overflow-x-auto pb-4">
          {MOCK_THEMES.map((theme, index) => (
            <div
              key={theme.label}
              className="group w-72 flex-shrink-0 cursor-pointer overflow-hidden transition-all"
              style={{ border: `1px solid ${COLORS.border}`, background: COLORS.bgCard }}
            >
              <div
                className="h-1 w-full transition-all group-hover:h-2"
                style={{ background: theme.color }}
              />
              <div className="p-6">
                <h3 className="mb-1 font-serif text-xl" style={{ color: COLORS.ink }}>
                  {theme.label}
                </h3>
                <div className="mb-5 font-mono text-xs" style={{ color: COLORS.muted }}>
                  {theme.count} œuvres
                </div>
                <div className="mb-5 grid grid-cols-3 gap-1">
                  {MOCK_WORKS.slice(index % 3, (index % 3) + 3).map((work) => (
                    <div key={work.id} className="relative overflow-hidden pb-[100%]">
                      <Image
                        src={work.img}
                        alt={work.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="96px"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="group/btn flex items-center gap-2 font-mono text-xs tracking-widest transition-colors"
                  style={{ color: theme.color }}
                >
                  EXPLORER{" "}
                  <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal reveal-delay-2 mt-4 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: COLORS.border }} />
          <span className="font-mono text-xs" style={{ color: COLORS.muted }}>
            ← GLISSER →
          </span>
          <div className="h-px flex-1" style={{ background: COLORS.border }} />
        </div>
      </div>
    </section>
  );
}
