/** Explorer URL state - shareable, bookmarkable, server-readable.
 * Pattern: Next.js Learn “Adding Search and Pagination” + Baymard URL-preserved filters.
 */

export const EXPLORER_PAGE_SIZE = 12;

export const EXPLORER_SORTS = ["name", "recent"] as const;
export type ExplorerSort = (typeof EXPLORER_SORTS)[number];

export type ExplorerParams = {
  q: string;
  labels: string[];
  page: number;
  sort: ExplorerSort;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function parseExplorerParams(raw: RawSearchParams): ExplorerParams {
  const sortRaw = first(raw.sort);
  const sort: ExplorerSort = EXPLORER_SORTS.includes(sortRaw as ExplorerSort)
    ? (sortRaw as ExplorerSort)
    : "name";

  const labelsRaw = first(raw.labels);
  const labels = labelsRaw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const page = Math.max(1, Number.parseInt(first(raw.page) || "1", 10) || 1);
  const q = first(raw.q).trim();

  return { q, labels, page, sort };
}

/** Build query string from explorer state. Omits defaults for clean URLs. */
export function buildExplorerSearchParams(
  params: Partial<ExplorerParams>,
  base?: URLSearchParams | ExplorerParams,
): string {
  const current: ExplorerParams =
    base instanceof URLSearchParams
      ? parseExplorerParams(Object.fromEntries(base.entries()))
      : base
        ? { ...base }
        : { q: "", labels: [], page: 1, sort: "name" };

  const next: ExplorerParams = {
    q: params.q !== undefined ? params.q : current.q,
    labels: params.labels !== undefined ? params.labels : current.labels,
    page: params.page !== undefined ? params.page : current.page,
    sort: params.sort !== undefined ? params.sort : current.sort,
  };

  const sp = new URLSearchParams();

  if (next.q) sp.set("q", next.q);
  if (next.labels.length) sp.set("labels", next.labels.join(","));
  if (next.page > 1) sp.set("page", String(next.page));
  if (next.sort !== "name") sp.set("sort", next.sort);

  return sp.toString();
}

export function explorerHref(
  params: Partial<ExplorerParams>,
  base?: ExplorerParams,
): string {
  const qs = buildExplorerSearchParams(params, base);
  return qs ? `/explorer?${qs}` : "/explorer";
}
