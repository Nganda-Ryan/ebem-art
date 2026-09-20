import { Hero } from "@/components/landing/hero";
import { AProposMboa } from "@/components/landing/a-propos-mboa";
import { ThemeDuJour } from "@/components/landing/theme-du-jour";
import { Explorer } from "@/components/landing/explorer";
import { Temoignages } from "@/components/landing/temoignages";
import { Newsletter } from "@/components/landing/newsletter";
import { COLORS } from "@/constants/colors";
import type { LandingArtwork } from "@/lib/landing/catalog";

type LandingPageProps = {
  artworks: LandingArtwork[];
};

export function LandingPage({ artworks }: LandingPageProps) {
  return (
    <div style={{ background: COLORS.bg, minHeight: "100%" }}>
      <Hero />
      <AProposMboa />
      <Explorer works={artworks} />
      <ThemeDuJour />
      <Temoignages />
      <Newsletter />
    </div>
  );
}
