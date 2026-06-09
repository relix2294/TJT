import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

export function HomeTrustScoreSection({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const t = dict.homeMarketplace;

  const links = [
    { href: `/${lang}/protocols`, label: t.trustLinkProtocols },
    { href: `/${lang}/safety`, label: t.trustLinkSafety },
    { href: `/${lang}/reviews`, label: t.trustLinkReviews },
  ];

  return (
    <section className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-neutral-950 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
              {t.trustEyebrow}
            </p>
          </div>
          <h2 className="font-heading text-lg font-bold text-white sm:text-xl">
            {t.trustTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{t.trustDesc}</p>
          <ul className="mt-3 space-y-1.5 text-xs text-slate-500">
            {t.trustBullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-emerald-500/60" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:min-w-[180px]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-emerald-500/30 hover:text-emerald-400"
            >
              {link.label}
              <ChevronRight className="size-3.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
