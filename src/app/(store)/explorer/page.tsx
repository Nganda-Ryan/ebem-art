import { Suspense } from "react";
import { ExplorerPage } from "@/components/landing/explorer-page";
import {
  EXPLORER_PAGE_SIZE,
  parseExplorerParams,
  type RawSearchParams,
} from "@/lib/explorer/params";
import { withTimeout } from "@/lib/explorer/timeout";
import {
  getExplorerLabels,
  searchArtworks,
  type ExplorerLabel,
  type ExplorerArtworkResult,
  type Paginated,
} from "@/modules/explorer";

export const metadata = {
  title: "Explorer - Mboa Arts",
  description:
    "Explorez les œuvres Mboa Arts. Recherchez, filtrez par labels, paginez côté serveur.",
};

export const dynamic = "force-dynamic";

const DB_BUDGET_MS = 2500;

const emptyPage = <T,>(): Paginated<T> => ({
  items: [],
  total: 0,
  page: 1,
  pageSize: EXPLORER_PAGE_SIZE,
  totalPages: 1,
});

type PageProps = {
  searchParams: Promise<RawSearchParams>;
};

async function ExplorerContent({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const raw = await searchParams;
  const params = parseExplorerParams(raw);

  const [labels, artworks] = await Promise.all([
    withTimeout<ExplorerLabel[]>(
      getExplorerLabels({ q: params.q }),
      DB_BUDGET_MS,
      []
    ),
    withTimeout(
      searchArtworks({
        q: params.q,
        labels: params.labels,
        page: params.page,
        sort: params.sort,
      }),
      DB_BUDGET_MS,
      emptyPage<ExplorerArtworkResult>()
    ),
  ]);

  return (
    <ExplorerPage params={params} labels={labels} artworks={artworks} />
  );
}

function ExplorerFallback() {
  return (
    <section className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-black/5" />
        <div className="mt-8 h-12 w-full animate-pulse rounded-xl bg-black/5" />
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-4/5 animate-pulse rounded-xl bg-black/5"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ExplorerRoute({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<ExplorerFallback />}>
      <ExplorerContent searchParams={searchParams} />
    </Suspense>
  );
}
