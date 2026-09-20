import type { Artwork } from "@/types/landing";

export type ArtworkFilters = {
  discipline: string;
  maxPrice: number;
};

export function filterArtworks(
  works: Artwork[],
  { discipline, maxPrice }: ArtworkFilters,
): Artwork[] {
  return works.filter((work) => {
    if (discipline !== "Tous" && work.discipline !== discipline) return false;
    if (work.price > maxPrice) return false;
    return true;
  });
}

export function workshopFillPercent(spots: number, remaining: number): number {
  if (spots <= 0) return 0;
  return Math.round(((spots - remaining) / spots) * 100);
}
