import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPilotHubPage, seoPilotHubMetadataInput } from "@/components/seo-pilot/hub-page";
import { loadDictionary } from "@/lib/server-config";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { generatePageMetadata } from "@/lib/seo";

export const dynamic = "force-static";

type PageProps = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const { path, title, description } = seoPilotHubMetadataInput(lang, "learn");
  return generatePageMetadata({
    lang,
    path,
    title,
    description,
    keywords: [
      "defi education",
      "what is defi yield",
      "liquid staking",
      "crypto yield risks",
      "defi learning",
    ],
    ogImageAlt: "TJT DeFi Learning Hub",
  });
}

export default async function LearnHubPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await loadDictionary(lang).catch(() => null);
  if (!dict) notFound();

  return <SeoPilotHubPage lang={lang as Locale} dict={dict} hubSegment="learn" />;
}
