import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { SITE } from "@/lib/config";
import { Toaster } from "@/components/ui/sonner";
import { loadDictionary } from "@/lib/server-config";
import { LOCALES, isLocale } from "@/lib/i18n";
import { generatePageMetadata } from "@/lib/seo";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

type LayoutParams = { params: Promise<{ lang: string }> };

/** Pre-render one shell per supported locale. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = await loadDictionary(lang).catch(() => null);
  const title = dict?.site.metaTitle ?? SITE.name;
  const description = dict?.site.metaDescription ?? "";
  return generatePageMetadata({
    lang,
    path: `/${lang}`,
    title,
    description,
    xDefault: true,
  });
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
