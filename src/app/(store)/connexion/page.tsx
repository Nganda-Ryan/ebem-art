import Image from "next/image";
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
    "Connectez-vous à votre espace artiste ou administrateur Mboa Arts.",
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
      className="relative min-h-screen pt-20"
      style={{ background: COLORS.bg }}
    >
      <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2">
        {/* Visual plane — gallery atmosphere */}
        <div className="relative hidden min-h-[42vh] overflow-hidden lg:block lg:min-h-0">
          <Image
            src="/images/hero-gallery.jpg"
            alt="Galerie Mboa Arts"
            fill
            priority
            className="object-cover"
            sizes="50vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, rgba(26,20,16,0.55) 0%, rgba(26,20,16,0.25) 45%, rgba(26,20,16,0.65) 100%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-14">
            <p
              className="font-serif text-3xl tracking-tight text-white xl:text-4xl"
              style={{ fontFamily: "var(--serif)" }}
            >
              Mboa Arts
            </p>
            <div className="max-w-md">
              <p className="font-serif text-3xl leading-tight text-white xl:text-4xl">
                {isAdminEspace
                  ? "La scène se gère aussi dans les coulisses."
                  : "Votre atelier, toujours à portée."}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                {isAdminEspace
                  ? "Validez les artistes, publiez les œuvres, suivez les commandes."
                  : "Publiez, suivez vos demandes et dialoguez avec la galerie."}
              </p>
            </div>
          </div>
        </div>

        {/* Form column */}
        <div className="relative flex items-center justify-center px-6 py-14 sm:px-10 lg:py-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 80% 0%, rgba(197,92,46,0.08), transparent 60%)",
            }}
          />
          <div className="relative w-full max-w-104">
            <Suspense
              fallback={
                <div
                  className="py-16 text-center text-sm"
                  style={{ color: COLORS.muted }}
                >
                  Chargement…
                </div>
              }
            >
              <ConnexionPortal />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
