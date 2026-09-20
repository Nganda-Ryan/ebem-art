import { ZodError } from "zod";
import { artistRequestSchema } from "@/modules/artist-requests/schemas";
import { createArtistRequestRecord } from "@/modules/artist-requests/service";

export const runtime = "nodejs";

/**
 * POST /api/artist-requests
 * Public KYC inscription — avoids Server Action ID skew across deploys.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = artistRequestSchema.parse(body);
    await createArtistRequestRecord(parsed);
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      const message =
        error.issues[0]?.message ?? "Données invalides. Vérifiez le formulaire.";
      return Response.json({ error: message }, { status: 400 });
    }

    const message =
      error instanceof Error
        ? error.message
        : "Une erreur est survenue. Veuillez réessayer.";

    const status =
      message.includes("déjà") || message.includes("en cours") ? 409 : 500;

    return Response.json({ error: message }, { status });
  }
}
