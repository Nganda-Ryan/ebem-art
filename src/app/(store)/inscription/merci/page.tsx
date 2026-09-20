import Link from "next/link";
import { COLORS } from "@/constants/colors";

export const metadata = {
  title: "Demande envoyée - Mboa Arts",
};

export default function InscriptionMerciPage() {
  return (
    <section
      className="flex min-h-screen items-center justify-center pt-28 pb-20"
      style={{ background: COLORS.bg }}
    >
      <div className="mx-auto max-w-lg px-6 text-center">
        <div
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl-full"
          style={{ background: COLORS.terra }}
        >
          <span className="text-2xl text-white">✓</span>
        </div>
        <h1
          className="font-serif text-3xl md:text-4xl"
          style={{ color: COLORS.ink }}
        >
          Compte créé
        </h1>
        <p
          className="mt-4 text-sm"
          style={{ color: COLORS.muted, lineHeight: 1.75 }}
        >
          Merci ! Votre compte artiste a été créé et votre dossier est en cours
          d&apos;examen. Dès l&apos;approbation, connectez-vous pour compléter
          votre profil et publier vos œuvres.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/connexion"
            className="inline-flex items-center justify-center px-6 py-3 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
            style={{ background: COLORS.terra }}
          >
            SE CONNECTER
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 font-mono text-xs tracking-wider transition-all"
            style={{
              color: COLORS.muted,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.bgCard,
            }}
          >
            RETOUR À L&apos;ACCUEIL
          </Link>
        </div>
      </div>
    </section>
  );
}
