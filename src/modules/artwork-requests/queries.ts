import { db } from "@/lib/db";

/** Get all artwork requests (admin) */
export async function getAllArtworkRequests() {
  return db.artworkRequest.findMany({
    include: { artist: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
}

/** Get a single artwork request by ID (admin) */
export async function getArtworkRequestById(id: string) {
  return db.artworkRequest.findUnique({
    where: { id },
    include: { artist: { select: { name: true, slug: true } } },
  });
}

/** Get pending artwork requests count (admin) */
export async function getPendingArtworkRequestsCount() {
  return db.artworkRequest.count({ where: { status: "PENDING" } });
}

/** Get artwork requests by artist ID */
export async function getArtworkRequestsByArtistId(artistId: string) {
  return db.artworkRequest.findMany({
    where: { artistId },
    orderBy: { createdAt: "desc" },
  });
}
