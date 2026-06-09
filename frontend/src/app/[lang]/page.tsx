import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { loadAppConfig } from "@/lib/server-config";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { HomeTerminal } from "@/components/home-terminal";
import { HomeMarketplaceHero } from "@/components/home-marketplace-hero";
import { HomeEntryCards } from "@/components/home-entry-cards";
import { HomeFeaturedCompare } from "@/components/home-featured-compare";
import { HomeTrustScoreSection } from "@/components/home-trust-score-section";
import { JsonLd } from "@/components/json-ld";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/seo/json-ld";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ lang: string }> };

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  let config: Awaited<ReturnType<typeof loadAppConfig>> | null = null;
  try {
    config = await loadAppConfig(lang);
  } catch {
    config = null;
  }

  if (!config) notFound();

  const dict = config.dict;
  const homePath = `/${lang}`;
  const jsonLd = [
    buildWebSiteSchema({
      lang: lang as Locale,
      path: homePath,
      description: dict.site.metaDescription,
    }),
    buildOrganizationSchema({
      url: homePath,
      description: dict.site.metaDescription,
    }),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar lang={lang as Locale} dict={dict} />
      <main className="flex-1 bg-neutral-950">
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-5 sm:py-8">
          <HomeMarketplaceHero lang={lang as Locale} dict={dict} />

          <HomeEntryCards lang={lang as Locale} dict={dict} />

          <HomeFeaturedCompare lang={lang as Locale} dict={dict} />

          <HomeTrustScoreSection lang={lang as Locale} dict={dict} />

          <HomeTerminal
            lang={lang as Locale}
            dict={dict}
            benchmarks={config.benchmarks}
            offers={config.offers ?? []}
            news={(config.news ?? []).slice(0, 5)}
            initialMarket={(config.market ?? []).slice(0, 15)}
          />
        </div>
      </main>
      <LegalFooter lang={lang as Locale} dict={dict} />
    </>
  );
}
