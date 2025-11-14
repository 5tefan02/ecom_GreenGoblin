import Link from "next/link";

const primaryLinks = [
  { label: "Acasă", href: "/" },
  { label: "Comics", href: "/comics" },
  { label: "Figurine", href: "/figurines" },
  { label: "Despre", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const resourceLinks = [
  { label: "Termeni și condiții", href: "/terms" },
  { label: "Politica de confidențialitate", href: "/privacy" },
  { label: "Suport clienți", href: "/support" },
];

const contactItems = [
  { label: "hello@greengoblin.com", href: "mailto:hello@greengoblin.com" },
  { label: "+40 310 000 000", href: "tel:+40310000000" },
];

export default function Footer() {
  // Folosim UTC pentru a evita probleme de timezone între server și client
  const currentYear = new Date().getUTCFullYear();

  return (
    <footer className="mt-24 border-t border-emerald-100 bg-emerald-950 text-emerald-50">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.2fr,1fr,1fr]">
        <div className="space-y-5">
          <div>
            <span className="text-xs uppercase tracking-[0.6em] text-emerald-200">
              GreenGoblin
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-200">
            Navigare
          </h3>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-emerald-100/80">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        
      </div>
    </footer>
  );
}
