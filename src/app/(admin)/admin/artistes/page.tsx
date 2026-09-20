import Link from "next/link";
import { getAllArtists } from "@/modules/artists";
import {
  NewArtistButton,
  ArtistRowActions,
} from "@/components/admin/ArtistRowActions";

export const metadata = { title: "Artistes - EBEM Admin" };
export const dynamic = "force-dynamic";

export default async function AdminArtistesPage() {
  const artists = await getAllArtists();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Artistes</h1>
        <NewArtistButton />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Œuvres</th>
              <th className="px-4 py-3">Publié</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {artists.map((artist) => (
              <tr key={artist.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/admin/artistes/${artist.id}`}
                    className="hover:underline"
                  >
                    {artist.name}
                  </Link>
                  {artist.user?.banned && (
                    <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">
                      Bloqué
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">{artist.slug}</td>
                <td className="px-4 py-3 text-gray-500">
                  {artist.city ?? "-"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {artist._count.artworks}
                </td>
                <td className="px-4 py-3">
                  {artist.published ? (
                    <span className="text-green-600">Oui</span>
                  ) : (
                    <span className="text-gray-400">Non</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ArtistRowActions
                    artist={{
                      id: artist.id,
                      name: artist.name,
                      slug: artist.slug,
                      bio: artist.bio,
                      city: artist.city,
                      discipline: artist.discipline,
                      portraitUrl: artist.portraitUrl,
                      published: artist.published,
                      banned: artist.user?.banned ?? false,
                      hasUser: Boolean(artist.userId),
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {artists.length === 0 && (
          <p className="p-4 text-gray-400">Aucun artiste.</p>
        )}
      </div>
    </div>
  );
}
