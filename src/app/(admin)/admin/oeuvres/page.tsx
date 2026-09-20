import Link from "next/link";
import { getAllArtworks } from "@/modules/artworks";
import { getAllArtists } from "@/modules/artists";
import { getAllLabels } from "@/modules/labels";
import {
  ArtworkRowActions,
  NewArtworkButton,
} from "@/components/admin/ArtworkRowActions";
import type { ArtworkFormValues } from "@/components/admin/ArtworkFormDrawer";
import { artworkCoverUrl } from "@/lib/media";

export const metadata = { title: "Œuvres - EBEM Admin" };
export const dynamic = "force-dynamic";

export default async function AdminOeuvresPage() {
  const [artworks, artists, labels] = await Promise.all([
    getAllArtworks(),
    getAllArtists(),
    getAllLabels(),
  ]);

  const artistOptions = artists.map((a) => ({ id: a.id, name: a.name }));
  const labelOptions = labels.map((l) => ({
    id: l.id,
    name: l.name,
    slug: l.slug,
  }));

  const statusLabel: Record<string, string> = {
    AVAILABLE: "Disponible",
    RESERVED: "Réservée",
    SOLD: "Vendue",
    EXHIBITING: "Exposition",
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Œuvres</h1>
        <NewArtworkButton artists={artistOptions} labels={labelOptions} />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Artiste</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Catalogue</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {artworks.map((artwork) => {
              const cover = artworkCoverUrl(artwork);
              return (
                <tr key={artwork.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/admin/oeuvres/${artwork.id}`}
                      className="inline-flex items-center gap-3 hover:underline"
                    >
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt=""
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-[10px] text-gray-400">
                          —
                        </span>
                      )}
                      {artwork.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    <Link
                      href={`/admin/artistes/${artwork.artist.id}`}
                      className="hover:underline"
                    >
                      {artwork.artist.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {artwork.priceCents.toLocaleString()} {artwork.currency}
                  </td>
                  <td className="px-4 py-3">
                    {statusLabel[artwork.status] ?? artwork.status}
                  </td>
                  <td className="px-4 py-3">
                    {artwork.published ? (
                      <span className="text-emerald-600">Publiée</span>
                    ) : (
                      <span className="text-amber-600">Non</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ArtworkRowActions
                      artwork={{
                        id: artwork.id,
                        title: artwork.title,
                        slug: artwork.slug,
                        description: artwork.description,
                        medium: artwork.medium,
                        year: artwork.year,
                        priceCents: artwork.priceCents,
                        currency: artwork.currency,
                        imageUrls:
                          artwork.imageUrls.length > 0
                            ? artwork.imageUrls
                            : cover
                              ? [cover]
                              : [],
                        artistId: artwork.artistId,
                        status: artwork.status as NonNullable<
                          ArtworkFormValues["status"]
                        >,
                        published: artwork.published,
                        labelIds: artwork.labels.map((l) => l.id),
                      }}
                      artists={artistOptions}
                      labels={labelOptions}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {artworks.length === 0 && (
          <p className="p-4 text-gray-400">Aucune œuvre.</p>
        )}
      </div>
    </div>
  );
}
