import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { OfferButton } from "@/components/offer-button";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { findOfferBySlug, loadAppConfig, loadDictionary } from "@/lib/server-config";
import { fmtUsd } from "@/lib/format";
import { LOCALES, isLocale } from "@/lib/i18n";
import {
  buildProductSchema,
  detailPath,
  generatePageMetadata,
  noIndexMetadata,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { TrustContextNote } from "@/components/trust-context-note";
import { ProductNextStep } from "@/components/product-connectivity/product-next-step";
import { RecommendationLayer } from "@/components/recommendations/recommendation-layer";
import { buildOfferNextSteps } from "@/lib/product-connectivity";
import { buildOfferDetailRecommendations } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of LOCALES) {
    const config = await loadAppConfig(lang).catch(() => null);
    if (!config) continue;
    for (const offer of config.offers) {
      params.push({ lang, slug: offer.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const dict = await loadDictionary(lang).catch(() => null);
  const offer = await findOfferBySlug(lang, slug).catch(() => undefined);

  if (!offer) {
    return noIndexMetadata(
      lang,
      `/${lang}/offers/${slug}`,
      dict?.offerDetail.notFoundTitle,
      dict?.offerDetail.notFoundDesc,
    );
  }

  const path = detailPath(lang, "protocols", offer.slug);
  return generatePageMetadata({
    lang,
    path,
    title: `${offer.name} — ${offer.apy}% APY | TJT`,
    description: offer.description,
    ogImageAlt: offer.name,
  });
}

export default async function OfferDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  let dict: Awaited<ReturnType<typeof loadDictionary>>;
  let offer: Awaited<ReturnType<typeof findOfferBySlug>>;
  try {
    dict = await loadDictionary(lang);
    offer = await findOfferBySlug(lang, slug);
  } catch {
    notFound();
  }

  if (!offer) notFound();

  const config = await loadAppConfig(lang).catch(() => null);
  const related =
    config?.offers.filter((o) => o.slug !== offer.slug).slice(0, 3) ?? [];

  const nextSteps = buildOfferNextSteps(lang, offer);
  const recommendations = config
    ? buildOfferDetailRecommendations(lang, offer, config.offers)
    : null;

  const offerPath = detailPath(lang, "protocols", offer.slug);
  const jsonLd = buildProductSchema({
    path: offerPath,
    name: offer.name,
    description: offer.description,
    brandName: offer.protocol,
  });

  return (
    <>
      <Navbar lang={lang} dict={dict} />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-5 pt-10 pb-16">
          <Breadcrumbs
            ariaLabel={dict.breadcrumbs.ariaLabel}
            items={[
              { label: dict.breadcrumbs.home, href: `/${lang}` },
              { label: dict.breadcrumbs.offers, href: `/${lang}/offers` },
              { label: offer.name },
            ]}
          />

          <header className="mb-8 border-b border-border/50 pb-8">
            <div className="flex items-start gap-5">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl border border-primary/30 bg-[--neon-soft] font-heading text-xl font-bold text-primary">
                {offer.logo}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-primary/40 bg-[--neon-soft] font-bold text-primary"
                  >
                    {offer.riskRating}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {offer.protocol} · {offer.network}
                  </span>
                </div>
                <h1 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {offer.name}
                </h1>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {offer.description}
                </p>
                <div className="mt-4 font-numeric text-3xl font-extrabold text-profit">
                  {offer.apy.toFixed(1)}% APY
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    · {dict.offers.min} {fmtUsd(offer.minEntryUsd)}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {recommendations ? (
            <div className="mb-8">
              <RecommendationLayer lang={lang} model={recommendations} />
            </div>
          ) : null}

          {offer.benefits.length > 0 ? (
            <section className="mb-10">
              <h2 className="mb-4 font-heading text-xl font-bold text-white">
                {dict.offerDetail.benefitsHeading}
              </h2>
              <ul className="space-y-3">
                {offer.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-profit" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <OfferButton
            offer={offer}
            dict={dict}
            lang={lang}
            label={dict.offerDetail.cta}
            className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto sm:px-8"
          />

          <div className="mt-10">
            <ProductNextStep
              lang={lang}
              steps={nextSteps}
              variant="grid"
              title={lang === "ru" ? "Продолжить исследование" : "Continue research"}
            />
          </div>

          <TrustContextNote lang={lang} />

          <div className="mt-6">
            <Link
              href={`/${lang}/offers`}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" />
              {dict.offerDetail.back}
            </Link>
          </div>

          {related.length > 0 ? (
            <section className="mt-14">
              <h2 className="mb-5 font-heading text-xl font-bold text-white">
                {dict.article.related}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {related.map((item) => (
                  <Card
                    key={item.id}
                    className="group rounded-2xl border-border/60 bg-surface/70 p-0 ring-1 ring-foreground/10 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50"
                  >
                    <Link
                      href={`/${lang}/offers/${item.slug}`}
                      className="flex flex-col p-5"
                    >
                      <span className="text-xs text-muted-foreground">{item.network}</span>
                      <h3 className="mt-1 font-heading text-sm font-bold text-white group-hover:text-primary">
                        {item.name}
                      </h3>
                      <span className="mt-3 font-numeric text-lg font-bold text-profit">
                        {item.apy.toFixed(1)}% APY
                      </span>
                    </Link>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}

          <JsonLd data={jsonLd} />
        </article>
      </main>
      <LegalFooter lang={lang} dict={dict} />
    </>
  );
}
