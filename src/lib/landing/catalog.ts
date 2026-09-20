import type { ExplorerArtworkResult } from "@/modules/explorer";

/** Landing / homepage artwork card (catalog) */
export type LandingArtwork = {
  id: string;
  slug: string;
  title: string;
  artistName: string;
  medium: string | null;
  year: number | null;
  priceCents: number;
  currency: string;
  coverUrl: string | null;
  /** Label names + medium for client-side filters */
  facets: string[];
};

export function toLandingArtwork(
  row: ExplorerArtworkResult
): LandingArtwork {
  const facets = [
    ...row.labels.map((l) => l.name),
    row.medium,
  ].filter((v): v is string => Boolean(v));

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    artistName: row.artist.name,
    medium: row.medium,
    year: row.year,
    priceCents: row.priceCents,
    currency: row.currency,
    coverUrl: row.coverUrl,
    facets,
  };
}

export function filterLandingArtworks(
  works: LandingArtwork[],
  discipline: string
): LandingArtwork[] {
  if (discipline === "Tous") return works;
  const needle = discipline.toLowerCase();
  return works.filter((work) =>
    work.facets.some((f) => f.toLowerCase().includes(needle))
  );
}

export function landingDisciplines(works: LandingArtwork[]): string[] {
  const set = new Set<string>();
  for (const work of works) {
    for (const f of work.facets) {
      // Prefer short discipline-like labels (Peinture, Sculpture…)
      if (f.length <= 24) set.add(f);
    }
  }
  return ["Tous", ...[...set].sort((a, b) => a.localeCompare(b, "fr"))];
}
