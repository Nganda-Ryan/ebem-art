import { MOCK_WORKS } from "@/data/mock";
import type {
  ExplorerArtworkResult,
  ExplorerLabel,
  Paginated,
} from "@/modules/explorer";
import type { ExplorerParams } from "@/lib/explorer/params";
import { EXPLORER_PAGE_SIZE } from "@/lib/explorer/params";

const FALLBACK_LABELS: ExplorerLabel[] = [
  { id: "peinture", slug: "peinture", name: "Peinture", count: 0 },
  { id: "sculpture", slug: "sculpture", name: "Sculpture", count: 0 },
  { id: "contemporain", slug: "contemporain", name: "Contemporain", count: 0 },
  { id: "abstrait", slug: "abstrait", name: "Abstrait", count: 0 },
  { id: "figuratif", slug: "figuratif", name: "Figuratif", count: 0 },
];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mockArtworks(): ExplorerArtworkResult[] {
  return MOCK_WORKS.map((work) => ({
    id: `mock-${work.id}`,
    slug: slugify(work.title),
    title: work.title,
    medium: work.medium,
    year: work.year,
    priceCents: work.price,
    currency: "XAF",
    coverUrl: work.img,
    labels: [
      { slug: slugify(work.discipline), name: work.discipline },
      { slug: slugify(work.medium), name: work.medium },
    ],
    artist: {
      id: `mock-artist-${work.artist}`,
      slug: slugify(work.artist),
      name: work.artist,
    },
  }));
}

function paginate<T>(items: T[], page: number, pageSize: number): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  return {
    items: items.slice((safePage - 1) * pageSize, safePage * pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

function matchesQuery(haystack: string[], q: string) {
  if (!q) return true;
  const needle = q.toLowerCase();
  return haystack.some((h) => h.toLowerCase().includes(needle));
}

export function getFallbackExplorerData(params: ExplorerParams): {
  labels: ExplorerLabel[];
  artworks: Paginated<ExplorerArtworkResult>;
} {
  const all = mockArtworks();

  const filtered = all.filter((work) => {
    const labelOk =
      params.labels.length === 0 ||
      work.labels.some((l) => params.labels.includes(l.slug));
    const qOk = matchesQuery(
      [
        work.title,
        work.medium ?? "",
        work.artist.name,
        ...work.labels.map((l) => l.name),
      ],
      params.q,
    );
    return labelOk && qOk;
  });

  const facetBase = all.filter((work) =>
    matchesQuery(
      [
        work.title,
        work.medium ?? "",
        work.artist.name,
        ...work.labels.map((l) => l.name),
      ],
      params.q,
    ),
  );

  const sorted = [...filtered].sort((a, b) => {
    if (params.sort === "recent") return (b.year ?? 0) - (a.year ?? 0);
    return a.title.localeCompare(b.title, "fr");
  });

  const labels = FALLBACK_LABELS.map((label) => ({
    ...label,
    count: facetBase.filter((w) =>
      w.labels.some((l) => l.slug === label.slug),
    ).length,
  })).filter((l) => l.count > 0 || params.labels.includes(l.slug));

  return {
    labels,
    artworks: paginate(sorted, params.page, EXPLORER_PAGE_SIZE),
  };
}
