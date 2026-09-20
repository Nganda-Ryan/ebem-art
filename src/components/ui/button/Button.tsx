import type { ButtonHTMLAttributes, ReactNode } from "react";
import { COLORS } from "@/constants/colors";

type ButtonVariant = "terra" | "outline" | "ghost" | "ink" | "goldOutline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

type VariantStyle = {
  background: string;
  color: string;
  border: string;
  hoverBackground?: string;
  hoverBorder?: string;
  hoverColor?: string;
};

const VARIANT_STYLES: Record<ButtonVariant, VariantStyle> = {
  terra: {
    background: COLORS.terra,
    color: "#FFFFFF",
    border: "1px solid transparent",
    hoverBackground: COLORS.terraHover,
  },
  outline: {
    background: "transparent",
    color: COLORS.muted,
    border: `1px solid ${COLORS.border}`,
    hoverBorder: COLORS.ink,
    hoverColor: COLORS.ink,
  },
  ghost: {
    background: "transparent",
    color: COLORS.terra,
    border: "1px solid transparent",
  },
  ink: {
    background: COLORS.ink,
    color: "#FFFFFF",
    border: "1px solid transparent",
    hoverBackground: "#2E2218",
  },
  goldOutline: {
    background: "transparent",
    color: COLORS.gold,
    border: `1px solid ${COLORS.border}`,
    hoverBorder: COLORS.gold,
  },
};

function applyStyle(el: HTMLButtonElement, style: VariantStyle) {
  el.style.background = style.background;
  el.style.color = style.color;
  el.style.border = style.border;
}

export function Button({
  variant = "terra",
  children,
  className = "",
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <button
      className={`inline-flex items-center justify-center transition-all ${className}`}
      style={{
        background: variantStyle.background,
        color: variantStyle.color,
        border: variantStyle.border,
        ...style,
      }}
      onMouseEnter={(event) => {
        const target = event.currentTarget;
        if (variantStyle.hoverBackground) target.style.background = variantStyle.hoverBackground;
        if (variantStyle.hoverBorder) target.style.border = `1px solid ${variantStyle.hoverBorder}`;
        if (variantStyle.hoverColor) target.style.color = variantStyle.hoverColor;
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        applyStyle(event.currentTarget, variantStyle);
        onMouseLeave?.(event);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
