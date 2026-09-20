import { notFound } from "next/navigation";
import Link from "next/link";
import { getArtistBySlug } from "@/modules/artists";
import type { Artwork } from "@/generated/prisma/client";
import { artistPortraitUrl, artworkCoverUrl } from "@/lib/media";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  return { title: artist ? `${artist.name} - EBEM Art` : "Artiste introuvable" };
}

export const dynamic = "force-dynamic";

export default async function ArtistDetailPage({ params }: Props) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) notFound();

  const portrait = artistPortraitUrl(artist);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-8 md:flex-row">
        {portrait ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={portrait}
            alt={artist.name}
            className="aspect-square w-full max-w-80 rounded-xl object-cover"
          />
        ) : (
          <div className="flex aspect-square w-full max-w-80 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
            Pas de portrait
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">{artist.name}</h1>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
            {artist.city && <span>{artist.city}</span>}
            {artist.discipline && <span>· {artist.discipline}</span>}
          </div>
          {artist.bio && (
            <p className="mt-4 max-w-2xl text-gray-600">{artist.bio}</p>
          )}
        </div>
      </div>

      {artist.artworks.length > 0 ? (
        <>
          <h2 className="mt-12 text-2xl font-semibold">Œuvres</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artist.artworks.map((artwork: Artwork) => {
              const cover = artworkCoverUrl(artwork);
              return (
                <Link
                  key={artwork.id}
                  href={`/oeuvres/${artwork.slug}`}
                  className="group block overflow-hidden rounded-xl border border-gray-200 hover:shadow-md"
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt={artwork.title}
                      className="h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-gray-100 text-sm text-gray-400">
                      Pas d&apos;image
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-medium group-hover:underline">
                      {artwork.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {artwork.priceCents.toLocaleString()} {artwork.currency}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <p className="mt-12 text-sm text-gray-500">
          Aucune œuvre disponible pour cet artiste pour le moment.
        </p>
      )}
    </section>
  );
}
