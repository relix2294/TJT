import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtocolTrustScoreCard } from "@/components/protocols/protocol-trust-score-card";
import type { Locale } from "@/lib/i18n";
import type { Protocol } from "@/lib/protocols/types";
import { resolveProtocolLocalized } from "@/lib/protocols/types";
import { protocolDetailPath } from "@/lib/protocols/paths";

type ProtocolGridProps = {
  lang: Locale;
  protocols: Protocol[];
  exploreLabel: string;
};

export function ProtocolGrid({ lang, protocols, exploreLabel }: ProtocolGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {protocols.map((protocol) => {
        const topApy = protocol.linkedOffers[0]?.apy ?? null;
        return (
          <Link
            key={protocol.slug}
            href={protocolDetailPath(lang, protocol.slug)}
            className="group"
          >
            <Card className="h-full rounded-2xl border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/40 hover:bg-card/60">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-primary/30 bg-[--neon-soft] font-heading text-sm font-bold text-primary">
                    {protocol.logo}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading text-lg font-bold text-white">
                        {protocol.name}
                      </span>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {protocol.riskProfile.tier}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {resolveProtocolLocalized(protocol.category.name, lang)}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                {protocol.description[lang]}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Layers className="size-3.5" />
                <span>
                  {protocol.supportedAssets.map((a) => a.symbol).join(", ")}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <ProtocolTrustScoreCard
                  lang={lang}
                  protocol={protocol}
                  variant="compact"
                />
                {topApy != null ? (
                  <p className="text-xs font-semibold text-profit">
                    {lang === "ru" ? "Лучший APY" : "Top APY"}: {topApy}%
                  </p>
                ) : null}
              </div>
              <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-primary">
                {exploreLabel}
              </span>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
