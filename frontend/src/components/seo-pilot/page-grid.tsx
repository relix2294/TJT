import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n";
import {
  resolvePilotLocalized,
  seoPilotDetailPath,
  type SeoPilotPage,
} from "@/lib/seo-pilot";

type SeoPilotPageGridProps = {
  lang: Locale;
  pages: SeoPilotPage[];
  exploreLabel: string;
};

export function SeoPilotPageGrid({
  lang,
  pages,
  exploreLabel,
}: SeoPilotPageGridProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {pages.map((page) => (
        <li key={page.slug}>
          <Link
            href={seoPilotDetailPath(lang, page.hubSegment, page.slug)}
            className="group block h-full"
          >
            <Card className="flex h-full flex-col rounded-2xl border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/30">
              <div className="mb-3 grid size-10 place-items-center rounded-xl border border-primary/30 bg-[--neon-soft] text-primary">
                <BookOpen className="size-4" />
              </div>
              <h3 className="font-heading text-base font-bold text-white group-hover:text-primary">
                {resolvePilotLocalized(page.h1, lang)}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                {resolvePilotLocalized(page.intro, lang)}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary">
                {exploreLabel}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
