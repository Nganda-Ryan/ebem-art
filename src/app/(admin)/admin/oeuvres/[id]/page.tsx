import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtworkById } from "@/modules/artworks";
import { getAllArtists } from "@/modules/artists";
import { getAllLabels } from "@/modules/labels";
import { ArtworkDetailActions } from "@/components/admin/ArtworkDetailActions";
import {
  AdminDetailHeader,
  AdminDetailLayout,
  AdminMetaCard,
  AdminMetaRow,
} from "@/components/admin/AdminDetailLayout";
import {
  AdminImageGallery,
  collectArtworkImages,
} from "@/components/admin/AdminImageGallery";
import type { ArtworkFormValues } from "@/components/admin/ArtworkFormDrawer";
import { artworkGalleryUrls } from "@/lib/media";

export const metadata = { title: "Détail œuvre - EBEM Admin" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Disponible",
  RESERVED: "Réservée",
  SOLD: "Vendue",
  EXHIBITING: "Exposition",
};

export default async function AdminArtworkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [artwork, artists, labels] = await Promise.all([
    getArtworkById(id),
    getAllArtists(),
    getAllLabels(),
  ]);

  if (!artwork) notFound();

  const artistOptions = artists.map((a) => ({ id: a.id, name: a.name }));
  const labelOptions = labels.map((l) => ({
    id: l.id,
    name: l.name,
    slug: l.slug,
  }));
  const images = collectArtworkImages(artwork);
  const galleryUrls = artworkGalleryUrls(artwork);

  return (
    <AdminDetailLayout
      header={
        <AdminDetailHeader
          backHref="/admin/oeuvres"
          backLabel="Retour aux œuvres"
          title={artwork.title}
          subtitle={
            <>
              <Link
                href={`/admin/artistes/${artwork.artist.id}`}
                className="font-medium text-gray-800 hover:underline"
              >
                {artwork.artist.name}
              </Link>
              <span className="text-gray-400"> · /{artwork.slug}</span>
            </>
          }
          badges={
            <>
              <span className="rounded-xl-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                {STATUS_LABEL[artwork.status] ?? artwork.status}
              </span>
              <span
                className={`rounded-xl-full px-2.5 py-0.5 text-xs font-medium ${
                  artwork.published
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {artwork.published ? "Publiée" : "Non publiée"}
              </span>
            </>
          }
          actions={
            <ArtworkDetailActions
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
                    : galleryUrls,
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
          }
        />
      }
      media={<AdminImageGallery images={images} />}
      aside={
        <>
          <AdminMetaCard title="Fiche">
            <dl>
              <AdminMetaRow label="Prix">
                {artwork.priceCents.toLocaleString()} {artwork.currency}
              </AdminMetaRow>
              <AdminMetaRow label="Médium">
                {artwork.medium ?? "—"}
              </AdminMetaRow>
              <AdminMetaRow label="Technique">
                {artwork.technique ?? "—"}
              </AdminMetaRow>
              <AdminMetaRow label="Année">
                {artwork.year ?? "—"}
              </AdminMetaRow>
              <AdminMetaRow label="Artiste">
                <Link
                  href={`/admin/artistes/${artwork.artist.id}`}
                  className="hover:underline"
                >
                  {artwork.artist.name}
                </Link>
              </AdminMetaRow>
              <AdminMetaRow label="Inventaire">
                {STATUS_LABEL[artwork.status] ?? artwork.status}
              </AdminMetaRow>
              <AdminMetaRow label="Catalogue">
                {artwork.published ? "Publiée" : "Non publiée"}
              </AdminMetaRow>
            </dl>
          </AdminMetaCard>

          {artwork.labels.length > 0 && (
            <AdminMetaCard title="Labels">
              <div className="flex flex-wrap gap-2">
                {artwork.labels.map((label) => (
                  <span
                    key={label.id}
                    className="rounded-xl-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </AdminMetaCard>
          )}

          {(artwork.heightCm ||
            artwork.widthCm ||
            artwork.depthCm ||
            artwork.weightKg) && (
            <AdminMetaCard title="Dimensions">
              <dl>
                {artwork.heightCm != null && (
                  <AdminMetaRow label="H">{artwork.heightCm} cm</AdminMetaRow>
                )}
                {artwork.widthCm != null && (
                  <AdminMetaRow label="L">{artwork.widthCm} cm</AdminMetaRow>
                )}
                {artwork.depthCm != null && (
                  <AdminMetaRow label="P">{artwork.depthCm} cm</AdminMetaRow>
                )}
                {artwork.weightKg != null && (
                  <AdminMetaRow label="Poids">
                    {artwork.weightKg} kg
                  </AdminMetaRow>
                )}
              </dl>
            </AdminMetaCard>
          )}
        </>
      }
    >
      {artwork.description && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Description
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
            {artwork.description}
          </p>
        </section>
      )}

      {artwork.orderItems.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Commandes récentes
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {artwork.orderItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/admin/commandes/${item.order.id}`}
                  className="text-gray-800 hover:underline"
                >
                  {item.order.id.slice(0, 12)}… — {item.order.status} —{" "}
                  {item.order.email || "sans email"}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AdminDetailLayout>
  );
}
