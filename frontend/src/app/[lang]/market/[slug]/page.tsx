import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  LineChart,
  Newspaper,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { TradingViewChart } from "@/components/trading-view-chart";
import { AiAgentAnalysis } from "@/components/ai-agent-analysis";
import { SimilarAssetsRow } from "@/components/similar-assets-row";
import { OfferButton } from "@/components/offer-button";
import { GlassPanel } from "@/components/glass-panel";
import { Badge } from "@/components/ui/badge";
import {
  findMarketBySlug,
  loadAppConfig,
  loadDictionary,
} from "@/lib/server-config";
import { fmtNewsDate, fmtPct, fmtUsd2 } from "@/lib/format";
import {
  filterNewsByAsset,
  interpolateCoin,
  resolveRelatedAssets,
  symbolToCalculatorAsset,
} from "@/lib/market-utils";
import { offerMatchesAsset } from "@/lib/calculator-assets";
import { LOCALES, isLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of LOCALES) {
    const config = await loadAppConfig(lang).catch(() => null);
    if (!config) continue;
    for (const asset of config.market) {
      params.push({ lang, slug: asset.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const dict = await loadDictionary(lang).catch(() => null);
  const asset = await findMarketBySlug(slug, lang).catch(() => undefined);

  if (!asset) {
    return {
      title: dict?.marketDetail.notFoundTitle,
      description: dict?.marketDetail.notFoundDesc,
      robots: { index: false, follow: true },
    };
  }

  const url = `/${lang}/market/${asset.slug}`;
  const title = `${asset.name} (${asset.symbol}) — ${dict?.marketDetail.metaTitleSuffix}`;

  return {
    title: `${title} | TJT`,
    description: asset.aiRecommendation.rationale,
    alternates: {
      canonical: url,
      languages: {
        en: `/en/market/${asset.slug}`,
        ru: `/ru/market/${asset.slug}`,
      },
    },
    openGraph: { type: "website", title, url, description: asset.aiRecommendation.rationale },
  };
}

const SENTIMENT_STYLES = {
  Greed: "border-profit/40 bg-profit/10 text-profit",
  Neutral: "border-border/60 bg-white/5 text-muted-foreground",
  Fear: "border-loss/40 bg-loss/10 text-loss",
} as const;

export default async function MarketAssetPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const [config, asset] = await Promise.all([
    loadAppConfig(lang).catch(() => null),
    findMarketBySlug(slug, lang).catch(() => undefined),
  ]);

  if (!config || !asset) notFound();

  const dict = config.dict;
  const t = dict.marketDetail;
  const calcAsset = symbolToCalculatorAsset(asset.symbol);

  const relevantOffers = config.offers
    .filter((offer) => (calcAsset ? offerMatchesAsset(offer, calcAsset) : true))
    .sort((a, b) => b.apy - a.apy)
    .slice(0, 4);

  const assetNews = filterNewsByAsset(config.news, asset).slice(0, 4);
  const similarAssets = resolveRelatedAssets(asset, config.market, 4);

  return (
    <>
      <Navbar lang={lang} dict={dict} />
      <main className="flex-1 bg-[#0B0E11]">
        <section className="relative overflow-hidden border-b border-white/[0.06]">
          <div className="grid-noise pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-5">
            <Breadcrumbs
              ariaLabel={dict.breadcrumbs.ariaLabel}
              items={[
                { label: dict.breadcrumbs.home, href: `/${lang}` },
                { label: dict.breadcrumbs.market, href: `/${lang}/market` },
                { label: `${asset.name} (${asset.symbol})` },
              ]}
            />

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <LineChart className="size-3.5" />
                  {dict.marketHub.terminalBadge}
                </span>
                <h1 className="font-heading mt-2 text-3xl font-bold text-foreground sm:text-4xl">
                  {asset.name}{" "}
                  <span className="text-muted-foreground">({asset.symbol})</span>
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {t.priceLabel}
                  </p>
                  <p className="font-numeric text-2xl font-bold tabular-nums text-foreground">
                    {fmtUsd2(asset.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {t.change24hLabel}
                  </p>
                  <p
                    className={cn(
                      "font-numeric text-lg font-bold tabular-nums",
                      asset.change24h >= 0 ? "text-profit" : "text-loss",
                    )}
                  >
                    {fmtPct(asset.change24h)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn("h-7 px-2 text-xs font-semibold", SENTIMENT_STYLES[asset.aiSentiment])}
                >
                  {t.sentimentLabel}: {asset.aiSentiment}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-5 sm:py-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-5">
            <div className="lg:col-span-8">
              <TradingViewChart symbol={asset.symbol} dict={dict} locale={lang} />
            </div>
            <div className="lg:col-span-4">
              <AiAgentAnalysis recommendation={asset.aiRecommendation} dict={dict} />
            </div>
          </div>

          <SimilarAssetsRow lang={lang} dict={dict} assets={similarAssets} />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-5">
            <aside className="lg:col-span-4">
              <GlassPanel
                eyebrow="CPA"
                title={interpolateCoin(t.whereToBuy, asset.name)}
                icon={TrendingUp}
                className="h-full"
              >
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  {t.whereToBuyDesc}
                </p>
                {relevantOffers.length === 0 ? (
                  <p className="text-xs text-muted-foreground">{dict.offers.error}</p>
                ) : (
                  <ul className="space-y-3">
                    {relevantOffers.map((offer) => (
                      <li
                        key={offer.id}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all duration-200 hover:border-primary/30"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/${lang}/offers/${offer.slug}`}
                              className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
                            >
                              {offer.name}
                            </Link>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {offer.protocol} · {offer.network}
                            </p>
                          </div>
                          <span className="font-numeric shrink-0 text-base font-bold text-profit">
                            {offer.apy.toFixed(1)}%
                          </span>
                        </div>
                        <div className="mt-3">
                          <OfferButton
                            offer={offer}
                            dict={dict}
                            lang={lang}
                            label={dict.home.getOffer}
                            className="h-8 w-full text-xs"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </GlassPanel>
            </aside>

            {assetNews.length > 0 ? (
              <div className="lg:col-span-8">
                <GlassPanel
                  eyebrow={dict.newsHub.eyebrow}
                  title={interpolateCoin(t.newsAbout, asset.name)}
                  icon={Newspaper}
                  className="h-full"
                >
                  <ul className="divide-y divide-border/60">
                    {assetNews.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/${lang}/news/${item.slug}`}
                          className="group flex items-start justify-between gap-4 py-4 transition-colors first:pt-0 last:pb-0 hover:text-primary"
                        >
                          <div>
                            <Badge
                              variant="outline"
                              className="mb-2 h-5 border-border/60 px-1.5 text-[10px]"
                            >
                              {dict.newsCategories[item.category]}
                            </Badge>
                            <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                              {item.title}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                              {item.description}
                            </p>
                            <time className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                              <CalendarDays className="size-3" />
                              {fmtNewsDate(item.publishedAt, lang)}
                            </time>
                          </div>
                          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${lang}/news`}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary"
                  >
                    {dict.ticker.all}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </GlassPanel>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <LegalFooter lang={lang} dict={dict} />
    </>
  );
}
