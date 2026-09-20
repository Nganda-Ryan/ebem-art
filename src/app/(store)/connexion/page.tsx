import { Suspense } from "react";
import { redirect } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { ArtisteAuthForm } from "@/components/artiste-auth-form";
import { LogoutButton } from "@/components/LogoutButton";
import { getSession } from "@/lib/auth";
import { getArtistForUser } from "@/modules/artists";

export const metadata = {
  title: "Espace Artiste - Mboa Arts",
  description:
    "Connectez-vous ou créez votre compte pour soumettre et gérer vos œuvres.",
};

export default async function ConnexionPage() {
  const session = await getSession();

  if (session) {
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
            ESPACE ARTISTE
          </span>
          <h1
            className="mt-2 font-serif text-4xl"
            style={{ color: COLORS.ink }}
          >
            Mauvais compte
          </h1>
          <p className="mt-3 text-sm" style={{ color: COLORS.muted }}>
            Vous êtes connecté avec{" "}
            <strong style={{ color: COLORS.ink }}>{session.user.email}</strong>
            {session.user.role === "admin"
              ? " (compte admin)"
              : ""}
            . Ce compte n&apos;a pas de profil artiste.
          </p>
          <p className="mt-2 text-sm" style={{ color: COLORS.muted }}>
            Déconnectez-vous, puis reconnectez-vous avec l&apos;email de votre
            demande d&apos;inscription.
          </p>
          <div className="mt-8 flex justify-center">
            <LogoutButton redirectTo="/connexion" />
          </div>
        </div>
      </section>
    );
  }

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
            ESPACE ARTISTE
          </span>
          <h1
            className="mt-2 font-serif text-4xl"
            style={{ color: COLORS.ink }}
          >
            Connexion
          </h1>
          <p className="mt-3 text-sm" style={{ color: COLORS.muted }}>
            Utilisez l&apos;email déclaré lors de votre inscription artiste.
          </p>
        </div>

        <Suspense
          fallback={
            <div
              className="py-12 text-center text-sm"
              style={{ color: COLORS.muted }}
            >
              Chargement...
            </div>
          }
        >
          <ArtisteAuthForm />
        </Suspense>
      </div>
    </section>
  );
}
