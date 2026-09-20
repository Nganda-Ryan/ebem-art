"use client";

import Image from "next/image";
import type { Workshop } from "@/types/landing";
import { COLORS } from "@/constants/colors";
import { Button } from "@/components/ui/button";
import { formatPrice, pluralSuffix } from "@/lib/format/price";
import { workshopFillPercent } from "@/lib/landing/filters";

type WorkshopCardProps = {
  workshop: Workshop;
  revealDelay?: number;
};

export function WorkshopCard({ workshop, revealDelay = 1 }: WorkshopCardProps) {
  const pct = workshopFillPercent(workshop.spots, workshop.remaining);

  return (
    <div
      className={`reveal reveal-delay-${revealDelay} flex flex-col overflow-hidden`}
      style={{ border: `1px solid ${COLORS.border}`, background: COLORS.bgCard }}
    >
      <div className="relative overflow-hidden pb-[55%]">
        <Image
          src={workshop.img}
          alt={workshop.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span
            className="px-2 py-1 font-mono text-xs text-white"
            style={{ background: "rgba(26,20,16,0.75)" }}
          >
            {workshop.level}
          </span>
        </div>
        <div className="absolute right-3 bottom-3">
          <span
            className="px-2 py-1 font-mono text-xs text-white"
            style={{ background: COLORS.terra }}
          >
            {workshop.remaining} PLACE{pluralSuffix(workshop.remaining)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 text-base font-medium" style={{ color: COLORS.ink }}>
          {workshop.title}
        </h3>
        <div className="mb-3 font-mono text-xs" style={{ color: COLORS.muted }}>
          avec {workshop.artist}
        </div>
        <div className="mb-4 flex flex-wrap gap-4 text-xs" style={{ color: COLORS.muted }}>
          <span className="font-mono">📅 {workshop.date}</span>
          <span className="font-mono">⏱ {workshop.duration}</span>
          <span className="font-mono">📍 {workshop.location}</span>
        </div>

        <div className="mb-4">
          <div
            className="mb-2 flex justify-between font-mono text-xs"
            style={{ color: COLORS.muted }}
          >
            <span>
              {workshop.spots - workshop.remaining}/{workshop.spots} inscrits
            </span>
            <span>{pct}% rempli</span>
          </div>
          <div className="h-1 w-full rounded" style={{ background: COLORS.border }}>
            <div
              className="h-1 rounded transition-all"
              style={{ width: `${pct}%`, background: pct > 80 ? COLORS.terra : COLORS.gold }}
            />
          </div>
        </div>

        <div
          className="mt-auto flex items-center justify-between pt-4"
          style={{ borderTop: `1px solid ${COLORS.border}` }}
        >
          <div>
            <div className="font-serif text-lg" style={{ color: COLORS.gold }}>
              {formatPrice(workshop.price)}
            </div>
            <div className="font-mono text-xs" style={{ color: COLORS.muted }}>
              par personne
            </div>
          </div>
          <Button variant="terra" className="px-4 py-2 text-xs font-medium tracking-wider">
            S&apos;INSCRIRE
          </Button>
        </div>
      </div>
    </div>
  );
}
