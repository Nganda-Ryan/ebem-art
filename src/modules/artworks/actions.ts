"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import {
  artworkSchema,
  ARTWORK_STATUSES,
  type ArtworkInput,
} from "./schemas";

export type ActionResult = { ok: true } | { ok: false; error: string };

function toArtworkData(parsed: ArtworkInput) {
  const { labelIds, ...rest } = parsed;
  return {
    ...rest,
    frontImageUrl: rest.imageUrls[0] ?? null,
    labels: { set: labelIds.map((id) => ({ id })) },
  };
}

function revalidateArtworkPaths(id?: string, slug?: string) {
  revalidatePath("/admin/oeuvres");
  if (id) revalidatePath(`/admin/oeuvres/${id}`);
  revalidatePath("/oeuvres");
  if (slug) revalidatePath(`/oeuvres/${slug}`);
  revalidatePath("/explorer");
  revalidatePath("/admin/artistes");
}

/** Create a new artwork (admin) */
export async function createArtwork(data: ArtworkInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = artworkSchema.parse(data);
    const { labelIds, ...rest } = parsed;

    const created = await db.artwork.create({
      data: {
        ...rest,
        frontImageUrl: rest.imageUrls[0] ?? null,
        labels: { connect: labelIds.map((id) => ({ id })) },
      },
    });
    revalidateArtworkPaths(created.id, parsed.slug);
    revalidatePath(`/admin/artistes/${parsed.artistId}`);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Création impossible.",
    };
  }
}

/** Update an existing artwork (admin) */
export async function updateArtwork(
  id: string,
  data: ArtworkInput
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = artworkSchema.parse(data);

    await db.artwork.update({
      where: { id },
      data: toArtworkData(parsed),
    });
    revalidateArtworkPaths(id, parsed.slug);
    revalidatePath(`/admin/artistes/${parsed.artistId}`);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Mise à jour impossible.",
    };
  }
}

/** Delete an artwork (admin) */
export async function deleteArtwork(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const existing = await db.artwork.findUnique({
      where: { id },
      select: { slug: true, artistId: true },
    });
    await db.artwork.delete({ where: { id } });
    revalidateArtworkPaths(id, existing?.slug);
    if (existing?.artistId) {
      revalidatePath(`/admin/artistes/${existing.artistId}`);
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Suppression impossible (commandes liées ?).",
    };
  }
}

/** Change artwork status (admin) */
export async function setArtworkStatus(
  id: string,
  status: (typeof ARTWORK_STATUSES)[number],
  options?: { force?: boolean }
): Promise<ActionResult> {
  try {
    await requireAdmin();

    if (!ARTWORK_STATUSES.includes(status)) {
      return { ok: false, error: "Statut invalide." };
    }

    const artwork = await db.artwork.findUnique({
      where: { id },
      select: { status: true, slug: true, artistId: true },
    });
    if (!artwork) {
      return { ok: false, error: "Œuvre introuvable." };
    }

    const locked = artwork.status === "RESERVED" || artwork.status === "SOLD";
    if (locked && status === "AVAILABLE" && !options?.force) {
      return {
        ok: false,
        error:
          "Cette œuvre est réservée ou vendue. Confirmez pour forcer le statut Disponible.",
      };
    }

    await db.artwork.update({
      where: { id },
      data: { status },
    });
    revalidateArtworkPaths(id, artwork.slug);
    revalidatePath(`/admin/artistes/${artwork.artistId}`);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Action impossible.",
    };
  }
}

/** Publish / unpublish artwork on the storefront (indépendant de l'approbation) */
export async function setArtworkPublished(
  id: string,
  published: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const artwork = await db.artwork.update({
      where: { id },
      data: { published },
      select: { slug: true, artistId: true },
    });
    revalidateArtworkPaths(id, artwork.slug);
    revalidatePath(`/admin/artistes/${artwork.artistId}`);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Action impossible.",
    };
  }
}
