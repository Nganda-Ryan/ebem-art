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
