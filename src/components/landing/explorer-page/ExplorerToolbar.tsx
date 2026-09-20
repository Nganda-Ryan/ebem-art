"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { SearchIcon } from "@/components/ui/icons";
import {
  buildExplorerSearchParams,
  type ExplorerParams,
  type ExplorerSort,
} from "@/lib/explorer/params";
import type { ExplorerLabel } from "@/modules/explorer";

const SORT_OPTIONS: { value: ExplorerSort; label: string }[] = [
  { value: "name", label: "Titre A–Z" },
  { value: "recent", label: "Plus récentes" },
];

type ExplorerToolbarProps = {
  params: ExplorerParams;
  labels: ExplorerLabel[];
  total: number;
};

export function ExplorerToolbar({ params, labels, total }: ExplorerToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [draftQ, setDraftQ] = useState(params.q);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setDraftQ(params.q);
  }, [params.q]);

  const navigate = useCallback(
    (patch: Partial<ExplorerParams>) => {
      const refining =
        patch.q !== undefined ||
        patch.labels !== undefined ||
        patch.sort !== undefined;

      const next: ExplorerParams = {
        ...params,
        ...patch,
        page: patch.page !== undefined ? patch.page : refining ? 1 : params.page,
      };

      const qs = buildExplorerSearchParams(next);
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [params, pathname, router],
  );

  useEffect(() => {
    if (draftQ === params.q) return;
    const id = window.setTimeout(() => {
      navigate({ q: draftQ.trim() });
    }, 320);
    return () => window.clearTimeout(id);
  }, [draftQ, params.q, navigate]);

  const toggleLabel = (slug: string) => {
    const next = params.labels.includes(slug)
      ? params.labels.filter((l) => l !== slug)
      : [...params.labels, slug];
    navigate({ labels: next });
  };

  const clearAll = () => {
    setDraftQ("");
    navigate({ q: "", labels: [], page: 1 });
  };

  const hasActiveFilters = Boolean(params.q) || params.labels.length > 0;

  const selectedLabelMeta = params.labels.map(
    (slug) =>
      labels.find((l) => l.slug === slug) ?? {
        slug,
        name: slug,
        count: 0,
        id: slug,
      },
  );

  return (
    <div
      className="sticky top-16 z-30 -mx-6 mb-8 space-y-4 px-6 py-3 md:-mx-12 md:px-12"
      style={{
        background: COLORS.bg,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 transition-opacity"
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          opacity: isPending ? 0.72 : 1,
        }}
      >
        <SearchIcon size={18} className="shrink-0 text-(--color-mboa-muted)" />
        <input
          type="search"
          name="q"
          value={draftQ}
          onChange={(e) => setDraftQ(e.target.value)}
          placeholder="Rechercher une œuvre, un artiste, un médium…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-(--color-mboa-muted)"
          style={{ color: COLORS.ink, fontFamily: "var(--sans)" }}
          aria-label="Recherche"
          autoComplete="off"
        />
        {draftQ ? (
          <button
            type="button"
            onClick={() => {
              setDraftQ("");
              navigate({ q: "" });
            }}
            className="shrink-0 font-mono text-xs tracking-wider transition-opacity hover:opacity-70"
            style={{ color: COLORS.muted }}
            aria-label="Effacer la recherche"
          >
            EFFACER
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-2 font-mono text-xs tracking-wider md:hidden"
          style={{
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.ink,
          }}
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
        >
          LABELS
          {params.labels.length > 0 ? (
            <span
              className="inline-flex h-5 min-w-5 items-center justify-center px-1 text-[10px] text-white"
              style={{ background: COLORS.terra }}
            >
              {params.labels.length}
            </span>
          ) : null}
        </button>

        <div
          className={`hidden min-w-0 flex-1 transition-opacity md:block ${
            isPending ? "opacity-70" : "opacity-100"
          }`}
        >
          <LabelFacetRow
            labels={labels}
            selected={params.labels}
            onToggle={toggleLabel}
          />
        </div>

        <label className="ml-auto flex items-center gap-2 font-mono text-xs tracking-wider">
          <span style={{ color: COLORS.muted }}>TRIER</span>
          <select
            value={params.sort}
            onChange={(e) => navigate({ sort: e.target.value as ExplorerSort })}
            className="bg-transparent py-1 outline-none"
            style={{
              color: COLORS.ink,
              borderBottom: `1px solid ${COLORS.border}`,
            }}
            aria-label="Trier les résultats"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap items-center gap-2" aria-live="polite">
          <span
            className="font-mono text-[10px] tracking-widest"
            style={{ color: COLORS.muted }}
          >
            FILTRES ACTIFS
          </span>
          {params.q ? (
            <RemovableChip
              label={`« ${params.q} »`}
              onRemove={() => {
                setDraftQ("");
                navigate({ q: "" });
              }}
            />
          ) : null}
          {selectedLabelMeta.map((label) => (
            <RemovableChip
              key={label.slug}
              label={label.name}
              onRemove={() => toggleLabel(label.slug)}
            />
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="font-mono text-xs tracking-wider transition-opacity hover:opacity-70"
            style={{ color: COLORS.terra }}
          >
            TOUT EFFACER
          </button>
        </div>
      ) : null}

      <div
        className="font-mono text-xs tracking-wider"
        style={{ color: COLORS.muted }}
        aria-live="polite"
      >
        {total} {total === 1 ? "ŒUVRE" : "ŒUVRES"}
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fermer les filtres"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute inset-x-0 bottom-0 flex max-h-[80vh] flex-col"
            style={{
              background: COLORS.bg,
              borderTop: `1px solid ${COLORS.border}`,
            }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="font-serif text-xl" style={{ color: COLORS.ink }}>
                Labels
              </h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="font-mono text-xs tracking-wider"
                style={{ color: COLORS.muted }}
              >
                FERMER
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <LabelFacetRow
                labels={labels}
                selected={params.labels}
                onToggle={toggleLabel}
                wrap
              />
            </div>
            <div
              className="px-6 py-4"
              style={{
                borderTop: `1px solid ${COLORS.border}`,
                background: COLORS.bgCard,
              }}
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 font-mono text-xs tracking-wider text-white"
                style={{ background: COLORS.terra }}
              >
                VOIR {total} ŒUVRE{total === 1 ? "" : "S"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RemovableChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs transition-opacity hover:opacity-80"
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        color: COLORS.ink,
      }}
    >
      <span>{label}</span>
      <span aria-hidden style={{ color: COLORS.muted }}>
        ×
      </span>
      <span className="sr-only">Retirer {label}</span>
    </button>
  );
}

function LabelFacetRow({
  labels,
  selected,
  onToggle,
  wrap = false,
}: {
  labels: ExplorerLabel[];
  selected: string[];
  onToggle: (slug: string) => void;
  wrap?: boolean;
}) {
  if (labels.length === 0) {
    return (
      <p className="text-sm" style={{ color: COLORS.muted }}>
        Aucun label disponible pour cette recherche.
      </p>
    );
  }

  return (
    <div
      className={
        wrap
          ? "flex flex-wrap gap-2"
          : "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      }
      role="group"
      aria-label="Filtrer par labels"
    >
      {labels.map((label) => {
        const active = selected.includes(label.slug);
        const disabled = !active && label.count === 0;
        return (
          <button
            key={label.slug}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(label.slug)}
            aria-pressed={active}
            className="shrink-0 px-3 py-1.5 font-mono text-[11px] tracking-wider transition-all disabled:cursor-not-allowed disabled:opacity-35"
            style={{
              background: active ? COLORS.terra : COLORS.bgCard,
              color: active ? "#FFFFFF" : COLORS.inkMid,
              border: `1px solid ${active ? COLORS.terra : COLORS.border}`,
            }}
          >
            {label.name.toUpperCase()}
            <span className="ml-1.5 opacity-70">{label.count}</span>
          </button>
        );
      })}
    </div>
  );
}
