"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message ?? "Nu am putut crea contul.");
      }

      setSuccess("Cont creat cu succes. Poți să te autentifici acum.");
      setEmail("");
      setPassword("");
      setName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare la crearea contului.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">
        <h1 className="text-3xl font-bold text-emerald-950">Creează un cont</h1>
        <p className="mt-2 text-sm text-emerald-900/70">
          Formular simplu pentru a genera un cont nou. Ai grijă să securizezi această pagină
          după ce adaugi utilizatorii necesari.
        </p>

        <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
            Nume
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Green Goblin"
              className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-emerald-900 placeholder:text-emerald-900/50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
          </label>

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

          {error ? <span className="text-sm text-red-600">{error}</span> : null}
          {success ? <span className="text-sm text-emerald-700">{success}</span> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creăm contul..." : "Creează cont"}
          </button>
        </form>
      </div>
    </div>
  );
}

