import Link from "next/link";
import { redirect } from "next/navigation";

import { db } from "@/lib/prismadb";
import { formatCurrency } from "@/lib/formatters";
import { requireUserRole } from "@/lib/auth";
import { deleteProductAction } from "./actions";

const statusMessages: Record<string, { title: string; description: string }> = {
  created: {
    title: "Produs adăugat",
    description: "Produsul a fost creat cu succes și apare în lista de mai jos.",
  },
  updated: {
    title: "Produs actualizat",
    description: "Modificările tale au fost salvate.",
  },
  deleted: {
    title: "Produs șters",
    description: "Produsul a fost eliminat din catalog.",
  },
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const user = await requireUserRole(["admin"]);
  if (!user) {
    redirect("/login?callbackUrl=/admin/products");
  }

  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const status = searchParams.status ? statusMessages[searchParams.status] : null;

  return (
    <div className="space-y-12">
      <header className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-800 to-lime-500 px-10 py-10 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold md:text-4xl">
              Administrare produse GreenGoblin
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Vizualizează, editează și gestionează produsele din catalog. Creează produse
              noi din pagina dedicată și actualizează colecțiile existente cu câteva click-uri.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/20"
          >
            Adaugă produs nou
          </Link>
        </div>
      </header>

      {status ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 px-6 py-4 text-sm text-emerald-900 shadow">
          <p className="text-base font-semibold">{status.title}</p>
          <p className="mt-1 text-emerald-900/80">{status.description}</p>
        </div>
      ) : null}

      <section className="rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-emerald-950">Toate produsele</h2>
            <p className="text-sm text-emerald-900/70">
              Ai {products.length} produse în catalog. Folosește acțiunile pentru editare,
              previzualizare sau ștergere.
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-100">
          <table className="min-w-full divide-y divide-emerald-100 text-sm text-emerald-900">
            <thead className="bg-emerald-50/70 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              <tr>
                <th className="px-6 py-3 text-left">Produs</th>
                <th className="px-6 py-3 text-left">Categorie</th>
                <th className="px-6 py-3 text-left">Preț</th>
                <th className="px-6 py-3 text-left">Slug</th>
                <th className="px-6 py-3 text-left">Actualizat</th>
                <th className="px-6 py-3 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-emerald-900/70">
                    Nu există produse salvate încă. Adaugă primul produs din pagina dedicată.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="bg-white/60">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-emerald-950">
                          {product.name}
                        </span>
                        <span className="text-xs text-emerald-900/60 line-clamp-1">
                          {product.description}
                        </span>
                        {product.isFeatured ? (
                          <span className="mt-2 w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-900">
                            Evidențiat
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-emerald-950">
                        {formatCurrency(product.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                        {product.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-xs text-emerald-900/60">
                      {product.updatedAt.toLocaleDateString("ro-RO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/products/${product.slug}`}
                          className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50"
                        >
                          Vezi pagina
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-full border border-emerald-600 px-3 py-1.5 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-600 hover:text-white"
                        >
                          Editează
                        </Link>
                        <form
                          action={deleteProductAction.bind(null, product.id)}
                          className="inline-flex"
                        >
                          <button
                            type="submit"
                            className="rounded-full border border-red-500 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
                          >
                            Șterge
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
