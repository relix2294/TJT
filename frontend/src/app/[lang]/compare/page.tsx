import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GitCompare } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CompareGrid } from "@/components/compare/compare-grid";
import { CompareInternalLinkSection } from "@/components/compare/internal-link-section";
import { CompareDisclaimer } from "@/components/compare/disclaimer";
import { JsonLd } from "@/components/json-ld";
import { loadAppConfig, loadDictionary } from "@/lib/server-config";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { generatePageMetadata } from "@/lib/seo";
import {
  COMPARE_HUB_COPY,
  COMPARE_LEGAL_DISCLAIMER,
  buildCompareHubJsonLd,
  buildComparePagesFromOffers,
  compareHubMetadataPath,
  getCompareHubLinkGraph,
} from "@/lib/compare";

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
    path: compareHubMetadataPath(lang),
    title: COMPARE_HUB_COPY.metaTitle[lang],
    description: COMPARE_HUB_COPY.metaDescription[lang],
    keywords: [
      "defi comparison",
      "protocol comparison",
      "yield comparison",
      "aave vs lido",
      "eth staking comparison",
      "tjt trust score",
    ],
    ogImageAlt: "TJT DeFi Comparisons",
  });
}

export default async function CompareHubPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await loadDictionary(lang).catch(() => null);
  if (!dict) notFound();

  const config = await loadAppConfig(lang).catch(() => null);
  const pages = config
    ? buildComparePagesFromOffers(config.offers, lang as Locale)
    : [];

  const currentPath = compareHubMetadataPath(lang as Locale);
  const internalLinks = getCompareHubLinkGraph(lang as Locale, currentPath);

  const jsonLd = buildCompareHubJsonLd({
    lang: lang as Locale,
    title: COMPARE_HUB_COPY.metaTitle[lang as Locale],
    description: COMPARE_HUB_COPY.metaDescription[lang as Locale],
    pages,
  });

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
              { label: COMPARE_HUB_COPY.breadcrumbCompare[lang as Locale] },
            ]}
          />

          <div className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <GitCompare className="size-3.5" />
              {COMPARE_HUB_COPY.eyebrow[lang as Locale]}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
              {COMPARE_HUB_COPY.title[lang as Locale]}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {COMPARE_HUB_COPY.subtitle[lang as Locale]}
            </p>
          </div>

          <h2 className="mb-4 font-heading text-lg font-bold text-white">
            {COMPARE_HUB_COPY.gridTitle[lang as Locale]}
          </h2>
          <CompareGrid
            lang={lang as Locale}
            pages={pages}
            exploreLabel={COMPARE_HUB_COPY.exploreLabel[lang as Locale]}
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            <CompareDisclaimer lang={lang as Locale} disclaimer={COMPARE_LEGAL_DISCLAIMER} />
            <CompareInternalLinkSection
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
