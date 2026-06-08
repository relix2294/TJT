import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Markdown } from "@/lib/markdown";
import {
  findNewsBySlug,
  loadAppConfig,
  loadDictionary,
  loadNews,
} from "@/lib/server-config";
import { fmtNewsDate, fmtPct, fmtUsd2 } from "@/lib/format";
import { extractAssetsFromNews, marketHref } from "@/lib/market-utils";
import { type NewsCategory } from "@/lib/config";
import { LOCALES, isLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const SITE_URL = "https://tjt.example";

/**
 * Default premium social-share card (shipped in `/public`). Resolved to an
 * absolute URL via the `metadataBase` set in the locale layout, so links pasted
 * into X/Telegram/Discord always render a rich "summary_large_image" preview.
 */
const OG_IMAGE = "/og-card.png";

const CATEGORY_BADGE: Record<NewsCategory, string> = {
  Аналитика: "border-primary/40 bg-[--neon-soft] text-primary",
  DeFi: "border-profit/40 bg-profit/10 text-profit",
  Новости: "border-border/70 bg-white/[0.04] text-muted-foreground",
};

type PageProps = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of LOCALES) {
    const news = await loadNews(lang).catch(() => []);
    for (const item of news) params.push({ lang, slug: item.slug });
  }
  return params;
}

/**
 * Per-article SEO metadata is generated dynamically from the AI-authored,
 * locale-resolved title/description/keywords so Google indexes each story on
 * its own merits — in the right language.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const dict = await loadDictionary(lang).catch(() => null);
  const article = await findNewsBySlug(lang, slug).catch(() => undefined);

  if (!article) {
    return {
      title: dict?.article.notFoundTitle,
      description: dict?.article.notFoundDesc,
      robots: { index: false, follow: true },
    };
  }

  const url = `/${lang}/news/${article.slug}`;
  return {
    title: `${article.title} — TJT`,
    description: article.description,
    keywords: article.seoKeywords,
    alternates: {
      canonical: url,
      languages: {
        en: `/en/news/${article.slug}`,
        ru: `/ru/news/${article.slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: lang === "ru" ? "ru_RU" : "en_US",
      title: article.title,
      description: article.description,
      url,
      publishedTime: article.publishedAt,
      section: article.category,
      tags: article.seoKeywords,
      images: [
        { url: OG_IMAGE, width: 1200, height: 630, alt: article.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [OG_IMAGE],
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await loadDictionary(lang);
  const article = await findNewsBySlug(lang, slug).catch(() => undefined);

  if (!article) {
    notFound();
  }

  const [allNews, config] = await Promise.all([
    loadNews(lang).catch(() => []),
    loadAppConfig(lang).catch(() => null),
  ]);

  const related = allNews
    .filter((n) => n.category === article.category && n.slug !== article.slug)
    .slice(0, 3);

  const mentionedAssets = config
    ? extractAssetsFromNews(article, config.market)
    : [];

  const categoryLabel = dict.newsCategories[article.category];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    inLanguage: lang,
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    articleSection: categoryLabel,
    keywords: article.seoKeywords.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${lang}/news/${article.slug}`,
    },
    author: { "@type": "Organization", name: "TJT AI Research" },
    publisher: { "@type": "Organization", name: "TJT" },
  };

  return (
    <>
      <Navbar lang={lang} dict={dict} />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-5 pt-10 pb-16">
          <Breadcrumbs
            ariaLabel={dict.breadcrumbs.ariaLabel}
            items={[
              { label: dict.breadcrumbs.home, href: `/${lang}` },
              { label: dict.breadcrumbs.news, href: `/${lang}/news` },
              { label: article.title },
            ]}
          />

          <header className="mb-8 border-b border-border/50 pb-8">
            <div className="mb-4 flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-[0.7rem] font-semibold uppercase tracking-wider",
                  CATEGORY_BADGE[article.category],
                )}
              >
                {categoryLabel}
              </Badge>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-background/40 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="size-3" />
                {dict.article.aiBadge}
              </span>
            </div>

            <h1 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {article.description}
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              <time dateTime={article.publishedAt}>
                {fmtNewsDate(article.publishedAt, lang)}
              </time>
            </div>
          </header>

          <Markdown content={article.content} />

          {mentionedAssets.length > 0 ? (
            <section className="mt-10">
              <h2 className="mb-4 font-heading text-lg font-bold text-white">
                {dict.article.assetsInArticle}
              </h2>
              <div className="flex flex-wrap gap-3">
                {mentionedAssets.map((asset) => (
                  <Link
                    key={asset.symbol}
                    href={marketHref(lang, asset)}
                    className="group glass flex min-w-[140px] flex-col rounded-xl border border-white/[0.06] p-4 transition-all duration-200 hover:border-primary/40 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-numeric text-sm font-bold text-foreground">
                        {asset.symbol}
                      </span>
                      <span
                        className={cn(
                          "font-numeric text-xs font-semibold tabular-nums",
                          asset.change24h >= 0 ? "text-profit" : "text-loss",
                        )}
                      >
                        {fmtPct(asset.change24h)}
                      </span>
                    </div>
                    <span className="mt-1 text-xs text-muted-foreground">{asset.name}</span>
                    <span className="mt-2 font-numeric text-sm font-semibold tabular-nums text-foreground">
                      {fmtUsd2(asset.price)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-1.5 border-t border-border/50 pt-6">
            {article.seoKeywords.map((kw) => (
              <span
                key={kw}
                className="rounded-md border border-border/60 bg-white/[0.03] px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground"
              >
                #{kw}
              </span>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-border/60 bg-background/40 p-5 text-xs leading-relaxed text-muted-foreground/80">
            {dict.article.disclaimer}
          </div>

          <div className="mt-10">
            <Link
              href={`/${lang}/news`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" />
              {dict.article.back}
            </Link>
          </div>

          {related.length > 0 ? (
            <section className="mt-14">
              <h2 className="mb-5 font-heading text-xl font-bold text-white">
                {dict.article.similarNews}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Card
                    key={item.id}
                    className="group flex flex-col rounded-2xl border-border/60 bg-surface/70 p-0 ring-1 ring-foreground/10 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:ring-primary/30"
                  >
                    <Link
                      href={`/${lang}/news/${item.slug}`}
                      className="flex flex-1 flex-col p-5"
                    >
                      <h3 className="font-heading text-sm font-bold leading-snug text-white transition-colors group-hover:text-primary">
                        {item.title}
                      </h3>
                      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
                        <span>{fmtNewsDate(item.publishedAt, lang)}</span>
                        <ArrowUpRight className="size-3.5 text-primary transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </article>
      </main>
      <LegalFooter lang={lang} dict={dict} />
    </>
  );
}
