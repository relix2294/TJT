import type { Locale } from "@/lib/i18n";
import type { SeoPilotFaqItem } from "@/lib/seo-pilot/types";
import { resolvePilotLocalized } from "@/lib/seo-pilot/types";

type SeoPilotFaqSectionProps = {
  lang: Locale;
  items: SeoPilotFaqItem[];
  title?: string;
};

export function SeoPilotFaqSection({
  lang,
  items,
  title,
}: SeoPilotFaqSectionProps) {
  if (!items.length) return null;

  const heading = title ?? (lang === "ru" ? "FAQ" : "FAQ");

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-xl font-bold text-white">{heading}</h2>
      <dl className="space-y-4">
        {items.map((item) => (
          <div
            key={resolvePilotLocalized(item.question, lang)}
            className="rounded-2xl border border-border/60 bg-card/30 p-5"
          >
            <dt className="font-heading text-sm font-semibold text-white">
              {resolvePilotLocalized(item.question, lang)}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {resolvePilotLocalized(item.answer, lang)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
