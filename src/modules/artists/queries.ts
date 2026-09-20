import { db } from "@/lib/db";

/** Get all published artists (public storefront) */
export async function getPublishedArtists() {
  try {
    return await db.artist.findMany({
      where: { published: true },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

/** Get a single artist by slug (public) */
export async function getArtistBySlug(slug: string) {
  try {
    return await db.artist.findUnique({
      where: { slug },
      include: {
        artworks: {
          where: { status: "AVAILABLE", published: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch {
    return null;
  }
}

/** Get all artists (admin) */
export async function getAllArtists() {
  return db.artist.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { artworks: true } },
      user: { select: { banned: true } },
    },
  });
}

/** Get a single artist by ID (admin) — with artworks + linked user ban state */
export async function getArtistById(id: string) {
  return db.artist.findUnique({
    where: { id },
    include: {
      artworks: { orderBy: { createdAt: "desc" } },
      user: { select: { id: true, email: true, banned: true, banReason: true } },
      _count: { select: { artworks: true } },
    },
  });
}

/** Resolve the artist profile for a logged-in user (userId first, email fallback) */
export async function getArtistForUser(user: {
  id: string;
  email: string;
}) {
  const byUserId = await db.artist.findUnique({
    where: { userId: user.id },
  });
  if (byUserId) return byUserId;

  return db.artist.findFirst({
    where: { email: user.email },
  });
}
