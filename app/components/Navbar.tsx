"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/app/context/cart";

const navItems = [
  { label: "Acasă", href: "/" },
  { label: "Comics", href: "/comics" },
  { label: "Figurine", href: "/figurines" },
  { label: "Despre", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<{ role: string } | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch {
      // Utilizatorul nu este autentificat
      setUser(null);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    // Obține informațiile utilizatorului curent
    fetchUser();
  }, []);

  // Reîmprospătează utilizatorul când se schimbă pathname-ul
  useEffect(() => {
    if (isMounted) {
      fetchUser();
    }
  }, [pathname, isMounted]);

  const cartBadge = useMemo(() => {
    if (!isMounted || count === 0) return null;
    return (
      <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-900 px-1.5 text-[11px] font-semibold text-white">
        {count}
      </span>
    );
  }, [count, isMounted]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleAccountClick = () => {
    if (!user) {
      router.push("/login");
    } else if (user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/account");
    }
  };

  return (
    <header className="border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-3 text-emerald-900">
          <span className="relative block h-10 w-10 overflow-hidden rounded-full border border-emerald-200 bg-emerald-50">
            <Image
              src="/logo.png"
              alt="Emblema GreenGoblin"
              fill
              sizes="40px"
              className="object-contain"
              priority
            />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold uppercase tracking-[0.4em] text-emerald-700">
              Green
            </span>
            <span className="text-lg font-semibold text-emerald-950">Goblin Collectibles</span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-emerald-800">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={isActive(item.href)}
              className="rounded-full px-4 py-2 transition-colors data-[active=true]:bg-emerald-100 data-[active=true]:text-emerald-950 hover:bg-emerald-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAccountClick}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 transition hover:border-emerald-300 hover:bg-emerald-100"
            aria-label={user ? (user.role === "admin" ? "Panou admin" : "Contul meu") : "Autentificare"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5 text-emerald-900"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </button>
          <Link href="/cart" className="relative flex h-11 w-11 items-center justify-center">
            <span className="sr-only">Vezi coșul</span>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 transition hover:border-emerald-300 hover:bg-emerald-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5 text-emerald-900"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386a1.125 1.125 0 0 1 1.1.892L5.7 8.25m0 0h12.09a1.125 1.125 0 0 1 1.107 1.294l-1.2 6.75a1.125 1.125 0 0 1-1.107.906H7.831a1.125 1.125 0 0 1-1.107-.906L5.7 8.25Zm0 0L5.1 5.25"
                />
                <circle cx="9.75" cy="19.5" r="1" />
                <circle cx="17.25" cy="19.5" r="1" />
              </svg>
              {cartBadge}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
