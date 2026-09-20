import { CartProvider } from "@/components/cart/CartProvider";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Nav />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  );
}
