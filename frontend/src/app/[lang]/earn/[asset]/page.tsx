import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EarnContentBlocks } from "@/components/earn/content-blocks";
import { EarnOpportunityList } from "@/components/earn/opportunity-list";
import { EarnInternalLinkSection } from "@/components/earn/internal-link-section";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { loadAppConfig, loadDictionary } from "@/lib/server-config";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { dedupeInternalLinks, generatePageMetadata } from "@/lib/seo";
import {
  DEFAULT_TRUST_SCORE_PLACEHOLDER,
  EARN_ASSET_SLUGS,
  EARN_HUB_COPY,
  buildEarnAssetContentBlocks,
  buildEarnAssetJsonLd,
  buildYieldOpportunitiesFromOffers,
  earnAssetMetaDescription,
  earnAssetMetaTitle,
  earnAssetMetadataPath,
  earnHubPath,
  getEarnAsset,
  getEarnOfferLinks,
  getEarnToMarketLinks,
  getOpportunitiesForAsset,
  getRelatedEarnAssetLinks,
  getTopApyForAsset,
  isEarnAssetSlug,
  resolveLocalized,
} from "@/lib/earn";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ lang: string; asset: string }> };

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    EARN_ASSET_SLUGS.map((asset) => ({ lang, asset })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, asset: assetSlug } = await params;
  if (!isLocale(lang) || !isEarnAssetSlug(assetSlug)) return {};

  const earnAsset = getEarnAsset(assetSlug);
  if (!earnAsset) return {};

  const path = earnAssetMetadataPath(lang, earnAsset);
  return generatePageMetadata({
    lang,
    path,
    title: earnAssetMetaTitle(earnAsset, lang),
    description: earnAssetMetaDescription(earnAsset, lang),
    keywords: [
      `${earnAsset.symbol} earn`,
      `${earnAsset.symbol} yield`,
      `${earnAsset.symbol} apy`,
      "defi",
      "non-custodial",
    ],
  });
}

export default async function EarnAssetPage({ params }: PageProps) {
  const { lang, asset: assetSlug } = await params;
  if (!isLocale(lang) || !isEarnAssetSlug(assetSlug)) notFound();

  const earnAsset = getEarnAsset(assetSlug);
  if (!earnAsset) {
    return notFound();
  }

  const dict = await loadDictionary(lang).catch(() => null);
  if (!dict) notFound();

  const config = await loadAppConfig(lang).catch(() => null);
  const opportunities = config
    ? getOpportunitiesForAsset(
        buildYieldOpportunitiesFromOffers(config.offers),
        earnAsset.slug,
      )
    : [];

  const topApy = getTopApyForAsset(opportunities, earnAsset.slug);
  const contentBlocks = buildEarnAssetContentBlocks(
    earnAsset,
    lang as Locale,
    DEFAULT_TRUST_SCORE_PLACEHOLDER,
  );

  const currentPath = earnAssetMetadataPath(lang, earnAsset);
  const internalLinks = dedupeInternalLinks([
    ...getRelatedEarnAssetLinks(lang as Locale, earnAsset.slug),
    ...getEarnOfferLinks(lang as Locale, opportunities),
    ...(config
      ? getEarnToMarketLinks(
          lang as Locale,
          earnAsset,
          config.market.map((m) => ({
            slug: m.slug,
            symbol: m.symbol,
            name: m.name,
          })),
        )
      : []),
  ]);

  const jsonLd = buildEarnAssetJsonLd({
    lang: lang as Locale,
    asset: earnAsset,
    opportunities,
    topApy,
  });

  const opportunitiesTitle =
    lang === "ru"
      ? `Лучшие маршруты ${earnAsset.symbol}`
      : `Top ${earnAsset.symbol} yield routes`;

  const emptyOpportunities =
    lang === "ru"
      ? "Каталог CPA пока не содержит маршрутов для этого актива. Страница готова к AI-контенту."
      : "No CPA catalog routes for this asset yet. Page is ready for AI-generated content.";

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar lang={lang} dict={dict} />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-5 pt-10 pb-16">
          <Breadcrumbs
            ariaLabel={dict.breadcrumbs.ariaLabel}
            items={[
              { label: dict.breadcrumbs.home, href: `/${lang}` },
              {
                label: EARN_HUB_COPY.breadcrumbEarn[lang as Locale],
                href: earnHubPath(lang as Locale),
              },
              { label: earnAsset.symbol },
            ]}
          />

          <div className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <TrendingUp className="size-3.5" />
              {EARN_HUB_COPY.eyebrow[lang as Locale]}
            </span>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                {resolveLocalized(earnAsset.name, lang as Locale)} ({earnAsset.symbol}) Earn
              </h1>
              <Badge variant="secondary" className="text-[10px] uppercase">
                {earnAsset.category}
              </Badge>
            </div>
            <p className="mt-3 text-muted-foreground">
              {resolveLocalized(earnAsset.description, lang as Locale)}
            </p>
            {topApy != null ? (
              <p className="mt-4 text-sm font-semibold text-profit">
                {lang === "ru" ? "Лучший APY в каталоге" : "Top catalog APY"}: {topApy}%
              </p>
            ) : null}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              <section>
                <h2 className="mb-4 font-heading text-lg font-bold text-white">
                  {opportunitiesTitle}
                </h2>
                <EarnOpportunityList
                  lang={lang as Locale}
                  opportunities={opportunities}
                  emptyLabel={emptyOpportunities}
                />
              </section>
              <EarnContentBlocks blocks={contentBlocks} />
            </div>

            <aside className="space-y-4">
              <EarnInternalLinkSection
                title={lang === "ru" ? "Связанные страницы" : "Related pages"}
                links={internalLinks}
              />
            </aside>
          </div>
        </section>
      </main>
      <LegalFooter lang={lang} dict={dict} />
    </>
  );
}
