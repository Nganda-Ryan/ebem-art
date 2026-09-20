"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { FILTER_REGIONS } from "@/data/mock";
import {
  ImageUpload,
  type ImageUploadHandle,
} from "@/components/ui/image-upload";
import { updateMyArtistProfile } from "@/modules/artists/actions";
import { isArtistProfileComplete } from "@/modules/artists/schemas";

const INPUT_STYLE = {
  background: COLORS.bgCard,
  border: `1px solid ${COLORS.border}`,
  color: COLORS.ink,
};

type ArtistProfileFormProps = {
  artist: {
    firstName: string | null;
    lastName: string | null;
    artistName: string | null;
    birthDate: Date | string | null;
    birthPlace: string | null;
    culturalStatus: string | null;
    bio: string | null;
    phone: string | null;
    whatsapp: string | null;
    city: string | null;
    region: string | null;
    discipline: string | null;
    profilePhotoUrl: string | null;
    published: boolean;
  };
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
        style={{ color: COLORS.muted }}
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p className="mt-1 text-xs" style={{ color: COLORS.muted }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function toDateInput(value: Date | string | null) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function ArtistProfileForm({ artist }: ArtistProfileFormProps) {
  const router = useRouter();
  const photoRef = useRef<ImageUploadHandle>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const initiallyComplete = isArtistProfileComplete(artist);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    startTransition(async () => {
      try {
        const urls = (await photoRef.current?.ensureUploaded()) ?? [];
        const profilePhotoUrl =
          urls[0] || artist.profilePhotoUrl || "";

        if (!profilePhotoUrl) {
          setError("Ajoutez une photo de profil.");
          return;
        }

        const result = await updateMyArtistProfile({
          firstName: fd.get("firstName") as string,
          lastName: fd.get("lastName") as string,
          artistName: fd.get("artistName") as string,
          birthDate: (fd.get("birthDate") as string) || null,
          birthPlace: (fd.get("birthPlace") as string) || null,
          culturalStatus: (fd.get("culturalStatus") as string) || null,
          bio: fd.get("bio") as string,
          phone: fd.get("phone") as string,
          whatsapp: (fd.get("whatsapp") as string) || null,
          city: fd.get("city") as string,
          region: fd.get("region") as string,
          discipline: (fd.get("discipline") as string) || null,
          profilePhotoUrl,
        });

        if (!result.ok) {
          setError(result.error);
          return;
        }

        setSuccess(
          result.published
            ? "Profil enregistré et publié. Vous pouvez soumettre vos œuvres."
            : "Profil enregistré. Complétez les champs obligatoires pour publier."
        );
        router.refresh();
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
        className="rounded-xl px-4 py-3 text-sm"
        style={{
          background: initiallyComplete || artist.published ? "#D1FAE5" : "#FEF3C7",
          color: initiallyComplete || artist.published ? "#065F46" : "#92400E",
          border: `1px solid ${
            initiallyComplete || artist.published ? "#A7F3D0" : "#FDE68A"
          }`,
        }}
      >
        {artist.published
          ? "Votre profil est publié sur la plateforme."
          : initiallyComplete
            ? "Profil prêt — enregistrez pour publier."
            : "Complétez les champs marqués * pour publier votre profil et soumettre des œuvres."}
      </div>

      <div
        className="rounded-xl p-6 md:p-8"
        style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}
      >
        <h2 className="mb-6 font-serif text-xl" style={{ color: COLORS.ink }}>
          Identité
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FieldGroup label="PRÉNOM *">
            <input
              name="firstName"
              required
              defaultValue={artist.firstName ?? ""}
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
            />
          </FieldGroup>
          <FieldGroup label="NOM *">
            <input
              name="lastName"
              required
              defaultValue={artist.lastName ?? ""}
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
            />
          </FieldGroup>
          <FieldGroup label="DATE DE NAISSANCE">
            <input
              name="birthDate"
              type="date"
              defaultValue={toDateInput(artist.birthDate)}
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
            />
          </FieldGroup>
          <FieldGroup label="LIEU DE NAISSANCE">
            <input
              name="birthPlace"
              defaultValue={artist.birthPlace ?? ""}
              placeholder="Ex: Douala, Cameroun"
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
            />
          </FieldGroup>
        </div>
      </div>

      <div
        className="rounded-xl p-6 md:p-8"
        style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}
      >
        <h2 className="mb-6 font-serif text-xl" style={{ color: COLORS.ink }}>
          Profil artistique
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FieldGroup label="NOM D'ARTISTE *">
            <input
              name="artistName"
              required
              defaultValue={artist.artistName ?? ""}
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
            />
          </FieldGroup>
          <FieldGroup
            label="STATUT CULTUREL"
            hint="Carte d'artiste, MINAC, SOCADAP…"
          >
            <input
              name="culturalStatus"
              defaultValue={artist.culturalStatus ?? ""}
              placeholder="Ex: Membre SOCADAP"
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
            />
          </FieldGroup>
          <FieldGroup label="DISCIPLINE">
            <input
              name="discipline"
              defaultValue={artist.discipline ?? ""}
              placeholder="Ex: Peinture, Sculpture…"
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
            />
          </FieldGroup>
          <div className="md:col-span-2">
            <FieldGroup
              label="BIO / STORYTELLING *"
              hint="Parcours, pratique, ce qui anime votre travail (20 caractères min.)"
            >
              <textarea
                name="bio"
                required
                rows={5}
                minLength={20}
                defaultValue={artist.bio ?? ""}
                className="w-full px-4 py-3 text-sm outline-none"
                style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
                placeholder="Ex: Formée à l'École des Beaux-Arts de Yaoundé…"
              />
            </FieldGroup>
          </div>
          <div className="md:col-span-2">
            <FieldGroup label="PHOTO DE PROFIL *">
              <ImageUpload
                ref={photoRef}
                name="profilePhotoUrl"
                folder="profile"
                defaultValues={
                  artist.profilePhotoUrl ? [artist.profilePhotoUrl] : undefined
                }
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
          Contact & localisation
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FieldGroup label="TÉLÉPHONE *">
            <input
              name="phone"
              type="tel"
              required
              defaultValue={artist.phone ?? ""}
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
            />
          </FieldGroup>
          <FieldGroup label="WHATSAPP">
            <input
              name="whatsapp"
              type="tel"
              defaultValue={artist.whatsapp ?? ""}
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
            />
          </FieldGroup>
          <FieldGroup label="VILLE *">
            <input
              name="city"
              required
              defaultValue={artist.city ?? ""}
              className="w-full px-4 py-3 text-sm outline-none"
              style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
            />
          </FieldGroup>
          <FieldGroup label="RÉGION *">
            <select
              name="region"
              required
              defaultValue={artist.region ?? ""}
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

      {error ? (
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
      ) : null}

      {success ? (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            background: "#D1FAE5",
            color: "#065F46",
            border: "1px solid #A7F3D0",
          }}
        >
          {success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3.5 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50 md:w-auto md:self-start"
        style={{ background: COLORS.terra }}
      >
        {isPending ? "ENREGISTREMENT…" : "ENREGISTRER MON PROFIL"}
      </button>
    </form>
  );
}
