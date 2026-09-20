import Link from "next/link";
import { getArtworks } from "@/modules/artworks";
import type { Artwork, Artist } from "@/generated/prisma/client";
import { artworkCoverUrl } from "@/lib/media";

type ArtworkWithArtist = Artwork & { artist: Pick<Artist, "name" | "slug"> };

export const metadata = { title: "Œuvres - EBEM Art" };
export const dynamic = "force-dynamic";

export default async function OeuvresPage() {
  let artworks: ArtworkWithArtist[] = [];
  try {
    artworks = await getArtworks();
  } catch {
    artworks = [];
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pt-28 pb-16">
      <h1 className="font-serif text-4xl">Œuvres</h1>
      <p className="mt-2 text-sm text-[var(--color-mboa-muted)]">
        Explorez notre collection d&apos;art contemporain camerounais.{" "}
        <a
          href="/explorer"
          className="underline"
          style={{ color: "var(--color-mboa-terra)" }}
        >
          Voir l&apos;explorateur
        </a>
      </p>

      {artworks.length === 0 ? (
        <p className="mt-8 text-[var(--color-mboa-muted)]">
          Aucune œuvre disponible pour le moment.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((artwork: ArtworkWithArtist) => {
            const cover = artworkCoverUrl(artwork);
            return (
              <Link
                key={artwork.id}
                href={`/oeuvres/${artwork.slug}`}
                className="group block overflow-hidden rounded-lg border border-gray-200 hover:shadow-md"
              >
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt={artwork.title}
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center bg-gray-100 text-sm text-gray-400">
                    Pas d&apos;image
                  </div>
                )}
                <div className="p-4">
                  <h2 className="font-medium group-hover:underline">
                    {artwork.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {artwork.artist.name}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {artwork.priceCents.toLocaleString()} {artwork.currency}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
