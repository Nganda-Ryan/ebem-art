"use client";

import type { LucideIcon } from "lucide-react";

type IconActionButtonProps = {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "default" | "danger" | "warning" | "success" | "primary";
  className?: string;
};

const variantClass: Record<
  NonNullable<IconActionButtonProps["variant"]>,
  string
> = {
  default: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  primary: "text-white bg-gray-900 hover:bg-gray-700",
  danger: "text-red-600 hover:bg-red-50",
  warning: "text-amber-700 hover:bg-amber-50",
  success: "text-emerald-700 hover:bg-emerald-50",
};

export function IconActionButton({
  label,
  icon: Icon,
  onClick,
  type = "button",
  disabled,
  variant = "default",
  className = "",
}: IconActionButtonProps) {
  return (
    <button
      type={type}
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors disabled:opacity-40 ${variantClass[variant]} ${className}`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}
