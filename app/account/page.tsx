import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "./_components/LogoutButton";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/account");
  }

  // Dacă utilizatorul este admin, redirecționează la pagina admin
  if (user.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 px-6 pb-24 pt-8">
      <section className="w-full max-w-6xl">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-800 to-lime-500 px-10 py-16 text-white shadow-xl">
          <div className="max-w-3xl">
            <span className="text-sm uppercase tracking-[0.4em] text-white/70">
              Contul meu
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Bun venit, {user.name ?? user.email}!
            </h1>
            <p className="mt-4 text-base text-white/85">
              Aici poți vedea comenzile tale și gestiona informațiile contului.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 w-full max-w-6xl">
        <div className="rounded-3xl border border-emerald-100 bg-white px-8 py-10 shadow-xl">
          <h2 className="text-2xl font-semibold text-emerald-950">Comenzile mele</h2>
          <p className="mt-2 text-sm text-emerald-900/70">
            Aici vei vedea toate comenzile tale când va fi implementat sistemul de comenzi.
          </p>

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
              Comenzile tale vor apărea aici când va fi implementat sistemul de comenzi.
            </p>
          </div>
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

