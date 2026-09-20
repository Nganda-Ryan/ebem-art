"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { COLORS } from "@/constants/colors";
import { SECTION_LABELS } from "@/constants/landing";
import { ExplorerFilters } from "@/components/landing/explorer-filters";
import { WorkCard } from "@/components/landing/work-card";
import { useReveal } from "@/hooks/use-reveal";
import {
  filterLandingArtworks,
  landingDisciplines,
  type LandingArtwork,
} from "@/lib/landing/catalog";

type ExplorerProps = {
  works: LandingArtwork[];
};

const HOME_ARTWORK_LIMIT = 8;

export function Explorer({ works }: ExplorerProps) {
  const ref = useReveal();
  const disciplines = useMemo(() => landingDisciplines(works), [works]);
  const [discipline, setDiscipline] = useState("Tous");
  const labels = SECTION_LABELS.explorer;

  const filtered = useMemo(
    () => filterLandingArtworks(works, discipline).slice(0, HOME_ARTWORK_LIMIT),
    [works, discipline]
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
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: COLORS.terra }}
          >
            {labels.code}
          </span>
          <h2
            className="mt-2 mb-8 font-serif text-3xl md:text-4xl"
            style={{ color: COLORS.ink }}
          >
            {labels.title}
          </h2>
        </div>

        {works.length > 0 ? (
          <div className="reveal reveal-delay-1">
            <ExplorerFilters
              discipline={discipline}
              disciplines={disciplines}
              onDisciplineChange={setDiscipline}
            />
          </div>
        ) : null}

        {works.length === 0 ? (
          <div className="py-16 text-center" style={{ color: COLORS.muted }}>
            <div
              className="mb-2 font-serif text-2xl"
              style={{ color: COLORS.ink }}
            >
              Aucune œuvre pour le moment
            </div>
            <p className="mx-auto max-w-md text-sm">
              La collection se remplit au fur et à mesure des publications.
              Revenez bientôt, ou explorez les artistes.
            </p>
            <Link
              href="/artistes"
              className="mt-6 inline-block px-5 py-2.5 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
              style={{ background: COLORS.terra }}
            >
              VOIR LES ARTISTES
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center" style={{ color: COLORS.muted }}>
            <div className="mb-2 font-serif text-2xl">Aucun résultat</div>
            <div className="text-sm">
              Ajustez vos filtres pour explorer davantage.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}

        {works.length > 0 ? (
          <div className="mt-10 text-center">
            <Link
              href="/explorer"
              className="inline-block px-6 py-3 font-mono text-xs tracking-wider transition-opacity hover:opacity-80"
              style={{
                color: COLORS.ink,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              VOIR TOUTE LA COLLECTION →
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
