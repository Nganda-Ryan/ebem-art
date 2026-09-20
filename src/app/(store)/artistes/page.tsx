import Link from "next/link";
import { getPublishedArtists } from "@/modules/artists";
import { MOCK_ARTISTS } from "@/data/mock";
import { artistPortraitUrl } from "@/lib/media";

export const metadata = { title: "Artistes - Mboa Arts" };
export const dynamic = "force-dynamic";

type ArtistCard = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  discipline: string | null;
  portraitUrl: string | null;
};

function mockArtists(): ArtistCard[] {
  return MOCK_ARTISTS.map((artist) => ({
    id: `mock-${artist.id}`,
    slug: artist.name.toLowerCase().replace(/\s+/g, "-"),
    name: artist.name,
    city: artist.city,
    discipline: artist.discipline,
    portraitUrl: artist.img,
  }));
}

export default async function ArtistesPage() {
  const rows = await getPublishedArtists();
  const artists: ArtistCard[] =
    rows.length > 0
      ? rows.map((artist) => ({
          id: artist.id,
          slug: artist.slug,
          name: artist.name,
          city: artist.city,
          discipline: artist.discipline,
          portraitUrl: artistPortraitUrl(artist),
        }))
      : mockArtists();

  return (
    <section className="mx-auto max-w-7xl px-6 pt-28 pb-16">
      <h1 className="font-serif text-4xl" style={{ color: "var(--color-mboa-ink)" }}>
        Artistes
      </h1>
      <p className="mt-2 text-sm" style={{ color: "var(--color-mboa-muted)" }}>
        Rencontrez les artistes derrière les œuvres.
      </p>

      <div
        className="mt-8 flex flex-col items-start justify-between gap-4 rounded-lg p-6 md:flex-row md:items-center md:p-8"
        style={{
          background: "var(--color-mboa-bg-alt, #EDE7DC)",
          border: "1px solid var(--color-mboa-border)",
        }}
      >
        <div>
          <h2
            className="font-serif text-xl md:text-2xl"
            style={{ color: "var(--color-mboa-ink)" }}
          >
            Vous êtes artiste ?
          </h2>
          <p
            className="mt-1 max-w-xl text-sm"
            style={{ color: "var(--color-mboa-muted)", lineHeight: 1.7 }}
          >
            Rejoignez la plateforme : soumettez votre dossier d&apos;inscription
            (KYC), faites valider vos œuvres et vendez à travers le Cameroun et
            au-delà.
          </p>
        </div>
        <Link
          href="/inscription"
          className="inline-flex shrink-0 items-center justify-center px-6 py-3 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--color-mboa-terra, #C55C2E)" }}
        >
          DEVENIR ARTISTE
        </Link>
      </div>

      {artists.length === 0 ? (
        <p className="mt-8" style={{ color: "var(--color-mboa-muted)" }}>
          Aucun artiste publié pour le moment.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={
                artist.id.startsWith("mock-")
                  ? "/artistes"
                  : `/artistes/${artist.slug}`
              }
              className="group block overflow-hidden"
              style={{ border: "1px solid var(--color-mboa-border)" }}
            >
              {artist.portraitUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artist.portraitUrl}
                  alt={artist.name}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-[var(--color-mboa-bg-alt)] text-sm text-[var(--color-mboa-muted)]">
                  Pas de portrait
                </div>
              )}
              <div className="p-4">
                <h2 className="font-serif text-xl group-hover:underline">
                  {artist.name}
                </h2>
                {artist.city ? (
                  <p className="mt-1 text-sm text-[var(--color-mboa-muted)]">
                    {artist.city}
                  </p>
                ) : null}
                {artist.discipline ? (
                  <p className="mt-0.5 font-mono text-xs tracking-wider text-[var(--color-mboa-terra)]">
                    {artist.discipline}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
