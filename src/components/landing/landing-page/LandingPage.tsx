import { Hero } from "@/components/landing/hero";
import { AProposMboa } from "@/components/landing/a-propos-mboa";
import { ThemeDuJour } from "@/components/landing/theme-du-jour";
import { News } from "@/components/landing/News";
import { Explorer } from "@/components/landing/explorer";
import { Temoignages } from "@/components/landing/temoignages";
import { Newsletter } from "@/components/landing/newsletter";
import { COLORS } from "@/constants/colors";
import type { LandingArtwork } from "@/lib/landing/catalog";
import type { PublicArticle } from "@/modules/articles";

type LandingPageProps = {
  artworks: LandingArtwork[];
  articles: PublicArticle[];
};

export function LandingPage({ artworks, articles }: LandingPageProps) {
  return (
    <div style={{ background: COLORS.bg, minHeight: "100%" }}>
      <Hero />
      <AProposMboa />
      <Explorer works={artworks} />
      <ThemeDuJour promo={articles[0] ?? null} />
      {articles.length > 0 && <News articles={articles} />}
      <Temoignages />
      <Newsletter />
    </div>
  );
}
