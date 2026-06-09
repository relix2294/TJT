import { Badge } from "@/components/ui/badge";
import type { ProtocolContentBlock } from "@/lib/protocols/content";

type ProtocolContentBlocksProps = {
  blocks: ProtocolContentBlock[];
};

/**
 * Reusable prose sections for AI-generated protocol review pages.
 * Each block maps to a stable `key` for programmatic content injection.
 */
export function ProtocolContentBlocks({ blocks }: ProtocolContentBlocksProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <article
          key={block.key}
          id={`protocol-block-${block.key}`}
          className="glass rounded-xl p-5 sm:p-6"
          data-protocol-block={block.key}
        >
          <header className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-lg font-bold text-white">{block.title}</h2>
            {block.aiSlot ? (
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                AI slot
              </Badge>
            ) : null}
          </header>
          <p className="text-sm leading-relaxed text-muted-foreground">{block.body}</p>
        </article>
      ))}
    </div>
  );
}
