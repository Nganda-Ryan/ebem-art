"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { COLORS } from "@/constants/colors";

function NavLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="rounded-xl px-3 py-2 text-sm transition-colors"
      style={{
        background: active ? COLORS.bgAlt : "transparent",
        color: active ? COLORS.ink : COLORS.inkMid,
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </Link>
  );
}

function SidebarBody({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        <div
          className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider"
          style={{ color: COLORS.muted }}
        >
          Espace
        </div>
        <NavLink
          href="/artiste/oeuvres"
          label="Mes œuvres"
          active={pathname.startsWith("/artiste/oeuvres")}
          onNavigate={onNavigate}
        />
        <NavLink
          href="/artiste/profil"
          label="Mon profil"
          active={pathname.startsWith("/artiste/profil")}
          onNavigate={onNavigate}
        />
      </nav>

      <div className="border-t p-4" style={{ borderColor: COLORS.border }}>
        <LogoutButton redirectTo="/connexion" />
      </div>
    </>
  );
}

function BrandBlock({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/artiste/oeuvres" className="block" onClick={onNavigate}>
      <span
        className="font-mono text-[10px] tracking-widest"
        style={{ color: COLORS.terra }}
      >
        ESPACE ARTISTE
      </span>
      <span
        className="mt-1 block font-serif text-lg"
        style={{ color: COLORS.ink }}
      >
        Mboa Arts
      </span>
    </Link>
  );
}

export function ArtistShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div
      className="flex min-h-screen"
      style={{ background: COLORS.bg, color: COLORS.ink }}
    >
      {/* Desktop sidebar */}
      <aside
        className="hidden w-56 shrink-0 flex-col border-r md:flex"
        style={{ background: COLORS.bgCard, borderColor: COLORS.border }}
      >
        <div
          className="border-b px-4 py-4"
          style={{ borderColor: COLORS.border }}
        >
          <BrandBlock />
        </div>
        <SidebarBody pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside
            className="relative flex h-full w-[min(18rem,85vw)] flex-col shadow-xl"
            style={{ background: COLORS.bgCard }}
          >
            <div
              className="flex items-center justify-between border-b px-4 py-4"
              style={{ borderColor: COLORS.border }}
            >
              <BrandBlock onNavigate={() => setMenuOpen(false)} />
              <button
                type="button"
                className="rounded-xl p-2 transition-opacity hover:opacity-70"
                style={{ color: COLORS.inkMid }}
                aria-label="Fermer"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarBody
              pathname={pathname}
              onNavigate={() => setMenuOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="sticky top-0 z-40 flex items-center gap-3 border-b px-4 py-3 md:hidden"
          style={{
            background: COLORS.bgCard,
            borderColor: COLORS.border,
          }}
        >
          <button
            type="button"
            className="rounded-xl p-2 transition-opacity hover:opacity-70"
            style={{ color: COLORS.ink }}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <span
              className="block font-mono text-[9px] tracking-widest"
              style={{ color: COLORS.terra }}
            >
              ESPACE ARTISTE
            </span>
            <span className="font-serif text-sm" style={{ color: COLORS.ink }}>
              Mboa Arts
            </span>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
