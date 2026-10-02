"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDrawer } from "./AdminDrawer";
import {
  ImageUpload,
  type ImageUploadHandle,
} from "@/components/ui/image-upload";
import {
  createArticle,
  updateArticle,
  type ActionResult,
} from "@/modules/articles/actions";
import type { ArticleInput } from "@/modules/articles/schemas";

export type ArticleFormValues = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  coverUrl?: string | null;
  authorName: string;
  published?: boolean;
};

type ArticleFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ArticleFormValues | null;
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

export function ArticleFormDrawer({
  open,
  onOpenChange,
  initial,
}: ArticleFormDrawerProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const coverRef = useRef<ImageUploadHandle>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setSlug(initial?.slug ?? "");
    setSlugTouched(Boolean(initial?.slug));
    setError(null);
    setFormKey((k) => k + 1);
  }, [open, initial?.id, initial?.title, initial?.slug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData(e.currentTarget);
      const covers = await (coverRef.current?.ensureUploaded() ??
        Promise.resolve(initial?.coverUrl ? [initial.coverUrl] : []));

      const payload: ArticleInput = {
        title: String(fd.get("title") ?? ""),
        slug: String(fd.get("slug") ?? ""),
        excerpt: String(fd.get("excerpt") ?? ""),
        body: String(fd.get("body") ?? ""),
        category: String(fd.get("category") ?? ""),
        authorName: String(fd.get("authorName") ?? ""),
        coverUrl: covers[0] ?? null,
        published: fd.get("published") === "on",
      };

      let result: ActionResult;
      if (isEdit && initial?.id) {
        result = await updateArticle(initial.id, payload);
      } else {
        result = await createArticle(payload);
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
      title={isEdit ? "Modifier l'article" : "Nouvel article"}
      description={
        isEdit
          ? "Mettez à jour l'article. Seuls les articles publiés apparaissent sur le site."
          : "Rédigez un article. Cochez Publier pour l'afficher sur le site."
      }
      wide
    >
      <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Catégorie
            </label>
            <input
              name="category"
              required
              defaultValue={initial?.category ?? ""}
              placeholder="Voyage, Portrait…"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Auteur
            </label>
            <input
              name="authorName"
              required
              defaultValue={initial?.authorName ?? ""}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Extrait
          </label>
          <textarea
            name="excerpt"
            required
            rows={3}
            defaultValue={initial?.excerpt ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Corps
          </label>
          <textarea
            name="body"
            required
            rows={10}
            defaultValue={initial?.body ?? ""}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Image de couverture
          </label>
          <ImageUpload
            key={`cover-${formKey}`}
            ref={coverRef}
            name="coverUrl"
            folder="articles"
            max={1}
            defaultValues={initial?.coverUrl ? [initial.coverUrl] : []}
            hint="Optionnelle. Affichée sur la page d'accueil et la page article."
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            name="published"
            type="checkbox"
            defaultChecked={initial?.published ?? false}
            className="rounded-xl border-gray-300"
          />
          Publier sur le site
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
