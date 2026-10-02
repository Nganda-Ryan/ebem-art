import { LandingPage } from "@/components/landing";
import { toLandingArtwork } from "@/lib/landing/catalog";
import { getPublishedArticles } from "@/modules/articles";
import { searchArtworks } from "@/modules/explorer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [result, articles] = await Promise.all([
    searchArtworks({
      q: "",
      labels: [],
      page: 1,
      sort: "recent",
      pageSize: 8,
    }),
    getPublishedArticles({ take: 4 }),
  ]);

  const artworks = result.items.map(toLandingArtwork);

  return <LandingPage artworks={artworks} articles={articles} />;
}
