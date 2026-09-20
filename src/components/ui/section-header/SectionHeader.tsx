import type { ReactNode } from "react";
import { COLORS } from "@/constants/colors";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  eyebrowColor?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  eyebrowColor = COLORS.terra,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-12 flex items-baseline justify-between gap-4 ${className}`}>
      <div>
        <span className="font-mono text-xs tracking-widest" style={{ color: eyebrowColor }}>
          {eyebrow}
        </span>
        <h2 className="mt-2 font-serif text-4xl md:text-5xl" style={{ color: COLORS.ink }}>
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-4 text-sm" style={{ color: COLORS.muted, lineHeight: 1.75 }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
