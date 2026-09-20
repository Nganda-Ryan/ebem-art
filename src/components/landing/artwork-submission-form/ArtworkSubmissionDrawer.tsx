"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import {
  ImageUpload,
  type ImageUploadHandle,
} from "@/components/ui/image-upload";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { submitArtworkRequest } from "@/modules/artwork-requests/actions";
import {
  PACKAGING_OPTIONS,
  type PackagingValue,
} from "@/modules/artwork-requests/images";

type ArtworkSubmissionDrawerProps = {
  artistId: string;
  artistName: string;
};

const STEPS = [
  { id: 1, label: "Identité" },
  { id: 2, label: "Visuels" },
  { id: 3, label: "Prix" },
] as const;

const DISCIPLINE_OPTIONS = [
  { value: "Peinture", label: "Peinture" },
  { value: "Sculpture", label: "Sculpture" },
  { value: "Gravure", label: "Gravure" },
  { value: "Photographie", label: "Photographie" },
  { value: "Installation", label: "Installation" },
  { value: "Arts mixtes", label: "Arts mixtes" },
  { value: "Autre", label: "Autre" },
];

const INPUT_STYLE = {
  background: COLORS.bgCard,
  border: `1px solid ${COLORS.border}`,
  color: COLORS.ink,
};

function FieldGroup({
  label,
  children,
  hint,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        className="mb-2 block font-mono text-[10px] tracking-widest"
        style={{ color: COLORS.muted }}
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

function TextInput({
  name,
  type = "text",
  placeholder,
  required = false,
  step,
}: {
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      step={step}
      className="w-full px-3 py-2.5 text-sm outline-none"
      style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
    />
  );
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const active = s.id === step;
        const done = s.id < step;
        return (
          <div key={s.id} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className="h-px w-4 sm:w-6"
                style={{ background: done || active ? COLORS.terra : COLORS.border }}
              />
            )}
            <div className="flex items-center gap-1.5">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px]"
                style={{
                  background: active || done ? COLORS.terra : COLORS.bgAlt,
                  color: active || done ? "#fff" : COLORS.muted,
                  border: `1px solid ${active || done ? COLORS.terra : COLORS.border}`,
                }}
              >
                {String(s.id).padStart(2, "0")}
              </span>
              <span
                className="hidden text-xs sm:inline"
                style={{
                  color: active ? COLORS.ink : COLORS.muted,
                  fontWeight: active ? 600 : 400,
                }}
              >
                {s.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ArtworkSubmissionDrawer({
  artistId,
  artistName,
}: ArtworkSubmissionDrawerProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formKey, setFormKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const frontImageRef = useRef<ImageUploadHandle>(null);
  const detailImagesRef = useRef<ImageUploadHandle>(null);
  const contextImageRef = useRef<ImageUploadHandle>(null);

  function resetWizard() {
    setStep(1);
    setError(null);
    setIsSubmitting(false);
    setFormKey((k) => k + 1);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetWizard();
  }

  function validateStep(form: HTMLFormElement, current: number): string | null {
    const fd = new FormData(form);

    if (current === 1) {
      const title = ((fd.get("title") as string) || "").trim();
      if (!title) return "Le titre de l'œuvre est obligatoire.";
    }

    if (current === 2) {
      if (!frontImageRef.current?.hasFiles()) {
        return "La vue de face complète (fond neutre) est obligatoire.";
      }
    }

    if (current === 3) {
      const price = Number(fd.get("priceCents"));
      if (!price || price <= 0) {
        return "Le prix public affiché est obligatoire.";
      }
    }

    return null;
  }

  function goNext(e: React.MouseEvent) {
    e.preventDefault();
    const form = (e.currentTarget as HTMLElement).closest("form");
    if (!form) return;
    const validationError = validateStep(form, step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((s) => Math.min(3, s + 1));
  }

  function goBack(e: React.MouseEvent) {
    e.preventDefault();
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step !== 3) return;

    const form = e.currentTarget;
    const validationError = validateStep(form, 3);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const fd = new FormData(form);

      const [frontUrls, detailImageUrls, contextUrls] = await Promise.all([
        frontImageRef.current?.ensureUploaded() ?? Promise.resolve([]),
        detailImagesRef.current?.ensureUploaded() ?? Promise.resolve([]),
        contextImageRef.current?.ensureUploaded() ?? Promise.resolve([]),
      ]);

      const frontImageUrl = frontUrls[0] || "";
      if (!frontImageUrl) {
        setError("La vue de face complète (fond neutre) est obligatoire.");
        setIsSubmitting(false);
        return;
      }
      const contextImageUrl = contextUrls[0] || null;

      const packagingRaw = (fd.get("packaging") as string) || "";
      const packaging: PackagingValue | null =
        packagingRaw === "ROULEE" ||
        packagingRaw === "CHASSIS" ||
        packagingRaw === "CAISSE_BOIS"
          ? packagingRaw
          : null;

      await submitArtworkRequest({
        title: fd.get("title") as string,
        titleTranslation: (fd.get("titleTranslation") as string) || null,
        description: (fd.get("description") as string) || null,
        medium: (fd.get("medium") as string) || null,
        technique: (fd.get("technique") as string) || null,
        year: fd.get("year") ? Number(fd.get("year")) : null,
        priceCents: Number(fd.get("priceCents")),
        artistPriceCents: fd.get("artistPriceCents")
          ? Number(fd.get("artistPriceCents"))
          : null,
        currency: "XAF",
        frontImageUrl,
        detailImageUrls,
        contextImageUrl,
        workStatus:
          (fd.get("workStatus") as
            | "AVAILABLE"
            | "RESERVED"
            | "SOLD"
            | "EXHIBITING") || "AVAILABLE",
        heightCm: fd.get("heightCm") ? Number(fd.get("heightCm")) : null,
        widthCm: fd.get("widthCm") ? Number(fd.get("widthCm")) : null,
        depthCm: fd.get("depthCm") ? Number(fd.get("depthCm")) : null,
        weightKg: fd.get("weightKg") ? Number(fd.get("weightKg")) : null,
        framed: fd.get("framed") === "true",
        packaging,
        location: (fd.get("location") as string) || null,
        artistId,
      });

      handleOpenChange(false);
      router.push("/artiste/oeuvres?submitted=true");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      swipeDirection={isMobile ? "down" : "right"}
      showSwipeHandle={isMobile}
    >
      <DrawerTrigger
        className="inline-flex shrink-0 items-center justify-center px-6 py-3 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
        style={{ background: COLORS.terra }}
      >
        + AJOUTER UNE ŒUVRE
      </DrawerTrigger>

      <DrawerContent
        className="bg-(--color-mboa-bg) text-(--color-mboa-ink) data-[swipe-axis=x]:[--drawer-content-width:100%] data-[swipe-axis=x]:sm:[--drawer-content-width:28rem] data-[swipe-axis=x]:lg:[--drawer-content-width:32rem] data-[swipe-axis=y]:[--drawer-content-max-height:92dvh]"
      >
        <form
          key={formKey}
          onSubmit={handleSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <DrawerHeader className="border-b border-(--color-mboa-border) pb-4 text-left">
            <DrawerTitle className="font-serif text-xl text-(--color-mboa-ink)">
              Soumettre une œuvre
            </DrawerTitle>
            <DrawerDescription className="text-(--color-mboa-muted)">
              Artiste : {artistName} - étape {String(step).padStart(2, "0")} / 03
            </DrawerDescription>
            <div className="mt-3">
              <StepIndicator step={step} />
            </div>
          </DrawerHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
            {/* Step 1 - always mounted so values persist */}
            <div className={step === 1 ? "flex flex-col gap-4" : "hidden"}>
              <FieldGroup label="TITRE DE L'ŒUVRE *">
                <TextInput
                  name="title"
                  placeholder="Ex: Mémoire Bamiléké No.3"
                />
              </FieldGroup>
              <FieldGroup
                label="TRADUCTION DU TITRE"
                hint="Si le titre est en langue locale"
              >
                <TextInput
                  name="titleTranslation"
                  placeholder="Ex: Memory of the Bamileke"
                />
              </FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="ANNÉE DE CRÉATION">
                  <TextInput name="year" type="number" placeholder="Ex: 2024" />
                </FieldGroup>
                <FieldGroup label="DISCIPLINE / MÉDIUM">
                  <select
                    name="medium"
                    className="w-full px-3 py-2.5 text-sm outline-none"
                    style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
                  >
                    <option value="">Sélectionner...</option>
                    {DISCIPLINE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </FieldGroup>
              </div>
              <FieldGroup
                label="TECHNIQUE UTILISÉE"
                hint="Ex: Couteau, Pinceau, Collage, Modelage"
              >
                <TextInput name="technique" placeholder="Ex: Couteau" />
              </FieldGroup>
              <FieldGroup label="DESCRIPTION">
                <textarea
                  name="description"
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm outline-none"
                  style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
                  placeholder="Décrivez votre œuvre..."
                />
              </FieldGroup>
            </div>

            {/* Step 2 */}
            <div className={step === 2 ? "flex flex-col gap-5" : "hidden"}>
              <FieldGroup
                label="VUE DE FACE *"
                hint="Vue de face complète sur fond neutre"
              >
                <ImageUpload
                  ref={frontImageRef}
                  name="frontImageUrl"
                  folder="artworks"
                />
              </FieldGroup>
              <FieldGroup
                label="ANGLES / DÉTAILS"
                hint="Textures, relief, détails de facture"
              >
                <ImageUpload
                  ref={detailImagesRef}
                  name="detailImageUrls"
                  folder="artworks"
                  multiple
                  max={4}
                />
              </FieldGroup>
              <FieldGroup
                label="MISE EN SITUATION"
                hint="Sur un mur ou un socle pour apprécier l'échelle"
              >
                <ImageUpload
                  ref={contextImageRef}
                  name="contextImageUrl"
                  folder="artworks"
                />
              </FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="HAUTEUR (cm)">
                  <TextInput
                    name="heightCm"
                    type="number"
                    step="0.1"
                    placeholder="cm"
                  />
                </FieldGroup>
                <FieldGroup label="LARGEUR (cm)">
                  <TextInput
                    name="widthCm"
                    type="number"
                    step="0.1"
                    placeholder="cm"
                  />
                </FieldGroup>
                <FieldGroup label="PROFONDEUR (cm)">
                  <TextInput
                    name="depthCm"
                    type="number"
                    step="0.1"
                    placeholder="cm"
                  />
                </FieldGroup>
                <FieldGroup label="POIDS (kg)">
                  <TextInput
                    name="weightKg"
                    type="number"
                    step="0.1"
                    placeholder="kg"
                  />
                </FieldGroup>
              </div>
            </div>

            {/* Step 3 */}
            <div className={step === 3 ? "flex flex-col gap-4" : "hidden"}>
              <FieldGroup label="STATUT DE L'ŒUVRE">
                <select
                  name="workStatus"
                  defaultValue="AVAILABLE"
                  className="w-full px-3 py-2.5 text-sm outline-none"
                  style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
                >
                  <option value="AVAILABLE">Disponible</option>
                  <option value="RESERVED">En réservation</option>
                  <option value="SOLD">Vendue</option>
                  <option value="EXHIBITING">
                    En cours d&apos;exposition physique
                  </option>
                </select>
              </FieldGroup>
              <FieldGroup
                label="PRIX PUBLIC AFFICHÉ (XAF) *"
                hint="Prix incluant la commission"
              >
                <TextInput
                  name="priceCents"
                  type="number"
                  placeholder="Ex: 280000"
                />
              </FieldGroup>
              <FieldGroup
                label="PRIX ARTISTE (XAF)"
                hint="Votre prix hors commission"
              >
                <TextInput
                  name="artistPriceCents"
                  type="number"
                  placeholder="Ex: 240000"
                />
              </FieldGroup>
              <FieldGroup label="ENCADREMENT / SUPPORT">
                <select
                  name="framed"
                  className="w-full px-3 py-2.5 text-sm outline-none"
                  style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
                >
                  <option value="false">Non encadré / Sans socle</option>
                  <option value="true">Encadré / Avec socle</option>
                </select>
              </FieldGroup>
              <FieldGroup label="CONDITIONNEMENT / EMBALLAGE">
                <select
                  name="packaging"
                  className="w-full px-3 py-2.5 text-sm outline-none"
                  style={{ ...INPUT_STYLE, fontFamily: "var(--sans)" }}
                >
                  <option value="">Sélectionner...</option>
                  {PACKAGING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FieldGroup>
              <FieldGroup
                label="LOCALISATION ACTUELLE"
                hint="Ville où la pièce est stockée"
              >
                <TextInput name="location" placeholder="Ex: Douala" />
              </FieldGroup>
            </div>

            {error && (
              <div
                className="mt-4 rounded-lg px-3 py-2.5 text-sm"
                style={{
                  background: "#FEE2E2",
                  color: "#991B1B",
                  border: "1px solid #FECACA",
                }}
              >
                {error}
              </div>
            )}
          </div>

          <DrawerFooter className="border-t border-(--color-mboa-border) pt-4">
            <div className="flex gap-2">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 px-4 py-3 font-mono text-xs tracking-wider transition-opacity hover:opacity-80"
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.inkMid,
                    background: COLORS.bgCard,
                  }}
                >
                  RETOUR
                </button>
              ) : (
                <DrawerClose
                  className="flex-1 px-4 py-3 font-mono text-xs tracking-wider transition-opacity hover:opacity-80"
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.inkMid,
                    background: COLORS.bgCard,
                  }}
                >
                  ANNULER
                </DrawerClose>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 px-4 py-3 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
                  style={{ background: COLORS.terra }}
                >
                  CONTINUER
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: COLORS.terra }}
                >
                  {isSubmitting ? "ENVOI..." : "SOUMETTRE"}
                </button>
              )}
            </div>
            <p
              className="text-center text-[11px]"
              style={{ color: COLORS.muted }}
            >
              L&apos;œuvre sera examinée avant publication.
            </p>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
