import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { getPublishedArticleBySlug } from "@/modules/articles";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  return {
    title: article ? `${article.title} - Mboa Art` : "Article introuvable",
  };
}

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 pt-28 pb-20 md:px-8">
      <Link
        href="/actualites"
        className="font-mono text-xs tracking-widest"
        style={{ color: COLORS.terra }}
      >
        ← Actualités
      </Link>

      <p className="mt-8 font-mono text-xs tracking-widest" style={{ color: COLORS.terra }}>
        {article.category}
      </p>
      <h1
        className="mt-3 font-serif leading-[1.1]"
        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: COLORS.ink }}
      >
        {article.title}
      </h1>
      <p className="mt-4 font-mono text-xs" style={{ color: COLORS.muted }}>
        {article.authorName} · {article.dateLabel} · {article.readingLabel} de lecture
      </p>

      {article.coverUrl && (
        <div className="relative mt-8 aspect-video overflow-hidden">
          <Image
            src={article.coverUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <p
        className="mt-8 text-lg"
        style={{ color: COLORS.inkMid, lineHeight: 1.7 }}
      >
        {article.excerpt}
      </p>
      <div
        className="mt-6 whitespace-pre-wrap text-base"
        style={{ color: COLORS.ink, lineHeight: 1.8 }}
      >
        {article.body}
      </div>
    </article>
  );
}
