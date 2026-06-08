import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/config";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { AdminLoginForm } from "./admin-login-form";

type PageProps = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Admin Login · TJT",
  robots: { index: false, follow: false },
};

const COPY = {
  en: {
    badge: "Restricted area",
    title: "CPA Analytics",
    subtitle: "Authorized personnel only. Sessions last 7 days.",
  },
  ru: {
    badge: "Закрытый раздел",
    title: "CPA-аналитика",
    subtitle: "Только для авторизованных пользователей. Сессия — 7 дней.",
  },
} as const;

export default async function AdminLoginPage({ params }: PageProps) {
  const { lang: rawLang } = await params;
  if (!isLocale(rawLang)) notFound();
  const lang = rawLang as Locale;
  const t = COPY[lang];

  return (
    <main className="relative flex min-h-full flex-1 items-center justify-center bg-background px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.12),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <div className="mb-8 space-y-4 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-primary/30 bg-[--neon-soft]">
              <ShieldCheck className="size-7 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                {t.badge}
              </p>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                {t.title}
              </h1>
              <p className="text-sm text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>

          <AdminLoginForm lang={lang} />

          <p className="mt-8 text-center text-xs text-muted-foreground/80">
            {SITE.name} · {lang.toUpperCase()}
          </p>
        </div>
      </div>
    </main>
  );
}
