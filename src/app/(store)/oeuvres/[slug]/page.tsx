import { ArtworkGallery } from "@/components/artwork/ArtworkGallery";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { artworkCoverUrl, artworkGalleryUrls } from "@/lib/media";
import { getArtworkBySlug } from "@/modules/artworks";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  return {
    title: artwork ? `${artwork.title} - EBEM Art` : "Œuvre introuvable",
  };
}

export const dynamic = "force-dynamic";

export default async function ArtworkDetailPage({ params }: Props) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) notFound();

  const gallery = artworkGalleryUrls(artwork);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 pt-28">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <ArtworkGallery images={gallery} title={artwork.title} />
        </div>

        <div className="lg:w-96">
          <h1 className="text-3xl font-bold">{artwork.title}</h1>
          <p className="mt-2 text-gray-500">
            par{" "}
            <a
              href={`/artistes/${artwork.artist.slug}`}
              className="underline hover:text-gray-800"
            >
              {artwork.artist.name}
            </a>
          </p>

          <div className="mt-6 space-y-2 text-sm text-gray-600">
            {artwork.medium && <p>Technique : {artwork.medium}</p>}
            {artwork.year && <p>Année : {artwork.year}</p>}
          </div>

          {artwork.description && (
            <p className="mt-6 text-gray-600">{artwork.description}</p>
          )}

          <div className="mt-8">
            <p className="text-2xl font-bold">
              {artwork.priceCents.toLocaleString()} {artwork.currency}
            </p>
            <AddToCartButton
              artworkStatus={artwork.status}
              item={{
                artworkId: artwork.id,
                slug: artwork.slug,
                title: artwork.title,
                priceCents: artwork.priceCents,
                currency: artwork.currency,
                imageUrl: artworkCoverUrl(artwork),
                artistName: artwork.artist.name,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
