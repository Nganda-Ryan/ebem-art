import { Suspense } from "react";
import { InscriptionForm } from "@/components/landing/inscription-form";

export const metadata = {
  title: "Inscription Artiste - Mboa Arts",
  description:
    "Rejoignez la plateforme Mboa Arts. Inscrivez-vous en tant qu'artiste et soumettez vos œuvres.",
};

export default function InscriptionPage() {
  return (
    <section
      className="min-h-screen pt-28 pb-20"
      style={{ background: "var(--color-mboa-bg)" }}
    >
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <div className="mb-10">
          <span
            className="font-mono text-xs tracking-widest"
            style={{ color: "var(--color-mboa-terra)" }}
          >
            INSCRIPTION
          </span>
          <h1
            className="mt-2 font-serif text-4xl md:text-5xl"
            style={{ color: "var(--color-mboa-ink)" }}
          >
            Devenir Artiste
          </h1>
          <p
            className="mt-4 max-w-xl text-sm"
            style={{ color: "var(--color-mboa-muted)", lineHeight: 1.75 }}
          >
            Remplissez le formulaire ci-dessous pour soumettre votre demande
            d&apos;inscription. Une fois approuvé, vous pourrez créer votre
            profil et soumettre vos œuvres.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="py-20 text-center" style={{ color: "var(--color-mboa-muted)" }}>
              Chargement...
            </div>
          }
        >
          <InscriptionForm />
        </Suspense>
      </div>
    </section>
  );
}
