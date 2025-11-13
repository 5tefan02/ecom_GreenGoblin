import { redirect } from "next/navigation";

import { db } from "@/lib/prismadb";
import { requireUserRole } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const user = await requireUserRole(["admin"]);
  if (!user) {
    redirect("/login?callbackUrl=/admin");
  }

  const [productCount, featuredCount, userCount, recentProducts, recentUsers] =
    await Promise.all([
      db.product.count(),
      db.product.count({ where: { isFeatured: true } }),
      db.user.count(),
      db.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        select: {
          id: true,
          name: true,
          category: true,
          createdAt: true,
        },
      }),
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

  return (
    <div className="space-y-12">
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-3xl border border-emerald-100 bg-white px-6 py-6 shadow">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900/60">
            Produse totale
          </p>
          <p className="mt-4 text-4xl font-bold text-emerald-950">{productCount}</p>
          <p className="mt-2 text-sm text-emerald-900/70">
            Toate produsele publicate în catalog.
          </p>
        </article>
        <article className="rounded-3xl border border-emerald-100 bg-white px-6 py-6 shadow">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900/60">
            Produse evidențiate
          </p>
          <p className="mt-4 text-4xl font-bold text-emerald-950">{featuredCount}</p>
          <p className="mt-2 text-sm text-emerald-900/70">
            Produse marcate ca highlight în homepage.
          </p>
        </article>
        <article className="rounded-3xl border border-emerald-100 bg-white px-6 py-6 shadow">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900/60">
            Utilizatori înregistrați
          </p>
          <p className="mt-4 text-4xl font-bold text-emerald-950">{userCount}</p>
          <p className="mt-2 text-sm text-emerald-900/70">
            Conturi cu acces la panoul GreenGoblin.
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-emerald-100 bg-white px-6 py-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-emerald-950">
              Produse adăugate recent
            </h2>
            <a
              href="/admin/products"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900/70 hover:text-emerald-900"
            >
              Administrează
            </a>
          </div>
          <ul className="mt-5 space-y-4">
            {recentProducts.length === 0 ? (
              <li className="text-sm text-emerald-900/70">
                Nu există produse recente încă.
              </li>
            ) : (
              recentProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-900/60">
                      {product.category.toLowerCase()}
                    </p>
                  </div>
                  <span className="text-xs text-emerald-900/60">
                    {product.createdAt.toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white px-6 py-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-emerald-950">
              Ultimii utilizatori
            </h2>
            <a
              href="/admin/users"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900/70 hover:text-emerald-900"
            >
              Vezi toți
            </a>
          </div>
          <ul className="mt-5 space-y-3">
            {recentUsers.length === 0 ? (
              <li className="text-sm text-emerald-900/70">
                Încă nu există utilizatori înregistrați.
              </li>
            ) : (
              recentUsers.map((recentUser) => (
                <li
                  key={recentUser.id}
                  className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900"
                >
                  <div>
                    <p className="font-medium">
                      {recentUser.name ?? "Utilizator fără nume"}
                    </p>
                    <p className="text-xs text-emerald-900/60">{recentUser.email}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-emerald-900/60">
                    {recentUser.role}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

