import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/prismadb";
import { formatCurrency } from "@/lib/formatters";
import { LogoutButton } from "./_components/LogoutButton";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/account");
  }

  // Dacă utilizatorul este admin, redirecționează la pagina admin
  if (user.role === "admin") {
    redirect("/admin");
  }

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-6 pb-24 pt-8">


      <section className="mt-12 w-full max-w-6xl">
        <div className="rounded-3xl border border-emerald-100 bg-white px-8 py-10 shadow-xl">
          <h2 className="text-2xl font-semibold text-emerald-950">Comenzile mele</h2>
          <p className="mt-2 text-sm text-emerald-900/70">
            Aici poți vedea toate comenzile tale.
          </p>

          {searchParams.order === "success" && (
            <div className="mt-6 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-700">
              Comanda ta a fost plasată cu succes! Vei primi un email de confirmare în curând.
            </div>
          )}

          {orders.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-6 py-12 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mx-auto h-12 w-12 text-emerald-900/40"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
              <p className="mt-4 text-sm font-medium text-emerald-900/70">
                Nu ai comenzi încă
              </p>
              <p className="mt-2 text-xs text-emerald-900/50">
                Comenzile tale vor apărea aici după ce le plasezi.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((order) => {
                const statusLabels: Record<string, string> = {
                  PENDING: "În așteptare",
                  PROCESSING: "În procesare",
                  SHIPPED: "Expediată",
                  DELIVERED: "Livrată",
                  CANCELLED: "Anulată",
                };

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-emerald-950">
                            Comandă #{order.id.slice(-8).toUpperCase()}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                              order.status === "DELIVERED"
                                ? "bg-emerald-100 text-emerald-900"
                                : order.status === "CANCELLED"
                                  ? "bg-red-100 text-red-900"
                                  : "bg-amber-100 text-amber-900"
                            }`}
                          >
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-emerald-900/60">
                          Plasată pe{" "}
                          {new Date(order.createdAt).toLocaleDateString("ro-RO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="mt-1 text-xs text-emerald-900/60">
                          Livrare: {order.shippingName}, {order.shippingCity}
                        </p>
                        <div className="mt-4 space-y-2">
                          {order.orderItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-emerald-900">
                                {item.product.name} x{item.quantity}
                              </span>
                              <span className="font-semibold text-emerald-950">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-emerald-200 pt-4 md:border-t-0 md:border-l md:pl-6 md:pt-0">
                        <div className="text-right">
                          <p className="text-xs text-emerald-900/60">Total</p>
                          <p className="mt-1 text-xl font-semibold text-emerald-950">
                            {formatCurrency(order.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 w-full max-w-6xl">
        <div className="rounded-3xl border border-emerald-100 bg-white px-8 py-10 shadow-xl">
          <h2 className="text-2xl font-semibold text-emerald-950">Informații cont</h2>
          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900/60">
                Nume
              </span>
              <p className="text-sm text-emerald-900">
                {user.name ?? "Nu ai setat un nume"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900/60">
                Email
              </span>
              <p className="text-sm text-emerald-900">{user.email}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900/60">
                Rol
              </span>
              <p className="text-sm text-emerald-900">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
                  {user.role}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-emerald-100 pt-6">
            <LogoutButton />
          </div>
        </div>
      </section>
    </div>
  );
}

