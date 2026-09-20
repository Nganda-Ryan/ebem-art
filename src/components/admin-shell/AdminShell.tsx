"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

const MANAGEMENT_ITEMS = [
  { href: "/admin/artistes", label: "Artistes" },
  { href: "/admin/oeuvres", label: "Œuvres" },
  { href: "/admin/commandes", label: "Commandes" },
] as const;

const REQUEST_ITEMS = [
  { href: "/admin/demandes-artistes", label: "Inscriptions Artistes" },
  { href: "/admin/demandes-oeuvres", label: "Demandes Œuvres" },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
      className={`rounded-xl px-3 py-2 transition-colors ${
        active ? "bg-gray-200 font-medium text-gray-900" : "hover:bg-gray-200"
      }`}
    >
      {label}
    </Link>
  );
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <nav className="flex flex-1 flex-col gap-1 p-4 text-sm">
        <NavLink
          href="/admin"
          label="Tableau de bord"
          active={isActive(pathname, "/admin", true)}
          onNavigate={onNavigate}
        />
        <div className="mt-2 mb-1 px-3 text-xs font-semibold uppercase text-gray-400">
          Gestion
        </div>
        {MANAGEMENT_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={isActive(pathname, item.href)}
            onNavigate={onNavigate}
          />
        ))}
        <div className="mt-4 mb-1 px-3 text-xs font-semibold uppercase text-gray-400">
          Demandes
        </div>
        {REQUEST_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={isActive(pathname, item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      <div className="border-t border-gray-200 p-4">
        <LogoutButton />
      </div>
    </>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
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

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-gray-200 bg-gray-50 md:flex">
        <div className="border-b border-gray-200 px-4 py-4">
          <Link href="/admin" className="text-lg font-bold">
            EBEM Admin
          </Link>
        </div>
        <SidebarNav pathname={pathname} />
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
          <aside className="relative flex h-full w-[min(18rem,85vw)] flex-col bg-gray-50 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
              <Link
                href="/admin"
                className="text-lg font-bold"
                onClick={() => setMenuOpen(false)}
              >
                EBEM Admin
              </Link>
              <button
                type="button"
                className="rounded-xl p-2 text-gray-600 hover:bg-gray-200"
                aria-label="Fermer"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav
              pathname={pathname}
              onNavigate={() => setMenuOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            className="rounded-xl p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold">EBEM Admin</span>
        </header>

        <main className="min-w-0 flex-1 overflow-x-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
