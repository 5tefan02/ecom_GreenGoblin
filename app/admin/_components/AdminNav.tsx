"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Produse", href: "/admin/products" },
  { label: "Utilizatori", href: "/admin/users" },
];

type AdminNavProps = {
  userDisplayName?: string | null;
};

export default function AdminNav({ userDisplayName }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="mx-auto flex w-full max-w-[1250px] flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.45em] text-emerald-900/60">
          GreenGoblin Admin
        </p>
        <h1 className="mt-1 text-lg font-semibold text-emerald-950">
          Panou de administrare
        </h1>
      </div>

      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-900/80">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {userDisplayName ?? "Administrator"}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-900 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Delogare"
          >
            {isLoggingOut ? "Delogare..." : "Delogare"}
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/50 p-1">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  isActive
                    ? "bg-emerald-900 text-white shadow"
                    : "text-emerald-900/70 hover:bg-white hover:text-emerald-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

