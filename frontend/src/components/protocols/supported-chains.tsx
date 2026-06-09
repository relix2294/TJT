import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/lib/i18n";
import type { ProtocolSupportedChain } from "@/lib/protocols/types";
import { resolveProtocolLocalized } from "@/lib/protocols/types";

type ProtocolSupportedChainsProps = {
  lang: Locale;
  chains: ProtocolSupportedChain[];
  title: string;
};

export function ProtocolSupportedChains({
  lang,
  chains,
  title,
}: ProtocolSupportedChainsProps) {
  if (!chains.length) return null;

  return (
    <section>
      <h2 className="mb-4 font-heading text-lg font-bold text-white">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {chains.map((chain) => (
          <div
            key={chain.slug}
            className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-4 py-3"
          >
            <span className="font-heading text-sm font-bold text-white">
              {resolveProtocolLocalized(chain.name, lang)}
            </span>
            <Badge variant="outline" className="text-[10px] uppercase">
              {chain.layer}
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
