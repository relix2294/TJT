import { ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type TrustContextNoteProps = {
  lang: Locale;
};

const COPY: Record<Locale, { title: string; body: string }> = {
  en: {
    title: "Trust & research context",
    body: "TJT Trust Score v0.1 is an educational risk-context framework — not a safety certification, rating, or financial advice. APY figures are indicative catalog snapshots. Verify live rates, audit status, and smart-contract risks on-chain before interacting with any DeFi position.",
  },
  ru: {
    title: "Контекст trust и исследования",
    body: "TJT Trust Score v0.1 — образовательная рамка risk context, не сертификат безопасности, рейтинг или финансовый совет. APY — ориентировочные снимки каталога. Проверяйте live-ставки, аудиты и риски смарт-контрактов on-chain перед взаимодействием с DeFi.",
  },
};

export function TrustContextNote({ lang }: TrustContextNoteProps) {
  const copy = COPY[lang];

  return (
    <aside
      className="mt-10 rounded-2xl border border-border/60 bg-background/40 p-5 sm:p-6"
      aria-label={copy.title}
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <h2 className="font-heading text-sm font-bold text-white">{copy.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {copy.body}
          </p>
        </div>
      </div>
    </aside>
  );
}
