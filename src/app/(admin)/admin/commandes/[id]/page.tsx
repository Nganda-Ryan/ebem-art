import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/modules/orders";
import { CancelOrderButton } from "@/components/admin/CancelOrderButton";

export const metadata = { title: "Détail commande - EBEM Admin" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  FAILED: "Échouée",
  REFUNDED: "Remboursée",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/commandes"
        className="mb-4 inline-block text-sm text-gray-500 hover:text-gray-700"
      >
        ← Retour aux commandes
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Commande</h1>
          <p className="mt-1 font-mono text-xs text-gray-500">{order.id}</p>
          <span className="mt-2 inline-block rounded-xl-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </div>
        {order.status === "PENDING" && (
          <CancelOrderButton orderId={order.id} />
        )}
      </div>

      <section className="mt-8 rounded-xl border border-gray-200 p-5">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium">{order.email || "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Total</dt>
            <dd className="font-medium">
              {order.totalCents.toLocaleString()} XAF
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Date</dt>
            <dd className="font-medium">
              {new Date(order.createdAt).toLocaleString("fr-FR")}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Session Stripe</dt>
            <dd className="font-mono text-xs">
              {order.stripeSessionId ?? "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Articles</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3">Œuvre</th>
                <th className="px-4 py-3">Prix unitaire</th>
                <th className="px-4 py-3">Qté</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/oeuvres/${item.artworkId}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {item.artwork.title}
                    </Link>
                    <div className="text-xs text-gray-400">
                      /{item.artwork.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {item.unitPriceCents.toLocaleString()} XAF
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
