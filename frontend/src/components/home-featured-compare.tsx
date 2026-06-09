import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { compareDetailPath } from "@/lib/compare/paths";
import type { CompareSlug } from "@/lib/compare/types";
import type { Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

const FEATURED_SLUGS: CompareSlug[] = [
  "best-usdt-yield",
  "best-usdc-yield",
  "best-eth-staking",
  "best-sol-staking",
  "morpho-vs-aave",
  "lido-vs-rocket-pool",
];

export function HomeFeaturedCompare({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const t = dict.homeMarketplace;
  const labels = t.featuredLinks;

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
      <header className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
          {t.featuredEyebrow}
        </p>
        <h2 className="font-heading text-lg font-bold text-white">{t.featuredTitle}</h2>
        <p className="mt-1 text-xs text-slate-500">{t.featuredDesc}</p>
      </header>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_SLUGS.map((slug, i) => (
          <Link
            key={slug}
            href={compareDetailPath(lang, slug)}
            className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2.5 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5"
          >
            <span className="text-sm font-medium text-slate-200 group-hover:text-emerald-400">
              {labels[i] ?? slug}
            </span>
            <ChevronRight className="size-4 shrink-0 text-slate-600 transition-colors group-hover:text-emerald-500" />
          </Link>
        ))}
      </div>

      <Link
        href={`/${lang}/compare`}
        className="mt-4 inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-500 transition-colors hover:text-emerald-400"
      >
        {t.featuredCta}
        <ChevronRight className="size-3.5" />
      </Link>
    </section>
  );
}
