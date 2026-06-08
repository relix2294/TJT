import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { fmtTimeAgo } from "@/lib/format";
import type { Dictionary, NewsItem } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

type HomeSidebarNewsProps = {
  lang: Locale;
  dict: Dictionary;
  items: NewsItem[];
};

export function HomeSidebarNews({ lang, dict, items }: HomeSidebarNewsProps) {
  const teasers = dict.homeTeasers;

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
      <header className="mb-2 border-b border-slate-800 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
          {teasers.newsEyebrow}
        </p>
        <h2 className="text-sm font-semibold text-white">{teasers.newsTitle}</h2>
      </header>

      {items.length === 0 ? (
        <p className="text-[11px] text-slate-500">{dict.ticker.empty}</p>
      ) : (
        <ul className="divide-y divide-slate-800">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/${lang}/news/${item.slug}`}
                className="group block py-2 transition-colors first:pt-0 last:pb-0 hover:text-white"
              >
                <h3 className="line-clamp-2 text-[11px] font-semibold leading-snug text-slate-200 transition-colors group-hover:text-emerald-400">
                  {item.title}
                </h3>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
                  <time className="font-numeric">{fmtTimeAgo(item.publishedAt, lang)}</time>
                  <span>#{dict.newsCategories[item.category]}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={`/${lang}/news`}
        className="mt-2 inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-500 transition-colors hover:text-emerald-400"
      >
        {teasers.newsCta}
        <ChevronRight className="size-3" />
      </Link>
    </section>
  );
}
