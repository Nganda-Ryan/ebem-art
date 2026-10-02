"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { articleSchema, type ArticleInput } from "./schemas";

export type ActionResult = { ok: true } | { ok: false; error: string };

function isUniqueViolation(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "P2002"
  );
}

function revalidateArticlePaths(slug?: string) {
  revalidatePath("/admin/articles");
  revalidatePath("/");
  revalidatePath("/actualites");
  if (slug) revalidatePath(`/actualites/${slug}`);
}

function publishStamp(published: boolean, existingPublishedAt?: Date | null) {
  if (!published) return existingPublishedAt ?? null;
  return existingPublishedAt ?? new Date();
}

/** Create an article (admin). */
export async function createArticle(data: ArticleInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = articleSchema.parse(data);

    await db.article.create({
      data: {
        ...parsed,
        coverUrl: parsed.coverUrl || null,
        publishedAt: parsed.published ? new Date() : null,
      },
    });
    revalidateArticlePaths(parsed.slug);
    return { ok: true };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, error: "Ce slug est déjà utilisé." };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Création impossible.",
    };
  }
}

/** Update an article (admin). */
export async function updateArticle(
  id: string,
  data: ArticleInput
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = articleSchema.parse(data);
    const existing = await db.article.findUnique({
      where: { id },
      select: { slug: true, publishedAt: true },
    });
    if (!existing) {
      return { ok: false, error: "Article introuvable." };
    }

    await db.article.update({
      where: { id },
      data: {
        ...parsed,
        coverUrl: parsed.coverUrl || null,
        publishedAt: publishStamp(parsed.published, existing.publishedAt),
      },
    });
    revalidateArticlePaths(existing.slug);
    if (existing.slug !== parsed.slug) revalidateArticlePaths(parsed.slug);
    return { ok: true };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, error: "Ce slug est déjà utilisé." };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Mise à jour impossible.",
    };
  }
}

/** Delete an article (admin). */
export async function deleteArticle(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const existing = await db.article.findUnique({
      where: { id },
      select: { slug: true },
    });
    await db.article.delete({ where: { id } });
    revalidateArticlePaths(existing?.slug);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Suppression impossible.",
    };
  }
}

/** Publish or unpublish an article. */
export async function setArticlePublished(
  id: string,
  published: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const existing = await db.article.findUnique({
      where: { id },
      select: { slug: true, publishedAt: true },
    });
    if (!existing) {
      return { ok: false, error: "Article introuvable." };
    }

    await db.article.update({
      where: { id },
      data: {
        published,
        publishedAt: publishStamp(published, existing.publishedAt),
      },
    });
    revalidateArticlePaths(existing.slug);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Action impossible.",
    };
  }
}
