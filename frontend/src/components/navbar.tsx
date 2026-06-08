import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import type { Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

export function Navbar({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const nav = [
    { href: `/${lang}/news`, label: dict.nav.news },
    { href: `/${lang}/market`, label: dict.nav.market },
    { href: `/${lang}/offers`, label: dict.nav.yield },
    { href: `/${lang}/tools/roi-calculator`, label: dict.nav.calculator },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-lg text-primary">
            ◆
          </span>
          <span className="font-heading text-lg font-bold tracking-tight text-white">
            TJT
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            render={<Link href={`/${lang}/offers`} />}
            size="sm"
            className="hidden rounded-lg bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 md:inline-flex"
          >
            {dict.nav.cta}
          </Button>
          <MobileNav lang={lang} items={nav} dict={dict} />
        </div>
      </div>
    </header>
  );
}
