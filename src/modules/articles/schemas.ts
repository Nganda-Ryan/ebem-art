import { z } from "zod";

export const articleSchema = z.object({
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .regex(/^[a-z0-9-]+$/, "Slug: lettres minuscules, chiffres et tirets uniquement"),
  title: z.string().min(1, "Le titre est requis"),
  excerpt: z.string().min(1, "L'extrait est requis"),
  body: z.string().min(1, "Le corps de l'article est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  coverUrl: z.string().url().optional().nullable(),
  authorName: z.string().min(1, "L'auteur est requis"),
  published: z.coerce.boolean().optional().default(false),
});

export type ArticleInput = z.infer<typeof articleSchema>;
