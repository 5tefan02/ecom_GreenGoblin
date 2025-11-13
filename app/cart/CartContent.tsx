"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/app/context/cart";
import { formatCurrency } from "@/lib/formatters";

export function CartContent() {
  const { items, removeItem, clearCart, total } = useCart();

  const hasItems = items.length > 0;

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

          <p className="mt-6 text-xs text-emerald-900/70">
            Stripe va fi integrat curând, dar poți finaliza o comandă demo pentru a simula
            experiența completă.
          </p>

          <button
            type="button"
            onClick={() => {
              clearCart();
              alert("Bravo fane! Comanda a fost plasată. (demo)");
            }}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-emerald-800"
          >
            Cumpără acum
          </button>
        </aside>
      </div>
    </div>
  );
}

