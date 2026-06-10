import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { HubEmptyRecovery } from "@/components/hub-empty-recovery";
import { TrustContextNote } from "@/components/trust-context-note";
import { Offers } from "@/components/offers";
import { RecommendationLayer } from "@/components/recommendations/recommendation-layer";
import { buildOffersCatalogRecommendations } from "@/lib/recommendations";
import { Card } from "@/components/ui/card";
import { loadAppConfig, loadDictionary } from "@/lib/server-config";
import { LOCALES, isLocale } from "@/lib/i18n";
import { generatePageMetadata, localePath } from "@/lib/seo";

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
  const t = config?.dict.offersHub;
  return generatePageMetadata({
    lang,
    path: localePath(lang, "/offers"),
    title: t?.metaTitle ?? "Offers",
    description: t?.metaDescription,
  });
}

export default async function OffersCatalogPage({ params }: PageProps) {
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

  const recommendations =
    config?.offers != null
      ? buildOffersCatalogRecommendations(lang, config.offers)
      : null;

  return (
    <>
      <Navbar lang={lang} dict={dict} />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-5 pt-10 pb-16">
          <Breadcrumbs
            ariaLabel={dict.breadcrumbs.ariaLabel}
            items={[
              { label: dict.breadcrumbs.home, href: `/${lang}` },
              { label: dict.offersHub.breadcrumbOffers },
            ]}
          />

          <div className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <TrendingUp className="size-3.5" />
              {dict.offers.eyebrow}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
              {dict.offers.title}
            </h1>
            <p className="mt-3 text-muted-foreground">{dict.offers.desc}</p>
          </div>

          {error || !config ? (
            <div className="space-y-6">
              <Card className="rounded-2xl border-loss/40 bg-loss/5 p-6 text-sm text-loss">
                {dict.offers.error}
                {error ? <span className="mt-1 block text-loss/70">{error}</span> : null}
              </Card>
              <HubEmptyRecovery
                lang={lang}
                hub="offers"
                message={
                  lang === "ru"
                    ? "Каталог офферов временно недоступен. Сравните маршруты и протоколы, пока данные обновляются."
                    : "The offers catalog is temporarily unavailable. Compare routes and protocols while data refreshes."
                }
              />
            </div>
          ) : config.offers.length === 0 ? (
            <HubEmptyRecovery
              lang={lang}
              hub="offers"
              message={
                lang === "ru"
                  ? "В каталоге пока нет активных офферов. Исследуйте Compare и Earn для контекста yield."
                  : "No active offers in the catalog yet. Explore Compare and Earn for yield context."
              }
            />
          ) : (
            <>
              {recommendations ? (
                <div className="mb-8">
                  <RecommendationLayer lang={lang} model={recommendations} />
                </div>
              ) : null}
              <Offers lang={lang} dict={dict} data={config.offers} />
            </>
          )}
          <TrustContextNote lang={lang} />
        </section>
      </main>
      <LegalFooter lang={lang} dict={dict} />
    </>
  );
}
