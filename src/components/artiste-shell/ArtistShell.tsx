"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { COLORS } from "@/constants/colors";

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="rounded px-3 py-2 text-sm transition-colors"
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

export function ArtistShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      className="flex min-h-screen"
      style={{ background: COLORS.bg, color: COLORS.ink }}
    >
      <aside
        className="flex w-56 flex-col border-r"
        style={{ background: COLORS.bgCard, borderColor: COLORS.border }}
      >
        <div
          className="border-b px-4 py-4"
          style={{ borderColor: COLORS.border }}
        >
          <Link href="/artiste/oeuvres" className="block">
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
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          <div
            className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider"
            style={{ color: COLORS.muted }}
          >
            Œuvres
          </div>
          <NavLink
            href="/artiste/oeuvres"
            label="Mes œuvres"
            active={pathname.startsWith("/artiste/oeuvres")}
          />
        </nav>

        <div className="border-t p-4" style={{ borderColor: COLORS.border }}>
          <LogoutButton redirectTo="/connexion" />
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
