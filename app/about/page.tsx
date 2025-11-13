import Image from "next/image";
import Link from "next/link";


export const metadata = {
  title: "Despre GreenGoblin",
  description:
    "Descoperă povestea GreenGoblin și cum transformăm pasiunea într-un univers pentru colecționari.",
};

const values = [
  {
    title: "Pasiune pentru artă",
    description:
      "Fiecare produs este ales sau creat de artiști și colecționari care trăiesc și respiră universul supereroilor.",
  },
  {
    title: "Calitate colecționabilă",
    description:
      "Lucrăm cu cele mai bune ateliere și editori pentru a oferi obiecte cu valoare reală pentru vitrinele tale.",
  },
  {
    title: "Comunitate activă",
    description:
      "Organizăm livestream-uri, sesiuni Q&A și evenimente private cu artiști, sculptori și scenariști.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-6 pb-24 pt-8">
      <section className="w-full max-w-[1250px]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-800 to-lime-500 px-10 py-16 text-white shadow-xl">
          <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className="text-sm uppercase tracking-[0.4em] text-white/70">
                Povestea GreenGoblin
              </span>
              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                De la o colecție personală la un hub creativ pentru fanii
                universului.
              </h1>
              <p className="mt-4 text-base text-white/85">
                GreenGoblin a apărut în 2015 ca un proiect de weekend într-un
                apartament din București. Astăzi suntem o echipă multidisciplinară
                care aduce colecționarilor din toată lumea povești, artă și experiențe
                imersive cu eroi iconici.
              </p>
            </div>
            <Link
              href="/contact"
              className="w-fit rounded-full bg-white/90 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-emerald-900 transition hover:bg-white"
            >
              Hai să colaborăm
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-16 grid w-full max-w-[1250px] gap-8">
        <div className="grid gap-6 rounded-3xl bg-white p-10 shadow-xl md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-semibold text-emerald-950">
              Cum transformăm pasiunea în experiențe
            </h2>
            <p className="text-sm text-emerald-900/70">
              Suntem obsedați de detaliu: de la selecția edițiilor limitate
              până la modul de împachetare și livrare. Platforma GreenGoblin este
              construită pentru colecționari, ilustratori, sculptori și toți cei care
              simt că poveștile fantastice pot inspira realitatea de zi cu zi.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-950/80">
                  +75 artiști colaboratori
                </h3>
                <p className="mt-2 text-sm text-emerald-900/70">
                  Lucrăm cu ilustratori independenți și studiouri celebre pentru
                  lansări exclusive.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-950/80">
                  12 evenimente anuale
                </h3>
                <p className="mt-2 text-sm text-emerald-900/70">
                  Meet & greet, lansări digitale și expoziții pop-up pentru fanii din
                  comunitate.
                </p>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-200/60 to-lime-300/30 blur-3xl" />
            <Image
              src="/hero_icon.png"
              alt="GreenGoblin community"
              width={360}
              height={360}
              className="relative z-10 drop-shadow-[0_45px_60px_rgba(16,185,129,0.25)]"
            />
          </div>
        </div>
      </section>

      <section className="mt-16 w-full max-w-[1250px]">
        <h2 className="text-3xl font-semibold text-emerald-950">
          Valorile care ne ghidează
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="text-lg font-semibold text-emerald-900">
                {value.title}
              </h3>
              <p className="text-sm text-emerald-900/70">{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 w-full max-w-[1250px]">
        <div className="relative overflow-hidden rounded-3xl bg-emerald-950 px-10 py-14 text-white shadow-xl">
          <div className="absolute -left-16 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold md:text-4xl">
                Experimentează magia GreenGoblin live.
              </h2>
              <p className="mt-4 text-sm text-white/80">
                Participă la evenimentele noastre trimestriale, ateliere de sculptură,
                sesiuni de semnături și expoziții temporare. Urmează Calendarul nostru
                pentru a nu rata locurile limitate.
              </p>
            </div>
            <Link
              href="/events"
              className="w-fit rounded-full bg-white/90 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-emerald-900 transition hover:bg-white"
            >
              Vezi următorul eveniment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

