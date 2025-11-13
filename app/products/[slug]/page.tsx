import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { db } from "@/lib/prismadb";
import { formatCurrency } from "@/lib/formatters";
import { AddToCartButton } from "@/app/components/AddToCartButton";

type ParamsInput = { slug?: string };
type ParamsOrPromise = ParamsInput | Promise<ParamsInput>;

type ProductPageProps = {
  params: ParamsOrPromise;
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

async function resolveParams(input: ParamsOrPromise): Promise<ParamsInput> {
  if (typeof (input as Promise<ParamsInput>)?.then === "function") {
    return await (input as Promise<ParamsInput>);
  }
  return input as ParamsInput;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await resolveParams(params);

  if (!slug) {
    return {
      title: "Produs indisponibil",
    };
  }

  const product = await db.product.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!product) {
    return {
      title: "Produs indisponibil",
    };
  }

  return {
    title: `${product.name} | GreenGoblin`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      url: `https://greengoblin.local/products/${slug}`,
      siteName: "GreenGoblin",
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await resolveParams(params);

  if (!slug) {
    notFound();
  }

  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  const related = await db.product.findMany({
    where: {
      category: product.category,
      NOT: { id: product.id },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div className="space-y-16 pb-24 pt-12">
      <nav className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 text-xs uppercase tracking-[0.3em] text-emerald-800">
        <Link href="/" className="hover:underline">
          Acasă
        </Link>
        <span>/</span>
        <Link href={`/${product.category.toLowerCase()}`} className="hover:underline">
          {product.category.toLowerCase()}
        </Link>
        <span>/</span>
        <span className="text-emerald-900">{product.name}</span>
      </nav>

      <section className="mx-auto w-full max-w-5xl px-4">
        <div className="grid gap-10 rounded-[32px] border border-emerald-100 bg-white/90 p-10 shadow-xl lg:grid-cols-[1.1fr,0.9fr]">
          <div className="relative flex min-h-[360px] items-center justify-center rounded-3xl bg-emerald-50/60">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={520}
              height={520}
              className="h-full w-full max-w-[420px] object-contain p-8"
              priority
            />
            {product.isFeatured ? (
              <span className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900 shadow">
                Evidențiat
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-6 text-emerald-950">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                {product.category.toLowerCase()}
              </span>
              <h1 className="text-4xl font-semibold leading-tight">{product.name}</h1>
            </div>

            <p className="text-sm leading-relaxed text-emerald-900/80">
              {product.description}
            </p>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800">
                Preț recomandat
              </span>
              <p className="mt-3 text-3xl font-semibold text-emerald-950">
                {formatCurrency(product.price)}
              </p>
            </div>

            <p className="text-xs text-emerald-900/60">
              Fiecare produs este verificat manual înainte de listare. Pentru întrebări
              privind disponibilitatea sau livrarea, contactează echipa noastră.
            </p>

            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
              }}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4">
        <header className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800">
            Poate te interesează și
          </span>
          <h2 className="text-2xl font-semibold text-emerald-950">
            Alte produse din aceeași categorie
          </h2>
        </header>

        {related.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className="group flex gap-4 rounded-3xl border border-emerald-100 bg-white/80 p-4 transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-white"
              >
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-emerald-50/60">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="h-full w-full object-contain p-4"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <span className="text-sm font-semibold text-emerald-950">{item.name}</span>
                  <span className="text-xs text-emerald-900/70 line-clamp-2">
                    {item.description}
                  </span>
                  <span className="text-sm font-semibold text-emerald-900">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-3xl border border-emerald-100 bg-white px-6 py-10 text-center text-sm text-emerald-900/70">
            Nu există alte produse similare în acest moment. Revino curând pentru mai multe opțiuni.
          </p>
        )}
      </section>
    </div>
  );
}


