import { db } from "@/lib/db";
import type { ExplorerSort } from "@/lib/explorer/params";
import { EXPLORER_PAGE_SIZE } from "@/lib/explorer/params";
import type { Prisma } from "@/generated/prisma/client";
import { artworkCoverUrl } from "@/lib/media";

export type ExplorerLabel = {
  id: string;
  slug: string;
  name: string;
  count: number;
};

export type ExplorerArtistResult = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  discipline: string | null;
  portraitUrl: string | null;
  labels: { slug: string; name: string }[];
  artworkCount: number;
};

export type ExplorerArtworkResult = {
  id: string;
  slug: string;
  title: string;
  medium: string | null;
  year: number | null;
  priceCents: number;
  currency: string;
  coverUrl: string | null;
  labels: { slug: string; name: string }[];
  artist: { id: string; slug: string; name: string };
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

function artworkOrderBy(
  sort: ExplorerSort,
): Prisma.ArtworkOrderByWithRelationInput {
  switch (sort) {
    case "recent":
      return { createdAt: "desc" };
    case "name":
    default:
      return { title: "asc" };
  }
}

/** Published catalog artworks only */
function artworkWhere(input: {
  q: string;
  labels: string[];
}): Prisma.ArtworkWhereInput {
  const where: Prisma.ArtworkWhereInput = {
    published: true,
    status: "AVAILABLE",
    artist: { published: true },
  };

  if (input.labels.length > 0) {
    where.labels = { some: { slug: { in: input.labels } } };
  }

  if (input.q) {
    where.OR = [
      { title: { contains: input.q, mode: "insensitive" } },
      { description: { contains: input.q, mode: "insensitive" } },
      { medium: { contains: input.q, mode: "insensitive" } },
      { technique: { contains: input.q, mode: "insensitive" } },
      {
        artist: { name: { contains: input.q, mode: "insensitive" } },
      },
      {
        labels: {
          some: { name: { contains: input.q, mode: "insensitive" } },
        },
      },
    ];
  }

  return where;
}

export async function searchArtworks(input: {
  q: string;
  labels: string[];
  page: number;
  sort: ExplorerSort;
  pageSize?: number;
}): Promise<Paginated<ExplorerArtworkResult>> {
  const pageSize = input.pageSize ?? EXPLORER_PAGE_SIZE;
  const page = Math.max(1, input.page);
  const where = artworkWhere(input);

  try {
    const [total, rows] = await Promise.all([
      db.artwork.count({ where }),
      db.artwork.findMany({
        where,
        include: {
          artist: { select: { id: true, slug: true, name: true } },
          labels: {
            select: { slug: true, name: true },
            orderBy: { name: "asc" },
          },
        },
        orderBy: artworkOrderBy(input.sort),
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      items: rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        medium: row.medium,
        year: row.year,
        priceCents: row.priceCents,
        currency: row.currency,
        coverUrl: artworkCoverUrl(row),
        labels: row.labels,
        artist: row.artist,
      })),
      total,
      page: Math.min(page, totalPages),
      pageSize,
      totalPages,
    };
  } catch {
    return { items: [], total: 0, page: 1, pageSize, totalPages: 1 };
  }
}

/**
 * Facet counts respect the current keyword search (not selected labels),
 * so users see remaining options instead of dead ends (NN/g + Baymard).
 */
export async function getExplorerLabels(input: {
  q: string;
}): Promise<ExplorerLabel[]> {
  try {
    const baseWhere = artworkWhere({ q: input.q, labels: [] });
    const labels = await db.label.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        _count: { select: { artworks: { where: baseWhere } } },
      },
    });
    return labels.map((label) => ({
      id: label.id,
      slug: label.slug,
      name: label.name,
      count: label._count.artworks,
    }));
  } catch {
    return [];
  }
}

/** True when at least one published catalog artwork exists. */
export async function hasExplorerCatalog(): Promise<boolean> {
  try {
    const count = await db.artwork.count({
      where: {
        published: true,
        status: "AVAILABLE",
        artist: { published: true },
      },
    });
    return count > 0;
  } catch {
    return false;
  }
}
