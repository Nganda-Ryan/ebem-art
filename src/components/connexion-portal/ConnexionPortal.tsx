"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { authClient } from "@/lib/auth-client";

type Espace = "artiste" | "admin";
type Mode = "login" | "signup";

const inputClassName =
  "w-full border px-4 py-3.5 text-[0.9375rem] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-mboa-muted focus:border-mboa-terra focus:shadow-[0_0_0_3px_rgba(197,92,46,0.18)]";

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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const next = searchParams.get("espace") === "admin" ? "admin" : "artiste";
    setEspace(next);
    if (next === "admin") setMode("login");
  }, [searchParams]);

  function switchEspace(next: Espace) {
    setEspace(next);
    setMode("login");
    setError(null);
    setInfo(null);
    setShowPassword(false);
    const url = new URL(window.location.href);
    if (next === "admin") url.searchParams.set("espace", "admin");
    else url.searchParams.delete("espace");
    window.history.replaceState(null, "", url.pathname + url.search);
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setInfo(null);
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
          "Compte créé. Un administrateur doit activer vos droits avant l’accès au tableau de bord."
        );
        await authClient.signOut();
        return;
      }

      if (role !== "admin") {
        setLoading(false);
        setError(
          "Ce compte n’a pas les droits administrateur. Revenez à l’espace artiste, ou demandez l’activation admin."
        );
        await authClient.signOut();
        return;
      }

      const dest = safePath(searchParams.get("callbackUrl"), "/admin");
      router.push(dest.startsWith("/admin") ? dest : "/admin");
      router.refresh();
      return;
    }

    const dest = safePath(searchParams.get("callbackUrl"), "/artiste/oeuvres");
    router.push(
      dest.startsWith("/artiste") || dest === "/inscription"
        ? dest
        : "/artiste/oeuvres"
    );
    router.refresh();
  }

  const isAdmin = espace === "admin";
  const isSignup = mode === "signup";

  return (
    <div className="w-full">
      <div
        key={`${espace}-${mode}`}
        className="animate-[connexion-in_0.35s_ease-out]"
      >
        <p
          className="font-mono text-[11px] tracking-[0.22em]"
          style={{ color: COLORS.terra }}
        >
          {isAdmin ? "ADMINISTRATION" : "ESPACE ARTISTE"}
        </p>
        <h2
          className="mt-3 font-serif text-3xl leading-tight md:text-4xl"
          style={{ color: COLORS.ink }}
        >
          {isSignup
            ? isAdmin
              ? "Créer un compte"
              : "Créer votre compte"
            : "Bon retour"}
        </h2>
        <p
          className="mt-3 max-w-[36ch] text-sm leading-relaxed"
          style={{ color: COLORS.muted }}
        >
          {isAdmin
            ? isSignup
              ? "L’accès au tableau de bord sera activé par un administrateur existant."
              : "Connectez-vous pour gérer la plateforme Mboa Arts."
            : isSignup
              ? "Utilisez l’email déclaré dans votre demande d’inscription pour être rattaché à votre profil."
              : "Gérez vos œuvres, vos demandes et votre profil."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        {isSignup ? (
          <Field
            label={isAdmin ? "Nom" : "Nom / nom d’artiste"}
            htmlFor="connexion-name"
          >
            <input
              id="connexion-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder={isAdmin ? "Votre nom" : "Ex. Élise Nkemdifor"}
              className={inputClassName}
              style={{
                background: COLORS.bgCard,
                borderColor: COLORS.border,
                color: COLORS.ink,
                fontFamily: "var(--sans)",
              }}
            />
          </Field>
        ) : null}

        <Field label="Email" htmlFor="connexion-email">
          <input
            id="connexion-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={isAdmin ? "admin@ebem-art.com" : "vous@email.com"}
            className={inputClassName}
            style={{
              background: COLORS.bgCard,
              borderColor: COLORS.border,
              color: COLORS.ink,
              fontFamily: "var(--sans)",
            }}
          />
        </Field>

        <Field label="Mot de passe" htmlFor="connexion-password">
          <div className="relative">
            <input
              id="connexion-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={5}
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="••••••••"
              className={`${inputClassName} pr-16`}
              style={{
                background: COLORS.bgCard,
                borderColor: COLORS.border,
                color: COLORS.ink,
                fontFamily: "var(--sans)",
              }}
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
        </Field>

        {error ? (
          <div
            role="alert"
            className="rounded-xl-md px-4 py-3 text-sm"
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
            role="status"
            className="rounded-xl-md px-4 py-3 text-sm"
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
          className="mt-1 w-full px-6 py-3.5 text-sm font-medium text-white transition-[background,opacity,transform] duration-200 hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
          style={{ background: COLORS.terra }}
        >
          {loading
            ? "Un instant…"
            : isSignup
              ? "Créer mon compte"
              : "Se connecter"}
        </button>
      </form>

      <div
        className="mt-8 space-y-4 border-t pt-6"
        style={{ borderColor: COLORS.border }}
      >
        <p className="text-sm" style={{ color: COLORS.muted }}>
          {isSignup ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
          <button
            type="button"
            onClick={() => switchMode(isSignup ? "login" : "signup")}
            className="font-medium underline decoration-transparent underline-offset-4 transition-[text-decoration-color] hover:decoration-current"
            style={{ color: COLORS.ink }}
          >
            {isSignup ? "Se connecter" : "Créer un compte"}
          </button>
        </p>

        <p className="text-sm" style={{ color: COLORS.muted }}>
          {isAdmin ? (
            <>
              Vous êtes artiste ?{" "}
              <button
                type="button"
                onClick={() => switchEspace("artiste")}
                className="font-medium underline decoration-transparent underline-offset-4 transition-[text-decoration-color] hover:decoration-current"
                style={{ color: COLORS.ink }}
              >
                Espace artiste
              </button>
            </>
          ) : (
            <>
              Accès équipe ?{" "}
              <button
                type="button"
                onClick={() => switchEspace("admin")}
                className="font-medium underline decoration-transparent underline-offset-4 transition-[text-decoration-color] hover:decoration-current"
                style={{ color: COLORS.ink }}
              >
                Administration
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium"
        style={{ color: COLORS.inkMid }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
