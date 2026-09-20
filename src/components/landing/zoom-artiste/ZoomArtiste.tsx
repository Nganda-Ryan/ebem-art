"use client";

import { useState } from "react";
import Image from "next/image";
import { COLORS } from "@/constants/colors";
import { SECTION_LABELS } from "@/constants/landing";
import { MOCK_ARTISTS } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";

export function ZoomArtiste() {
  const ref = useReveal();
  const [current, setCurrent] = useState(0);
  const artist = MOCK_ARTISTS[current];
  const labels = SECTION_LABELS.zoomArtiste;

  return (
    <section
      id="artistes"
      ref={ref}
      className="py-10 md:py-14"
      style={{ background: COLORS.bg, borderTop: `1px solid ${COLORS.border}` }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="reveal mb-12 flex items-baseline justify-between">
          <div>
            <span className="font-mono text-xs tracking-widest" style={{ color: COLORS.gold }}>
              {labels.code}
            </span>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl" style={{ color: COLORS.ink }}>
              {labels.title}
            </h2>
          </div>
          <div className="hidden gap-2 md:flex">
            {MOCK_ARTISTS.map((_, index) => (
              <button
                key={MOCK_ARTISTS[index].id}
                type="button"
                onClick={() => setCurrent(index)}
                className="h-8 w-8 font-mono text-xs transition-all"
                style={{
                  background: current === index ? COLORS.terra : "transparent",
                  color: current === index ? "#fff" : COLORS.muted,
                  border: `1px solid ${current === index ? COLORS.terra : COLORS.border}`,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        <div
          className="reveal reveal-delay-1 grid gap-0 md:grid-cols-12"
          style={{ border: `1px solid ${COLORS.border}` }}
        >
          <div className="relative min-h-[400px] overflow-hidden md:col-span-4">
            <Image
              src={artist.img}
              alt={artist.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(247,243,238,0.5) 0%, transparent 50%)",
              }}
            />
            <div className="absolute top-4 left-4">
              <span
                className="px-2 py-1 font-mono text-xs tracking-widest text-white"
                style={{ background: COLORS.terra }}
              >
                {artist.discipline.toUpperCase()}
              </span>
            </div>
          </div>

          <div
            className="flex flex-col justify-between p-8 md:col-span-8 md:p-12"
            style={{ background: COLORS.bgCard }}
          >
            <div>
              <div className="mb-3 flex flex-wrap items-baseline gap-4">
                <h3 className="font-serif text-3xl md:text-4xl" style={{ color: COLORS.ink }}>
                  {artist.name}
                </h3>
                <span className="font-mono text-xs" style={{ color: COLORS.muted }}>
                  {artist.age} ans · {artist.city}, {artist.region}
                </span>
              </div>

              <blockquote
                className="my-6 border-l-2 pl-4 font-serif text-xl italic md:text-2xl"
                style={{
                  color: COLORS.gold,
                  borderColor: COLORS.terra,
                  lineHeight: 1.5,
                }}
              >
                &ldquo;{artist.quote}&rdquo;
              </blockquote>

              <p
                className="mb-6 text-sm leading-relaxed md:text-base"
                style={{ color: COLORS.muted }}
              >
                {artist.bio}
              </p>

              <div className="mb-8 flex flex-wrap gap-2">
                {artist.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 font-mono text-xs"
                    style={{ border: `1px solid ${COLORS.border}`, color: COLORS.inkMid }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="flex flex-wrap items-center justify-between gap-6 pt-6"
              style={{ borderTop: `1px solid ${COLORS.border}` }}
            >
              <div className="flex gap-8">
                {[
                  { v: artist.works, l: "Œuvres" },
                  { v: artist.sold, l: "Vendues" },
                  { v: artist.works - artist.sold, l: "Disponibles", accent: true },
                ].map((stat) => (
                  <div key={stat.l}>
                    <div
                      className="font-serif text-2xl"
                      style={{ color: stat.accent ? COLORS.terra : COLORS.ink }}
                    >
                      {stat.v}
                    </div>
                    <div className="mt-0.5 font-mono text-xs" style={{ color: COLORS.muted }}>
                      {stat.l}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="terra" className="px-6 py-3 text-sm font-medium tracking-wider">
                VOIR LE PORTFOLIO →
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2 md:hidden">
          {MOCK_ARTISTS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Artiste ${index + 1}`}
              onClick={() => setCurrent(index)}
              className="h-2 w-2 rounded-xl-full transition-all"
              style={{ background: current === index ? COLORS.terra : COLORS.border }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
