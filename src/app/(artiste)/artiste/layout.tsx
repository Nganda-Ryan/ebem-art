import { ArtistShell } from "@/components/artiste-shell";

export default function ArtisteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ArtistShell>{children}</ArtistShell>;
}
