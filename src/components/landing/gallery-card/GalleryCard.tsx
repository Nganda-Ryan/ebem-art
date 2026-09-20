"use client";

import Image from "next/image";
import type { GalleryItem } from "@/types/landing";
import { COLORS } from "@/constants/colors";
import { formatPrice } from "@/lib/format/price";

type GalleryCardProps = {
  item: GalleryItem;
};

export function GalleryCard({ item }: GalleryCardProps) {
  return (
    <div
      className="masonry-item hover-reveal group relative cursor-pointer overflow-hidden"
      style={{ border: `1px solid ${COLORS.border}` }}
    >
      <Image
        src={item.img}
        alt={item.title}
        width={400}
        height={500}
        className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
      <div
        className="overlay absolute inset-0 flex flex-col justify-end p-4"
        style={{
          background: "linear-gradient(to top, rgba(26,20,16,0.9) 0%, transparent 50%)",
        }}
      >
        <div className="mb-0.5 text-sm font-medium text-white">{item.title}</div>
        <div className="mb-2 font-mono text-xs text-white opacity-70">{item.artist}</div>
        <div className="flex items-center justify-between">
          <span className="font-serif text-white">{formatPrice(item.price)}</span>
          <button
            type="button"
            className="px-2 py-1 font-mono text-xs text-white"
            style={{ background: COLORS.terra }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
