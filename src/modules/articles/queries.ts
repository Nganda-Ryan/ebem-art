import { db } from "@/lib/db";
import { formatArticleDate, readingMinutes } from "./reading";

const publicSelect = {
  slug: true,
  title: true,
  excerpt: true,
  category: true,
  coverUrl: true,
  authorName: true,
  publishedAt: true,
  body: true,
  published: true,
} as const;

export type PublicArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverUrl: string | null;
  authorName: string;
  dateLabel: string;
  readingLabel: string;
};

export type PublicArticleDetail = PublicArticle & {
  body: string;
};

function toCard(article: {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverUrl: string | null;
  authorName: string;
  publishedAt: Date | null;
  body: string;
}): PublicArticle {
  const when = article.publishedAt ?? new Date();
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    coverUrl: article.coverUrl,
    authorName: article.authorName,
    dateLabel: formatArticleDate(when),
    readingLabel: `${readingMinutes(article.body)} min`,
  };
}

/** Published articles, newest first. */
export async function getPublishedArticles(options?: { take?: number }) {
  try {
    const rows = await db.article.findMany({
      where: { published: true },
      select: publicSelect,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      ...(options?.take ? { take: options.take } : {}),
    });
    return rows.map(toCard);
  } catch {
    return [];
  }
}

/** A single published article. Drafts and unknown slugs return null. */
export async function getPublishedArticleBySlug(
  slug: string
): Promise<PublicArticleDetail | null> {
  try {
    const article = await db.article.findUnique({
      where: { slug },
      select: publicSelect,
    });
    if (!article?.published) return null;
    return { ...toCard(article), body: article.body };
  } catch {
    return null;
  }
}

/** All articles (admin). */
export async function getAllArticles() {
  return db.article.findMany({
    orderBy: { createdAt: "desc" },
  });
}
