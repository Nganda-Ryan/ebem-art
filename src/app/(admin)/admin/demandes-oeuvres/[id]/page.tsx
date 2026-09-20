import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtworkRequestById, PACKAGING_LABELS } from "@/modules/artwork-requests";
import { RequestDecisionButton } from "@/components/admin/RequestDecisionDrawer";
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

export const metadata = { title: "Détail demande œuvre - Admin" };
export const dynamic = "force-dynamic";

const WORK_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Disponible",
  RESERVED: "En réservation",
  SOLD: "Vendue",
  EXHIBITING: "En exposition physique",
};

const STATUS_STYLES: Record<string, { className: string; label: string }> = {
  PENDING: {
    className: "bg-amber-100 text-amber-800",
    label: "En attente",
  },
  APPROVED: {
    className: "bg-emerald-100 text-emerald-800",
    label: "Approuvé",
  },
  REJECTED: {
    className: "bg-red-100 text-red-800",
    label: "Rejeté",
  },
};

export default async function AdminDemandeOeuvreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getArtworkRequestById(id);

  if (!request) notFound();

  const style = STATUS_STYLES[request.status] ?? STATUS_STYLES.PENDING;
  const images = collectArtworkImages(request);

  return (
    <AdminDetailLayout
      header={
        <AdminDetailHeader
          backHref="/admin/demandes-oeuvres"
          backLabel="Retour aux demandes"
          title={request.title}
          subtitle={
            <>
              Par{" "}
              <Link
                href={`/admin/artistes/${request.artistId}`}
                className="font-medium text-gray-800 hover:underline"
              >
                {request.artist.name}
              </Link>
            </>
          }
          badges={
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${style.className}`}
            >
              {style.label}
            </span>
          }
          actions={
            request.status === "PENDING" ? (
              <RequestDecisionButton
                requestId={request.id}
                kind="artwork"
                label={request.title}
                iconOnly={false}
              />
            ) : request.status === "APPROVED" ? (
              <div className="flex flex-wrap gap-2">
                {request.artworkId && (
                  <Link
                    href={`/admin/oeuvres/${request.artworkId}`}
                    className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
                  >
                    Voir l&apos;œuvre →
                  </Link>
                )}
                <Link
                  href={`/admin/artistes/${request.artistId}`}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Voir l&apos;artiste →
                </Link>
              </div>
            ) : undefined
          }
        />
      }
      media={<AdminImageGallery images={images} />}
      aside={
        <>
          <AdminMetaCard title="Caractéristiques">
            <dl>
              <AdminMetaRow label="Médium">
                {request.medium || "—"}
              </AdminMetaRow>
              <AdminMetaRow label="Technique">
                {request.technique || "—"}
              </AdminMetaRow>
              <AdminMetaRow label="Année">
                {request.year || "—"}
              </AdminMetaRow>
              <AdminMetaRow label="Dimensions">
                {request.heightCm && request.widthCm
                  ? `${request.heightCm} × ${request.widthCm}${
                      request.depthCm ? ` × ${request.depthCm}` : ""
                    } cm`
                  : "—"}
              </AdminMetaRow>
              <AdminMetaRow label="Poids">
                {request.weightKg ? `${request.weightKg} kg` : "—"}
              </AdminMetaRow>
            </dl>
          </AdminMetaCard>

          <AdminMetaCard title="Prix & logistique">
            <dl>
              <AdminMetaRow label="Prix public">
                {request.priceCents.toLocaleString()} {request.currency}
              </AdminMetaRow>
              <AdminMetaRow label="Prix artiste">
                {request.artistPriceCents
                  ? `${request.artistPriceCents.toLocaleString()} ${request.currency}`
                  : "—"}
              </AdminMetaRow>
              <AdminMetaRow label="Statut œuvre">
                {WORK_STATUS_LABELS[request.workStatus] ?? request.workStatus}
              </AdminMetaRow>
              <AdminMetaRow label="Encadré">
                {request.framed ? "Oui" : "Non"}
              </AdminMetaRow>
              <AdminMetaRow label="Emballage">
                {request.packaging
                  ? (PACKAGING_LABELS[request.packaging] ?? request.packaging)
                  : "—"}
              </AdminMetaRow>
              <AdminMetaRow label="Lieu">
                {request.location || "—"}
              </AdminMetaRow>
            </dl>
          </AdminMetaCard>

          {request.status === "PENDING" && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
              L&apos;approbation crée l&apos;œuvre <strong>sans</strong> la
              publier sur le catalogue. Publiez-la ensuite depuis la fiche
              œuvre.
            </p>
          )}
        </>
      }
    >
      {request.titleTranslation && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Traduction du titre
          </h2>
          <p className="mt-3 text-sm text-gray-800">
            {request.titleTranslation}
          </p>
        </section>
      )}
      {request.description && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Description
          </h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-800">
            {request.description}
          </p>
        </section>
      )}
      {request.adminNote && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Note admin
          </h2>
          <p className="mt-3 text-sm text-gray-800">{request.adminNote}</p>
        </section>
      )}
    </AdminDetailLayout>
  );
}
