import { COLORS } from "@/constants/colors";

type FilterChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
  tone?: "terra" | "gold";
};

export function FilterChip({ label, active, onClick, tone = "terra" }: FilterChipProps) {
  const activeBg = tone === "terra" ? COLORS.terra : COLORS.bgCard;
  const activeColor = tone === "terra" ? "#FFFFFF" : COLORS.gold;
  const activeBorder = tone === "terra" ? COLORS.terra : COLORS.gold;

  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 text-xs font-medium tracking-wider transition-all"
      style={{
        background: active ? activeBg : tone === "terra" ? COLORS.bgCard : "transparent",
        color: active ? activeColor : COLORS.muted,
        border: `1px solid ${active ? activeBorder : COLORS.border}`,
      }}
    >
      {label.toUpperCase()}
    </button>
  );
}
