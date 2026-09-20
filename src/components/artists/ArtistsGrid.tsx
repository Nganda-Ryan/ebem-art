"use client";

import { CatalogFlipCard } from "@/components/ui/catalog-flip-card";

export type ArtistCardData = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  discipline: string | null;
  portraitUrl: string | null;
};

type ArtistsGridProps = {
  artists: ArtistCardData[];
};

export function ArtistsGrid({ artists }: ArtistsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {artists.map((artist) => {
        const href = artist.id.startsWith("mock-")
          ? "/artistes"
          : `/artistes/${artist.slug}`;

        return (
          <CatalogFlipCard
            key={artist.id}
            imageUrl={artist.portraitUrl}
            imageAlt={artist.name}
            eyebrow={artist.discipline}
            title={artist.name}
            subtitle={artist.city}
            href={href}
            frontActionLabel="VOIR LE PROFIL"
            frontActionHref={href}
          />
        );
      })}
    </div>
  );
}
