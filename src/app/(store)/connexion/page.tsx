import { Suspense } from "react";
import { redirect } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { ConnexionPortal } from "@/components/connexion-portal";
import { LogoutButton } from "@/components/LogoutButton";
import { getSession } from "@/lib/auth";
import { getArtistForUser } from "@/modules/artists";

export const metadata = {
  title: "Connexion - Mboa Arts",
  description:
    "Connectez-vous ou créez un compte artiste ou administrateur.",
};

type Props = {
  searchParams: Promise<{ espace?: string; callbackUrl?: string }>;
};

export default async function ConnexionPage({ searchParams }: Props) {
  const params = await searchParams;
  const session = await getSession();

  if (session) {
    if (session.user.role === "admin") {
      redirect("/admin");
    }

    const artist = await getArtistForUser({
      id: session.user.id,
      email: session.user.email,
    });

    if (artist) {
      redirect("/artiste/oeuvres");
    }

    return (
      <section
        className="flex min-h-screen items-center justify-center pt-28 pb-20"
        style={{ background: COLORS.bg }}
      >
        <div className="w-full max-w-md px-6 text-center">
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: COLORS.terra }}
          >
            CONNEXION
          </span>
          <h1
            className="mt-2 font-serif text-4xl"
            style={{ color: COLORS.ink }}
          >
            Compte en attente
          </h1>
          <p className="mt-3 text-sm" style={{ color: COLORS.muted }}>
            Vous êtes connecté avec{" "}
            <strong style={{ color: COLORS.ink }}>{session.user.email}</strong>
            . Ce compte n&apos;est pas encore rattaché à un profil artiste, ni
            activé comme administrateur.
          </p>
          <p className="mt-2 text-sm" style={{ color: COLORS.muted }}>
            Soumettez une demande d&apos;inscription artiste, ou demandez
            l&apos;activation admin. Vous pouvez aussi vous déconnecter pour
            utiliser un autre compte.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="/inscription"
              className="px-6 py-3 font-mono text-xs tracking-wider text-white"
              style={{ background: COLORS.terra }}
            >
              DEVENIR ARTISTE
            </a>
            <LogoutButton redirectTo="/connexion" />
          </div>
        </div>
      </section>
    );
  }

  const isAdminEspace = params.espace === "admin";

  return (
    <section
      className="flex min-h-screen items-center justify-center pt-28 pb-20"
      style={{ background: COLORS.bg }}
    >
      <div className="w-full max-w-md px-6">
        <div className="mb-10 text-center">
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: COLORS.terra }}
          >
            ACCÈS PLATEFORME
          </span>
          <h1
            className="mt-2 font-serif text-4xl"
            style={{ color: COLORS.ink }}
          >
            Connexion
          </h1>
          <p className="mt-3 text-sm" style={{ color: COLORS.muted }}>
            {isAdminEspace
              ? "Espace administrateur — connexion ou inscription."
              : "Choisissez votre espace : artiste ou administrateur."}
          </p>
        </div>

        <Suspense
          fallback={
            <div
              className="py-12 text-center text-sm"
              style={{ color: COLORS.muted }}
            >
              Chargement…
            </div>
          }
        >
          <ConnexionPortal />
        </Suspense>
      </div>
    </section>
  );
}
