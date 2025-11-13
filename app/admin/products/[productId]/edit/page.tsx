import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ProductCategory } from "@prisma/client";

import { db } from "@/lib/prismadb";
import { requireUserRole } from "@/lib/auth";
import { updateProductAction } from "../../actions";
import { ImageUploaderField } from "../../_components/ImageUploaderField";
import { formatCurrency } from "@/lib/formatters";

const categoryOptions = [
  { label: "Comics", value: ProductCategory.COMICS },
  { label: "Figurines", value: ProductCategory.FIGURINES },
];

type EditPageProps = {
  params: { productId: string } | Promise<{ productId: string }>;
  searchParams: { status?: string } | Promise<{ status?: string }>;
};

async function resolveParams<T>(input: T | Promise<T>): Promise<T> {
  if (typeof (input as Promise<T>)?.then === "function") {
    return await (input as Promise<T>);
  }
  return input as T;
}

export default async function EditProductPage({ params, searchParams }: EditPageProps) {
  const resolvedParams = await resolveParams(params);
  const resolvedSearch = await resolveParams(searchParams);

  const productId = resolvedParams?.productId;

  const user = await requireUserRole(["admin"]);
  if (!user) {
    redirect(`/login?callbackUrl=/admin/products/${productId ?? ""}/edit`);
  }

  if (!productId) {
    notFound();
  }

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) {
    notFound();
  }

  const status = resolvedSearch?.status === "updated";

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950">Editează produsul</h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-900/70">
            Actualizează informațiile pentru {product.name}. Modificările salvate se vor
            reflecta în catalog și în pagina publică a produsului.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="rounded-full border border-emerald-200 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50"
        >
          Înapoi la listă
        </Link>
      </header>

      {status ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 px-6 py-4 text-sm text-emerald-900 shadow">
          <p className="text-base font-semibold">Produs actualizat</p>
          <p className="mt-1 text-emerald-900/80">
            Modificările au fost salvate cu succes. Verifică pagina publică pentru a vedea
            noua prezentare.
          </p>
        </div>
      ) : null}

      <section className="rounded-3xl bg-white p-8 shadow-xl">
        <form action={updateProductAction.bind(null, product.id)} className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
              Nume produs *
              <input
                type="text"
                name="name"
                required
                defaultValue={product.name}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
              Categorie *
              <select
                name="category"
                required
                defaultValue={product.category}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
            Descriere *
            <textarea
              name="description"
              required
              rows={4}
              defaultValue={product.description}
              className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </label>

          <ImageUploaderField defaultUrl={product.imageUrl} defaultKey={product.imageKey} />

          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
              Preț *
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                required
                defaultValue={product.price.toString()}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-emerald-950">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={product.isFeatured}
                className="h-4 w-4 rounded border border-emerald-400 text-emerald-600 focus:ring-emerald-500"
              />
              Marchează drept produs evidențiat
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-full bg-emerald-900 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-emerald-800"
            >
              Salvează modificările
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="rounded-full border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              Vezi pagina publică ({formatCurrency(product.price)})
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}

