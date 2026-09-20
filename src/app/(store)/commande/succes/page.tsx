import Link from "next/link";
import { ClearCartOnSuccess } from "@/components/cart/ClearCartOnSuccess";
import { getOrderByStripeSessionId } from "@/modules/orders";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export const metadata = { title: "Commande confirmée - EBEM Art" };

export const dynamic = "force-dynamic";

export default async function CommandeSuccesPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">Commande</h1>
        <p className="mt-4 text-gray-600">
          Aucune session de paiement trouvée.
        </p>
        <Link href="/" className="mt-6 inline-block underline">
          Retour à l&apos;accueil
        </Link>
      </section>
    );
  }

  const order = await getOrderByStripeSessionId(session_id);

  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <ClearCartOnSuccess />
      <h1 className="text-2xl font-bold">Merci pour votre achat ! 🎉</h1>
      <p className="mt-4 text-gray-600">
        Votre commande a bien été reçue. Vous recevrez un email de confirmation.
      </p>

      {order && (
        <div className="mt-8 rounded-lg border border-gray-200 p-6 text-left">
          <p className="text-sm text-gray-500">Commande</p>
          <p className="font-mono text-xs text-gray-400">{order.id}</p>
          <p className="mt-2 text-sm text-gray-500">Statut</p>
          <p className="font-medium">
            {order.status === "PAID" ? "✅ Payée" : "⏳ En cours de traitement"}
          </p>
          <p className="mt-2 text-sm text-gray-500">Total</p>
          <p className="font-medium">
            {order.totalCents.toLocaleString()} XAF
          </p>
        </div>
      )}

      <Link
        href="/oeuvres"
        className="mt-8 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700"
      >
        Continuer vos achats
      </Link>
    </section>
  );
}
