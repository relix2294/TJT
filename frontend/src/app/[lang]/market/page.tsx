import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Activity, LineChart } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MarketTerminalTable } from "@/components/market-terminal-table";
import { NewsTicker } from "@/components/news-ticker";
import { Card } from "@/components/ui/card";
import { loadAppConfig, loadDictionary } from "@/lib/server-config";
import { LOCALES, isLocale } from "@/lib/i18n";
import { generatePageMetadata, hubPath } from "@/lib/seo";

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

  const config = await loadAppConfig(lang).catch(() => null);
  const t = config?.dict.marketHub;
  return generatePageMetadata({
    lang,
    path: hubPath(lang, "coins"),
    title: t?.metaTitle ?? "Market",
    description: t?.metaDescription,
  });
}

export default async function MarketTerminalPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  let config: Awaited<ReturnType<typeof loadAppConfig>> | null = null;
  let error: string | null = null;
  try {
    config = await loadAppConfig(lang);
  } catch (err) {
    error = (err as Error).message;
  }

  const dict = config?.dict ?? (await loadDictionary(lang).catch(() => null));
  if (!dict) notFound();

  return (
    <>
      <Navbar lang={lang} dict={dict} />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-white/[0.06] bg-[#0b0c11]">
          <div className="grid-noise pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-6xl px-5 py-10">
            <Breadcrumbs
              ariaLabel={dict.breadcrumbs.ariaLabel}
              items={[
                { label: dict.breadcrumbs.home, href: `/${lang}` },
                { label: dict.marketHub.breadcrumbMarket },
              ]}
            />

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <LineChart className="size-3.5" />
                  {dict.market.eyebrow}
                </span>
                <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-5xl">
                  {dict.market.title}
                </h1>
                <p className="mt-3 text-muted-foreground">{dict.market.desc}</p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-profit/30 bg-profit/10 px-4 py-2 text-xs font-semibold text-profit">
                <Activity className="size-3.5" />
                {dict.marketHub.terminalBadge}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-10">
          {error || !config ? (
            <Card className="rounded-2xl border-loss/40 bg-loss/5 p-6 text-sm text-loss">
              {dict.market.error}
              {error ? <span className="mt-1 block text-loss/70">{error}</span> : null}
            </Card>
          ) : (
            <div className="space-y-6">
              <MarketTerminalTable lang={lang} dict={dict} initialMarket={config.market} />
              <NewsTicker lang={lang} dict={dict} news={config.news} />
            </div>
          )}
        </section>
      </main>
      <LegalFooter lang={lang} dict={dict} />
    </>
  );
}
