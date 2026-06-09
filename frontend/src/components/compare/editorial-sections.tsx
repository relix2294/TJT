import type { Locale } from "@/lib/i18n";
import { SeoPilotFaqSection } from "@/components/seo-pilot/faq-section";
import type { CompareDetailEditorial } from "@/lib/compare/types";
import { resolveCompareLocalized } from "@/lib/compare/types";

type CompareEditorialSectionsProps = {
  lang: Locale;
  editorial: CompareDetailEditorial;
};

export function CompareEditorialSections({
  lang,
  editorial,
}: CompareEditorialSectionsProps) {
  const overviewTitle =
    lang === "ru" ? "Обзор протоколов" : "Protocol overview";
  const useCaseTitle = resolveCompareLocalized(
    editorial.useCaseComparison.title,
    lang,
  );

  return (
    <div className="space-y-8">
      <section aria-label={overviewTitle}>
        <h2 className="mb-4 font-heading text-lg font-bold text-white">
          {overviewTitle}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[editorial.leftOverview, editorial.rightOverview].map((overview) => (
            <div
              key={overview.protocolName}
              className="rounded-2xl border border-border/60 bg-card/30 p-5"
            >
              <h3 className="font-heading text-sm font-bold text-white">
                {resolveCompareLocalized(overview.title, lang)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {resolveCompareLocalized(overview.body, lang)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label={useCaseTitle}>
        <h2 className="mb-3 font-heading text-lg font-bold text-white">
          {useCaseTitle}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
          {resolveCompareLocalized(editorial.useCaseComparison.body, lang)}
        </p>
      </section>

      <SeoPilotFaqSection lang={lang} items={editorial.faq} />
    </div>
  );
}
