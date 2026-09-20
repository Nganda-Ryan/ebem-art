"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { authClient } from "@/lib/auth-client";

const INPUT_STYLE = {
  background: COLORS.bgCard,
  border: `1px solid ${COLORS.border}`,
  color: COLORS.ink,
};

export function ArtisteAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/artiste/oeuvres";
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    const result =
      mode === "login"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({
            email,
            password,
            name: (fd.get("name") as string) || email,
          });

    setLoading(false);

    if (result.error) {
      setError(
        mode === "login"
          ? "Email ou mot de passe incorrect."
          : "Impossible de créer le compte. " +
              (result.error.message ??
                "Ce compte existe peut-être déjà, essayez de vous connecter.")
      );
      return;
    }

    router.push(
      callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
        ? callbackUrl
        : "/artiste/oeuvres"
    );
    router.refresh();
  }

  return (
    <div
      className="w-full rounded-xl p-6 md:p-8"
      style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}
    >
      {/* Toggle login / signup */}
      <div
        className="mb-8 grid grid-cols-2 gap-1 rounded-xl-md p-1"
        style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
      >
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className="px-4 py-2 font-mono text-xs tracking-widest transition-colors"
            style={{
              background: mode === m ? COLORS.ink : "transparent",
              color: mode === m ? "#FFFFFF" : COLORS.muted,
            }}
          >
            {m === "login" ? "CONNEXION" : "CRÉER UN COMPTE"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {mode === "signup" && (
          <div>
            <label
              className="mb-2 block font-mono text-xs tracking-widest"
              style={{ color: COLORS.muted }}
            >
              NOM / NOM D&apos;ARTISTE
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Ex: Élise Nkemdifor"
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
            />
            <p className="mt-1 text-xs" style={{ color: COLORS.muted }}>
              Utilisez l&apos;email déclaré dans votre demande d&apos;inscription
              KYC pour être rattaché à votre profil artiste.
            </p>
          </div>
        )}

        <div>
          <label
            className="mb-2 block font-mono text-xs tracking-widest"
            style={{ color: COLORS.muted }}
          >
            EMAIL
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="artiste@email.com"
            className="w-full px-4 py-3 text-sm outline-none"
            style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
          />
        </div>

        <div>
          <label
            className="mb-2 block font-mono text-xs tracking-widest"
            style={{ color: COLORS.muted }}
          >
            MOT DE PASSE
          </label>
          <input
            name="password"
            type="password"
            required
            minLength={5}
            placeholder="••••••••"
            className="w-full px-4 py-3 text-sm outline-none"
            style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
          />
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
          disabled={loading}
          className="w-full px-6 py-3.5 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: COLORS.terra }}
        >
          {loading
            ? "EN COURS..."
            : mode === "login"
              ? "SE CONNECTER"
              : "CRÉER MON COMPTE"}
        </button>
      </form>
    </div>
  );
}
