"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { NAV_LINKS } from "@/constants/navigation";
import { SITE } from "@/constants/site";
import { CartNavLink } from "@/components/cart/CartNavLink";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { BrandMark } from "@/components/ui/brand-mark";
import { useScrolled } from "@/hooks/use-scrolled";

export function Nav() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  /** Solid bar on inner pages (no dark hero behind the fixed nav). */
  const solid = pathname !== "/" || scrolled;
  const linkColor = solid ? COLORS.inkMid : "rgba(255,255,255,0.82)";
  const linkHover = solid ? COLORS.ink : "#FFFFFF";
  const menuLine = solid ? COLORS.ink : "#FFFFFF";
  const iconColor = solid ? COLORS.ink : "#FFFFFF";
  const loginColor = solid ? COLORS.ink : "#FFFFFF";

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-400"
      style={{
        background: solid ? "rgba(247,243,238,0.97)" : "#0C0A08",
        backdropFilter: solid ? "blur(12px)" : "none",
        borderBottom: solid
          ? `1px solid ${COLORS.border}`
          : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <a href="/" aria-label={SITE.name} className="shrink-0">
          <BrandMark inverted={!solid} />
        </a>

        <div
          className="hidden items-center gap-6 text-[13px] font-medium tracking-wide lg:flex xl:gap-8"
          style={{ color: linkColor, fontFamily: "var(--sans)" }}
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition-colors"
              style={{ color: linkColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = linkHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = linkColor;
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <GlobalSearch
            iconColor={iconColor}
            onOpenChange={(isOpen) => {
              if (isOpen) setOpen(false);
            }}
          />
          <CartNavLink iconColor={iconColor} />
          <Link
            href="/connexion"
            className="hidden px-2.5 py-2 text-[13px] font-medium tracking-wide transition-opacity hover:opacity-70 sm:inline"
            style={{ color: loginColor, fontFamily: "var(--sans)" }}
          >
            Connexion
          </Link>
          <button
            type="button"
            className="p-2 lg:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <div className="w-5 space-y-1.5">
              <span className="block h-px w-full" style={{ background: menuLine }} />
              <span className="block h-px w-3/4" style={{ background: menuLine }} />
              <span className="block h-px w-full" style={{ background: menuLine }} />
            </div>
          </button>
        </div>
      </div>

      {open ? (
        <div
          className="px-5 pb-6 sm:px-6 lg:hidden"
          style={{ background: solid ? COLORS.bg : "#0C0A08" }}
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block border-b py-3 text-sm"
              style={{
                color: solid ? COLORS.muted : "rgba(255,255,255,0.75)",
                borderColor: solid ? COLORS.border : "rgba(255,255,255,0.1)",
                fontFamily: "var(--sans)",
              }}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/connexion"
            className="mt-4 block py-2 text-sm font-medium tracking-wide sm:hidden"
            style={{
              color: solid ? COLORS.ink : "#FFFFFF",
              fontFamily: "var(--sans)",
            }}
            onClick={() => setOpen(false)}
          >
            Connexion
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
