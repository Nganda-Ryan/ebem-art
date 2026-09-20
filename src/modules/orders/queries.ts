import { db } from "@/lib/db";

/** Get all orders (admin) */
export async function getAllOrders() {
  return db.order.findMany({
    include: {
      items: {
        include: { artwork: { select: { title: true, slug: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** Get a single order by ID (admin) */
export async function getOrderById(id: string) {
  return db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { artwork: true },
      },
    },
  });
}

/** Get an order by Stripe session ID (used by webhook & success page) */
export async function getOrderByStripeSessionId(stripeSessionId: string) {
  return db.order.findUnique({
    where: { stripeSessionId },
    include: { items: { include: { artwork: true } } },
  });
}

/** Get dashboard stats (admin) */
export async function getDashboardStats() {
  const [totalOrders, totalRevenue, totalArtworks, totalArtists] =
    await Promise.all([
      db.order.count({ where: { status: "PAID" } }),
      db.order.aggregate({
        where: { status: "PAID" },
        _sum: { totalCents: true },
      }),
      db.artwork.count(),
      db.artist.count(),
    ]);

  return {
    totalOrders,
    totalRevenueCents: totalRevenue._sum.totalCents ?? 0,
    totalArtworks,
    totalArtists,
  };
}
