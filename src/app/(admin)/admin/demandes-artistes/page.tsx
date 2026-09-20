import Link from "next/link";
import { getAllArtistRequests } from "@/modules/artist-requests";
import { RequestDecisionButton } from "@/components/admin/RequestDecisionDrawer";

export const metadata = { title: "Demandes Artistes - Admin" };
export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PENDING: { bg: "#FEF3C7", color: "#92400E", label: "En attente" },
  APPROVED: { bg: "#D1FAE5", color: "#065F46", label: "Approuvé" },
  REJECTED: { bg: "#FEE2E2", color: "#991B1B", label: "Rejeté" },
};

export default async function AdminDemandesArtistesPage() {
  const requests = await getAllArtistRequests();

  return (
    <div>
      <h1 className="text-xl font-bold sm:text-2xl">
        Demandes d&apos;inscription Artistes
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Examinez et approuvez les demandes KYC des artistes.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((req) => {
              const style = STATUS_STYLES[req.status] ?? STATUS_STYLES.PENDING;
              return (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/demandes-artistes/${req.id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {req.firstName} {req.lastName}
                    </Link>
                    {req.artistName && (
                      <div className="text-xs text-gray-400">
                        &ldquo;{req.artistName}&rdquo;
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{req.email}</td>
                  <td className="px-4 py-3 text-gray-500">{req.phone}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {req.city}, {req.region}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block rounded-xl-full px-2 py-0.5 text-xs font-medium"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {style.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {req.status === "PENDING" ? (
                      <RequestDecisionButton
                        requestId={req.id}
                        kind="artist"
                        label={`${req.firstName} ${req.lastName}`}
                      />
                    ) : req.artistId ? (
                      <Link
                        href={`/admin/artistes/${req.artistId}`}
                        className="text-xs font-medium text-gray-700 hover:underline"
                      >
                        Voir artiste
                      </Link>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {requests.length === 0 && (
          <p className="p-4 text-gray-400">Aucune demande.</p>
        )}
      </div>
    </div>
  );
}
