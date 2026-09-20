"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDrawer } from "./AdminDrawer";
import {
  ImageUpload,
  type ImageUploadHandle,
} from "@/components/ui/image-upload";
import {
  createArtwork,
  updateArtwork,
  type ActionResult,
} from "@/modules/artworks/actions";
import {
  ARTWORK_STATUSES,
  type ArtworkInput,
} from "@/modules/artworks/schemas";

export type ArtistOption = { id: string; name: string };
export type LabelOption = { id: string; name: string; slug: string };

export type ArtworkFormValues = {
  id?: string;
  slug: string;
  title: string;
  description?: string | null;
  medium?: string | null;
  year?: number | null;
  priceCents: number;
  currency?: string;
  imageUrls?: string[];
  artistId: string;
  status?: (typeof ARTWORK_STATUSES)[number];
  published?: boolean;
  labelIds?: string[];
};

type ArtworkFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ArtworkFormValues | null;
  artists: ArtistOption[];
  labels: LabelOption[];
  /** Prefill artist when creating from artist detail */
  defaultArtistId?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500";

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Disponible",
  RESERVED: "Réservée",
  SOLD: "Vendue",
  EXHIBITING: "En exposition",
};

export function ArtworkFormDrawer({
  open,
  onOpenChange,
  initial,
  artists,
  labels,
  defaultArtistId,
}: ArtworkFormDrawerProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const imagesRef = useRef<ImageUploadHandle>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    initial?.labelIds ?? []
  );
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setSlug(initial?.slug ?? "");
    setSlugTouched(Boolean(initial?.slug));
    setSelectedLabels(initial?.labelIds ?? []);
    setError(null);
    setFormKey((k) => k + 1);
  }, [open, initial?.id, initial?.title, initial?.slug, initial?.labelIds]);

  function toggleLabel(id: string) {
    setSelectedLabels((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData(e.currentTarget);
      const yearRaw = String(fd.get("year") ?? "").trim();
      const imageUrls = await (imagesRef.current?.ensureUploaded() ??
        Promise.resolve(initial?.imageUrls ?? []));

      if (imageUrls.length === 0) {
        setError("Ajoutez au moins une image.");
        setLoading(false);
        return;
      }

      const payload: ArtworkInput = {
        title: String(fd.get("title") ?? ""),
        slug: String(fd.get("slug") ?? ""),
        description: (fd.get("description") as string) || null,
        medium: (fd.get("medium") as string) || null,
        year: yearRaw ? Number(yearRaw) : null,
        priceCents: Number(fd.get("priceCents") ?? 0),
        currency: String(fd.get("currency") ?? "XAF"),
        imageUrls,
        artistId: String(fd.get("artistId") ?? ""),
        labelIds: selectedLabels,
        status: (fd.get("status") as ArtworkInput["status"]) || "AVAILABLE",
        published: fd.get("published") === "on",
      };

      let result: ActionResult;
      if (isEdit && initial?.id) {
        result = await updateArtwork(initial.id, payload);
      } else {
        result = await createArtwork(payload);
      }

      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }

      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Modifier l'œuvre" : "Nouvelle œuvre"}
      description={
        isEdit
          ? "Mettez à jour la fiche œuvre."
          : "Créez une œuvre directement depuis l'admin."
      }
      wide
    >
      <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Titre
          </label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            name="slug"
            required
            pattern="^[a-z0-9-]+$"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Artiste
          </label>
          <select
            name="artistId"
            required
            defaultValue={
              initial?.artistId ?? defaultArtistId ?? artists[0]?.id ?? ""
            }
            className={inputClass}
          >
            {artists.length === 0 && (
              <option value="">Aucun artiste</option>
            )}
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prix (centimes XAF)
            </label>
            <input
              name="priceCents"
              type="number"
              min={1}
              required
              defaultValue={initial?.priceCents ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Devise
            </label>
            <input
              name="currency"
              defaultValue={initial?.currency ?? "XAF"}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Médium
            </label>
            <input
              name="medium"
              defaultValue={initial?.medium ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Année
            </label>
            <input
              name="year"
              type="number"
              defaultValue={initial?.year ?? ""}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Statut inventaire
          </label>
          <select
            name="status"
            defaultValue={initial?.status ?? "AVAILABLE"}
            className={inputClass}
          >
            {ARTWORK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s] ?? s}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            name="published"
            type="checkbox"
            defaultChecked={initial?.published ?? false}
            className="rounded border-gray-300"
          />
          Publiée sur le catalogue (indépendant de l&apos;approbation)
        </label>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Labels
          </label>
          {labels.length === 0 ? (
            <p className="text-xs text-gray-400">
              Aucun label en base. Lancez le seed pour en créer.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => {
                const checked = selectedLabels.includes(label.id);
                return (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => toggleLabel(label.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      checked
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {label.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Images
          </label>
          <ImageUpload
            key={`images-${formKey}`}
            ref={imagesRef}
            name="imageUrls"
            folder="artworks"
            multiple
            max={8}
            defaultValues={initial?.imageUrls ?? []}
            hint="Au moins une image. La première sert de couverture."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={initial?.description ?? ""}
            className={inputClass}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || artists.length === 0}
            className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? "Enregistrement…" : isEdit ? "Enregistrer" : "Créer"}
          </button>
        </div>
      </form>
    </AdminDrawer>
  );
}
