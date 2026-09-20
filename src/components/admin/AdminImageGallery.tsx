import Image from "next/image";

export type GalleryImage = {
  url: string;
  label: string;
};

type AdminImageGalleryProps = {
  images: GalleryImage[];
  emptyLabel?: string;
};

/** Deduplicate by URL while preserving order */
export function collectArtworkImages(input: {
  frontImageUrl?: string | null;
  detailImageUrls?: string[];
  contextImageUrl?: string | null;
  imageUrls?: string[];
}): GalleryImage[] {
  const tagged: GalleryImage[] = [];

  if (input.frontImageUrl) {
    tagged.push({ url: input.frontImageUrl, label: "Vue de face" });
  }
  for (const [i, url] of (input.detailImageUrls ?? []).entries()) {
    if (url) tagged.push({ url, label: `Détail ${i + 1}` });
  }
  if (input.contextImageUrl) {
    tagged.push({ url: input.contextImageUrl, label: "Mise en situation" });
  }

  const seen = new Set(tagged.map((t) => t.url));
  for (const [i, url] of (input.imageUrls ?? []).entries()) {
    if (url && !seen.has(url)) {
      tagged.push({ url, label: `Image ${i + 1}` });
      seen.add(url);
    }
  }

  return tagged;
}

export function AdminImageGallery({
  images,
  emptyLabel = "Aucune image",
}: AdminImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
        {emptyLabel}
      </div>
    );
  }

  const [hero, ...rest] = images;

  return (
    <div className="space-y-3">
      <figure className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={hero.url}
            alt={hero.label}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 55vw"
            unoptimized
            priority
          />
        </div>
        <figcaption className="border-t border-gray-200 px-3 py-2 text-xs text-gray-500">
          {hero.label}
        </figcaption>
      </figure>

      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {rest.map((img) => (
            <figure
              key={img.url + img.label}
              className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={img.url}
                  alt={img.label}
                  fill
                  className="object-cover"
                  sizes="200px"
                  unoptimized
                />
              </div>
              <figcaption className="border-t border-gray-200 px-2 py-1.5 text-[11px] text-gray-500">
                {img.label}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
