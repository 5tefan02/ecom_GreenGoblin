"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useCart } from "@/app/context/cart";
import { formatCurrency } from "@/lib/formatters";
import { createOrderAction } from "./actions";

export function CartContent() {
  const { items, removeItem, clearCart, total } = useCart();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingData, setShippingData] = useState({
    shippingName: "",
    shippingAddress: "",
    shippingCity: "",
    shippingPostalCode: "",
    shippingCountry: "România",
    phone: "",
    notes: "",
  });

  const hasItems = items.length > 0;

  useEffect(() => {
    // Check if user is logged in
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-emerald-950">Coșul tău</h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-900/70">
            Stripe va fi integrat în curând pentru plăți rapide și sigure. Deocamdată
            păstrăm aici produsele adăugate de tine.
          </p>
        </div>
        {hasItems ? (
          <button
            type="button"
            onClick={clearCart}
            className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            Golește coșul
          </button>
        ) : null}
      </header>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-4 rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-xl">
          <h2 className="text-lg font-semibold text-emerald-900">Produse în coș</h2>

          {hasItems ? (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-emerald-100 bg-white">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm font-semibold text-emerald-950">{item.name}</p>
                      <p className="text-xs text-emerald-900/60">
                        Cantitate: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="self-start rounded-full border border-red-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-red-500 transition hover:border-red-400 hover:bg-red-50"
                  >
                    Elimină
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-12 text-center text-sm text-emerald-900/70">
              Coșul este gol. Vizitează paginile de produse pentru a adăuga articole.
            </div>
          )}

          <Link
            href="/"
            className="inline-flex w-fit items-center justify-center rounded-full border border-emerald-200 px-5 py-2 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            Continuă cumpărăturile
          </Link>
        </div>

        <aside className="w-full max-w-sm rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-emerald-900">Rezumat comandă</h2>
          <dl className="mt-6 space-y-3 text-sm text-emerald-900/70">
            <div className="flex items-center justify-between">
              <dt>Produse</dt>
              <dd>{formatCurrency(total)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Livrare estimată</dt>
              <dd>—</dd>
            </div>
            <div className="flex items-center justify-between text-emerald-900">
              <dt className="text-sm font-semibold">Total</dt>
              <dd className="text-base font-semibold">{formatCurrency(total)}</dd>
            </div>
          </dl>

          {!showShippingForm ? (
            <>
              {!user ? (
                <p className="mt-6 text-xs text-emerald-900/70">
                  Trebuie să te autentifici pentru a plasa o comandă.
                </p>
              ) : (
                <p className="mt-6 text-xs text-emerald-900/70">
                  Completează informațiile de livrare pentru a finaliza comanda.
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    router.push("/login?callbackUrl=/cart");
                    return;
                  }
                  setShowShippingForm(true);
                }}
                disabled={!hasItems || isLoading}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Se procesează..." : "Cumpără acum"}
              </button>
            </>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsLoading(true);
                setError(null);

                try {
                  const orderItems = items.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                  }));

                  await createOrderAction({
                    items: orderItems,
                    ...shippingData,
                  });

                  clearCart();
                  router.push("/account?order=success");
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "A apărut o eroare la plasarea comenzii.",
                  );
                  setIsLoading(false);
                }
              }}
              className="mt-6 space-y-4"
            >
              {error && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="shippingName"
                  className="block text-xs font-semibold text-emerald-900"
                >
                  Nume complet *
                </label>
                <input
                  id="shippingName"
                  type="text"
                  required
                  value={shippingData.shippingName}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, shippingName: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label
                  htmlFor="shippingAddress"
                  className="block text-xs font-semibold text-emerald-900"
                >
                  Adresă *
                </label>
                <input
                  id="shippingAddress"
                  type="text"
                  required
                  value={shippingData.shippingAddress}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, shippingAddress: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="shippingCity"
                    className="block text-xs font-semibold text-emerald-900"
                  >
                    Oraș *
                  </label>
                  <input
                    id="shippingCity"
                    type="text"
                    required
                    value={shippingData.shippingCity}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, shippingCity: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="shippingPostalCode"
                    className="block text-xs font-semibold text-emerald-900"
                  >
                    Cod poștal *
                  </label>
                  <input
                    id="shippingPostalCode"
                    type="text"
                    required
                    value={shippingData.shippingPostalCode}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        shippingPostalCode: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="shippingCountry"
                  className="block text-xs font-semibold text-emerald-900"
                >
                  Țară *
                </label>
                <input
                  id="shippingCountry"
                  type="text"
                  required
                  value={shippingData.shippingCountry}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, shippingCountry: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold text-emerald-900"
                >
                  Telefon
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={shippingData.phone}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, phone: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-xs font-semibold text-emerald-900"
                >
                  Note (opțional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={shippingData.notes}
                  onChange={(e) =>
                    setShippingData({ ...shippingData, notes: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowShippingForm(false);
                    setError(null);
                  }}
                  disabled={isLoading}
                  className="flex-1 rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-full bg-emerald-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Se procesează..." : "Plasează comanda"}
                </button>
              </div>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}

