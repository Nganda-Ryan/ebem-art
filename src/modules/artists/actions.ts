"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { getSession } from "@/lib/auth";
import {
  artistSchema,
  artistProfileSchema,
  isArtistProfileComplete,
  type ArtistInput,
  type ArtistProfileInput,
} from "./schemas";
import { getArtistForUser } from "./queries";

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
  revalidatePath("/artiste/oeuvres");
  revalidatePath("/artiste/profil");
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

/** Artiste connecté : met à jour son profil ; publie s'il est complet. */
export async function updateMyArtistProfile(
  data: ArtistProfileInput
): Promise<ActionResult & { published?: boolean }> {
  try {
    const session = await getSession();
    if (!session) {
      return { ok: false, error: "Vous devez être connecté." };
    }

    const artist = await getArtistForUser({
      id: session.user.id,
      email: session.user.email,
    });
    if (!artist) {
      return {
        ok: false,
        error: "Aucun profil artiste associé à ce compte.",
      };
    }

    const parsed = artistProfileSchema.parse(data);
    const complete = isArtistProfileComplete(parsed);
    const displayName = parsed.artistName.trim();

    const updated = await db.artist.update({
      where: { id: artist.id },
      data: {
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        artistName: parsed.artistName,
        name: displayName,
        birthDate: parsed.birthDate ? new Date(parsed.birthDate) : null,
        birthPlace: parsed.birthPlace || null,
        culturalStatus: parsed.culturalStatus || null,
        bio: parsed.bio,
        phone: parsed.phone,
        whatsapp: parsed.whatsapp || null,
        city: parsed.city,
        region: parsed.region,
        discipline: parsed.discipline || null,
        profilePhotoUrl: parsed.profilePhotoUrl,
        portraitUrl: parsed.profilePhotoUrl,
        published: complete,
        ...(artist.userId ? {} : { userId: session.user.id }),
      },
      select: { id: true, slug: true, published: true },
    });

    revalidateArtistPaths(updated.id, updated.slug);
    return { ok: true, published: updated.published };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : "Mise à jour du profil impossible.",
    };
  }
}
