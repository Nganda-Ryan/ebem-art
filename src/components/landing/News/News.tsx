"use client";

import Image from "next/image";
import { COLORS } from "@/constants/colors";
import { SECTION_LABELS } from "@/constants/landing";
import { MOCK_STORIES } from "@/data/mock";
import { useReveal } from "@/hooks/use-reveal";

/**
 * News - lead story + related cluster (editorial homepage pattern).
 * Same layout previously used by Thème du Jour.
 */
export function News() {
  const ref = useReveal();
  const labels = SECTION_LABELS.news;
  const [featured, ...related] = MOCK_STORIES;
  const secondary = related.slice(0, 3);

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
              {labels.date}
            </span>
            <h2
              className="mt-2 font-serif text-4xl md:text-5xl"
              style={{ color: COLORS.ink }}
            >
              {labels.title}
            </h2>
          </div>
          <span
            className="hidden font-mono text-xs md:block"
            style={{ color: COLORS.muted }}
          >
            {labels.subtitle}
          </span>
        </div>

        <div className="reveal reveal-delay-1 flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10 xl:gap-12">
          <a
            href="#news"
            className="group relative aspect-square w-full shrink-0 overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 lg:w-[min(48%,520px)]"
            style={{ outlineColor: COLORS.terra }}
            aria-label={`${featured.headline} - ${labels.readLabel}`}
          >
            <Image
              src={featured.img}
              alt={featured.headline}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 520px"
            />
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(to top, rgba(26,20,16,0.35) 0%, transparent 45%)",
              }}
              aria-hidden
            />
          </a>

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
                  {featured.duration} de lecture
                </span>
              </div>

              <h3
                className="font-serif leading-[1.12]"
                style={{
                  fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)",
                  color: COLORS.ink,
                }}
              >
                {featured.headline}
              </h3>

              <p
                className="mt-5 text-base md:text-lg"
                style={{ color: COLORS.inkMid, lineHeight: 1.75, maxWidth: "38ch" }}
              >
                {featured.sub}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden">
                    <Image
                      src={featured.img}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                      aria-hidden
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: COLORS.ink }}>
                      {featured.artist}
                    </div>
                    <div className="font-mono text-xs" style={{ color: COLORS.muted }}>
                      {labels.artistLabel}
                    </div>
                  </div>
                </div>

                <a
                  href="#news"
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
                </a>
              </div>
            </div>

            <div>
              <p
                className="mb-4 font-mono text-xs tracking-widest"
                style={{ color: COLORS.muted }}
              >
                {labels.relatedLabel}
              </p>

              <ul className="grid grid-cols-3 gap-3 sm:gap-4" role="list">
                {secondary.map((story) => (
                  <li key={story.headline}>
                    <a
                      href="#news"
                      className="group/thumb block focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ outlineColor: COLORS.terra }}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={story.img}
                          alt={story.headline}
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover/thumb:scale-[1.05]"
                          sizes="(max-width: 1024px) 30vw, 160px"
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
                        {story.headline}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
