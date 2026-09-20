"use client";

import { useRef, useState, useTransition } from "react";
import { COLORS } from "@/constants/colors";
import { FILTER_REGIONS } from "@/data/mock";
import {
  ImageUpload,
  type ImageUploadHandle,
} from "@/components/ui/image-upload";
import { submitArtistRequest } from "@/modules/artist-requests/actions";

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
  defaultValue,
}: {
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      defaultValue={defaultValue}
      className="w-full px-4 py-3 text-sm outline-none"
      style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
    />
  );
}

function Select({
  name,
  options,
  required = false,
  defaultValue,
}: {
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <select
      name={name}
      required={required}
      defaultValue={defaultValue}
      className="w-full px-4 py-3 text-sm outline-none"
      style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
    >
      <option value="">Sélectionner...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function InscriptionForm() {
  const photoRef = useRef<ImageUploadHandle>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    startTransition(async () => {
      try {
        const urls = (await photoRef.current?.ensureUploaded()) ?? [];
        const profilePhotoUrl = urls[0] || null;

        await submitArtistRequest({
          firstName: fd.get("firstName") as string,
          lastName: fd.get("lastName") as string,
          birthDate: (fd.get("birthDate") as string) || null,
          birthPlace: (fd.get("birthPlace") as string) || null,
          artistName: fd.get("artistName") as string,
          culturalStatus: (fd.get("culturalStatus") as string) || null,
          bio: fd.get("bio") as string,
          phone: fd.get("phone") as string,
          whatsapp: (fd.get("whatsapp") as string) || null,
          email: fd.get("email") as string,
          city: fd.get("city") as string,
          region: fd.get("region") as string,
          profilePhotoUrl,
        });
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
        className="rounded-lg p-6 md:p-8"
        style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}
      >
        <h2 className="mb-6 font-serif text-xl" style={{ color: COLORS.ink }}>
          Identité & Informations personnelles
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FieldGroup label="PRÉNOM *">
            <Input name="firstName" placeholder="Ex: Élise" required />
          </FieldGroup>
          <FieldGroup label="NOM *">
            <Input name="lastName" placeholder="Ex: Nkemdifor" required />
          </FieldGroup>
          <FieldGroup label="DATE DE NAISSANCE">
            <Input name="birthDate" type="date" />
          </FieldGroup>
          <FieldGroup label="LIEU DE NAISSANCE">
            <Input name="birthPlace" placeholder="Ex: Douala, Cameroun" />
          </FieldGroup>
        </div>
      </div>

      <div
        className="rounded-lg p-6 md:p-8"
        style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}
      >
        <h2 className="mb-6 font-serif text-xl" style={{ color: COLORS.ink }}>
          Profil Artiste
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FieldGroup
            label="NOM D'ARTISTE *"
            hint="Le nom sous lequel vos œuvres seront affichées"
          >
            <Input name="artistName" placeholder="Ex: Élise Nkemdifor" required />
          </FieldGroup>
          <FieldGroup
            label="STATUT CULTUREL"
            hint="N° carte d'artiste, affiliation MINAC, SOCADAP..."
          >
            <Input name="culturalStatus" placeholder="Ex: Membre SOCADAP" />
          </FieldGroup>
          <div className="md:col-span-2">
            <FieldGroup
              label="PROFIL ARTISTIQUE & STORYTELLING *"
              hint="Parlez de votre parcours, votre pratique, ce qui anime votre travail"
            >
              <textarea
                name="bio"
                required
                rows={5}
                minLength={20}
                className="w-full px-4 py-3 text-sm outline-none"
                style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
                placeholder="Ex: Formée à l'École des Beaux-Arts de Yaoundé, je sculpte l'argile rouge des Hauts Plateaux..."
              />
            </FieldGroup>
          </div>
          <div className="md:col-span-2">
            <FieldGroup
              label="PHOTO DE PROFIL / ATELIER"
              hint="Photo de vous ou de votre atelier — utilisée pour vérifier votre identité (KYC)"
            >
              <ImageUpload
                ref={photoRef}
                name="profilePhotoUrl"
                folder="profile"
              />
            </FieldGroup>
          </div>
        </div>
      </div>

      <div
        className="rounded-lg p-6 md:p-8"
        style={{ background: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}
      >
        <h2 className="mb-6 font-serif text-xl" style={{ color: COLORS.ink }}>
          Contact
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FieldGroup label="TÉLÉPHONE PRINCIPAL *">
            <Input
              name="phone"
              type="tel"
              placeholder="+237 6XX XXX XXX"
              required
            />
          </FieldGroup>
          <FieldGroup
            label="WHATSAPP"
            hint="Canal privilégié pour les notifications"
          >
            <Input
              name="whatsapp"
              type="tel"
              placeholder="+237 6XX XXX XXX"
            />
          </FieldGroup>
          <FieldGroup label="EMAIL *">
            <Input
              name="email"
              type="email"
              placeholder="artiste@email.com"
              required
            />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-5">
            <FieldGroup label="VILLE *">
              <Input name="city" placeholder="Ex: Douala" required />
            </FieldGroup>
            <FieldGroup label="RÉGION *">
              <Select
                name="region"
                options={FILTER_REGIONS.filter((r) => r !== "Tous").map(
                  (r) => ({
                    value: r,
                    label: r,
                  })
                )}
                required
              />
            </FieldGroup>
          </div>
        </div>
      </div>

      {error && (
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
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3.5 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: COLORS.terra }}
      >
        {isPending ? "ENVOI EN COURS..." : "SOUMETTRE MA DEMANDE"}
      </button>

      <p className="text-center text-xs" style={{ color: COLORS.muted }}>
        Votre demande sera examinée par notre équipe. Vous serez notifié par
        email et WhatsApp de la décision.
      </p>
    </form>
  );
}
