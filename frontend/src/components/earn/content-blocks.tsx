import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EarnContentBlock } from "@/lib/earn/content";

type EarnContentBlocksProps = {
  blocks: EarnContentBlock[];
};

/**
 * Reusable prose sections for AI-generated earn pages.
 * Each block maps to a stable `key` for programmatic content injection.
 */
export function EarnContentBlocks({ blocks }: EarnContentBlocksProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <article
          key={block.key}
          id={`earn-block-${block.key}`}
          className="glass rounded-xl p-5 sm:p-6"
          data-earn-block={block.key}
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
          {block.links && block.links.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {block.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}
