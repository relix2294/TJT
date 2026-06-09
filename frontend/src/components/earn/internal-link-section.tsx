import Link from "next/link";
import type { InternalLink } from "@/lib/seo/internal-links";
import { GlassPanel } from "@/components/glass-panel";
import { Link2 } from "lucide-react";

type EarnInternalLinkSectionProps = {
  title: string;
  links: InternalLink[];
};

/** Crawl-oriented internal link block for earn knowledge graph pages. */
export function EarnInternalLinkSection({ title, links }: EarnInternalLinkSectionProps) {
  if (!links.length) return null;

  return (
    <GlassPanel title={title} icon={Link2}>
      <nav aria-label={title}>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
                data-link-type={link.type}
              >
                <span>{link.label}</span>
                <span className="text-[10px] uppercase tracking-wider text-primary/70">
                  {link.type}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </GlassPanel>
  );
}
