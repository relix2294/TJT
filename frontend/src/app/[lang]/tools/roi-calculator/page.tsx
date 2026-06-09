import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Calculator } from "@/components/calculator";
import { Navbar } from "@/components/navbar";
import { LegalFooter } from "@/components/legal-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card } from "@/components/ui/card";
import { loadAppConfig } from "@/lib/server-config";
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
  const t = config?.dict.calculatorPage;
  return generatePageMetadata({
    lang,
    path: localePath(lang, "/tools/roi-calculator"),
    title: t?.metaTitle ?? "ROI Calculator",
    description: t?.metaDescription,
  });
}

function CalculatorFallback() {
  return (
    <Card className="glass relative overflow-hidden rounded-3xl border border-white/[0.06] p-9">
      <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
    </Card>
  );
}

export default async function RoiCalculatorPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  let config: Awaited<ReturnType<typeof loadAppConfig>> | null = null;
  try {
    config = await loadAppConfig(lang);
  } catch {
    notFound();
  }

  const dict = config.dict;

  return (
    <>
      <Navbar lang={lang} dict={dict} />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-5 pt-10 pb-16">
          <Breadcrumbs
            ariaLabel={dict.breadcrumbs.ariaLabel}
            items={[
              { label: dict.breadcrumbs.home, href: `/${lang}` },
              { label: dict.breadcrumbs.tools, href: `/${lang}/tools/roi-calculator` },
              { label: dict.calculatorPage.breadcrumbCalculator },
            ]}
          />

          <Suspense fallback={<CalculatorFallback />}>
            <div className="mt-8">
              <Calculator
                lang={lang}
                dict={dict}
                benchmarks={config.benchmarks}
              />
            </div>
          </Suspense>
        </section>
      </main>
      <LegalFooter lang={lang} dict={dict} />
    </>
  );
}
