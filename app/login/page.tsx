"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message ?? "Autentificare eșuată");
      }

      // Dacă există un callback URL, folosește-l, altfel redirecționează pe baza rolului
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        // Redirecționează pe baza rolului utilizatorului
        const userRole = data.data?.role;
        if (userRole === "admin") {
          router.push("/admin");
        } else {
          router.push("/account");
        }
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Autentificare eșuată");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-3xl font-bold text-emerald-950">Autentificare</h1>
        <p className="mt-2 text-sm text-emerald-900/70">
          Introdu credențialele tale pentru a accesa contul tău.
        </p>

        <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 placeholder:text-emerald-900/50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
            Parolă
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 placeholder:text-emerald-900/50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </label>

          {error ? (
            <span className="text-sm text-red-600">{error}</span>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Autentificare..." : "Autentifică-te"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-emerald-900/70">
          Nu ai cont?{" "}
          <a href="/register" className="font-semibold text-emerald-900 hover:underline">
            Creează unul aici
          </a>
        </div>
      </div>
    </div>
  );
}

