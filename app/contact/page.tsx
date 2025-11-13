import Link from "next/link";

export const metadata = {
  title: "Contact GreenGoblin",
  description: "Intră în legătură cu echipa GreenGoblin pentru suport și colaborări.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-6 pb-24 pt-8">
      <section className="w-full max-w-[1250px]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-700 to-lime-500 px-10 py-16 text-white shadow-xl">
          <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-12 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6">
            <span className="text-sm uppercase tracking-[0.4em] text-white/70">
              Legătura cu GreenGoblin
            </span>
            <h1 className="text-4xl font-bold md:text-5xl">
              Suntem aici pentru comunitatea noastră pasionată.
            </h1>
            <p className="max-w-2xl text-base text-white/80">
              Contactează-ne prin email sau telefon pentru comenzi speciale, colaborări sau orice întrebare. Echipa GreenGoblin îți răspunde în maxim 24 de ore.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 w-full max-w-[1250px]">
        <aside className="mx-auto flex max-w-2xl flex-col gap-8 rounded-3xl bg-emerald-950 p-10 text-white shadow-xl">
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-[0.3em] text-lime-200">
              Detalii contact
            </h3>
            <ul className="mt-4 flex flex-col gap-4 text-sm text-white/80">
              <li>Str. Supereroilor 42, București</li>
              <li>
                <a href="tel:+40310000000" className="hover:text-white">
                  +40 310 000 000
                </a>
              </li>
              <li>
                <a href="mailto:hello@greengoblin.com" className="hover:text-white">
                  hello@greengoblin.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold uppercase tracking-[0.3em] text-lime-200">
              Program servicii
            </h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-white/80">
              <li>Luni – Vineri: 09:00 – 18:00</li>
              <li>Sâmbătă: 10:00 – 14:00</li>
              <li>Duminică: Închis</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold uppercase tracking-[0.3em] text-lime-200">
              Comunitatea noastră
            </h3>
            <p className="mt-3 text-sm text-white/80">
              Urmărește-ne pentru lansări exclusive și evenimente live cu artiștii noștri.
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="https://instagram.com"
                className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium transition hover:border-white hover:bg-white/10"
              >
                Instagram
              </Link>
              <Link
                href="https://tiktok.com"
                className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium transition hover:border-white hover:bg-white/10"
              >
                TikTok
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 text-sm text-white/80">
            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-lime-200">
              Newsletter
            </h4>
            <p className="mt-3">
              Abonează-te pentru a primi noutăți despre colecțiile exclusive și evenimentele private GreenGoblin.
            </p>
            <form className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="email@exemplu.com"
                className="flex-1 rounded-full bg-white/90 px-4 py-2 text-sm text-emerald-900 placeholder:text-emerald-900/60 focus:outline-none focus:ring-2 focus:ring-lime-200"
              />
              <button
                type="submit"
                className="rounded-full bg-lime-200 px-5 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-white"
              >
                Mă abonez
              </button>
            </form>
          </div>
        </aside>
      </section>
    </div>
  );
}

