import { COLORS } from "@/constants/colors";
import { SECTION_LABELS } from "@/constants/landing";
import { explorerHref, type ExplorerParams } from "@/lib/explorer/params";
import type {
  ExplorerArtworkResult,
  ExplorerLabel,
  Paginated,
} from "@/modules/explorer";
import { ExplorerToolbar } from "./ExplorerToolbar";
import { ExplorerResults } from "./ExplorerResults";
import { ExplorerPagination } from "./ExplorerPagination";

export type ExplorerPageProps = {
  params: ExplorerParams;
  labels: ExplorerLabel[];
  artworks: Paginated<ExplorerArtworkResult>;
};

export function ExplorerPage({ params, labels, artworks }: ExplorerPageProps) {
  const clearHref = explorerHref({ q: "", labels: [], page: 1 });

  return (
    <section
      className="min-h-screen pt-20 pb-20"
      style={{ background: COLORS.bg }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <header className="mb-2">
          <h1
            className="mt-2 font-serif text-4xl md:text-5xl"
            style={{ color: COLORS.ink }}
          >
            {SECTION_LABELS.explorer.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm" style={{ color: COLORS.muted }}>
            Cherchez et filtrez par labels pour découvrir les œuvres de la
            collection.
          </p>
        </header>

        <ExplorerToolbar
          params={params}
          labels={labels}
          total={artworks.total}
        />

        <ExplorerResults
          artworks={artworks.items}
          total={artworks.total}
          onClearHref={clearHref}
        />

        <ExplorerPagination params={params} totalPages={artworks.totalPages} />
      </div>
    </section>
  );
}
