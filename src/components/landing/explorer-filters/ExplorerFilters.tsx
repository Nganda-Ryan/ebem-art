"use client";

import { COLORS } from "@/constants/colors";
import { PRICE_FILTER } from "@/constants/landing";
import { FILTER_STYLES } from "@/data/mock";
import { FilterChip } from "@/components/ui/filter-chip";
import { formatPrice } from "@/lib/format/price";

type ExplorerFiltersProps = {
  discipline: string;
  maxPrice: number;
  onDisciplineChange: (value: string) => void;
  onMaxPriceChange: (value: number) => void;
};

export function ExplorerFilters({
  discipline,
  maxPrice,
  onDisciplineChange,
  onMaxPriceChange,
}: ExplorerFiltersProps) {
  return (
    <div className="mb-8 flex flex-wrap items-start gap-6">
      <div>
        <div className="mb-3 font-mono text-xs tracking-widest" style={{ color: COLORS.muted }}>
          DISCIPLINE
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTER_STYLES.map((style) => (
            <FilterChip
              key={style}
              label={style}
              active={discipline === style}
              onClick={() => onDisciplineChange(style)}
              tone="terra"
            />
          ))}
        </div>
      </div>

    </div>
  );
}
