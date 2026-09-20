import { getSession } from "@/lib/auth";

/**
 * Verify the current user is an authenticated admin.
 * Throws if not - call at the top of every admin Server Action.
 */
export async function requireAdmin() {
  const session = await getSession();

  if (!session || session.user.role !== "admin") {
    throw new Error(
      "Non autorisé. Veuillez vous connecter en tant qu'administrateur."
    );
  }

  return session;
}
