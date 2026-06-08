import { notFound } from "next/navigation";
import { Bot } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n";
import { loadAppConfig } from "@/lib/server-config";
import { fmtTimeAgo } from "@/lib/format";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { HomeTerminal } from "@/components/home-terminal";
import { PriceTickerTape } from "@/components/price-ticker-tape";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ lang: string }> };

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  let config: Awaited<ReturnType<typeof loadAppConfig>> | null = null;
  try {
    config = await loadAppConfig(lang);
  } catch {
    config = null;
  }

  if (!config) notFound();

  const dict = config.dict;
  const latestNewsAt = config.news?.[0]?.publishedAt;

  return (
    <>
      <Navbar lang={lang as Locale} dict={dict} />
      <main className="flex-1 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-5">
          <header className="mb-4 flex flex-col gap-2 border-b border-slate-800 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {dict.ticker.title}
              </p>
              <h1 className="mt-0.5 text-base font-bold tracking-tight text-white sm:text-lg">
                {dict.site.tagline}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                <Bot className="size-3 text-emerald-500/80" />
                {dict.marketHub.terminalBadge}
              </span>
              {latestNewsAt ? (
                <>
                  <span className="text-slate-700">|</span>
                  <span className="font-numeric">{fmtTimeAgo(latestNewsAt, lang)}</span>
                </>
              ) : null}
            </div>
          </header>

          <div className="mb-4">
            <PriceTickerTape lang={lang as Locale} dict={dict} />
          </div>

          <HomeTerminal
            lang={lang as Locale}
            dict={dict}
            benchmarks={config.benchmarks}
            offers={config.offers ?? []}
            news={(config.news ?? []).slice(0, 5)}
            initialMarket={(config.market ?? []).slice(0, 15)}
          />
        </div>
      </main>
      <LegalFooter lang={lang as Locale} dict={dict} />
    </>
  );
}
