"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login page: no sidebar / admin chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      <aside className="flex w-56 flex-col border-r border-gray-200 bg-gray-50">
        <div className="border-b border-gray-200 px-4 py-4">
          <Link href="/admin" className="text-lg font-bold">
            EBEM Admin
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4 text-sm">
          <Link href="/admin" className="rounded px-3 py-2 hover:bg-gray-200">
            Tableau de bord
          </Link>
          <div className="mt-2 mb-1 px-3 text-xs font-semibold uppercase text-gray-400">
            Gestion
          </div>
          <Link
            href="/admin/artistes"
            className="rounded px-3 py-2 hover:bg-gray-200"
          >
            Artistes
          </Link>
          <Link
            href="/admin/oeuvres"
            className="rounded px-3 py-2 hover:bg-gray-200"
          >
            Œuvres
          </Link>
          <Link
            href="/admin/commandes"
            className="rounded px-3 py-2 hover:bg-gray-200"
          >
            Commandes
          </Link>
          <div className="mt-4 mb-1 px-3 text-xs font-semibold uppercase text-gray-400">
            Demandes
          </div>
          <Link
            href="/admin/demandes-artistes"
            className="rounded px-3 py-2 hover:bg-gray-200"
          >
            Inscriptions Artistes
          </Link>
          <Link
            href="/admin/demandes-oeuvres"
            className="rounded px-3 py-2 hover:bg-gray-200"
          >
            Demandes Œuvres
          </Link>
        </nav>
        <div className="border-t border-gray-200 p-4">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
