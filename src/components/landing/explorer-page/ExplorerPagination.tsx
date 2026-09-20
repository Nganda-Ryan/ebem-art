import Link from "next/link";
import { COLORS } from "@/constants/colors";
import { explorerHref, type ExplorerParams } from "@/lib/explorer/params";

type ExplorerPaginationProps = {
  params: ExplorerParams;
  totalPages: number;
};

function pageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) out.push("…");
    out.push(sorted[i]!);
  }
  return out;
}

export function ExplorerPagination({
  params,
  totalPages,
}: ExplorerPaginationProps) {
  if (totalPages <= 1) return null;

  const current = Math.min(params.page, totalPages);
  const pages = pageWindow(current, totalPages);

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <Link
        href={explorerHref({ ...params, page: Math.max(1, current - 1) })}
        aria-disabled={current <= 1}
        className={`px-3 py-2 font-mono text-xs tracking-wider transition-all ${
          current <= 1 ? "pointer-events-none opacity-30" : "hover:opacity-80"
        }`}
        style={{
          color: COLORS.muted,
          border: `1px solid ${COLORS.border}`,
          background: COLORS.bgCard,
        }}
        scroll={false}
      >
        ← PRÉC
      </Link>

      {pages.map((p, idx) =>
        p === "…" ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-1 font-mono text-xs"
            style={{ color: COLORS.muted }}
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={explorerHref({ ...params, page: p })}
            aria-current={p === current ? "page" : undefined}
            className="flex h-9 w-9 items-center justify-center font-mono text-xs transition-all"
            style={{
              background: p === current ? COLORS.terra : COLORS.bgCard,
              color: p === current ? "#FFFFFF" : COLORS.muted,
              border: `1px solid ${p === current ? COLORS.terra : COLORS.border}`,
            }}
            scroll={false}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={explorerHref({ ...params, page: Math.min(totalPages, current + 1) })}
        aria-disabled={current >= totalPages}
        className={`px-3 py-2 font-mono text-xs tracking-wider transition-all ${
          current >= totalPages
            ? "pointer-events-none opacity-30"
            : "hover:opacity-80"
        }`}
        style={{
          color: COLORS.muted,
          border: `1px solid ${COLORS.border}`,
          background: COLORS.bgCard,
        }}
        scroll={false}
      >
        SUIV →
      </Link>
    </nav>
  );
}
