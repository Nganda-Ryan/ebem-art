"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { artworkRequestSchema, type ArtworkRequestInput } from "./schemas";
import { composeArtworkImageUrls } from "./images";
import { isArtistProfileComplete } from "@/modules/artists/schemas";

/** Submit a new artwork request (artist) */
export async function submitArtworkRequest(data: ArtworkRequestInput) {
  const session = await getSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour soumettre une œuvre.");
  }

  const parsed = artworkRequestSchema.parse(data);

  const artist = await db.artist.findUnique({
    where: { id: parsed.artistId },
    select: {
      id: true,
      published: true,
      userId: true,
      email: true,
      firstName: true,
      lastName: true,
      artistName: true,
      bio: true,
      phone: true,
      city: true,
      region: true,
      profilePhotoUrl: true,
    },
  });

  if (!artist) {
    throw new Error("Artiste introuvable.");
  }

  if (!isArtistProfileComplete(artist)) {
    throw new Error(
      "Complétez votre profil avant de soumettre une œuvre."
    );
  }

  if (!artist.published) {
    throw new Error(
      "Publiez votre profil (complétez-le entièrement) avant de soumettre des œuvres."
    );
  }

  const ownsArtist =
    artist.userId === session.user.id ||
    artist.email === session.user.email;
  if (!ownsArtist && session.user.role !== "admin") {
    throw new Error("Non autorisé à soumettre une œuvre pour cet artiste.");
  }

  const imageUrls = composeArtworkImageUrls(parsed);

  await db.artworkRequest.create({
    data: {
      ...parsed,
      imageUrls,
      detailImageUrls: parsed.detailImageUrls ?? [],
      contextImageUrl: parsed.contextImageUrl ?? null,
    },
  });

  revalidatePath("/artiste/oeuvres");
  revalidatePath("/admin/demandes-oeuvres");
}

/** Approve an artwork request (admin) */
export async function approveArtworkRequest(id: string, adminNote?: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("Non autorisé");
  }

  const request = await db.artworkRequest.findUnique({ where: { id } });
  if (!request) throw new Error("Demande introuvable");

  const slug = request.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const uniqueSlug = `${slug}-${Date.now()}`;

  const imageUrls =
    request.imageUrls.length > 0
      ? request.imageUrls
      : composeArtworkImageUrls({
          frontImageUrl: request.frontImageUrl ?? "",
          detailImageUrls: request.detailImageUrls,
          contextImageUrl: request.contextImageUrl,
        }).filter(Boolean);

  const artwork = await db.artwork.create({
    data: {
      slug: uniqueSlug,
      title: request.title,
      titleTranslation: request.titleTranslation,
      description: request.description,
      medium: request.medium,
      technique: request.technique,
      year: request.year,
      priceCents: request.priceCents,
      artistPriceCents: request.artistPriceCents,
      currency: request.currency,
      status: request.workStatus ?? "AVAILABLE",
      published: false, // Approbation ≠ publication catalogue
      imageUrls,
      frontImageUrl: request.frontImageUrl,
      detailImageUrls: request.detailImageUrls,
      contextImageUrl: request.contextImageUrl,
      heightCm: request.heightCm,
      widthCm: request.widthCm,
      depthCm: request.depthCm,
      weightKg: request.weightKg,
      framed: request.framed,
      packaging: request.packaging,
      location: request.location,
      artistId: request.artistId,
    },
  });

  await db.artworkRequest.update({
    where: { id },
    data: {
      status: "APPROVED",
      adminNote: adminNote ?? null,
      artworkId: artwork.id,
    },
  });

  revalidatePath("/admin/demandes-oeuvres");
  revalidatePath("/admin/oeuvres");
  revalidatePath("/oeuvres");
  revalidatePath("/explorer");
  revalidatePath("/artiste/oeuvres");
}

/** Reject an artwork request (admin) */
export async function rejectArtworkRequest(id: string, adminNote: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("Non autorisé");
  }

  await db.artworkRequest.update({
    where: { id },
    data: {
      status: "REJECTED",
      adminNote,
    },
  });

  revalidatePath("/admin/demandes-oeuvres");
  revalidatePath("/artiste/oeuvres");
}
