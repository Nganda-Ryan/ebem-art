"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/ui/icons";
import { COLORS } from "@/constants/colors";
import type { SearchResults } from "@/modules/search";

type Props = {
  iconColor: string;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

const EMPTY: SearchResults = { artworks: [], artists: [] };

export function GlobalSearch({
  iconColor,
  className = "p-2.5",
  onOpenChange,
}: Props) {
  const router = useRouter();
  const dialogId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults(EMPTY);
    setError(null);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const openSearch = useCallback(() => {
    setOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch]);

  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2) {
      setResults(EMPTY);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("fail");
        const data = (await res.json()) as SearchResults;
        setResults(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Impossible de rechercher pour le moment.");
        setResults(EMPTY);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, open]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const first =
      results.artworks[0] ?? results.artists[0] ?? null;
    if (!first) return;
    close();
    router.push(
      first.type === "artwork"
        ? `/oeuvres/${first.slug}`
        : `/artistes/${first.slug}`
    );
  }

  const hasHits =
    results.artworks.length > 0 || results.artists.length > 0;
  const showEmpty =
    query.trim().length >= 2 && !loading && !error && !hasHits;

  return (
    <>
      <button
        type="button"
        aria-label="Rechercher artistes et œuvres"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        className={`transition-opacity hover:opacity-70 ${className}`}
        style={{ color: iconColor }}
        onClick={openSearch}
      >
        <SearchIcon />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[15vh]"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Fermer la recherche"
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={close}
          />

          <div
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-label="Recherche globale"
            className="relative z-10 flex max-h-[min(70vh,560px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}` }}
          >
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 border-b px-4 py-3"
              style={{ borderColor: COLORS.border }}
            >
              <span style={{ color: COLORS.muted }} aria-hidden>
                <SearchIcon size={18} />
              </span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une œuvre ou un artiste…"
                className="min-w-0 flex-1 bg-transparent text-base outline-none"
                style={{
                  color: COLORS.ink,
                  fontFamily: "var(--sans)",
                }}
                autoComplete="off"
                spellCheck={false}
              />
              <kbd
                className="hidden rounded px-1.5 py-0.5 font-mono text-[10px] sm:inline"
                style={{
                  color: COLORS.muted,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                ESC
              </kbd>
            </form>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
              {query.trim().length < 2 ? (
                <p
                  className="px-3 py-6 text-center text-sm"
                  style={{ color: COLORS.muted, fontFamily: "var(--sans)" }}
                >
                  Tapez au moins 2 caractères pour chercher dans le catalogue.
                </p>
              ) : null}

              {loading ? (
                <p
                  className="px-3 py-6 text-center text-sm"
                  style={{ color: COLORS.muted, fontFamily: "var(--sans)" }}
                >
                  Recherche…
                </p>
              ) : null}

              {error ? (
                <p
                  className="px-3 py-6 text-center text-sm"
                  style={{ color: COLORS.terra, fontFamily: "var(--sans)" }}
                >
                  {error}
                </p>
              ) : null}

              {showEmpty ? (
                <p
                  className="px-3 py-6 text-center text-sm"
                  style={{ color: COLORS.muted, fontFamily: "var(--sans)" }}
                >
                  Aucun résultat pour « {query.trim()} ».
                </p>
              ) : null}

              {results.artworks.length > 0 ? (
                <section className="mb-2">
                  <h3
                    className="px-3 py-2 font-mono text-[10px] tracking-widest uppercase"
                    style={{ color: COLORS.muted }}
                  >
                    Œuvres
                  </h3>
                  <ul>
                    {results.artworks.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/oeuvres/${item.slug}`}
                          onClick={close}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-black/5"
                        >
                          <ResultThumb src={item.imageUrl} alt="" />
                          <div className="min-w-0 flex-1">
                            <p
                              className="truncate text-sm font-medium"
                              style={{ color: COLORS.ink, fontFamily: "var(--serif)" }}
                            >
                              {item.title}
                            </p>
                            <p
                              className="truncate text-xs"
                              style={{ color: COLORS.muted, fontFamily: "var(--sans)" }}
                            >
                              {item.artistName} ·{" "}
                              {item.priceCents.toLocaleString()} {item.currency}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {results.artists.length > 0 ? (
                <section>
                  <h3
                    className="px-3 py-2 font-mono text-[10px] tracking-widest uppercase"
                    style={{ color: COLORS.muted }}
                  >
                    Artistes
                  </h3>
                  <ul>
                    {results.artists.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/artistes/${item.slug}`}
                          onClick={close}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-black/5"
                        >
                          <ResultThumb src={item.imageUrl} alt="" round />
                          <div className="min-w-0 flex-1">
                            <p
                              className="truncate text-sm font-medium"
                              style={{ color: COLORS.ink, fontFamily: "var(--serif)" }}
                            >
                              {item.name}
                            </p>
                            <p
                              className="truncate text-xs"
                              style={{ color: COLORS.muted, fontFamily: "var(--sans)" }}
                            >
                              {[item.discipline, item.city].filter(Boolean).join(" · ") ||
                                "Artiste"}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function ResultThumb({
  src,
  alt,
  round = false,
}: {
  src: string | null;
  alt: string;
  round?: boolean;
}) {
  return (
    <div
      className={`relative h-11 w-11 shrink-0 overflow-hidden bg-black/5 ${
        round ? "rounded-full" : "rounded-lg"
      }`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : null}
    </div>
  );
}
