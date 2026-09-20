import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { ArtistRequestInput } from "./schemas";

/** Shared create logic for API route + server action */
export async function createArtistRequestRecord(data: ArtistRequestInput) {
  const session = await getSession();
  const userId = session?.user?.id ?? null;

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

  const { birthDate, ...rest } = data;

  return db.artistRequest.create({
    data: {
      ...rest,
      birthDate: birthDate ? new Date(birthDate) : null,
      userId,
    },
  });
}
