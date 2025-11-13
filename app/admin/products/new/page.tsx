import Link from "next/link";
import { redirect } from "next/navigation";

import { ProductCategory } from "@prisma/client";

import { requireUserRole } from "@/lib/auth";
import { createProductAction } from "../actions";
import { ImageUploaderField } from "../_components/ImageUploaderField";

const categoryOptions = [
  { label: "Comics", value: ProductCategory.COMICS },
  { label: "Figurines", value: ProductCategory.FIGURINES },
];

export default async function AdminNewProductPage() {
  const user = await requireUserRole(["admin"]);
  if (!user) {
    redirect("/login?callbackUrl=/admin/products/new");
  }

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950">Adaugă produs nou</h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-900/70">
            Completează informațiile despre produs. Toate câmpurile sunt obligatorii pentru a
            publica produsul în catalog.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="rounded-full border border-emerald-200 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50"
        >
          Înapoi la produse
        </Link>
      </header>

      <section className="rounded-3xl bg-white p-8 shadow-xl">
        <form action={createProductAction} className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
              Nume produs *
              <input
                type="text"
                name="name"
                required
                placeholder="Ex. GreenGoblin Saga #1"
                className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 placeholder:text-emerald-900/50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
              Categorie *
              <select
                name="category"
                required
                className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              >
                <option value="">Selectează categoria</option>
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
              placeholder="Adaugă detalii captivante despre produs..."
              className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 placeholder:text-emerald-900/50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </label>

          <ImageUploaderField />

          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
              Preț *
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                required
                placeholder="Ex. 49.99"
                className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 placeholder:text-emerald-900/50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-emerald-950">
              <input
                type="checkbox"
                name="isFeatured"
                className="h-4 w-4 rounded border border-emerald-400 text-emerald-600 focus:ring-emerald-500"
              />
              Marchează drept produs evidențiat
            </label>
          </div>

          <button
            type="submit"
            className="w-fit rounded-full bg-emerald-900 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-emerald-800"
          >
            Salvează produsul
          </button>
        </form>
      </section>
    </div>
  );
}

