import { ReactNode } from "react";

import { getCurrentUser } from "@/lib/auth";

import AdminNav from "./_components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-emerald-100 bg-white shadow-sm">
        <AdminNav userDisplayName={user?.name ?? user?.email ?? "Administrator"} />
      </header>
      <main className="mx-auto w-full max-w-[1250px] px-6 py-10">{children}</main>
    </div>
  );
}

