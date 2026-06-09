import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/lib/i18n";
import type { ProtocolSupportedAsset } from "@/lib/protocols/types";
import { resolveProtocolLocalized } from "@/lib/protocols/types";

type ProtocolSupportedAssetsProps = {
  lang: Locale;
  assets: ProtocolSupportedAsset[];
  title: string;
  earnLabel: string;
};

export function ProtocolSupportedAssets({
  lang,
  assets,
  title,
  earnLabel,
}: ProtocolSupportedAssetsProps) {
  if (!assets.length) return null;

  return (
    <section>
      <h2 className="mb-4 font-heading text-lg font-bold text-white">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {assets.map((asset) => (
          <Link
            key={asset.slug}
            href={asset.earnPath}
            className="group inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-4 py-3 transition-colors hover:border-primary/40"
          >
            <span className="font-heading text-sm font-bold text-white group-hover:text-primary">
              {asset.symbol}
            </span>
            <span className="text-xs text-muted-foreground">
              {resolveProtocolLocalized(asset.name, lang)}
            </span>
            <Badge variant="secondary" className="text-[10px] uppercase">
              {earnLabel}
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}
