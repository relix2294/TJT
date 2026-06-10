import Link from "next/link";
import { ArrowRight, GitCompare } from "lucide-react";
import { compareDetailPath } from "@/lib/compare/paths";
import { getCompareSlugTitle } from "@/lib/compare/content";
import type { CompareSlug } from "@/lib/compare/types";
import type { Asset } from "@/lib/earn/types";
import type { Locale } from "@/lib/i18n";

const ASSET_COMPARE_SLUG: Partial<Record<Asset["slug"], CompareSlug>> = {
  usdt: "best-usdt-yield",
  usdc: "best-usdc-yield",
  eth: "best-eth-staking",
  sol: "best-sol-staking",
};

const ETH_EXTRA_COMPARE: CompareSlug[] = ["best-liquid-staking", "best-eth-restaking"];

type EarnCompareCtaSectionProps = {
  lang: Locale;
  asset: Asset;
};

export function EarnCompareCtaSection({ lang, asset }: EarnCompareCtaSectionProps) {
  const primarySlug = ASSET_COMPARE_SLUG[asset.slug];
  if (!primarySlug) return null;

  const slugs: CompareSlug[] =
    asset.slug === "eth"
      ? [primarySlug, ...ETH_EXTRA_COMPARE]
      : [primarySlug];

  const title =
    lang === "ru"
      ? `Сравнить ${asset.symbol} side-by-side`
      : `Compare ${asset.symbol} side-by-side`;
  const subtitle =
    lang === "ru"
      ? "Live таблицы TJT Compare — APY, сети и Trust Score v0.1 для независимого исследования."
      : "Live TJT Compare tables — APY, chains, and Trust Score v0.1 for independent research.";

  return (
    <section
      aria-label={title}
      className="rounded-2xl border border-primary/30 bg-[--neon-soft]/40 p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/30 bg-[--neon-soft] text-primary">
          <GitCompare className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-lg font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {slugs.map((slug) => (
              <li key={slug}>
                <Link
                  href={compareDetailPath(lang, slug)}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {getCompareSlugTitle(slug)[lang]}
                  <ArrowRight className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
