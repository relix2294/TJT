import Link from "next/link";
import { HubEmptyRecovery } from "@/components/hub-empty-recovery";
import { TrendingUp } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { ProtocolLinkedEarnOpportunity } from "@/lib/protocols/types";
import { resolveProtocolLocalized } from "@/lib/protocols/types";
import { detailPath } from "@/lib/seo/urls";

type ProtocolEarnOpportunitiesProps = {
  lang: Locale;
  opportunities: ProtocolLinkedEarnOpportunity[];
  title: string;
  emptyLabel: string;
  earnLabel: string;
};

export function ProtocolEarnOpportunities({
  lang,
  opportunities,
  title,
  emptyLabel,
  earnLabel,
}: ProtocolEarnOpportunitiesProps) {
  if (!opportunities.length) {
    return (
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-white">{title}</h2>
        <HubEmptyRecovery lang={lang} hub="protocols" message={emptyLabel} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-bold text-white">{title}</h2>
      <ul className="space-y-3">
        {opportunities.map((opp) => (
          <li
            key={opp.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-white">
                {resolveProtocolLocalized(opp.headline, lang)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {opp.type} · {opp.chainSlug}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-profit">
                <TrendingUp className="size-3.5" />
                {opp.apy}%
              </span>
              <Link
                href={opp.earnAssetPath}
                className="text-xs font-semibold uppercase tracking-wider text-primary hover:text-white"
              >
                {earnLabel}
              </Link>
              {opp.offerSlug ? (
                <Link
                  href={detailPath(lang, "protocols", opp.offerSlug)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {lang === "ru" ? "Оффер" : "Offer"}
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
