import { LandingPage } from "@/components/landing";
import { toLandingArtwork } from "@/lib/landing/catalog";
import { searchArtworks } from "@/modules/explorer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const result = await searchArtworks({
    q: "",
    labels: [],
    page: 1,
    sort: "recent",
    pageSize: 8,
  });

  const artworks = result.items.map(toLandingArtwork);

  return <LandingPage artworks={artworks} />;
}
