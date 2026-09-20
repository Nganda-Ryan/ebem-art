import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "Connexion - EBEM Admin" };

export default function AdminLoginPage() {
  return (
    <section className="flex min-h-screen items-center justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </section>
  );
}
