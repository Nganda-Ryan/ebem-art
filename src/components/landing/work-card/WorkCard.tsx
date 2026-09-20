"use client";

import type { LandingArtwork } from "@/lib/landing/catalog";
import { CatalogFlipCard } from "@/components/ui/catalog-flip-card";
import { formatPrice } from "@/lib/format/price";

type WorkCardProps = {
  work: LandingArtwork;
};

export function WorkCard({ work }: WorkCardProps) {
  const metaParts = [
    work.year ? String(work.year) : null,
    work.medium,
  ].filter(Boolean);

  return (
    <CatalogFlipCard
      imageUrl={work.coverUrl}
      imageAlt={work.title}
      eyebrow={work.facets[0] ?? work.medium}
      title={work.title}
      subtitle={work.artistName}
      meta={metaParts.length > 0 ? metaParts.join(" · ") : null}
      footer={formatPrice(work.priceCents)}
      href={`/oeuvres/${work.slug}`}
      cartItem={{
        artworkId: work.id,
        slug: work.slug,
        title: work.title,
        priceCents: work.priceCents,
        currency: work.currency,
        imageUrl: work.coverUrl,
        artistName: work.artistName,
      }}
    />
  );
}
