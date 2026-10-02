import Image from "next/image";
import Link from "next/link";
import { COLORS } from "@/constants/colors";
import { getPublishedArticles } from "@/modules/articles";

export const metadata = { title: "Actualités - Mboa Art" };
export const dynamic = "force-dynamic";

export default async function ActualitesPage() {
  const articles = await getPublishedArticles();

  return (
    <section className="mx-auto max-w-7xl px-6 pt-28 pb-16 md:px-12">
      <h1 className="font-serif text-4xl md:text-5xl" style={{ color: COLORS.ink }}>
        Actualités
      </h1>
      <p className="mt-2 text-sm" style={{ color: COLORS.muted }}>
        Les articles publiés de la galerie.
      </p>

      {articles.length === 0 ? (
        <div className="mt-16 py-8 text-center">
          <h2 className="font-serif text-2xl" style={{ color: COLORS.ink }}>
            Aucun article publié
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: COLORS.muted }}>
            Les actualités apparaîtront ici dès leur publication.
          </p>
        </div>
      ) : (
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link href={`/actualites/${article.slug}`} className="group block">
                <div className="relative aspect-4/3 overflow-hidden">
                  {article.coverUrl ? (
                    <Image
                      src={article.coverUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <span
                      className="absolute inset-0"
                      style={{ background: COLORS.border }}
                      aria-hidden
                    />
                  )}
                </div>
                <span
                  className="mt-4 block font-mono text-xs tracking-widest"
                  style={{ color: COLORS.terra }}
                >
                  {article.category}
                </span>
                <h2
                  className="mt-2 font-serif text-2xl leading-snug"
                  style={{ color: COLORS.ink }}
                >
                  {article.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm" style={{ color: COLORS.inkMid }}>
                  {article.excerpt}
                </p>
                <p className="mt-3 font-mono text-xs" style={{ color: COLORS.muted }}>
                  {article.authorName} · {article.dateLabel} · {article.readingLabel}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
