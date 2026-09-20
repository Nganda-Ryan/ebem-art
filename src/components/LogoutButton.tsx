"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";

export function LogoutButton({
  redirectTo = "/connexion?espace=admin",
}: {
  redirectTo?: string;
}) {
  const router = useRouter();
  const isArtist = redirectTo === "/connexion";

  async function handleLogout() {
    await authClient.signOut();
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className={
        isArtist
          ? "w-full rounded px-3 py-2 text-left text-sm transition-colors hover:opacity-80"
          : "rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
      }
      style={isArtist ? { color: COLORS.inkMid } : undefined}
    >
      Déconnexion
    </button>
  );
}
