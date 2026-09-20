import { CartView } from "@/components/cart/CartView";

export const metadata = { title: "Panier - EBEM Art" };

export default function PanierPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 pt-28">
      <h1 className="text-3xl font-bold">Panier</h1>
      <p className="mt-2 text-gray-500">
        Vérifiez vos œuvres puis finalisez l&apos;achat.
      </p>
      <div className="mt-10">
        <CartView />
      </div>
    </section>
  );
}
