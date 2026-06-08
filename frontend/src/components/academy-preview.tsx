import { ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/lib/config";

export function AcademyPreview({ dict }: { dict: Dictionary }) {
  const t = dict.academy;

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
      {t.articles.map((article) => (
        <Card
          key={article.id}
          className="group relative flex flex-col overflow-hidden rounded-2xl border-border/60 bg-surface/70 p-0 ring-1 ring-foreground/10 transition-all duration-200 hover:-translate-y-1.5 hover:border-primary/50 hover:ring-primary/30"
        >
          {/* Cover band */}
          <div className="relative h-32 overflow-hidden border-b border-border/60 bg-surface-2">
            <div className="grid-noise pointer-events-none absolute inset-0 opacity-70" />
            <div className="absolute -right-6 -top-8 size-32 rounded-full bg-[--neon-soft] blur-2xl transition-opacity duration-300 group-hover:opacity-90" />
            <div className="relative flex h-full items-start justify-between p-5">
              <Badge
                variant="outline"
                className="border-primary/40 bg-[--neon-soft] text-xs font-semibold uppercase tracking-wider text-primary"
              >
                {article.category}
              </Badge>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-background/40 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="size-3" />
                AI
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <h4 className="font-heading text-base font-bold leading-snug text-white transition-colors group-hover:text-primary sm:text-lg">
              {article.title}
            </h4>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border/60 bg-white/[0.03] px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {article.readingMinutes} {t.readingSuffix}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-primary transition-transform group-hover:translate-x-0.5">
                {t.read}
                <ArrowUpRight className="size-3.5" />
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
