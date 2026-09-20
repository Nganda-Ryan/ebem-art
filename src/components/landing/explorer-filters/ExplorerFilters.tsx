"use client";

import { FilterChip } from "@/components/ui/filter-chip";

type ExplorerFiltersProps = {
  discipline: string;
  disciplines: string[];
  onDisciplineChange: (value: string) => void;
};

export function ExplorerFilters({
  discipline,
  disciplines,
  onDisciplineChange,
}: ExplorerFiltersProps) {
  if (disciplines.length <= 1) return null;

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {disciplines.map((style) => (
        <FilterChip
          key={style}
          label={style}
          active={discipline === style}
          onClick={() => onDisciplineChange(style)}
          tone="terra"
        />
      ))}
    </div>
  );
}
