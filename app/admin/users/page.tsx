import { redirect } from "next/navigation";

import { db } from "@/lib/prismadb";
import { requireUserRole } from "@/lib/auth";
import { UserRoleToggle } from "./_components/UserRoleToggle";

export default async function AdminUsersPage() {
  const user = await requireUserRole(["admin"]);
  if (!user) {
    redirect("/login?callbackUrl=/admin/users");
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-800 to-lime-500 px-10 py-10 text-white shadow-xl">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold md:text-4xl">Administrare utilizatori</h1>
          <p className="mt-2 text-sm text-white/80">
            Vezi toate conturile care au acces la platformă și rolurile asociate.
          </p>
        </div>
      </header>

      <section className="rounded-3xl border border-emerald-100 bg-white px-6 py-6 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-emerald-950">
              Lista utilizatorilor ({users.length})
            </h2>
            <p className="text-sm text-emerald-900/70">
              Poți schimba rolul utilizatorilor (user/admin) direct din tabel. Click pe butonul
              corespunzător pentru a actualiza rolul.
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-emerald-100">
          <table className="min-w-full divide-y divide-emerald-100 bg-white text-left text-sm text-emerald-900">
            <thead className="bg-emerald-50/70 text-xs uppercase tracking-[0.3em] text-emerald-900/70">
              <tr>
                <th className="px-6 py-3">Nume</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Acțiuni</th>
                <th className="px-6 py-3">Creat la</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {users.length === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-center text-sm text-emerald-900/70" colSpan={5}>
                    Încă nu există utilizatori înregistrați.
                  </td>
                </tr>
              ) : (
                users.map((entry) => (
                  <tr key={entry.id} className="hover:bg-emerald-50/50">
                    <td className="px-6 py-4">
                      <p className="font-medium">
                        {entry.name ?? "Utilizator fără nume"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-emerald-900/80">{entry.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
                        {entry.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <UserRoleToggle userId={entry.id} currentRole={entry.role} />
                    </td>
                    <td className="px-6 py-4 text-sm text-emerald-900/70">
                      {entry.createdAt.toLocaleDateString("ro-RO", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
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

