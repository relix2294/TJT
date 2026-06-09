import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n";
import { SEO_PILOT_DISCLAIMER } from "@/lib/seo-pilot/disclaimer";
import { resolvePilotLocalized } from "@/lib/seo-pilot/types";

type SeoPilotDisclaimerProps = {
  lang: Locale;
  title?: string;
};

export function SeoPilotDisclaimer({ lang, title }: SeoPilotDisclaimerProps) {
  const heading =
    title ??
    (lang === "ru" ? "Юридический дисклеймер" : "Legal disclaimer");

  return (
    <Card className="rounded-2xl border-primary/20 bg-[--neon-soft]/40 p-5">
      <div className="flex gap-3">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <div>
          <h2 className="mb-2 font-heading text-sm font-bold text-white">
            {heading}
          </h2>
          <p className="text-sm text-muted-foreground">
            {resolvePilotLocalized(SEO_PILOT_DISCLAIMER, lang)}
          </p>
        </div>
      </div>
    </Card>
  );
}
