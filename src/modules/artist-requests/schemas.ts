import { z } from "zod";

export const artistRequestSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  birthDate: z.string().optional().nullable(),
  birthPlace: z.string().optional().nullable(),
  artistName: z.string().min(1, "Le nom d'artiste est requis"),
  culturalStatus: z.string().optional().nullable(),
  bio: z
    .string()
    .min(20, "Décrivez votre parcours artistique (20 caractères min.)")
    .max(4000),
  phone: z.string().min(1, "Le téléphone est requis"),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email("Email invalide"),
  city: z.string().min(1, "La ville est requise"),
  region: z.string().min(1, "La région est requise"),
  profilePhotoUrl: z.string().url("URL invalide").optional().nullable(),
});

export type ArtistRequestInput = z.infer<typeof artistRequestSchema>;
