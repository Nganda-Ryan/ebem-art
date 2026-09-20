"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { artistRequestSchema, type ArtistRequestInput } from "./schemas";
import { createArtistRequestRecord } from "./service";

/** Submit a new artist KYC request (public) — prefer POST /api/artist-requests in the UI */
export async function submitArtistRequest(data: ArtistRequestInput) {
  const parsed = artistRequestSchema.parse(data);
  await createArtistRequestRecord(parsed);
  redirect("/inscription/merci");
}

/** Approve an artist request (admin) */
export async function approveArtistRequest(id: string, adminNote?: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("Non autorisé");
  }

  const request = await db.artistRequest.findUnique({ where: { id } });
  if (!request) throw new Error("Demande introuvable");

  // Create the artist from the request data
  const artistName = request.artistName ?? `${request.firstName} ${request.lastName}`;

  const slug = artistName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Prefer request.userId; otherwise resolve by email so the espace artiste works
  let linkedUserId = request.userId;
  if (!linkedUserId) {
    const userByEmail = await db.user.findUnique({
      where: { email: request.email },
      select: { id: true },
    });
    linkedUserId = userByEmail?.id ?? null;
  }

  const artist = await db.artist.create({
    data: {
      slug,
      name: artistName,
      bio: request.bio,
      firstName: request.firstName,
      lastName: request.lastName,
      birthDate: request.birthDate,
      birthPlace: request.birthPlace,
      artistName: request.artistName,
      culturalStatus: request.culturalStatus,
      phone: request.phone,
      whatsapp: request.whatsapp,
      email: request.email,
      city: request.city,
      region: request.region,
      portraitUrl: request.profilePhotoUrl,
      profilePhotoUrl: request.profilePhotoUrl,
      userId: linkedUserId,
      // KYC approuvé => l'artiste peut soumettre ses œuvres.
      // Les œuvres restent individuellement modérées avant affichage.
      published: true,
    },
  });

  // Update request status
  await db.artistRequest.update({
    where: { id },
    data: {
      status: "APPROVED",
      adminNote: adminNote ?? null,
      artistId: artist.id,
      userId: linkedUserId ?? request.userId,
    },
  });

  revalidatePath("/admin/demandes-artistes");
  revalidatePath("/admin/artistes");
  revalidatePath("/artistes");
  revalidatePath("/artiste/oeuvres");
}

/** Reject an artist request (admin) */
export async function rejectArtistRequest(id: string, adminNote: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("Non autorisé");
  }

  await db.artistRequest.update({
    where: { id },
    data: {
      status: "REJECTED",
      adminNote,
    },
  });

  revalidatePath("/admin/demandes-artistes");
}
