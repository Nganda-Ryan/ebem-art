import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";

function appOrigins(): string[] {
  const origins = new Set<string>();

  for (const value of [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ]) {
    if (!value) continue;
    try {
      origins.add(new URL(value).origin);
    } catch {
      /* ignore invalid */
    }
  }

  // Vercel sets this automatically (no protocol)
  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  // Production custom / project domain
  origins.add("https://ebem-art.vercel.app");

  return [...origins];
}

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
  trustedOrigins: appOrigins(),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 5,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  plugins: [
    admin(),
    nextCookies(),
  ],
});

/** Get the full session (user + session) from request headers */
export async function getSession() {
  const { headers } = await import("next/headers");
  return auth.api.getSession({
    headers: await headers(),
  });
}
