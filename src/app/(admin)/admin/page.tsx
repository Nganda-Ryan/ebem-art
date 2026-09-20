import { getDashboardStats } from "@/modules/orders";

export const metadata = { title: "Admin - EBEM Art" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Œuvres", value: stats.totalArtworks },
    { label: "Artistes", value: stats.totalArtists },
    { label: "Commandes payées", value: stats.totalOrders },
    {
      label: "Revenu total",
      value: `${stats.totalRevenueCents.toLocaleString()} XAF`,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 p-4"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
