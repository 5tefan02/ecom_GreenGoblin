import Image from "next/image";
import Link from "next/link";

import { db } from "@/lib/prismadb";
import { formatCurrency } from "@/lib/formatters";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type DbProduct = Awaited<ReturnType<typeof db.product.findMany>>[number];

type UiProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceLabel: string;
  isFeatured: boolean;
  slug: string;
};

const mapProductToUi = (product: DbProduct): UiProduct => ({
        id: product.id,
        name: product.name,
        description: product.description,
  imageUrl: product.imageUrl,
  priceLabel: formatCurrency(product.price),
  isFeatured: product.isFeatured,
  slug: product.slug,
});

function ProductCard({ product }: { product: UiProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="relative flex aspect-square items-center justify-center bg-emerald-50/60">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={320}
          height={320}
          className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
        />
        {product.isFeatured ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
            Vedetă
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 px-6 py-6">
        <h3 className="text-lg font-semibold text-emerald-950">{product.name}</h3>
        <p className="text-sm text-emerald-900/70 line-clamp-3">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-base font-semibold text-emerald-900">{product.priceLabel}</span>
          <span className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900 transition group-hover:border-emerald-300 group-hover:bg-emerald-50">
            Detalii
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function Home() {
  const [featured, newest, comics, figurines] = await Promise.all([
    db.product.findMany({
      where: { isFeatured: true },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
    db.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    db.product.findMany({
      where: { category: "COMICS" },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.product.findMany({
      where: { category: "FIGURINES" },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const featuredProducts = featured.map(mapProductToUi);
  const newestProducts = newest.map(mapProductToUi);
  const comicsProducts = comics.map(mapProductToUi);
  const figurinesProducts = figurines.map(mapProductToUi);

  const showEmptyState =
    featuredProducts.length === 0 &&
    newestProducts.length === 0 &&
    comicsProducts.length === 0 &&
    figurinesProducts.length === 0;

  return (
    <div className="space-y-24 pb-24 pt-12">

      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6 rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-sm">
            <header className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-emerald-950">Noutăți</h3>
                <p className="text-sm text-emerald-900/70">Ultimele produse adăugate.</p>
              </div>
              <Link
                href="/figurines"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800 underline-offset-4 hover:underline"
              >
                vezi tot
              </Link>
            </header>
            {newestProducts.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {newestProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-white/80 p-5 transition hover:border-emerald-200 hover:bg-white"
                  >
                    <div className="relative h-32 w-full overflow-hidden rounded-xl bg-emerald-50/60">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={240}
                        height={240}
                        className="h-full w-full object-contain p-4"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold text-emerald-950">
                        {product.name}
                      </h4>
                      <p className="text-xs text-emerald-900/70 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-900">
                      {product.priceLabel}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-emerald-100 bg-white px-5 py-8 text-center text-sm text-emerald-900/70">
                Nu există încă produse noi. Adaugă unele din admin panel!
              </p>
            )}
          </div>

          <div className="grid gap-8">
            <div className="rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-sm">
              <header className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-emerald-950">Comics</h3>
                <Link
                  href="/comics"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800 underline-offset-4 hover:underline"
                >
                  vezi colecția
                </Link>
              </header>
      {comicsProducts.length > 0 ? (
                <ul className="mt-6 space-y-5">
                  {comicsProducts.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex gap-4 rounded-2xl border border-transparent p-3 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                      >
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/60">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-contain p-2"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <span className="text-sm font-semibold text-emerald-950">
                            {product.name}
                          </span>
                          <span className="text-xs text-emerald-900/70 line-clamp-2">
                            {product.description}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-emerald-900">
                          {product.priceLabel}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 rounded-2xl border border-emerald-100 bg-white px-5 py-6 text-center text-sm text-emerald-900/70">
                  Lista de comics este goală momentan.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-sm">
              <header className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-emerald-950">Figurine</h3>
                <Link
                  href="/figurines"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800 underline-offset-4 hover:underline"
                >
                  vezi colecția
                </Link>
              </header>
      {figurinesProducts.length > 0 ? (
                <ul className="mt-6 space-y-5">
                  {figurinesProducts.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex gap-4 rounded-2xl border border-transparent p-3 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                      >
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/60">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-contain p-2"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <span className="text-sm font-semibold text-emerald-950">
                            {product.name}
                          </span>
                          <span className="text-xs text-emerald-900/70 line-clamp-2">
                            {product.description}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-emerald-900">
                          {product.priceLabel}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 rounded-2xl border border-emerald-100 bg-white px-5 py-6 text-center text-sm text-emerald-900/70">
                  Nu există figurine salvate în bază în acest moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      

      {showEmptyState ? (
        <section className="mx-auto max-w-3xl px-4">
          <div className="rounded-3xl border border-emerald-200 bg-white px-8 py-10 text-center text-sm text-emerald-900/70">
            Nu există încă produse în baza de date. Importă produse noi din panoul de administrare
            pentru a popula vitrina magazinului.
          </div>
        </section>
      ) : null}
    </div>
  );
}
