"use client";

import { COLORS } from "@/constants/colors";
import { SECTION_LABELS } from "@/constants/landing";
import { MOCK_GALLERY } from "@/data/mock";
import { GalleryCard } from "@/components/landing/gallery-card";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";

export function MasonryGalerie() {
  const ref = useReveal();
  const labels = SECTION_LABELS.galerie;

  return (
    <section
      id="galerie"
      ref={ref}
      className="py-10 md:py-14"
      style={{ background: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="reveal mb-12 flex items-baseline justify-between">
          <div>
            <span className="font-mono text-xs tracking-widest" style={{ color: COLORS.gold }}>
              {labels.code}
            </span>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl" style={{ color: COLORS.ink }}>
              {labels.title}
            </h2>
          </div>
          <span className="font-mono text-xs" style={{ color: COLORS.muted }}>
            {labels.hint}
          </span>
        </div>

        <div className="masonry reveal reveal-delay-1">
          {MOCK_GALLERY.map((item) => (
            <GalleryCard key={item.title} item={item} />
          ))}
        </div>

        <div className="reveal reveal-delay-2 mt-12 text-center">
          <Button variant="outline" className="px-10 py-4 text-sm font-medium tracking-wider">
            VOIR TOUTE LA COLLECTION →
          </Button>
        </div>
      </div>
    </section>
  );
}
