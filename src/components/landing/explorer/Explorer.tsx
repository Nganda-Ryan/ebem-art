"use client";

import { useMemo, useState } from "react";
import { COLORS } from "@/constants/colors";
import { PRICE_FILTER, SECTION_LABELS } from "@/constants/landing";
import { MOCK_WORKS } from "@/data/mock";
import { ExplorerFilters } from "@/components/landing/explorer-filters";
import { WorkCard } from "@/components/landing/work-card";
import { useReveal } from "@/hooks/use-reveal";
import { filterArtworks } from "@/lib/landing/filters";
import { pluralSuffix } from "@/lib/format/price";

export function Explorer() {
  const ref = useReveal();
  const [discipline, setDiscipline] = useState("Tous");
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_FILTER.defaultMax);
  const labels = SECTION_LABELS.explorer;

  const filtered = useMemo(
    () => filterArtworks(MOCK_WORKS, { discipline, maxPrice }),
    [discipline, maxPrice],
  );

  return (
    <section
      id="explorer"
      ref={ref}
      className="py-10 md:py-14"
      style={{ background: COLORS.bgAlt, borderTop: `1px solid ${COLORS.border}` }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-12">
        <div className="reveal">
          <span className="font-mono text-xs tracking-widest" style={{ color: COLORS.terra }}>
            {labels.code}
          </span>
          <h2 className="mt-2 mb-8 font-serif text-4xl md:text-5xl" style={{ color: COLORS.ink }}>
            {labels.title}
          </h2>
        </div>

        <div className="reveal reveal-delay-1">
          <ExplorerFilters
            discipline={discipline}
            maxPrice={maxPrice}
            onDisciplineChange={setDiscipline}
            onMaxPriceChange={setMaxPrice}
          />
        </div>

        <div className="reveal reveal-delay-2 mb-6 font-mono text-xs" style={{ color: COLORS.muted }}>
          {filtered.length} ŒUVRE{pluralSuffix(filtered.length)} TROUVÉE
          {pluralSuffix(filtered.length)}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center" style={{ color: COLORS.muted }}>
            <div className="mb-2 font-serif text-2xl">Aucun résultat</div>
            <div className="text-sm">Ajustez vos filtres pour explorer davantage.</div>
          </div>
        ) : (
          // Grid must stay outside `.reveal` — a parent `transform` flattens 3D tilt.
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
