import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EarnHubPageGrid } from "@/components/earn/hub-page-grid";
import { EarnInternalLinkSection } from "@/components/earn/internal-link-section";
import { SeoPilotFaqSection } from "@/components/seo-pilot/faq-section";
import { JsonLd } from "@/components/json-ld";
import { loadAppConfig, loadDictionary } from "@/lib/server-config";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { generatePageMetadata } from "@/lib/seo";
import {
  EARN_ASSETS,
  EARN_HUB_COPY,
  EARN_HUB_FAQ,
  buildEarnAssetTrustScore,
  buildYieldOpportunitiesFromOffers,
  buildEarnHubJsonLd,
  earnHubMetadataPath,
  getEarnHubLinkGraph,
  getTopApyForAsset,
} from "@/lib/earn";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  return generatePageMetadata({
    lang,
    path: earnHubMetadataPath(lang),
    title: EARN_HUB_COPY.metaTitle[lang],
    description: EARN_HUB_COPY.metaDescription[lang],
    keywords: ["crypto earn", "defi yield", "usdt apy", "usdc apy", "eth staking", "sol staking"],
  });
}

export default async function EarnHubPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await loadDictionary(lang).catch(() => null);
  if (!dict) notFound();

  const config = await loadAppConfig(lang).catch(() => null);
  const opportunities = config
    ? buildYieldOpportunitiesFromOffers(config.offers)
    : [];

  const topApyByAsset = Object.fromEntries(
    EARN_ASSETS.map((a) => [a.slug, getTopApyForAsset(opportunities, a.slug)]),
  );

  const trustScoreByAsset = Object.fromEntries(
    EARN_ASSETS.map((a) => [
      a.slug,
      buildEarnAssetTrustScore(a, opportunities),
    ]),
  );

  const currentPath = earnHubMetadataPath(lang as Locale);
  const internalLinks = getEarnHubLinkGraph(lang as Locale, currentPath);

  const breadcrumbs = [
    { label: dict.breadcrumbs.home, href: `/${lang}` },
    { label: EARN_HUB_COPY.breadcrumbEarn[lang as Locale] },
  ];

  const jsonLd = buildEarnHubJsonLd({
    lang: lang as Locale,
    title: EARN_HUB_COPY.metaTitle[lang as Locale],
    description: EARN_HUB_COPY.metaDescription[lang as Locale],
    assets: EARN_ASSETS,
    breadcrumbs,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar lang={lang} dict={dict} />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-5 pt-10 pb-16">
          <Breadcrumbs
            ariaLabel={dict.breadcrumbs.ariaLabel}
            items={breadcrumbs}
          />

          <div className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <TrendingUp className="size-3.5" />
              {EARN_HUB_COPY.eyebrow[lang as Locale]}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
              {EARN_HUB_COPY.title[lang as Locale]}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {EARN_HUB_COPY.subtitle[lang as Locale]}
            </p>
          </div>

          <h2 className="mb-4 font-heading text-lg font-bold text-white">
            {EARN_HUB_COPY.hubGridTitle[lang as Locale]}
          </h2>
          <EarnHubPageGrid
            lang={lang as Locale}
            assets={EARN_ASSETS}
            exploreLabel={EARN_HUB_COPY.exploreLabel[lang as Locale]}
            topApyByAsset={topApyByAsset}
            trustScoreByAsset={trustScoreByAsset}
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            <SeoPilotFaqSection
              lang={lang as Locale}
              items={EARN_HUB_FAQ}
              title={EARN_HUB_COPY.faqTitle[lang as Locale]}
            />
            <EarnInternalLinkSection
              title={lang === "ru" ? "Внутренние ссылки" : "Internal links"}
              links={internalLinks}
            />
          </div>
        </section>
      </main>
      <LegalFooter lang={lang} dict={dict} />
    </>
  );
}
