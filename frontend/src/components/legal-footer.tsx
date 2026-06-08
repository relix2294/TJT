import Link from "next/link";
import {
  Scale,
  AtSign,
  Send,
  MessageSquare,
  GitBranch,
  ShieldCheck,
} from "lucide-react";
import { SITE, SOCIAL_LINKS, type Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

const SOCIAL_ICONS: Record<string, typeof AtSign> = {
  "X (Twitter)": AtSign,
  Telegram: Send,
  Discord: MessageSquare,
  GitHub: GitBranch,
};

/** Resolve relative paths and in-page anchors to the active locale. */
function localizeHref(href: string, lang: Locale): string {
  if (href.startsWith("#")) return `/${lang}${href}`;
  if (href.startsWith("/")) return `/${lang}${href}`;
  return href;
}

export function LegalFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.footer;

  return (
    <footer
      id="legal"
      className="relative mt-24 scroll-mt-20 overflow-hidden border-t border-white/[0.06] bg-[#0b0c11]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl px-5 py-14">
        {/* Top: brand + link columns */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Link href={`/${lang}`} className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-lg text-primary">
                ◆
              </span>
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                {SITE.name}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {dict.site.tagline}. {t.tagline}
            </p>

            <div className="mt-6 flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => {
                const Icon = SOCIAL_ICONS[s.label] ?? AtSign;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid size-9 place-items-center rounded-lg border border-border/60 bg-white/[0.03] text-muted-foreground transition-colors hover:border-primary/50 hover:bg-[--neon-soft] hover:text-primary"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {t.columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={localizeHref(link.href, lang)}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Risk disclosure */}
        <div className="mt-12 rounded-2xl border border-border/60 bg-background/40 p-6 sm:p-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Scale className="size-4 text-primary" />
            {dict.risk.heading}
          </div>
          <div className="space-y-3">
            {dict.risk.paragraphs.map((p, i) => (
              <p key={i} className="text-xs leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Bottom bar: status + meta */}
        <div className="mt-10 flex flex-col gap-4 border-t border-border/50 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-profit/30 bg-profit/10 px-3 py-1 text-xs font-semibold text-profit">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-pulse-dot rounded-full bg-profit/70" />
                <span className="relative inline-flex size-2 rounded-full bg-profit" />
              </span>
              {t.statusLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs">
              <ShieldCheck className="size-3.5 text-primary" />
              {t.nonCustodialLabel}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-primary">◆</span>
            <span className="font-heading font-bold text-white">{SITE.name}</span>
            <span className="text-muted-foreground/60">v{SITE.version}</span>
            <span className="text-muted-foreground/40">·</span>
            <span>© {new Date().getFullYear()} {SITE.name}</span>
          </div>
        </div>

        <p className="mt-4 text-[0.7rem] leading-relaxed text-muted-foreground/70">
          {SITE.model}. {t.academyNote}
        </p>
      </div>
    </footer>
  );
}
