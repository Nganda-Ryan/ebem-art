"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDrawer } from "./AdminDrawer";
import {
  ImageUpload,
  type ImageUploadHandle,
} from "@/components/ui/image-upload";
import {
  createArtist,
  updateArtist,
  type ActionResult,
} from "@/modules/artists/actions";
import type { ArtistInput } from "@/modules/artists/schemas";

export type ArtistFormValues = {
  id?: string;
  slug: string;
  name: string;
  bio?: string | null;
  city?: string | null;
  discipline?: string | null;
  portraitUrl?: string | null;
  published?: boolean;
};

type ArtistFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ArtistFormValues | null;
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
  "mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500";

export function ArtistFormDrawer({
  open,
  onOpenChange,
  initial,
}: ArtistFormDrawerProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const portraitRef = useRef<ImageUploadHandle>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setSlug(initial?.slug ?? "");
    setSlugTouched(Boolean(initial?.slug));
    setError(null);
    setFormKey((k) => k + 1);
  }, [open, initial?.id, initial?.name, initial?.slug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData(e.currentTarget);
      const portraitUrls = await (portraitRef.current?.ensureUploaded() ??
        Promise.resolve(
          initial?.portraitUrl ? [initial.portraitUrl] : ([] as string[])
        ));
      const portraitUrl = portraitUrls[0] ?? null;

      const payload: ArtistInput = {
        name: String(fd.get("name") ?? ""),
        slug: String(fd.get("slug") ?? ""),
        bio: (fd.get("bio") as string) || null,
        city: (fd.get("city") as string) || null,
        discipline: (fd.get("discipline") as string) || null,
        portraitUrl,
        published: fd.get("published") === "on",
        labelIds: [],
      };

      let result: ActionResult;
      if (isEdit && initial?.id) {
        result = await updateArtist(initial.id, payload);
      } else {
        result = await createArtist(payload);
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
      title={isEdit ? "Modifier l'artiste" : "Nouvel artiste"}
      description={
        isEdit
          ? "Mettez à jour le profil artiste."
          : "Créez un artiste directement depuis l'admin."
      }
      wide
    >
      <form
        key={formKey}
        id="artist-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
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
          <label className="block text-sm font-medium text-gray-700">Ville</label>
          <input
            name="city"
            defaultValue={initial?.city ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Discipline
          </label>
          <input
            name="discipline"
            defaultValue={initial?.discipline ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Photo de profil
          </label>
          <ImageUpload
            key={`portrait-${formKey}`}
            ref={portraitRef}
            name="portraitUrl"
            folder="profile"
            max={1}
            defaultValues={initial?.portraitUrl ? [initial.portraitUrl] : []}
            hint="Portrait affiché sur les pages publiques."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            rows={4}
            defaultValue={initial?.bio ?? ""}
            className={inputClass}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            name="published"
            type="checkbox"
            defaultChecked={initial?.published ?? false}
            className="rounded-xl border-gray-300"
          />
          Publié sur le storefront
        </label>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? "Enregistrement…" : isEdit ? "Enregistrer" : "Créer"}
          </button>
        </div>
      </form>
    </AdminDrawer>
  );
}
