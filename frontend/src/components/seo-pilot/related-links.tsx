import Link from "next/link";
import { Link2 } from "lucide-react";
import { GlassPanel } from "@/components/glass-panel";
import type { Locale } from "@/lib/i18n";
import type { SeoPilotRelatedLink } from "@/lib/seo-pilot/types";
import { resolvePilotLocalized } from "@/lib/seo-pilot/types";

type SeoPilotRelatedLinksProps = {
  lang: Locale;
  links: SeoPilotRelatedLink[];
  title?: string;
};

export function SeoPilotRelatedLinks({
  lang,
  links,
  title,
}: SeoPilotRelatedLinksProps) {
  if (!links.length) return null;

  const heading =
    title ??
    (lang === "ru" ? "Связанные страницы" : "Related pages");

  return (
    <GlassPanel title={heading} icon={Link2}>
      <nav aria-label={heading}>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href(lang)}>
              <Link
                href={link.href(lang)}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
                data-link-type={link.type}
              >
                <span>{resolvePilotLocalized(link.label, lang)}</span>
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
