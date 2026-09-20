"use client";

import type { Artwork } from "@/types/landing";
import { CatalogFlipCard } from "@/components/ui/catalog-flip-card";
import { formatPrice } from "@/lib/format/price";

type WorkCardProps = {
  work: Artwork;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function WorkCard({ work }: WorkCardProps) {
  const slug = slugify(work.title);

  return (
    <CatalogFlipCard
      imageUrl={work.img}
      imageAlt={work.title}
      eyebrow={work.discipline}
      title={work.title}
      subtitle={work.artist}
      meta={`${work.year} · ${work.medium}`}
      footer={formatPrice(work.price)}
      href={`/explorer`}
      cartItem={{
        artworkId: `mock-${work.id}`,
        slug,
        title: work.title,
        priceCents: work.price,
        currency: "XAF",
        imageUrl: work.img,
        artistName: work.artist,
      }}
    />
  );
}
