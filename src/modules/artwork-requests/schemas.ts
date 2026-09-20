import { z } from "zod";

export const artworkRequestSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  titleTranslation: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  technique: z.string().optional().nullable(),
  year: z.coerce.number().int().positive().optional().nullable(),
  priceCents: z.coerce.number().int().positive("Le prix doit être positif"),
  artistPriceCents: z.coerce.number().int().positive().optional().nullable(),
  currency: z.string().default("XAF"),
  frontImageUrl: z.string().url("La vue de face est requise"),
  detailImageUrls: z.array(z.string().url()).default([]),
  contextImageUrl: z.string().url().optional().nullable(),
  workStatus: z
    .enum(["AVAILABLE", "RESERVED", "SOLD", "EXHIBITING"])
    .default("AVAILABLE"),
  heightCm: z.coerce.number().positive().optional().nullable(),
  widthCm: z.coerce.number().positive().optional().nullable(),
  depthCm: z.coerce.number().positive().optional().nullable(),
  weightKg: z.coerce.number().positive().optional().nullable(),
  framed: z.boolean().optional().default(false),
  packaging: z
    .enum(["ROULEE", "CHASSIS", "CAISSE_BOIS"])
    .optional()
    .nullable(),
  location: z.string().optional().nullable(),
  artistId: z.string().min(1, "L'artiste est requis"),
});

export type ArtworkRequestInput = z.infer<typeof artworkRequestSchema>;
