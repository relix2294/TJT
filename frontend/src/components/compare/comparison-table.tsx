import Link from "next/link";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Locale } from "@/lib/i18n";
import type {
  ComparePage,
  ProtocolComparisonSide,
  YieldComparisonRow,
} from "@/lib/compare/types";
import {
  isProtocolComparison,
  isYieldComparison,
  resolveCompareLocalized,
} from "@/lib/compare/types";

type CompareTableLabels = {
  protocol: string;
  apy: string;
  tvl: string;
  chain: string;
  asset: string;
  trustScore: string;
  risk: string;
  notAvailable: string;
  viewProtocol: string;
  viewOffer: string;
};

type CompareComparisonTableProps = {
  lang: Locale;
  page: ComparePage;
  labels: CompareTableLabels;
};

function TrustScoreBadge({ score, grade }: { score: number; grade: string }) {
  return (
    <Badge
      variant="outline"
      className="border-primary/30 bg-[--neon-soft] font-heading text-xs font-bold text-primary"
    >
      <Shield className="mr-1 size-3" />
      {score} · {grade}
    </Badge>
  );
}

function formatApy(apy: number | null, notAvailable: string): string {
  return apy != null ? `${apy}%` : notAvailable;
}

function formatTvl(
  side: Pick<ProtocolComparisonSide, "tvlUsd" | "tvlLabel">,
  lang: Locale,
  notAvailable: string,
): string {
  if (side.tvlUsd != null) {
    return `$${(side.tvlUsd / 1_000_000_000).toFixed(1)}B`;
  }
  if (side.tvlLabel) {
    return resolveCompareLocalized(side.tvlLabel, lang);
  }
  return notAvailable;
}

function ProtocolRow({
  lang,
  side,
  labels,
}: {
  lang: Locale;
  side: ProtocolComparisonSide;
  labels: CompareTableLabels;
}) {
  return (
    <TableRow>
      <TableCell>
        <Link
          href={side.protocolPath}
          className="font-heading text-sm font-bold text-white hover:text-primary"
        >
          {side.name}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">
          {resolveCompareLocalized(side.category, lang)}
        </p>
      </TableCell>
      <TableCell className="font-heading font-bold text-profit">
        {formatApy(side.apy, labels.notAvailable)}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatTvl(side, lang, labels.notAvailable)}
      </TableCell>
      <TableCell className="text-sm">
        {resolveCompareLocalized(side.chain, lang)}
      </TableCell>
      <TableCell className="text-sm">
        {resolveCompareLocalized(side.supportedAsset, lang)}
      </TableCell>
      <TableCell>
        <TrustScoreBadge
          score={side.trustScore.score}
          grade={side.trustScore.grade}
        />
      </TableCell>
      <TableCell className="max-w-xs text-xs text-muted-foreground">
        {resolveCompareLocalized(side.riskExplanation, lang)}
      </TableCell>
    </TableRow>
  );
}

function YieldRow({
  lang,
  row,
  labels,
}: {
  lang: Locale;
  row: YieldComparisonRow;
  labels: CompareTableLabels;
}) {
  return (
    <TableRow>
      <TableCell>
        <Link
          href={row.protocolPath}
          className="font-heading text-sm font-bold text-white hover:text-primary"
        >
          {row.protocolName}
        </Link>
        {row.offerPath ? (
          <Link
            href={row.offerPath}
            className="mt-1 block text-xs text-primary/80 hover:text-primary"
          >
            {labels.viewOffer}
          </Link>
        ) : null}
      </TableCell>
      <TableCell className="font-heading font-bold text-profit">
        {formatApy(row.apy, labels.notAvailable)}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatTvl(row, lang, labels.notAvailable)}
      </TableCell>
      <TableCell className="text-sm">
        {resolveCompareLocalized(row.chain, lang)}
      </TableCell>
      <TableCell className="text-sm">{row.supportedAsset}</TableCell>
      <TableCell>
        <TrustScoreBadge
          score={row.trustScore.score}
          grade={row.trustScore.grade}
        />
      </TableCell>
      <TableCell className="max-w-xs text-xs text-muted-foreground">
        {resolveCompareLocalized(row.riskExplanation, lang)}
      </TableCell>
    </TableRow>
  );
}

export function CompareComparisonTable({
  lang,
  page,
  labels,
}: CompareComparisonTableProps) {
  const comparison = page.comparison;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/30">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{labels.protocol}</TableHead>
            <TableHead>{labels.apy}</TableHead>
            <TableHead>{labels.tvl}</TableHead>
            <TableHead>{labels.chain}</TableHead>
            <TableHead>{labels.asset}</TableHead>
            <TableHead>{labels.trustScore}</TableHead>
            <TableHead>{labels.risk}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isProtocolComparison(comparison) ? (
            <>
              <ProtocolRow lang={lang} side={comparison.left} labels={labels} />
              <ProtocolRow lang={lang} side={comparison.right} labels={labels} />
            </>
          ) : null}
          {isYieldComparison(comparison)
            ? comparison.rows.map((row) => (
                <YieldRow key={row.id} lang={lang} row={row} labels={labels} />
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
}
