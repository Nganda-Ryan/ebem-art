import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArtistById, getAllArtists } from "@/modules/artists";
import { getAllLabels } from "@/modules/labels";
import { ArtistDetailActions } from "@/components/admin/ArtistDetailActions";
import { NewArtworkButton } from "@/components/admin/ArtworkRowActions";
import {
  AdminDetailHeader,
  AdminDetailLayout,
  AdminMetaCard,
  AdminMetaRow,
} from "@/components/admin/AdminDetailLayout";
import { artistPortraitUrl } from "@/lib/media";

export const metadata = { title: "Détail artiste - EBEM Admin" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Disponible",
  RESERVED: "Réservée",
  SOLD: "Vendue",
  EXHIBITING: "Exposition",
};

export default async function AdminArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [artist, allArtists, labels] = await Promise.all([
    getArtistById(id),
    getAllArtists(),
    getAllLabels(),
  ]);

  if (!artist) notFound();

  const artistOptions = allArtists.map((a) => ({ id: a.id, name: a.name }));
  const labelOptions = labels.map((l) => ({
    id: l.id,
    name: l.name,
    slug: l.slug,
  }));
  const portrait = artistPortraitUrl(artist);

  return (
    <AdminDetailLayout
      header={
        <AdminDetailHeader
          backHref="/admin/artistes"
          backLabel="Retour aux artistes"
          title={artist.name}
          subtitle={<span>/{artist.slug}</span>}
          badges={
            <>
              <span
                className={`rounded-xl-full px-2.5 py-0.5 text-xs font-medium ${
                  artist.published
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {artist.published ? "Publié" : "Non publié"}
              </span>
              {artist.user && (
                <span
                  className={`rounded-xl-full px-2.5 py-0.5 text-xs font-medium ${
                    artist.user.banned
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {artist.user.banned ? "Compte bloqué" : "Compte actif"}
                </span>
              )}
            </>
          }
          actions={
            <ArtistDetailActions
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
          }
        />
      }
      media={
        portrait ? (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={portrait}
                alt={artist.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
                unoptimized
                priority
              />
            </div>
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
            Aucun portrait
          </div>
        )
      }
      aside={
        <AdminMetaCard title="Profil">
          <dl>
            <AdminMetaRow label="Ville">{artist.city ?? "—"}</AdminMetaRow>
            <AdminMetaRow label="Discipline">
              {artist.discipline ?? "—"}
            </AdminMetaRow>
            <AdminMetaRow label="Email">
              {artist.email ?? artist.user?.email ?? "—"}
            </AdminMetaRow>
            <AdminMetaRow label="Téléphone">
              {artist.phone ?? "—"}
            </AdminMetaRow>
            <AdminMetaRow label="Œuvres">
              {artist._count.artworks}
            </AdminMetaRow>
          </dl>
          {artist.user?.banReason && (
            <p className="mt-3 text-xs text-red-600">
              Motif ban : {artist.user.banReason}
            </p>
          )}
        </AdminMetaCard>
      }
    >
      {artist.bio && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Bio
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
            {artist.bio}
          </p>
        </section>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Œuvres
          </h2>
          <NewArtworkButton
            artists={artistOptions}
            labels={labelOptions}
            defaultArtistId={artist.id}
          />
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">Titre</th>
                <th className="px-3 py-2 font-medium">Prix</th>
                <th className="px-3 py-2 font-medium">Statut</th>
                <th className="px-3 py-2 font-medium">Catalogue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {artist.artworks.map((artwork) => (
                <tr key={artwork.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/admin/oeuvres/${artwork.id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {artwork.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">
                    {artwork.priceCents.toLocaleString()} {artwork.currency}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">
                    {STATUS_LABEL[artwork.status] ?? artwork.status}
                  </td>
                  <td className="px-3 py-2.5 text-gray-500">
                    {artwork.published ? "Publiée" : "Non"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {artist.artworks.length === 0 && (
            <p className="p-4 text-gray-400">Aucune œuvre pour cet artiste.</p>
          )}
        </div>
      </section>
    </AdminDetailLayout>
  );
}
