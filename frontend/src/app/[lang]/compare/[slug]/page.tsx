import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GitCompare } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CompareComparisonTable } from "@/components/compare/comparison-table";
import { CompareTrustOverview } from "@/components/compare/trust-overview-section";
import { CompareInternalLinkSection } from "@/components/compare/internal-link-section";
import { CompareDisclaimer } from "@/components/compare/disclaimer";
import { JsonLd } from "@/components/json-ld";
import { loadAppConfig, loadDictionary } from "@/lib/server-config";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { generatePageMetadata, noIndexMetadata } from "@/lib/seo";
import {
  COMPARE_HUB_COPY,
  COMPARE_SLUGS,
  buildCompareDetailJsonLd,
  buildComparePagesFromOffers,
  compareDetailMetadataPath,
  compareHubPath,
  comparePageMetaDescription,
  comparePageMetaTitle,
  comparePageTitle,
  getComparePage,
  isCompareSlug,
  resolveCompareLocalized,
} from "@/lib/compare";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    COMPARE_SLUGS.map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isCompareSlug(slug)) return {};

  const config = await loadAppConfig(lang).catch(() => null);
  if (!config) return {};

  const pages = buildComparePagesFromOffers(config.offers, lang);
  const page = getComparePage(pages, slug);
  if (!page) {
    return noIndexMetadata(
      lang,
      `/${lang}/compare/${slug}`,
      lang === "ru" ? "Сравнение не найдено" : "Comparison not found",
    );
  }

  const path = compareDetailMetadataPath(lang, page);
  return generatePageMetadata({
    lang,
    path,
    title: comparePageMetaTitle(page, lang),
    description: comparePageMetaDescription(page, lang),
    keywords: [
      slug.replace(/-/g, " "),
      "defi comparison",
      "informational comparison",
      "tjt trust score",
      "market context",
    ],
    ogImageAlt: comparePageTitle(page, lang),
  });
}

export default async function CompareDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isCompareSlug(slug)) notFound();

  const dict = await loadDictionary(lang).catch(() => null);
  if (!dict) notFound();

  const config = await loadAppConfig(lang).catch(() => null);
  if (!config) notFound();

  const pages = buildComparePagesFromOffers(config.offers, lang as Locale);
  const page = getComparePage(pages, slug);
  if (!page) notFound();

  const jsonLd = buildCompareDetailJsonLd({ lang: lang as Locale, page });

  const tableLabels = {
    protocol: lang === "ru" ? "Протокол" : "Protocol",
    apy: "APY",
    tvl: "TVL",
    chain: lang === "ru" ? "Сеть" : "Chain",
    asset: lang === "ru" ? "Актив" : "Asset",
    trustScore: lang === "ru" ? "Trust Score" : "Trust Score",
    risk: lang === "ru" ? "Риск" : "Risk",
    notAvailable: lang === "ru" ? "Н/Д" : "N/A",
    viewProtocol: lang === "ru" ? "Обзор протокола" : "Protocol review",
    viewOffer: lang === "ru" ? "Открыть оффер" : "View offer",
  };

  const comparisonTitle =
    lang === "ru" ? "Таблица сравнения" : "Comparison table";
  const riskTitle =
    lang === "ru" ? "Контекст риска" : "Risk context";
  const relatedTitle =
    lang === "ru" ? "Связанные страницы" : "Related pages";

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
                label: COMPARE_HUB_COPY.breadcrumbCompare[lang as Locale],
                href: compareHubPath(lang as Locale),
              },
              { label: comparePageTitle(page, lang as Locale) },
            ]}
          />

          <div className="mb-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <GitCompare className="size-3.5" />
              {COMPARE_HUB_COPY.eyebrow[lang as Locale]}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
              {comparePageTitle(page, lang as Locale)}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {resolveCompareLocalized(page.summary, lang as Locale)}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              <div>
                <h2 className="mb-4 font-heading text-lg font-bold text-white">
                  {comparisonTitle}
                </h2>
                <CompareComparisonTable
                  lang={lang as Locale}
                  page={page}
                  labels={tableLabels}
                />
              </div>

              <CompareTrustOverview lang={lang as Locale} page={page} />

              <CompareDisclaimer
                lang={lang as Locale}
                disclaimer={page.disclaimer}
                riskExplanation={page.riskExplanation}
                riskTitle={riskTitle}
              />
            </div>

            <aside>
              <CompareInternalLinkSection
                title={relatedTitle}
                links={page.internalLinks}
              />
            </aside>
          </div>
        </section>
      </main>
      <LegalFooter lang={lang} dict={dict} />
    </>
  );
}
