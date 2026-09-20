import Link from "next/link";
import { getAllOrders } from "@/modules/orders";

export const metadata = { title: "Commandes - EBEM Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCommandesPage() {
  const orders = await getAllOrders();

  const statusLabel: Record<string, string> = {
    PENDING: "En attente",
    PAID: "Payée",
    FAILED: "Échouée",
    REFUNDED: "Remboursée",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Commandes</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                  <Link
                    href={`/admin/commandes/${order.id}`}
                    className="hover:underline"
                  >
                    {order.id.slice(0, 12)}…
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/commandes/${order.id}`}
                    className="hover:underline"
                  >
                    {order.email || "-"}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {order.totalCents.toLocaleString()} XAF
                </td>
                <td className="px-4 py-3">
                  {statusLabel[order.status] ?? order.status}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-4 text-gray-400">Aucune commande.</p>
        )}
      </div>
    </div>
  );
}
