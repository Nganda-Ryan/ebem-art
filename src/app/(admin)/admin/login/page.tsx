import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

/** Legacy admin login → unified /connexion portal */
export default async function AdminLoginPage({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;
  const params = new URLSearchParams({ espace: "admin" });
  if (callbackUrl) params.set("callbackUrl", callbackUrl);
  redirect(`/connexion?${params.toString()}`);
}
