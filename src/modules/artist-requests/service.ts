import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ArtistInscriptionInput, ArtistRequestInput } from "./schemas";

/** Shared create logic for API route + server action */
export async function createArtistRequestRecord(
  data: ArtistRequestInput,
  options?: { userId?: string | null; headers?: Headers }
) {
  const userId = options?.userId ?? null;

  if (userId) {
    const existing = await db.artistRequest.findFirst({
      where: { userId, status: "PENDING" },
    });
    if (existing) {
      throw new Error("Vous avez déjà une demande en cours de traitement.");
    }
  }

  const byEmail = await db.artistRequest.findFirst({
    where: { email: data.email, status: "PENDING" },
  });
  if (byEmail) {
    throw new Error(
      "Une demande est déjà en cours pour cet email. Vérifiez votre boîte mail ou contactez-nous."
    );
  }

  const existingArtist = await db.artist.findFirst({
    where: { email: data.email },
  });
  if (existingArtist) {
    throw new Error(
      "Un profil artiste existe déjà pour cet email. Connectez-vous à votre espace."
    );
  }

  const { birthDate, bio, ...rest } = data;

  return db.artistRequest.create({
    data: {
      ...rest,
      bio: bio?.trim() ? bio : null,
      birthDate: birthDate ? new Date(birthDate) : null,
      userId,
    },
  });
}

/** Inscription publique : crée le compte + la demande KYC. */
export async function registerArtistWithRequest(
  data: ArtistInscriptionInput,
  headers?: Headers
) {
  const existingUser = await db.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });
  if (existingUser) {
    throw new Error(
      "Un compte existe déjà avec cet email. Connectez-vous, ou utilisez un autre email."
    );
  }

  const { password, ...requestData } = data;
  const displayName =
    requestData.artistName.trim() ||
    `${requestData.firstName} ${requestData.lastName}`.trim();

  let userId: string;

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: requestData.email,
        password,
        name: displayName,
      },
      headers,
    });
    userId = result.user.id;
  } catch (err) {
    if (err instanceof APIError) {
      throw new Error(
        err.message ||
          "Impossible de créer le compte. Cet email est peut-être déjà utilisé."
      );
    }
    throw err;
  }

  try {
    return await createArtistRequestRecord(requestData, { userId, headers });
  } catch (err) {
    // Compte créé mais demande échouée — message orienté recovery
    throw new Error(
      err instanceof Error
        ? `${err.message} Votre compte a été créé : connectez-vous pour réessayer.`
        : "Demande impossible. Votre compte a été créé : connectez-vous."
    );
  }
}
