import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import type { Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

export function Navbar({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const nav = [
    { href: `/${lang}/compare`, label: dict.nav.compare },
    { href: `/${lang}/earn`, label: dict.nav.earn },
    { href: `/${lang}/offers`, label: dict.nav.offers },
    { href: `/${lang}/protocols`, label: dict.nav.protocols },
    { href: `/${lang}/reviews`, label: dict.nav.reviews },
    { href: `/${lang}/safety`, label: dict.nav.safety },
    { href: `/${lang}/learn`, label: dict.nav.academy },
    { href: `/${lang}/market`, label: dict.nav.market },
    { href: `/${lang}/news`, label: dict.nav.news },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-lg text-primary">
            ◆
          </span>
          <span className="font-heading text-lg font-bold tracking-tight text-white">
            TJT
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            render={<Link href={`/${lang}/compare`} />}
            size="sm"
            className="hidden rounded-lg bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 lg:inline-flex"
          >
            {dict.nav.cta}
          </Button>
          <MobileNav lang={lang} items={nav} dict={dict} />
        </div>
      </div>
    </header>
  );
}
