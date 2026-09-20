import Link from "next/link";
import Image from "next/image";
import { COLORS } from "@/constants/colors";
import type { ExplorerArtworkResult } from "@/modules/explorer";
import { formatPrice } from "@/lib/format/price";

type ExplorerResultsProps = {
  artworks: ExplorerArtworkResult[];
  total: number;
  onClearHref: string;
};

export function ExplorerResults({
  artworks,
  total,
  onClearHref,
}: ExplorerResultsProps) {
  if (total === 0) {
    return (
      <div className="py-20 text-center" style={{ color: COLORS.muted }}>
        <div className="mb-2 font-serif text-2xl" style={{ color: COLORS.ink }}>
          Aucune œuvre
        </div>
        <p className="mx-auto max-w-md text-sm">
          Essayez un autre mot-clé, retirez un label, ou réinitialisez pour
          parcourir toute la collection.
        </p>
        <Link
          href={onClearHref}
          className="mt-6 inline-block px-5 py-2.5 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
          style={{ background: COLORS.terra }}
        >
          VOIR TOUTES LES ŒUVRES
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {artworks.map((artwork) => {
        const href = artwork.id.startsWith("mock-")
          ? "/explorer"
          : `/oeuvres/${artwork.slug}`;
        return (
          <Link key={artwork.id} href={href} className="group block">
            <div
              className="overflow-hidden"
              style={{ border: `1px solid ${COLORS.border}` }}
            >
              <div className="relative aspect-4/5 overflow-hidden bg-[#0C0A08]">
                {artwork.coverUrl ? (
                  <Image
                    src={artwork.coverUrl}
                    alt={artwork.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="flex h-full items-center justify-center text-sm"
                    style={{ color: COLORS.muted, background: COLORS.bgAlt }}
                  >
                    Pas d&apos;image
                  </div>
                )}
              </div>
              <div className="p-4" style={{ background: COLORS.bgCard }}>
                <h3
                  className="font-serif text-xl group-hover:underline"
                  style={{ color: COLORS.ink }}
                >
                  {artwork.title}
                </h3>
                <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
                  {artwork.artist.name}
                  {artwork.year ? ` · ${artwork.year}` : ""}
                </p>
                {artwork.medium ? (
                  <p
                    className="mt-0.5 font-mono text-[10px] tracking-wider"
                    style={{ color: COLORS.terra }}
                  >
                    {artwork.medium.toUpperCase()}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {artwork.labels.slice(0, 4).map((label) => (
                    <span
                      key={label.slug}
                      className="font-mono text-[10px] tracking-wider"
                      style={{ color: COLORS.terra }}
                    >
                      {label.name.toUpperCase()}
                    </span>
                  ))}
                </div>
                <p
                  className="mt-3 font-serif text-base"
                  style={{ color: COLORS.ink }}
                >
                  {formatPrice(artwork.priceCents)}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
