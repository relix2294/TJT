import Link from "next/link";
import { ArrowRight, BarChart2, BookOpen, FileText, Shield } from "lucide-react";
import type { Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const CARDS = [
  {
    key: "compare" as const,
    href: "/compare",
    icon: BarChart2,
    accent: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  {
    key: "earn" as const,
    href: "/earn",
    icon: BookOpen,
    accent: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  },
  {
    key: "reviews" as const,
    href: "/reviews",
    icon: FileText,
    accent: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  },
  {
    key: "safety" as const,
    href: "/safety",
    icon: Shield,
    accent: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
];

export function HomeEntryCards({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const t = dict.homeMarketplace;

  return (
    <section>
      <h2 className="mb-4 font-heading text-lg font-bold text-white sm:text-xl">
        {t.entryCardsTitle}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ key, href, icon: Icon, accent }) => {
          const card = t.entryCards[key];
          return (
            <Link
              key={key}
              href={`/${lang}${href}`}
              className="group flex flex-col rounded-xl border border-slate-800 bg-slate-950/80 p-4 transition-colors hover:border-slate-700 hover:bg-slate-900/80"
            >
              <span
                className={cn(
                  "mb-3 inline-flex size-9 items-center justify-center rounded-lg border",
                  accent,
                )}
              >
                <Icon className="size-4" />
              </span>
              <h3 className="font-heading text-sm font-bold text-white group-hover:text-emerald-400">
                {card.title}
              </h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-500">
                {card.desc}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                {card.cta}
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
