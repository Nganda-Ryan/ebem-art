import { COLORS } from "@/constants/colors";
import { SITE } from "@/constants/site";

type BrandMarkProps = {
  inverted?: boolean;
};

export function BrandMark({ inverted = false }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ background: COLORS.terra }}
      >
        <span className="text-xs text-white" style={{ fontFamily: "var(--serif)" }}>
          {SITE.shortName}
        </span>
      </div>
      <span
        className="text-lg tracking-wide"
        style={{
          color: inverted ? "#FFFFFF" : COLORS.ink,
          fontFamily: "var(--serif)",
        }}
      >
        {SITE.name}
      </span>
    </div>
  );
}
