import { getSession } from "@/lib/auth";
import { uploadImage } from "@/lib/storage";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 Mo

const ALLOWED_FOLDERS = new Set(["profile", "artworks"]);

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export const runtime = "nodejs";

/**
 * POST /api/upload
 * FormData: { file: File, folder?: "profile" | "artworks" }
 * Returns: { url: string }
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Only the public KYC photo can be uploaded without an account;
    // artwork photos require a logged-in artist.
    const rawFolder = (formData.get("folder") as string | null) ?? "artworks";
    const folder = ALLOWED_FOLDERS.has(rawFolder) ? rawFolder : "artworks";

    if (folder !== "profile") {
      const session = await getSession();
      if (!session) {
        return Response.json(
          { error: "Vous devez être connecté pour téléverser cette image." },
          { status: 401 }
        );
      }
    }

    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json(
        { error: "Aucun fichier reçu." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        {
          error:
            "Format non supporté. Utilisez une image JPEG, PNG, WebP, AVIF ou GIF.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return Response.json(
        { error: "Image trop lourde (8 Mo maximum)." },
        { status: 400 }
      );
    }

    if (!isCloudinaryConfigured()) {
      return Response.json(
        {
          error:
            "Service de stockage d'images non configuré. Ajoutez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans .env.",
        },
        { status: 503 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(buffer, `ebem-art/${folder}`);

    return Response.json({ url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Échec du téléversement.";
    return Response.json({ error: message }, { status: 500 });
  }
}
