import { notFound } from "next/navigation";
import { SeoPilotDetailPage } from "@/components/seo-pilot/detail-page";
import { loadDictionary } from "@/lib/server-config";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { buildMetadataForPage } from "@/lib/seo-pilot/page-helpers";
import { getSeoPilotPage } from "@/lib/seo-pilot";

export const dynamic = "force-static";

type PageProps = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const page = getSeoPilotPage("how-to-compare-eth-yield");
  if (!page) return {};

  return buildMetadataForPage(lang, page);
}

export default async function EthYieldGuidePage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const page = getSeoPilotPage("how-to-compare-eth-yield");
  if (!page) notFound();

  const dict = await loadDictionary(lang).catch(() => null);
  if (!dict) notFound();

  return (
    <SeoPilotDetailPage lang={lang as Locale} dict={dict} page={page} />
  );
}
