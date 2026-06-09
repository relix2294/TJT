import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n";
import type { LocalizedString } from "@/lib/compare/types";
import { resolveCompareLocalized } from "@/lib/compare/types";

type CompareDisclaimerProps = {
  lang: Locale;
  disclaimer: LocalizedString;
  riskExplanation?: LocalizedString;
  riskTitle?: string;
};

export function CompareDisclaimer({
  lang,
  disclaimer,
  riskExplanation,
  riskTitle,
}: CompareDisclaimerProps) {
  return (
    <div className="space-y-4">
      {riskExplanation ? (
        <Card className="rounded-2xl border-border/60 bg-card/30 p-5">
          {riskTitle ? (
            <h2 className="mb-2 font-heading text-sm font-bold text-white">
              {riskTitle}
            </h2>
          ) : null}
          <p className="text-sm text-muted-foreground">
            {resolveCompareLocalized(riskExplanation, lang)}
          </p>
        </Card>
      ) : null}
      <Card className="rounded-2xl border-primary/20 bg-[--neon-soft]/40 p-5">
        <div className="flex gap-3">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            {resolveCompareLocalized(disclaimer, lang)}
          </p>
        </div>
      </Card>
    </div>
  );
}
