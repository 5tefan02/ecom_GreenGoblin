import Image from "next/image";
import Link from "next/link";

import { db } from "@/lib/prismadb";
import { formatCurrency } from "@/lib/formatters";

export const metadata = {
  title: "GreenGoblin Figurines",
  description: "Figurine premium și colecții exclusive GreenGoblin.",
};

type UiProduct = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  imageUrl: string;
  slug: string;
};

const mapProduct = (product: Awaited<ReturnType<typeof db.product.findMany>>[number]): UiProduct => ({
  id: product.id,
  name: product.name,
  description: product.description,
  imageUrl: product.imageUrl,
  priceLabel: formatCurrency(product.price),
  slug: product.slug,
});

export default async function FigurinesPage() {
  const products = await db.product.findMany({
    where: { category: "FIGURINES" },
    orderBy: { createdAt: "desc" },
  });

  const items = products.map(mapProduct);

  return (
    <div className="space-y-16 pb-24 pt-12">
      <section className="mx-auto w-full max-w-6xl px-4">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-emerald-950">
              Piese disponibile
            </h2>
            <p className="text-sm text-emerald-900/70">
              Fiecare figurină este sincronizată cu stocul din baza noastră de date.
            </p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            {items.length} figurine
          </span>
        </header>

        {items.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm transition hover:-translate-y-2 hover:border-violet-200 hover:shadow-xl"
              >
                <div className="relative flex aspect-square items-center justify-center bg-violet-50/60">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={320}
                    height={320}
                    className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 px-6 py-6">
                  <h3 className="text-lg font-semibold text-emerald-950">{product.name}</h3>
                  <p className="flex-1 text-sm text-emerald-900/70 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-emerald-900">
                      {product.priceLabel}
                    </span>
                    <span className="rounded-full border border-violet-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-violet-900 transition group-hover:border-violet-300 group-hover:bg-violet-50">
                      Vezi detalii
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-violet-100 bg-white px-8 py-12 text-center text-sm text-emerald-900/70">
            Categoria de figurine este goală momentan. Adaugă produse noi din panoul de administrare
            pentru a le afișa aici.
          </div>
        )}
      </section>
    </div>
  );
}
