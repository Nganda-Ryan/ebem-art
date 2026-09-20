import { z } from "zod";

export const ARTWORK_STATUSES = [
  "AVAILABLE",
  "RESERVED",
  "SOLD",
  "EXHIBITING",
] as const;

export const artworkSchema = z.object({
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .regex(/^[a-z0-9-]+$/, "Slug: lettres minuscules, chiffres et tirets uniquement"),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  year: z.coerce.number().int().positive().optional().nullable(),
  priceCents: z.coerce.number().int().positive("Le prix doit être positif"),
  currency: z.string().default("XAF"),
  imageUrls: z.array(z.string().url()).default([]),
  artistId: z.string().min(1, "L'artiste est requis"),
  labelIds: z.array(z.string()).default([]),
  status: z.enum(ARTWORK_STATUSES).optional().default("AVAILABLE"),
  published: z.coerce.boolean().optional().default(false),
});

export type ArtworkInput = z.infer<typeof artworkSchema>;
