import Link from "next/link";
import { getSession } from "@/lib/auth";
import { COLORS } from "@/constants/colors";
import { getArtistForUser } from "@/modules/artists";
import { ArtistProfileForm } from "@/components/artiste-profile-form";

export const metadata = {
  title: "Mon profil - Espace Artiste",
};

export const dynamic = "force-dynamic";

export default async function ArtisteProfilPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="font-serif text-3xl" style={{ color: COLORS.ink }}>
          Mon profil
        </h1>
        <p className="mt-4 text-sm" style={{ color: COLORS.muted }}>
          Connectez-vous pour gérer votre profil artiste.
        </p>
        <Link
          href="/connexion"
          className="mt-8 inline-flex items-center justify-center px-6 py-3 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
          style={{ background: COLORS.terra }}
        >
          SE CONNECTER
        </Link>
      </div>
    );
  }

  const artist = await getArtistForUser({
    id: session.user.id,
    email: session.user.email,
  });

  if (!artist) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="font-serif text-3xl" style={{ color: COLORS.ink }}>
          Profil indisponible
        </h1>
        <p className="mt-4 text-sm" style={{ color: COLORS.muted }}>
          Votre compte n&apos;est pas encore associé à un profil artiste
          approuvé. Une fois votre demande validée, vous pourrez compléter
          votre profil ici.
        </p>
        <Link
          href="/artiste/oeuvres"
          className="mt-8 inline-flex items-center justify-center px-6 py-3 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
          style={{ background: COLORS.terra }}
        >
          RETOUR
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10">
        <h1
          className="font-serif text-3xl md:text-4xl"
          style={{ color: COLORS.ink }}
        >
          Mon profil
        </h1>
        <p className="mt-2 text-sm" style={{ color: COLORS.muted }}>
          Complétez ces informations pour publier votre page artiste et
          soumettre des œuvres.
        </p>
      </div>

      <ArtistProfileForm artist={artist} />
    </div>
  );
}
