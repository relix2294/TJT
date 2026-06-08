import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Newspaper } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NewsList } from "@/components/news-list";
import { Card } from "@/components/ui/card";
import { loadDictionary, loadNews } from "@/lib/server-config";
import { LOCALES, isLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await loadDictionary(lang).catch(() => null);
  const url = `/${lang}/news`;
  return {
    title: dict?.newsHub.metaTitle,
    description: dict?.newsHub.metaDescription,
    alternates: {
      canonical: url,
      languages: { en: "/en/news", ru: "/ru/news" },
    },
    openGraph: {
      type: "website",
      title: dict?.newsHub.metaTitle,
      description: dict?.newsHub.metaDescription,
      url,
    },
  };
}

export default async function NewsHubPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await loadDictionary(lang);

  let news = [] as Awaited<ReturnType<typeof loadNews>>;
  let error: string | null = null;
  try {
    news = await loadNews(lang);
  } catch (err) {
    error = (err as Error).message;
  }

  return (
    <>
      <Navbar lang={lang} dict={dict} />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-5 pt-10 pb-16">
          <Breadcrumbs
            ariaLabel={dict.breadcrumbs.ariaLabel}
            items={[
              { label: dict.breadcrumbs.home, href: `/${lang}` },
              { label: dict.newsHub.breadcrumbNews },
            ]}
          />

          <div className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Newspaper className="size-3.5" />
              {dict.newsHub.eyebrow}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
              {dict.newsHub.title}
            </h1>
            <p className="mt-3 text-muted-foreground">{dict.newsHub.desc}</p>
          </div>

          {error ? (
            <Card className="rounded-2xl border-loss/40 bg-loss/5 p-6 text-sm text-loss">
              {dict.newsHub.loadError}
              <span className="mt-1 block text-loss/70">{error}</span>
            </Card>
          ) : (
            <NewsList news={news} lang={lang} dict={dict} />
          )}
        </section>
      </main>
      <LegalFooter lang={lang} dict={dict} />
    </>
  );
}
