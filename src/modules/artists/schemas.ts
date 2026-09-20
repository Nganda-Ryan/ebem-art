import { z } from "zod";

export const artistSchema = z.object({
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .regex(/^[a-z0-9-]+$/, "Slug: lettres minuscules, chiffres et tirets uniquement"),
  name: z.string().min(1, "Le nom est requis"),
  bio: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  discipline: z.string().optional().nullable(),
  portraitUrl: z.string().url("URL invalide").optional().nullable(),
  published: z.coerce.boolean().default(false),
  labelIds: z.array(z.string()).default([]),
});

export type ArtistInput = z.infer<typeof artistSchema>;

/** Profil artiste — à compléter après approbation pour pouvoir publier. */
export const artistProfileSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  artistName: z.string().min(1, "Le nom d'artiste est requis"),
  birthDate: z.string().optional().nullable(),
  birthPlace: z.string().optional().nullable(),
  culturalStatus: z.string().optional().nullable(),
  bio: z
    .string()
    .min(20, "Décrivez votre parcours artistique (20 caractères min.)")
    .max(4000),
  phone: z.string().min(1, "Le téléphone est requis"),
  whatsapp: z.string().optional().nullable(),
  city: z.string().min(1, "La ville est requise"),
  region: z.string().min(1, "La région est requise"),
  discipline: z.string().optional().nullable(),
  profilePhotoUrl: z
    .string()
    .url("Ajoutez une photo de profil")
    .min(1, "Ajoutez une photo de profil"),
});

export type ArtistProfileInput = z.infer<typeof artistProfileSchema>;

export type ArtistProfileFields = {
  firstName?: string | null;
  lastName?: string | null;
  artistName?: string | null;
  bio?: string | null;
  phone?: string | null;
  city?: string | null;
  region?: string | null;
  profilePhotoUrl?: string | null;
};

/** Profil suffisamment complet pour publier le compte et soumettre des œuvres. */
export function isArtistProfileComplete(artist: ArtistProfileFields): boolean {
  return Boolean(
    artist.firstName?.trim() &&
      artist.lastName?.trim() &&
      artist.artistName?.trim() &&
      artist.bio &&
      artist.bio.trim().length >= 20 &&
      artist.phone?.trim() &&
      artist.city?.trim() &&
      artist.region?.trim() &&
      artist.profilePhotoUrl?.trim()
  );
}
