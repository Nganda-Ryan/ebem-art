"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { FILTER_REGIONS } from "@/data/mock";

const INPUT_STYLE = {
  background: COLORS.bgCard,
  border: `1px solid ${COLORS.border}`,
  color: COLORS.ink,
};

const LABEL_STYLE = {
  color: COLORS.muted,
};

function FieldGroup({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label
        className="mb-2 block font-mono text-xs tracking-widest"
        style={LABEL_STYLE}
      >
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-xs" style={{ color: COLORS.muted }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function Input({
  name,
  type = "text",
  placeholder,
  required = false,
  minLength,
  autoComplete,
  className = "",
}: {
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      autoComplete={autoComplete}
      className={`w-full px-4 py-3 text-sm outline-none ${className}`}
      style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
    />
  );
}

export function InscriptionForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const password = fd.get("password") as string;
    const passwordConfirm = fd.get("passwordConfirm") as string;

    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/artist-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: fd.get("firstName") as string,
            lastName: fd.get("lastName") as string,
            artistName: fd.get("artistName") as string,
            email: fd.get("email") as string,
            password,
            phone: fd.get("phone") as string,
            city: fd.get("city") as string,
            region: fd.get("region") as string,
          }),
        });

        const json = (await res.json()) as { ok?: boolean; error?: string };

        if (!res.ok) {
          throw new Error(
            json.error ?? "Une erreur est survenue. Veuillez réessayer."
          );
        }

        router.push("/inscription/merci");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue. Veuillez réessayer."
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div
        className="rounded-xl p-6 md:p-8"
        style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}
      >
        <h2 className="mb-2 font-serif text-xl" style={{ color: COLORS.ink }}>
          Qui êtes-vous ?
        </h2>
        <p className="mb-6 text-sm" style={{ color: COLORS.muted }}>
          Ces informations suffisent pour ouvrir votre dossier. Le profil
          complet se remplit après approbation.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FieldGroup label="PRÉNOM *">
            <Input
              name="firstName"
              placeholder="Ex: Élise"
              required
              autoComplete="given-name"
            />
          </FieldGroup>
          <FieldGroup label="NOM *">
            <Input
              name="lastName"
              placeholder="Ex: Nkemdifor"
              required
              autoComplete="family-name"
            />
          </FieldGroup>
          <div className="md:col-span-2">
            <FieldGroup
              label="NOM D'ARTISTE *"
              hint="Le nom affiché sur la plateforme"
            >
              <Input
                name="artistName"
                placeholder="Ex: Élise Nkemdifor"
                required
              />
            </FieldGroup>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-6 md:p-8"
        style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}
      >
        <h2 className="mb-6 font-serif text-xl" style={{ color: COLORS.ink }}>
          Compte & contact
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FieldGroup label="EMAIL *">
            <Input
              name="email"
              type="email"
              placeholder="artiste@email.com"
              required
              autoComplete="email"
            />
          </FieldGroup>
          <FieldGroup label="TÉLÉPHONE *">
            <Input
              name="phone"
              type="tel"
              placeholder="+237 6XX XXX XXX"
              required
              autoComplete="tel"
            />
          </FieldGroup>
          <FieldGroup label="MOT DE PASSE *">
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={5}
                autoComplete="new-password"
                className="pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[10px] tracking-widest uppercase transition-opacity hover:opacity-70"
                style={{ color: COLORS.muted }}
              >
                {showPassword ? "Cacher" : "Voir"}
              </button>
            </div>
          </FieldGroup>
          <FieldGroup label="CONFIRMER LE MOT DE PASSE *">
            <Input
              name="passwordConfirm"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              minLength={5}
              autoComplete="new-password"
            />
          </FieldGroup>
          <FieldGroup label="VILLE *">
            <Input name="city" placeholder="Ex: Douala" required />
          </FieldGroup>
          <FieldGroup label="RÉGION *">
            <select
              name="region"
              required
              defaultValue=""
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
            >
              <option value="">Sélectionner...</option>
              {FILTER_REGIONS.filter((r) => r !== "Tous").map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </FieldGroup>
        </div>
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            background: "#FEE2E2",
            color: "#991B1B",
            border: "1px solid #FECACA",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3.5 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: COLORS.terra }}
      >
        {isPending ? "CRÉATION EN COURS..." : "CRÉER MON COMPTE ARTISTE"}
      </button>

      <p className="text-center text-sm" style={{ color: COLORS.muted }}>
        Déjà inscrit ?{" "}
        <Link
          href="/connexion"
          className="font-medium underline underline-offset-4"
          style={{ color: COLORS.ink }}
        >
          Se connecter
        </Link>
      </p>

      <p className="text-center text-xs" style={{ color: COLORS.muted }}>
        Après examen de votre dossier, complétez votre profil pour publier vos
        œuvres.
      </p>
    </form>
  );
}
