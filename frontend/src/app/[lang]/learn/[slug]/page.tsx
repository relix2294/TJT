import { notFound } from "next/navigation";
import { SeoPilotDetailPage } from "@/components/seo-pilot/detail-page";
import { loadDictionary } from "@/lib/server-config";
import { isLocale, type Locale } from "@/lib/i18n";
import {
  buildSeoPilotMetadata,
  buildSeoPilotStaticParams,
} from "@/lib/seo-pilot/page-helpers";
import { getSeoPilotPage, isLearnSlug } from "@/lib/seo-pilot";

export const dynamic = "force-static";

type PageProps = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return buildSeoPilotStaticParams("learn");
}

export async function generateMetadata({ params }: PageProps) {
  const { lang, slug } = await params;
  return buildSeoPilotMetadata(lang, "learn", slug);
}

export default async function LearnPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isLearnSlug(slug)) notFound();

  const page = getSeoPilotPage(slug);
  if (!page) notFound();

  const dict = await loadDictionary(lang).catch(() => null);
  if (!dict) notFound();

  return (
    <SeoPilotDetailPage lang={lang as Locale} dict={dict} page={page} />
  );
}
