import { db } from "@/lib/db";
import { artistPortraitUrl, artworkCoverUrl } from "@/lib/media";

export type SearchArtworkHit = {
  type: "artwork";
  id: string;
  slug: string;
  title: string;
  artistName: string;
  imageUrl: string | null;
  priceCents: number;
  currency: string;
};

export type SearchArtistHit = {
  type: "artist";
  id: string;
  slug: string;
  name: string;
  city: string | null;
  discipline: string | null;
  imageUrl: string | null;
};

export type SearchResults = {
  artworks: SearchArtworkHit[];
  artists: SearchArtistHit[];
};

/** Public catalog search across published artists and artworks */
export async function searchCatalog(
  query: string,
  limit = 6
): Promise<SearchResults> {
  const q = query.trim();
  if (q.length < 2) {
    return { artworks: [], artists: [] };
  }

  const [artworks, artists] = await Promise.all([
    db.artwork.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { medium: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { artist: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      include: { artist: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    db.artist.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
          { region: { contains: q, mode: "insensitive" } },
          { discipline: { contains: q, mode: "insensitive" } },
          { artistName: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { name: "asc" },
      take: limit,
    }),
  ]);

  return {
    artworks: artworks.map((a) => ({
      type: "artwork" as const,
      id: a.id,
      slug: a.slug,
      title: a.title,
      artistName: a.artist.name,
      imageUrl: artworkCoverUrl(a),
      priceCents: a.priceCents,
      currency: a.currency,
    })),
    artists: artists.map((a) => ({
      type: "artist" as const,
      id: a.id,
      slug: a.slug,
      name: a.name,
      city: a.city,
      discipline: a.discipline,
      imageUrl: artistPortraitUrl(a),
    })),
  };
}
