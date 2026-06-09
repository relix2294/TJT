import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shield } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProtocolContentBlocks } from "@/components/protocols/content-blocks";
import { ProtocolEarnOpportunities } from "@/components/protocols/earn-opportunities";
import { ProtocolInternalLinkSection } from "@/components/protocols/internal-link-section";
import { ProtocolLinkedOffers } from "@/components/protocols/linked-offers";
import { ProtocolSupportedAssets } from "@/components/protocols/supported-assets";
import { ProtocolSupportedChains } from "@/components/protocols/supported-chains";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { loadAppConfig, loadDictionary } from "@/lib/server-config";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { dedupeInternalLinks, generatePageMetadata, noIndexMetadata } from "@/lib/seo";
import {
  PROTOCOLS_HUB_COPY,
  PROTOCOL_SLUGS,
  buildProtocolContentBlocks,
  buildProtocolDetailJsonLd,
  buildProtocolsFromOffers,
  getProtocol,
  getProtocolComparePlaceholderLinks,
  getProtocolEarnAssetLinks,
  getProtocolOfferLinks,
  getRelatedProtocolLinks,
  isProtocolSlug,
  protocolDetailMetadataPath,
  protocolMetaDescription,
  protocolMetaTitle,
  protocolsHubPath,
  resolveProtocolLocalized,
} from "@/lib/protocols";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    PROTOCOL_SLUGS.map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isProtocolSlug(slug)) return {};

  const config = await loadAppConfig(lang).catch(() => null);
  if (!config) return {};

  const protocols = buildProtocolsFromOffers(config.offers, lang);
  const protocol = getProtocol(protocols, slug);
  if (!protocol) {
    return noIndexMetadata(
      lang,
      `/${lang}/protocols/${slug}`,
      lang === "ru" ? "Протокол не найден" : "Protocol not found",
    );
  }

  const path = protocolDetailMetadataPath(lang, protocol);
  return generatePageMetadata({
    lang,
    path,
    title: protocolMetaTitle(protocol, lang),
    description: protocolMetaDescription(protocol, lang),
    keywords: [
      `${protocol.name} protocol`,
      `${protocol.name} review`,
      `${protocol.name} defi`,
      "trust score",
      "yield protocol",
    ],
    ogImageAlt: `${protocol.name} Protocol Review`,
  });
}

export default async function ProtocolDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isProtocolSlug(slug)) notFound();

  const dict = await loadDictionary(lang).catch(() => null);
  if (!dict) notFound();

  const config = await loadAppConfig(lang).catch(() => null);
  if (!config) notFound();

  const protocols = buildProtocolsFromOffers(config.offers, lang as Locale);
  const protocol = getProtocol(protocols, slug);
  if (!protocol) notFound();

  const contentBlocks = buildProtocolContentBlocks(protocol, lang as Locale);
  const currentPath = protocolDetailMetadataPath(lang, protocol);

  const internalLinks = dedupeInternalLinks([
    ...getRelatedProtocolLinks(lang as Locale, protocol.slug, protocols),
    ...getProtocolEarnAssetLinks(lang as Locale, protocol),
    ...getProtocolOfferLinks(lang as Locale, protocol),
    ...getProtocolComparePlaceholderLinks(lang as Locale, protocol),
  ]);

  const jsonLd = buildProtocolDetailJsonLd({
    lang: lang as Locale,
    protocol,
  });

  const supportedAssetsTitle =
    lang === "ru" ? "Поддерживаемые активы" : "Supported assets";
  const supportedChainsTitle =
    lang === "ru" ? "Поддерживаемые сети" : "Supported chains";
  const earnOpportunitiesTitle =
    lang === "ru"
      ? `Earn-маршруты ${protocol.name}`
      : `${protocol.name} earn routes`;
  const linkedOffersTitle =
    lang === "ru" ? "Связанные офферы" : "Linked offers";
  const earnLabel = lang === "ru" ? "Earn" : "Earn";
  const emptyEarn =
    lang === "ru"
      ? "Каталог CPA пока не содержит earn-маршрутов для этого протокола."
      : "No CPA catalog earn routes for this protocol yet.";
  const emptyOffers =
    lang === "ru"
      ? "Каталог CPA пока не содержит офферов для этого протокола."
      : "No CPA catalog offers for this protocol yet.";

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
                label: PROTOCOLS_HUB_COPY.breadcrumbProtocols[lang as Locale],
                href: protocolsHubPath(lang as Locale),
              },
              { label: protocol.name },
            ]}
          />

          <div className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Shield className="size-3.5" />
              {PROTOCOLS_HUB_COPY.eyebrow[lang as Locale]}
            </span>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-primary/30 bg-[--neon-soft] font-heading text-lg font-bold text-primary">
                {protocol.logo}
              </div>
              <div>
                <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                  {protocol.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    {resolveProtocolLocalized(protocol.category.name, lang as Locale)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-primary/40 bg-[--neon-soft] font-bold text-primary"
                  >
                    {protocol.riskProfile.tier}
                  </Badge>
                </div>
              </div>
            </div>
            <p className="mt-3 text-muted-foreground">
              {protocol.description[lang as Locale]}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              <ProtocolSupportedAssets
                lang={lang as Locale}
                assets={protocol.supportedAssets}
                title={supportedAssetsTitle}
                earnLabel={earnLabel}
              />

              <ProtocolSupportedChains
                lang={lang as Locale}
                chains={protocol.supportedChains}
                title={supportedChainsTitle}
              />

              <ProtocolEarnOpportunities
                lang={lang as Locale}
                opportunities={protocol.earnOpportunities}
                title={earnOpportunitiesTitle}
                emptyLabel={emptyEarn}
                earnLabel={earnLabel}
              />

              <ProtocolLinkedOffers
                lang={lang as Locale}
                offers={protocol.linkedOffers}
                title={linkedOffersTitle}
                emptyLabel={emptyOffers}
                ctaLabel={dict.offerDetail.cta}
                minLabel={dict.offers.min}
              />

              <ProtocolContentBlocks blocks={contentBlocks} />
            </div>

            <aside className="space-y-4">
              <ProtocolInternalLinkSection
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
