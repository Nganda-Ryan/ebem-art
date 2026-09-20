import { z } from "zod";

/** Demande d'inscription artiste — champs simples pour créer le compte. */
export const artistRequestSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  artistName: z.string().min(1, "Le nom d'artiste est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Le téléphone est requis"),
  city: z.string().min(1, "La ville est requise"),
  region: z.string().min(1, "La région est requise"),
  // Conservés pour compat / admin ; remplis plus tard dans le profil
  birthDate: z.string().optional().nullable(),
  birthPlace: z.string().optional().nullable(),
  culturalStatus: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  profilePhotoUrl: z.string().url("URL invalide").optional().nullable(),
});

export const artistInscriptionSchema = artistRequestSchema.extend({
  password: z
    .string()
    .min(5, "Le mot de passe doit contenir au moins 5 caractères"),
});

export type ArtistRequestInput = z.infer<typeof artistRequestSchema>;
export type ArtistInscriptionInput = z.infer<typeof artistInscriptionSchema>;
