"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { artistSchema, type ArtistInput } from "./schemas";

export type ActionResult = { ok: true } | { ok: false; error: string };

function toArtistData(parsed: ArtistInput) {
  const { labelIds, ...rest } = parsed;
  return {
    ...rest,
    profilePhotoUrl: rest.portraitUrl ?? null,
    labels: { set: labelIds.map((id) => ({ id })) },
  };
}

function revalidateArtistPaths(id?: string, slug?: string) {
  revalidatePath("/admin/artistes");
  if (id) revalidatePath(`/admin/artistes/${id}`);
  revalidatePath("/artistes");
  if (slug) revalidatePath(`/artistes/${slug}`);
  revalidatePath("/explorer");
}

/** Create a new artist (admin) */
export async function createArtist(data: ArtistInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = artistSchema.parse(data);
    const { labelIds, ...rest } = parsed;

    await db.artist.create({
      data: {
        ...rest,
        profilePhotoUrl: rest.portraitUrl ?? null,
        labels: { connect: labelIds.map((id) => ({ id })) },
      },
    });
    revalidateArtistPaths(undefined, parsed.slug);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Création impossible.",
    };
  }
}

/** Update an existing artist (admin) */
export async function updateArtist(
  id: string,
  data: ArtistInput
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = artistSchema.parse(data);

    await db.artist.update({
      where: { id },
      data: toArtistData(parsed),
    });
    revalidateArtistPaths(id, parsed.slug);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Mise à jour impossible.",
    };
  }
}

/** Delete an artist (admin) */
export async function deleteArtist(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.artist.delete({ where: { id } });
    revalidateArtistPaths(id);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Suppression impossible (œuvres liées ?).",
    };
  }
}

/** Publish / unpublish an artist on the storefront */
export async function setArtistPublished(
  id: string,
  published: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const artist = await db.artist.update({
      where: { id },
      data: { published },
      select: { slug: true },
    });
    revalidateArtistPaths(id, artist.slug);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Action impossible.",
    };
  }
}

/** Ban / unban the linked user account */
export async function setArtistBanned(
  id: string,
  banned: boolean,
  reason?: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const artist = await db.artist.findUnique({
      where: { id },
      select: { userId: true, slug: true },
    });
    if (!artist) {
      return { ok: false, error: "Artiste introuvable." };
    }
    if (!artist.userId) {
      return {
        ok: false,
        error: "Aucun compte utilisateur lié à cet artiste.",
      };
    }

    await db.user.update({
      where: { id: artist.userId },
      data: {
        banned,
        banReason: banned ? (reason ?? "Bloqué par un administrateur") : null,
        banExpires: null,
      },
    });
    revalidateArtistPaths(id, artist.slug);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Action impossible.",
    };
  }
}
