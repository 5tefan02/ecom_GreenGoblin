import { CartContent } from "./CartContent";

export const metadata = {
  title: "Coș de cumpărături | GreenGoblin",
  description:
    "Finalizează achiziția produselor tale GreenGoblin. Stripe va fi disponibil în curând pentru plata online.",
};

export default function CartPage() {
  return (
    <section className="pb-24 pt-12">
      <CartContent />
    </section>
  );
}

