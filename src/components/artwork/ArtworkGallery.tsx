"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  title: string;
};

export function ArtworkGallery({ images, title }: Props) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, goPrev, goNext]);

  if (count === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
        Pas d&apos;image
      </div>
    );
  }

  const current = images[index]!;

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current}
          alt={`${title} — image ${index + 1} sur ${count}`}
          className="aspect-4/5 w-full object-cover sm:aspect-3/4"
        />

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Image précédente"
              className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Image suivante"
              className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <p className="absolute right-3 bottom-3 rounded-full bg-black/55 px-2.5 py-1 text-xs text-white">
              {index + 1} / {count}
            </p>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Voir l'image ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`overflow-hidden rounded object-cover ring-offset-2 transition ${
                i === index
                  ? "ring-2 ring-gray-900"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-20 w-full object-cover sm:h-24"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
