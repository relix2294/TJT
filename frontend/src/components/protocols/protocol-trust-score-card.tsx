import { TrustScoreCard as StaticTrustScoreCard } from "@/components/trust/trust-score-card";
import { TrustScoreCard as LegacyTrustScoreCard } from "@/components/trust-score/trust-score-card";
import type { Locale } from "@/lib/i18n";
import type { Protocol } from "@/lib/protocols/types";

type ProtocolTrustScoreCardProps = {
  lang: Locale;
  protocol: Pick<Protocol, "trustProfile" | "trustScore">;
  variant?: "compact" | "full";
};

/**
 * Adapter: prefers canonical static Trust Score v0.1 when trustProfile is present.
 * Falls back to legacy dynamic trustScore for non-registry protocols.
 */
export function ProtocolTrustScoreCard({
  lang,
  protocol,
  variant = "full",
}: ProtocolTrustScoreCardProps) {
  if (protocol.trustProfile) {
    return (
      <StaticTrustScoreCard
        lang={lang}
        profile={protocol.trustProfile}
        variant={variant}
      />
    );
  }

  return (
    <LegacyTrustScoreCard
      lang={lang}
      trustScore={protocol.trustScore}
      variant={variant}
    />
  );
}
