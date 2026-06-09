import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Offers } from "@/components/offers";
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
  const t = config?.dict.offersHub;
  return generatePageMetadata({
    lang,
    path: hubPath(lang, "earn"),
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
            <Card className="rounded-2xl border-loss/40 bg-loss/5 p-6 text-sm text-loss">
              {dict.offers.error}
              {error ? <span className="mt-1 block text-loss/70">{error}</span> : null}
            </Card>
          ) : (
            <Offers lang={lang} dict={dict} data={config.offers} />
          )}
        </section>
      </main>
      <LegalFooter lang={lang} dict={dict} />
    </>
  );
}
