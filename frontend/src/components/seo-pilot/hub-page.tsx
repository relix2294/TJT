import { BookOpen } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SeoPilotFaqSection } from "@/components/seo-pilot/faq-section";
import { SeoPilotPageGrid } from "@/components/seo-pilot/page-grid";
import type { Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import {
  SEO_PILOT_HUB_COPY,
  SEO_PILOT_HUB_LABELS,
  buildSeoPilotHubJsonLd,
  getSeoPilotPagesByHub,
  resolvePilotLocalized,
  seoPilotHubMetadataPath,
  type SeoPilotHubSegment,
} from "@/lib/seo-pilot";

type SeoPilotHubPageProps = {
  lang: Locale;
  dict: Dictionary;
  hubSegment: Exclude<SeoPilotHubSegment, "earn">;
};

export function SeoPilotHubPage({
  lang,
  dict,
  hubSegment,
}: SeoPilotHubPageProps) {
  const copy = SEO_PILOT_HUB_COPY[hubSegment];
  const hubLabel = SEO_PILOT_HUB_LABELS[hubSegment][lang];
  const pages = getSeoPilotPagesByHub(hubSegment);

  const breadcrumbs = [
    { label: dict.breadcrumbs.home, href: `/${lang}` },
    { label: hubLabel },
  ];

  const jsonLd = buildSeoPilotHubJsonLd({
    lang,
    hubSegment,
    copy,
    pages,
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
              <BookOpen className="size-3.5" />
              {resolvePilotLocalized(copy.eyebrow, lang)}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
              {resolvePilotLocalized(copy.title, lang)}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {resolvePilotLocalized(copy.subtitle, lang)}
            </p>
          </div>

          <h2 className="mb-4 font-heading text-lg font-bold text-white">
            {resolvePilotLocalized(copy.gridTitle, lang)}
          </h2>
          <SeoPilotPageGrid
            lang={lang}
            pages={pages}
            exploreLabel={resolvePilotLocalized(copy.exploreLabel, lang)}
          />

          <div className="mt-10">
            <SeoPilotFaqSection
              lang={lang}
              items={copy.faq}
              title={resolvePilotLocalized(copy.faqTitle, lang)}
            />
          </div>
        </section>
      </main>
      <LegalFooter lang={lang} dict={dict} />
    </>
  );
}

/** Metadata helper inputs for hub route files. */
export function seoPilotHubMetadataInput(
  lang: Locale,
  hubSegment: Exclude<SeoPilotHubSegment, "earn">,
) {
  const copy = SEO_PILOT_HUB_COPY[hubSegment];
  return {
    path: seoPilotHubMetadataPath(lang, hubSegment),
    title: resolvePilotLocalized(copy.metaTitle, lang),
    description: resolvePilotLocalized(copy.metaDescription, lang),
  };
}
