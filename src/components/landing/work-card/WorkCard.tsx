"use client";

import Image from "next/image";
import type { Artwork } from "@/types/landing";
import { COLORS } from "@/constants/colors";
import { FlipCard } from "@/components/ui/flip-card";
import { formatPrice } from "@/lib/format/price";

type WorkCardProps = {
  work: Artwork;
};

export function WorkCard({ work }: WorkCardProps) {
  return (
    <div className="aspect-3/4 w-full bg-transparent">
      <FlipCard
        front={
          <div className="relative h-full w-full">
            {/* Overscan wrapper - Image fill must stay at 100%, so we enlarge the parent. */}
            <div className="absolute -inset-[3px]">
              <Image
                src={work.img}
                alt={work.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(12,10,8,0.92) 0%, rgba(12,10,8,0.55) 38%, rgba(12,10,8,0.12) 68%, transparent 100%)",
              }}
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 md:p-5">
              <div>
                <div className="font-mono text-[10px] tracking-widest text-white/70 uppercase">
                  {work.discipline}
                </div>
                <h3 className="mt-1.5 font-serif text-lg leading-tight text-white md:text-xl">
                  {work.title}
                </h3>
                <p className="mt-1 text-sm text-white/75">{work.artist}</p>
                <p className="mt-0.5 font-mono text-xs text-white/55">
                  {work.year} · {work.medium}
                </p>
              </div>
              <div className="font-serif text-base text-white md:text-lg">
                {formatPrice(work.price)}
              </div>
            </div>
          </div>
        }
        back={
          <div className="flex h-full flex-col justify-between p-5 md:p-6">
            <div>
              <div
                className="font-mono text-[10px] tracking-widest uppercase"
                style={{ color: COLORS.terra }}
              >
                {work.discipline}
              </div>
              <h3
                className="mt-3 font-serif text-xl leading-tight md:text-2xl"
                style={{ color: "#f5f5f5" }}
              >
                {work.title}
              </h3>
              <p className="mt-2 text-sm text-white/70">
                {work.artist} · {work.year}
              </p>
              <p className="mt-1 font-mono text-xs text-white/50">{work.medium}</p>
            </div>
            <div>
              <div className="mb-4 font-serif text-lg text-white">
                {formatPrice(work.price)}
              </div>
              <button
                type="button"
                className="w-full px-3 py-2.5 font-mono text-xs tracking-wider text-white transition-opacity hover:opacity-90"
                style={{ background: COLORS.terra }}
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
                onPointerUp={(event) => event.stopPropagation()}
              >
                ACQUÉRIR
              </button>
            </div>
          </div>
        }
        axis="y"
        flipOnClick
        draggable
        dragDistance={0}
        tilt
        tiltMax={12}
        glare
        glareOpacity={0.22}
        hoverScale={1.03}
        perspective={1100}
        stiffness={170}
        damping={20}
        width="100%"
        height="100%"
        radius={22}
        background="#0C0A08"
        color="#f5f5f5"
        shadow
        shadowColor="#000000"
        shadowOpacity={0.45}
      />
    </div>
  );
}
