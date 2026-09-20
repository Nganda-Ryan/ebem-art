import { db } from "@/lib/db";

/** Get all artist requests (admin) */
export async function getAllArtistRequests() {
  return db.artistRequest.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

/** Get a single artist request by ID (admin) */
export async function getArtistRequestById(id: string) {
  return db.artistRequest.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true } } },
  });
}

/** Get pending artist requests count (admin) */
export async function getPendingArtistRequestsCount() {
  return db.artistRequest.count({ where: { status: "PENDING" } });
}

/** Get artist request by user ID */
export async function getArtistRequestByUserId(userId: string) {
  return db.artistRequest.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
