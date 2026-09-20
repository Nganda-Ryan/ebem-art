import Image from "next/image";
import Link from "next/link";

export type OverlayCardProps = {
  href: string;
  imageUrl: string | null;
  imageAlt: string;
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  meta?: string | null;
  footer?: string | null;
  emptyLabel?: string;
};

/**
 * Full-bleed media card with bottom gradient text — shared by /explorer and /artistes.
 */
export function OverlayCard({
  href,
  imageUrl,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  meta,
  footer,
  emptyLabel = "Pas d’image",
}: OverlayCardProps) {
  return (
    <Link
      href={href}
      className="group block aspect-3/4 w-full overflow-hidden rounded-xl-[22px] bg-[#0C0A08] outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-(--color-mboa-terra)"
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl-[22px]">
        {imageUrl ? (
          <div className="absolute inset-0 scale-[1.03] transition-transform duration-700 group-hover:scale-[1.06]">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              style={{ border: "none", outline: "none" }}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-(--color-mboa-bg-alt) text-sm text-(--color-mboa-muted)">
            {emptyLabel}
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(12,10,8,0.92) 0%, rgba(12,10,8,0.55) 38%, rgba(12,10,8,0.12) 68%, transparent 100%)",
          }}
          aria-hidden
        />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3.5 sm:gap-3 sm:p-4 md:p-5">
          <div>
            {eyebrow ? (
              <div className="font-mono text-[10px] tracking-widest text-white/70 uppercase">
                {eyebrow}
              </div>
            ) : null}
            <h3
              className={`font-serif text-base leading-tight text-white sm:text-lg md:text-xl ${eyebrow ? "mt-1.5" : ""}`}
            >
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-1 text-sm text-white/75">{subtitle}</p>
            ) : null}
            {meta ? (
              <p className="mt-0.5 font-mono text-xs text-white/55">{meta}</p>
            ) : null}
          </div>
          {footer ? (
            <div className="font-serif text-base text-white md:text-lg">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
