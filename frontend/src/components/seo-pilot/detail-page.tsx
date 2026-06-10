import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { SeoPilotDisclaimer } from "@/components/seo-pilot/disclaimer";
import { SeoPilotFaqSection } from "@/components/seo-pilot/faq-section";
import { SeoPilotRelatedLinks } from "@/components/seo-pilot/related-links";
import { ProductNextStep } from "@/components/product-connectivity/product-next-step";
import { buildSeoPilotPageNextSteps } from "@/lib/product-connectivity";
import type { Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { TrustScoreCard } from "@/components/trust/trust-score-card";
import type { ProtocolTrustProfile } from "@/lib/trust";
import {
  SEO_PILOT_HUB_LABELS,
  buildSeoPilotJsonLd,
  resolvePilotLocalized,
  seoPilotHubPath,
  type SeoPilotPage,
} from "@/lib/seo-pilot";

type SeoPilotDetailPageProps = {
  lang: Locale;
  dict: Dictionary;
  page: SeoPilotPage;
  trustProfile?: ProtocolTrustProfile | null;
};

export function SeoPilotDetailPage({
  lang,
  dict,
  page,
  trustProfile,
}: SeoPilotDetailPageProps) {
  const hubLabel = SEO_PILOT_HUB_LABELS[page.hubSegment][lang];
  const ctaLabel =
    lang === "ru" ? "Сравнить возможности" : "Compare opportunities";
  const nextSteps = buildSeoPilotPageNextSteps(lang, page);

  const breadcrumbs = [
    { label: dict.breadcrumbs.home, href: `/${lang}` },
    { label: hubLabel, href: seoPilotHubPath(lang, page.hubSegment) },
    { label: resolvePilotLocalized(page.h1, lang) },
  ];

  const jsonLd = buildSeoPilotJsonLd({
    lang,
    page,
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

          <div className="mb-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <BookOpen className="size-3.5" />
              {resolvePilotLocalized(page.eyebrow, lang)}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
              {resolvePilotLocalized(page.h1, lang)}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {resolvePilotLocalized(page.intro, lang)}
            </p>
            <Button
              render={<Link href={page.ctaHref(lang)} />}
              className="mt-6 rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {ctaLabel}
            </Button>
          </div>

          {trustProfile ? (
            <div className="mb-8">
              <TrustScoreCard lang={lang} profile={trustProfile} />
            </div>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              {page.sections.map((section) => (
                <article
                  key={section.key}
                  className="rounded-2xl border border-border/60 bg-card/20 p-6"
                >
                  <h2 className="font-heading text-xl font-bold text-white">
                    {resolvePilotLocalized(section.title, lang)}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {resolvePilotLocalized(section.body, lang)
                      .split("\n\n")
                      .map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 48)}
                          className="text-sm leading-relaxed text-muted-foreground"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </article>
              ))}

              <SeoPilotFaqSection lang={lang} items={page.faq} />
              <SeoPilotDisclaimer lang={lang} />
            </div>

            <aside className="space-y-4">
              <SeoPilotRelatedLinks lang={lang} links={page.relatedLinks} />
              <ProductNextStep lang={lang} steps={nextSteps} />
            </aside>
          </div>
        </section>
      </main>
      <LegalFooter lang={lang} dict={dict} />
    </>
  );
}
