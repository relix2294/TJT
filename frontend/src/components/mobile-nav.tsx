"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

export function MobileNav({
  lang,
  items,
  dict,
}: {
  lang: Locale;
  items: NavItem[];
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative grid size-10 place-items-center rounded-lg border border-border/60 bg-white/5 text-white transition-colors hover:bg-white/10"
      >
        <Menu
          className={cn(
            "absolute size-5 transition-all duration-300",
            open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
          )}
        />
        <X
          className={cn(
            "absolute size-5 transition-all duration-300",
            open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
          )}
        />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-background/60 backdrop-blur-md transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Slide-in panel */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-dvh w-[82%] max-w-xs flex-col gap-1 border-l border-white/[0.07] p-6 shadow-[0_0_60px_-20px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out",
          "bg-[color-mix(in_oklab,var(--surface)_82%,transparent)] backdrop-blur-2xl",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-lg text-primary">
              ◆
            </span>
            <span className="font-heading text-lg font-bold text-white">TJT</span>
          </span>
          <button
            type="button"
            aria-label={dict.nav.closeMenu}
            onClick={() => setOpen(false)}
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button
          render={<Link href={`/${lang}/offers`} onClick={() => setOpen(false)} />}
          className="mt-4 h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {dict.nav.cta}
        </Button>

        <p className="mt-auto pt-6 text-xs text-muted-foreground/70">
          {dict.nav.mobileTagline}
        </p>
      </aside>
    </div>
  );
}
