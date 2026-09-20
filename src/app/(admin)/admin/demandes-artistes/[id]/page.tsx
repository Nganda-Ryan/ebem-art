import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArtistRequestById } from "@/modules/artist-requests";
import { RequestDecisionButton } from "@/components/admin/RequestDecisionDrawer";

export const metadata = { title: "Détail demande - Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDemandeArtisteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getArtistRequestById(id);

  if (!request) notFound();

  const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
    PENDING: { bg: "#FEF3C7", color: "#92400E", label: "En attente" },
    APPROVED: { bg: "#D1FAE5", color: "#065F46", label: "Approuvé" },
    REJECTED: { bg: "#FEE2E2", color: "#991B1B", label: "Rejeté" },
  };

  const style = STATUS_STYLES[request.status] ?? STATUS_STYLES.PENDING;

  return (
    <div>
      <Link
        href="/admin/demandes-artistes"
        className="mb-4 inline-block text-sm text-gray-500 hover:text-gray-700"
      >
        ← Retour aux demandes
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {request.firstName} {request.lastName}
        </h1>
        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: style.bg, color: style.color }}
        >
          {style.label}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Identity */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500">
            Identité
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Nom complet</dt>
              <dd className="font-medium">
                {request.firstName} {request.lastName}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Date de naissance</dt>
              <dd>{request.birthDate ? new Date(request.birthDate).toLocaleDateString("fr-FR") : "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Lieu de naissance</dt>
              <dd>{request.birthPlace || "-"}</dd>
            </div>
          </dl>

          {/* KYC photo */}
          <div className="mt-4">
            <dt className="text-gray-500">Photo de profil / atelier (KYC)</dt>
            <dd className="mt-2">
              {request.profilePhotoUrl ? (
                <Image
                  src={request.profilePhotoUrl}
                  alt={`Photo de ${request.firstName} ${request.lastName}`}
                  width={160}
                  height={160}
                  className="h-40 w-40 rounded-lg object-cover"
                  sizes="160px"
                  unoptimized
                />
              ) : (
                <span className="text-gray-400">Aucune photo fournie</span>
              )}
            </dd>
          </div>
        </div>

        {/* Artist profile */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500">
            Profil Artiste
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Nom d&apos;artiste</dt>
              <dd className="font-medium">{request.artistName || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Statut culturel</dt>
              <dd>{request.culturalStatus || "-"}</dd>
            </div>
            {request.bio && (
              <div>
                <dt className="mb-1 text-gray-500">Profil artistique & storytelling</dt>
                <dd className="whitespace-pre-line rounded bg-gray-50 p-3 text-sm leading-relaxed">
                  {request.bio}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Contact */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500">
            Contact
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Téléphone</dt>
              <dd>{request.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">WhatsApp</dt>
              <dd>{request.whatsapp || "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Email</dt>
              <dd>{request.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Ville / Région</dt>
              <dd>
                {request.city}, {request.region}
              </dd>
            </div>
          </dl>
        </div>

        {/* Admin info */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500">
            Informations
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Date de demande</dt>
              <dd>
                {new Date(request.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
            {request.adminNote && (
              <div>
                <dt className="text-gray-500">Note admin</dt>
                <dd className="mt-1 rounded bg-gray-50 p-2 text-sm">
                  {request.adminNote}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Action buttons / shortcuts */}
      {request.status === "PENDING" && (
        <div className="mt-8">
          <RequestDecisionButton
            requestId={request.id}
            kind="artist"
            label={`${request.firstName} ${request.lastName}`}
            iconOnly={false}
          />
        </div>
      )}
      {request.status === "APPROVED" && request.artistId && (
        <div className="mt-8">
          <Link
            href={`/admin/artistes/${request.artistId}`}
            className="inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Voir l&apos;artiste créé →
          </Link>
        </div>
      )}
    </div>
  );
}
