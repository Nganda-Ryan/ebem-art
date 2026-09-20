"use client";

import Link from "next/link";
import { COLORS } from "@/constants/colors";
import { CatalogFlipCard } from "@/components/ui/catalog-flip-card";
import type { ExplorerArtworkResult } from "@/modules/explorer";
import { formatPrice } from "@/lib/format/price";

type ExplorerResultsProps = {
  artworks: ExplorerArtworkResult[];
  total: number;
  onClearHref: string;
  /** True when search/filters are active (empty = no match vs empty catalog) */
  hasActiveQuery?: boolean;
};

export function ExplorerResults({
  artworks,
  total,
  onClearHref,
  hasActiveQuery = false,
}: ExplorerResultsProps) {
  if (total === 0) {
    return (
      <div className="py-20 text-center" style={{ color: COLORS.muted }}>
        <div className="mb-2 font-serif text-2xl" style={{ color: COLORS.ink }}>
          {hasActiveQuery ? "Aucune œuvre" : "Collection vide"}
        </div>
        <p className="mx-auto max-w-md text-sm">
          {hasActiveQuery
            ? "Essayez un autre mot-clé, retirez un label, ou réinitialisez pour parcourir toute la collection."
            : "Aucune œuvre n’est publiée pour le moment. Revenez bientôt."}
        </p>
        {hasActiveQuery ? (
          <Link
            href={onClearHref}
            className="mt-6 inline-block px-5 py-2.5 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
            style={{ background: COLORS.terra }}
          >
            VOIR TOUTES LES ŒUVRES
          </Link>
        ) : (
          <Link
            href="/artistes"
            className="mt-6 inline-block px-5 py-2.5 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
            style={{ background: COLORS.terra }}
          >
            VOIR LES ARTISTES
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((artwork) => {
        const metaParts = [
          artwork.year ? String(artwork.year) : null,
          artwork.medium,
        ].filter(Boolean);

        return (
          <CatalogFlipCard
            key={artwork.id}
            imageUrl={artwork.coverUrl}
            imageAlt={artwork.title}
            eyebrow={artwork.labels[0]?.name ?? artwork.medium}
            title={artwork.title}
            subtitle={artwork.artist.name}
            meta={metaParts.length > 0 ? metaParts.join(" · ") : null}
            footer={formatPrice(artwork.priceCents)}
            href={`/oeuvres/${artwork.slug}`}
            cartItem={{
              artworkId: artwork.id,
              slug: artwork.slug,
              title: artwork.title,
              priceCents: artwork.priceCents,
              currency: artwork.currency,
              imageUrl: artwork.coverUrl,
              artistName: artwork.artist.name,
            }}
          />
        );
      })}
    </div>
  );
}
