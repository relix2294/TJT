import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shield } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProtocolGrid } from "@/components/protocols/protocol-grid";
import { HubEmptyRecovery } from "@/components/hub-empty-recovery";
import { TrustContextNote } from "@/components/trust-context-note";
import { ProtocolInternalLinkSection } from "@/components/protocols/internal-link-section";
import { JsonLd } from "@/components/json-ld";
import { loadAppConfig, loadDictionary } from "@/lib/server-config";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { generatePageMetadata } from "@/lib/seo";
import {
  PROTOCOLS_HUB_COPY,
  buildProtocolsFromOffers,
  buildProtocolsHubJsonLd,
  getProtocolsHubLinkGraph,
  protocolsHubMetadataPath,
} from "@/lib/protocols";

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
    path: protocolsHubMetadataPath(lang),
    title: PROTOCOLS_HUB_COPY.metaTitle[lang],
    description: PROTOCOLS_HUB_COPY.metaDescription[lang],
    keywords: [
      "defi protocols",
      "aave review",
      "lido review",
      "jito review",
      "protocol trust score",
      "crypto yield protocols",
    ],
  });
}

export default async function ProtocolsHubPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await loadDictionary(lang).catch(() => null);
  if (!dict) notFound();

  const config = await loadAppConfig(lang).catch(() => null);
  const protocols = config
    ? buildProtocolsFromOffers(config.offers, lang as Locale)
    : [];

  const currentPath = protocolsHubMetadataPath(lang as Locale);
  const internalLinks = getProtocolsHubLinkGraph(
    lang as Locale,
    currentPath,
    protocols,
  );

  const jsonLd = buildProtocolsHubJsonLd({
    lang: lang as Locale,
    title: PROTOCOLS_HUB_COPY.metaTitle[lang as Locale],
    description: PROTOCOLS_HUB_COPY.metaDescription[lang as Locale],
    protocols,
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
              { label: PROTOCOLS_HUB_COPY.breadcrumbProtocols[lang as Locale] },
            ]}
          />

          <div className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Shield className="size-3.5" />
              {PROTOCOLS_HUB_COPY.eyebrow[lang as Locale]}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
              {PROTOCOLS_HUB_COPY.title[lang as Locale]}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {PROTOCOLS_HUB_COPY.subtitle[lang as Locale]}
            </p>
          </div>

          <h2 className="mb-4 font-heading text-lg font-bold text-white">
            {PROTOCOLS_HUB_COPY.gridTitle[lang as Locale]}
          </h2>
          {protocols.length > 0 ? (
            <ProtocolGrid
              lang={lang as Locale}
              protocols={protocols}
              exploreLabel={PROTOCOLS_HUB_COPY.exploreLabel[lang as Locale]}
            />
          ) : (
            <HubEmptyRecovery
              lang={lang as Locale}
              hub="protocols"
              message={
                lang === "ru"
                  ? "Каталог протоколов пуст — CPA-офферы ещё не подключены. Продолжите через сравнения и Earn."
                  : "The protocol catalog is empty — CPA offers are not connected yet. Continue via Compare and Earn."
              }
            />
          )}

          <TrustContextNote lang={lang as Locale} />

          <div className="mt-10">
            <ProtocolInternalLinkSection
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
