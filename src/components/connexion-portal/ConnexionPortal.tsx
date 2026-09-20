"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { authClient } from "@/lib/auth-client";

type Espace = "artiste" | "admin";
type Mode = "login" | "signup";

const INPUT_STYLE = {
  background: COLORS.bgCard,
  border: `1px solid ${COLORS.border}`,
  color: COLORS.ink,
};

function safePath(path: string | null, fallback: string) {
  if (path && path.startsWith("/") && !path.startsWith("//")) return path;
  return fallback;
}

export function ConnexionPortal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEspace =
    searchParams.get("espace") === "admin" ? "admin" : "artiste";

  const [espace, setEspace] = useState<Espace>(initialEspace);
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const next = searchParams.get("espace") === "admin" ? "admin" : "artiste";
    setEspace(next);
  }, [searchParams]);

  function switchEspace(next: Espace) {
    setEspace(next);
    setMode("login");
    setError(null);
    setInfo(null);
    const url = new URL(window.location.href);
    if (next === "admin") url.searchParams.set("espace", "admin");
    else url.searchParams.delete("espace");
    window.history.replaceState(null, "", url.pathname + url.search);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
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

    if (result.error) {
      setLoading(false);
      setError(
        mode === "login"
          ? "Email ou mot de passe incorrect."
          : "Impossible de créer le compte. " +
              (result.error.message ??
                "Ce compte existe peut-être déjà — essayez de vous connecter.")
      );
      return;
    }

    const { data: sessionData } = await authClient.getSession();
    const role = sessionData?.user?.role;

    if (espace === "admin") {
      if (mode === "signup") {
        setLoading(false);
        setMode("login");
        setInfo(
          "Compte créé. Un administrateur doit activer vos droits admin avant l’accès au tableau de bord. Vous pourrez ensuite vous connecter ici."
        );
        await authClient.signOut();
        return;
      }

      if (role !== "admin") {
        setLoading(false);
        setError(
          "Ce compte n’a pas les droits administrateur. Choisissez l’espace Artiste, ou demandez l’activation de votre compte admin."
        );
        await authClient.signOut();
        return;
      }

      const dest = safePath(searchParams.get("callbackUrl"), "/admin");
      router.push(dest.startsWith("/admin") ? dest : "/admin");
      router.refresh();
      return;
    }

    // Artiste
    if (role === "admin" && mode === "login") {
      // Admins can open admin space; keep session and send to artist area only if intended
    }

    const dest = safePath(searchParams.get("callbackUrl"), "/artiste/oeuvres");
    router.push(dest.startsWith("/artiste") || dest === "/inscription" ? dest : "/artiste/oeuvres");
    router.refresh();
  }

  return (
    <div
      className="w-full rounded-lg p-6 md:p-8"
      style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}
    >
      {/* Espace: Artiste / Admin */}
      <div
        className="mb-6 grid grid-cols-2 gap-1 rounded-md p-1"
        style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
      >
        {(
          [
            { id: "artiste", label: "ARTISTE" },
            { id: "admin", label: "ADMIN" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => switchEspace(item.id)}
            className="px-4 py-2.5 font-mono text-xs tracking-widest transition-colors"
            style={{
              background: espace === item.id ? COLORS.terra : "transparent",
              color: espace === item.id ? "#FFFFFF" : COLORS.muted,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="mb-6 text-sm leading-relaxed" style={{ color: COLORS.muted }}>
        {espace === "artiste"
          ? "Gérez vos œuvres et votre profil artiste."
          : "Accédez au tableau de bord d’administration Mboa Arts."}
      </p>

      {/* Mode: Connexion / Inscription */}
      <div
        className="mb-8 grid grid-cols-2 gap-1 rounded-md p-1"
        style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
      >
        {(
          [
            { id: "login", label: "CONNEXION" },
            { id: "signup", label: "INSCRIPTION" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setMode(item.id);
              setError(null);
              setInfo(null);
            }}
            className="px-4 py-2 font-mono text-xs tracking-widest transition-colors"
            style={{
              background: mode === item.id ? COLORS.ink : "transparent",
              color: mode === item.id ? "#FFFFFF" : COLORS.muted,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {mode === "signup" ? (
          <div>
            <label
              className="mb-2 block font-mono text-xs tracking-widest"
              style={{ color: COLORS.muted }}
            >
              {espace === "artiste" ? "NOM / NOM D'ARTISTE" : "NOM"}
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder={
                espace === "artiste" ? "Ex: Élise Nkemdifor" : "Votre nom"
              }
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
            />
            {espace === "artiste" ? (
              <p className="mt-1.5 text-xs" style={{ color: COLORS.muted }}>
                Utilisez l&apos;email déclaré dans votre demande d&apos;inscription
                pour être rattaché à votre profil.
              </p>
            ) : (
              <p className="mt-1.5 text-xs" style={{ color: COLORS.muted }}>
                L&apos;accès admin sera activé par un administrateur existant.
              </p>
            )}
          </div>
        ) : null}

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
            placeholder={
              espace === "artiste" ? "artiste@email.com" : "admin@email.com"
            }
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

        {error ? (
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{
              background: "#FEE2E2",
              color: "#991B1B",
              border: "1px solid #FECACA",
            }}
          >
            {error}
          </div>
        ) : null}

        {info ? (
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{
              background: "#ECFDF5",
              color: "#065F46",
              border: "1px solid #A7F3D0",
            }}
          >
            {info}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3.5 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: COLORS.terra }}
        >
          {loading
            ? "EN COURS…"
            : mode === "login"
              ? espace === "admin"
                ? "SE CONNECTER — ADMIN"
                : "SE CONNECTER — ARTISTE"
              : espace === "admin"
                ? "CRÉER UN COMPTE ADMIN"
                : "CRÉER MON COMPTE ARTISTE"}
        </button>
      </form>
    </div>
  );
}
