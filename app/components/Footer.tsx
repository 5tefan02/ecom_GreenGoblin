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
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Colecții create pentru fani adevărați
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-emerald-200/80">
            Construim o platformă pentru colecționarii care caută produse autentice,
            povești memorabile și o comunitate caldă. Rămânem aproape de artiști,
            editori și fani pentru a aduce mereu ceva nou.
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-medium uppercase tracking-[0.2em] text-emerald-200/60">
            <span>Comunitate</span>
            <span>Evenimente</span>
            <span>Drop-uri limitate</span>
            <span>Preview-uri exclusive</span>
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

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-200">
            Resurse
          </h3>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-emerald-100/80">
            {resourceLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.4em] text-emerald-200">
            Contact
          </h3>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-emerald-100/80">
            <li>Str. Supereroilor 42, București</li>
            {contactItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-emerald-800 bg-emerald-900/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-emerald-200/70 md:flex-row md:items-center md:justify-between">
          <span>© {currentYear} GreenGoblin. Toate drepturile rezervate.</span>
          <div className="flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              Facebook
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
