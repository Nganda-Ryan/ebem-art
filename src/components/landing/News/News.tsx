"use client";

import Image from "next/image";
import Link from "next/link";
import { COLORS } from "@/constants/colors";
import { SECTION_LABELS } from "@/constants/landing";
import { useReveal } from "@/hooks/use-reveal";
import type { PublicArticle } from "@/modules/articles";

function Cover({
  src,
  alt,
  sizes,
  className,
}: {
  src: string | null;
  alt: string;
  sizes: string;
  className?: string;
}) {
  if (!src) {
    return (
      <span
        className={`absolute inset-0 ${className ?? ""}`}
        style={{ background: COLORS.border }}
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
    />
  );
}

/**
 * News - lead story + related cluster (editorial homepage pattern).
 * Renders nothing when there is no published article.
 */
export function News({ articles }: { articles: PublicArticle[] }) {
  const ref = useReveal();
  const labels = SECTION_LABELS.news;
  const [featured, ...related] = articles;
  const secondary = related.slice(0, 3);

  if (!featured) return null;

  const href = `/actualites/${featured.slug}`;

  return (
    <section
      id="news"
      ref={ref}
      className="py-10 md:py-14"
      style={{ borderTop: `1px solid ${COLORS.border}`, background: COLORS.bgAlt }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="reveal mb-12 flex items-baseline justify-between gap-4">
          <div>
            <span
              className="font-mono text-xs tracking-widest"
              style={{ color: COLORS.terra }}
            >
              {featured.dateLabel}
            </span>
            <h2
              className="mt-2 font-serif text-4xl md:text-5xl"
              style={{ color: COLORS.ink }}
            >
              {labels.title}
            </h2>
          </div>
          <Link
            href="/actualites"
            className="hidden font-mono text-xs tracking-wider md:block"
            style={{ color: COLORS.muted }}
          >
            {labels.subtitle}
          </Link>
        </div>

        <div className="reveal reveal-delay-1 flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10 xl:gap-12">
          <Link
            href={href}
            className="group relative aspect-square w-full shrink-0 overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 lg:w-[min(48%,520px)]"
            style={{ outlineColor: COLORS.terra }}
            aria-label={`${featured.title} - ${labels.readLabel}`}
          >
            <Cover
              src={featured.coverUrl}
              alt={featured.title}
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(to top, rgba(26,20,16,0.35) 0%, transparent 45%)",
              }}
              aria-hidden
            />
          </Link>

          <div className="flex min-h-0 flex-1 flex-col justify-between gap-10 lg:gap-8">
            <div className="max-w-xl">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span
                  className="font-mono text-xs tracking-widest text-white"
                  style={{ background: COLORS.terra, padding: "0.35rem 0.75rem" }}
                >
                  {featured.category}
                </span>
                <span className="font-mono text-xs" style={{ color: COLORS.muted }}>
                  {featured.readingLabel} de lecture
                </span>
              </div>

              <h3
                className="font-serif leading-[1.12]"
                style={{
                  fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)",
                  color: COLORS.ink,
                }}
              >
                {featured.title}
              </h3>

              <p
                className="mt-5 text-base md:text-lg"
                style={{ color: COLORS.inkMid, lineHeight: 1.75, maxWidth: "38ch" }}
              >
                {featured.excerpt}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden">
                    <Cover
                      src={featured.coverUrl}
                      alt=""
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: COLORS.ink }}>
                      {featured.authorName}
                    </div>
                    <div className="font-mono text-xs" style={{ color: COLORS.muted }}>
                      {labels.artistLabel}
                    </div>
                  </div>
                </div>

                <Link
                  href={href}
                  className="group/cta inline-flex items-center gap-2 border-b pb-1 text-sm font-medium tracking-wider transition-opacity hover:opacity-70"
                  style={{ color: COLORS.terra, borderColor: COLORS.terra }}
                >
                  {labels.readLabel.toUpperCase()}
                  <span
                    className="transition-transform duration-300 group-hover/cta:translate-x-1"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>

            {secondary.length > 0 && (
              <div>
                <p
                  className="mb-4 font-mono text-xs tracking-widest"
                  style={{ color: COLORS.muted }}
                >
                  {labels.relatedLabel}
                </p>

                <ul className="grid grid-cols-3 gap-3 sm:gap-4" role="list">
                  {secondary.map((story) => (
                    <li key={story.slug}>
                      <Link
                        href={`/actualites/${story.slug}`}
                        className="group/thumb block focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{ outlineColor: COLORS.terra }}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <Cover
                            src={story.coverUrl}
                            alt={story.title}
                            sizes="(max-width: 1024px) 30vw, 160px"
                            className="object-cover transition-transform duration-500 ease-out group-hover/thumb:scale-[1.05]"
                          />
                        </div>
                        <span
                          className="mt-2.5 block font-mono text-[10px] tracking-wider sm:text-xs"
                          style={{ color: COLORS.terra }}
                        >
                          {story.category}
                        </span>
                        <span
                          className="mt-1 block line-clamp-2 text-xs leading-snug sm:text-sm"
                          style={{ color: COLORS.ink }}
                        >
                          {story.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
