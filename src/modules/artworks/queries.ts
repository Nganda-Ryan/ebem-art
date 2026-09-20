import { db } from "@/lib/db";

/** Get all artworks with filters (public catalog) */
export async function getArtworks(filters?: {
  medium?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}) {
  try {
    const where: Record<string, unknown> = {};

    if (filters?.available !== false) {
      where.status = "AVAILABLE";
      where.published = true;
    }
    if (filters?.medium) {
      where.medium = filters.medium;
    }
    if (filters?.minPrice || filters?.maxPrice) {
      where.priceCents = {};
      if (filters.minPrice) (where.priceCents as Record<string, number>).gte = filters.minPrice;
      if (filters.maxPrice) (where.priceCents as Record<string, number>).lte = filters.maxPrice;
    }

    return await db.artwork.findMany({
      where,
      include: { artist: { select: { slug: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

/** Get a single artwork by slug (public catalog) */
export async function getArtworkBySlug(slug: string) {
  try {
    const artwork = await db.artwork.findUnique({
      where: { slug },
      include: { artist: true },
    });
    if (!artwork || !artwork.published) return null;
    return artwork;
  } catch {
    return null;
  }
}

/** Get all artworks (admin) */
export async function getAllArtworks() {
  return db.artwork.findMany({
    include: {
      artist: { select: { id: true, name: true, slug: true } },
      labels: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

/** Get a single artwork by ID (admin) */
export async function getArtworkById(id: string) {
  return db.artwork.findUnique({
    where: { id },
    include: {
      artist: {
        select: { id: true, name: true, slug: true, published: true },
      },
      labels: { select: { id: true, name: true, slug: true } },
      orderItems: {
        take: 5,
        orderBy: { order: { createdAt: "desc" } },
        include: {
          order: {
            select: { id: true, status: true, email: true, createdAt: true },
          },
        },
      },
    },
  });
}

/** Get all artworks belonging to a given artist (espace artiste) */
export async function getArtworksByArtistId(artistId: string) {
  return db.artwork.findMany({
    where: { artistId },
    orderBy: { createdAt: "desc" },
  });
}
