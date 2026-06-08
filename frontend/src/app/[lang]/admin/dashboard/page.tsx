import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Clock,
  FileText,
  Film,
  Globe2,
  MousePointerClick,
  Target,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { loadDictionary } from "@/lib/server-config";
import {
  loadDashboardData,
  type DashboardData,
  type LangStat,
  type OfferStat,
} from "@/lib/server-registry";
import { fmtDateTime } from "@/lib/format";
import { LOCALES, isLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/config";
import { cn } from "@/lib/utils";

// The dashboard reads the live, file-backed registry on every request — never
// pre-render or cache it.
export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "CPA Dashboard · TJT",
  robots: { index: false, follow: false },
};

function pct(share: number): string {
  return `${(share * 100).toFixed(share >= 0.1 ? 0 : 1)}%`;
}

function riskTone(rating: string | null): string {
  if (!rating) return "border-border text-muted-foreground";
  if (rating.startsWith("AAA")) return "border-profit/40 bg-profit/10 text-profit";
  if (rating.startsWith("AA")) return "border-primary/40 bg-[--neon-soft] text-primary";
  return "border-loss/40 bg-loss/10 text-loss";
}

function langLabel(lang: string, t: Dictionary["admin"]): string {
  if (lang === "en") return t.langEn;
  if (lang === "ru") return t.langRu;
  return t.langUnknown;
}

const LANG_TONE: Record<string, string> = {
  en: "bg-primary",
  ru: "bg-profit",
};

export default async function AdminDashboardPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await loadDictionary(lang);
  const t = dict.admin;

  let data: DashboardData | null = null;
  let error: string | null = null;
  try {
    data = await loadDashboardData();
  } catch (err) {
    error = (err as Error).message;
  }

  return (
    <main className="min-h-screen">
      <AdminHeader lang={lang} t={t} />

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-8">
        {/* Title block */}
        <div className="mb-8 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Activity className="size-3.5" />
            {t.eyebrow}
          </span>
          <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-3 text-muted-foreground">{t.desc}</p>
        </div>

        {error || !data ? (
          <Card className="rounded-2xl border-loss/40 bg-loss/5 p-6 text-sm text-loss">
            {t.error}
            {error ? <span className="mt-1 block text-loss/70">{error}</span> : null}
          </Card>
        ) : (
          <DashboardBody lang={lang} t={t} data={data} />
        )}
      </div>
    </main>
  );
}

function AdminHeader({ lang, t }: { lang: Locale; t: Dictionary["admin"] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link
          href={`/${lang}`}
          className="group inline-flex items-center gap-2.5"
          aria-label="TJT"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary/15 font-heading text-sm font-bold text-primary ring-1 ring-primary/30">
            T
          </span>
          <span className="font-heading text-sm font-bold tracking-tight text-white">
            TJT
            <span className="ml-1.5 font-sans text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              admin
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="gap-1.5 border-profit/30 bg-profit/10 font-medium text-profit"
          >
            <span className="size-1.5 animate-pulse-dot rounded-full bg-profit" />
            {t.liveBadge}
          </Badge>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            {t.backToSite}
          </Link>
        </div>
      </div>
    </header>
  );
}

function DashboardBody({
  lang,
  t,
  data,
}: {
  lang: Locale;
  t: Dictionary["admin"];
  data: DashboardData;
}) {
  const totalCatalog = data.offerStats.length;

  return (
    <>
      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<MousePointerClick className="size-5" />}
          tone="primary"
          label={t.kpiTotalClicks}
          value={data.totalClicks.toLocaleString(lang === "ru" ? "ru-RU" : "en-US")}
          sub={
            data.lastUpdated
              ? `${t.lastUpdated}: ${fmtDateTime(data.lastUpdated, lang)}`
              : t.never
          }
        />
        <KpiCard
          icon={<Target className="size-5" />}
          tone="profit"
          label={t.kpiActiveOffers}
          value={`${data.uniqueOffers}`}
          sub={`${t.kpiOfTotal}: ${totalCatalog}`}
        />
        <KpiCard
          icon={<FileText className="size-5" />}
          tone="muted"
          label={t.kpiArticles}
          value={`${data.metrics.generatedArticles}`}
        />
        <KpiCard
          icon={<Film className="size-5" />}
          tone="muted"
          label={t.kpiVideoScripts}
          value={`${data.metrics.generatedVideoScripts}`}
        />
      </div>

      {/* Analytics tabs */}
      <Tabs defaultValue="offer" className="mt-8 gap-4">
        <TabsList className="h-9 bg-surface/70 ring-1 ring-foreground/10">
          <TabsTrigger value="offer" className="gap-1.5">
            <Target className="size-3.5" />
            {t.tabByOffer}
          </TabsTrigger>
          <TabsTrigger value="lang" className="gap-1.5">
            <Globe2 className="size-3.5" />
            {t.tabByLang}
          </TabsTrigger>
          <TabsTrigger value="recent" className="gap-1.5">
            <Clock className="size-3.5" />
            {t.tabRecent}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offer">
          <PanelCard title={t.byOfferTitle} desc={t.byOfferDesc}>
            <OfferTable lang={lang} t={t} stats={data.offerStats} />
          </PanelCard>
        </TabsContent>

        <TabsContent value="lang">
          <PanelCard title={t.byLangTitle} desc={t.byLangDesc}>
            {data.langStats.length === 0 ? (
              <EmptyState label={t.emptyClicks} />
            ) : (
              <LangBreakdown t={t} stats={data.langStats} total={data.totalClicks} />
            )}
          </PanelCard>
        </TabsContent>

        <TabsContent value="recent">
          <PanelCard title={t.recentTitle} desc={t.recentDesc}>
            {data.recentClicks.length === 0 ? (
              <EmptyState label={t.emptyClicks} />
            ) : (
              <RecentTable lang={lang} t={t} data={data} />
            )}
          </PanelCard>
        </TabsContent>
      </Tabs>
    </>
  );
}

function KpiCard({
  icon,
  tone,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  tone: "primary" | "profit" | "muted";
  label: string;
  value: string;
  sub?: string;
}) {
  const toneClass = {
    primary: "text-primary",
    profit: "text-profit",
    muted: "text-muted-foreground",
  }[tone];

  return (
    <Card className="glass relative overflow-hidden rounded-2xl border border-white/[0.06] p-5">
      <div
        className={cn(
          "mb-3 flex size-9 items-center justify-center rounded-lg bg-background/60",
          toneClass,
        )}
      >
        {icon}
      </div>
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-heading font-numeric text-3xl font-extrabold tabular-nums text-white">
        {value}
      </div>
      {sub ? (
        <div className="mt-1.5 truncate text-xs text-muted-foreground/80">{sub}</div>
      ) : null}
    </Card>
  );
}

function PanelCard({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="glass overflow-hidden rounded-2xl border border-white/[0.06] py-0">
      <CardHeader className="border-b border-white/[0.06] px-5 py-4">
        <CardTitle className="text-base text-white">{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 py-1 sm:px-3">{children}</CardContent>
    </Card>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center px-4 py-14 text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function ShareBar({ share, tone }: { share: number; tone: string }) {
  return (
    <div className="h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-background/70">
      <div
        className={cn("h-full rounded-full", tone)}
        style={{ width: `${Math.max(share * 100, share > 0 ? 4 : 0)}%` }}
      />
    </div>
  );
}

function OfferTable({
  lang,
  t,
  stats,
}: {
  lang: Locale;
  t: Dictionary["admin"];
  stats: OfferStat[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-8 text-center">{t.colRank}</TableHead>
          <TableHead>{t.colOffer}</TableHead>
          <TableHead>{t.colNetwork}</TableHead>
          <TableHead className="text-right">{t.colApy}</TableHead>
          <TableHead className="text-center">{t.colRisk}</TableHead>
          <TableHead className="text-right">{t.colClicks}</TableHead>
          <TableHead className="hidden sm:table-cell">{t.colShare}</TableHead>
          <TableHead className="hidden text-right md:table-cell">
            {t.colLastClick}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.map((s, i) => (
          <TableRow key={s.offerId}>
            <TableCell className="text-center font-numeric text-xs text-muted-foreground tabular-nums">
              {i + 1}
            </TableCell>
            <TableCell>
              <div className="font-medium text-white">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.protocol}</div>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{s.network}</TableCell>
            <TableCell className="text-right font-numeric font-semibold tabular-nums text-profit">
              {s.apy != null ? `${s.apy.toFixed(1)}%` : "—"}
            </TableCell>
            <TableCell className="text-center">
              {s.riskRating ? (
                <Badge variant="outline" className={cn("font-bold", riskTone(s.riskRating))}>
                  {s.riskRating}
                </Badge>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell className="text-right font-numeric text-base font-bold tabular-nums text-white">
              {s.clicks}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <div className="flex items-center gap-2">
                <ShareBar share={s.share} tone="bg-primary" />
                <span className="font-numeric text-xs tabular-nums text-muted-foreground">
                  {pct(s.share)}
                </span>
              </div>
            </TableCell>
            <TableCell className="hidden text-right text-xs text-muted-foreground md:table-cell">
              {s.lastClick ? fmtDateTime(s.lastClick, lang) : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function LangBreakdown({
  t,
  stats,
  total,
}: {
  t: Dictionary["admin"];
  stats: LangStat[];
  total: number;
}) {
  return (
    <div className="grid gap-6 p-3 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      {/* Cards per language */}
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((s) => (
          <div
            key={s.lang}
            className="rounded-xl border border-border/60 bg-background/40 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                {langLabel(s.lang, t)}
              </span>
              <span className="font-numeric text-xs uppercase tabular-nums text-muted-foreground">
                {s.lang}
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <span className="font-numeric text-3xl font-extrabold tabular-nums text-white">
                {s.clicks}
              </span>
              <span className="font-numeric text-sm font-semibold tabular-nums text-primary">
                {pct(s.share)}
              </span>
            </div>
            <div className="mt-3">
              <ShareBar share={s.share} tone={LANG_TONE[s.lang] ?? "bg-muted-foreground"} />
            </div>
          </div>
        ))}
      </div>

      {/* Stacked composition bar */}
      <div>
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {total} · 100%
        </div>
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-background/70 ring-1 ring-white/[0.05]">
          {stats.map((s) => (
            <div
              key={s.lang}
              className={cn("h-full", LANG_TONE[s.lang] ?? "bg-muted-foreground")}
              style={{ width: `${s.share * 100}%` }}
              title={`${langLabel(s.lang, t)} · ${s.clicks}`}
            />
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {stats.map((s) => (
            <div key={s.lang} className="flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "size-2.5 rounded-sm",
                  LANG_TONE[s.lang] ?? "bg-muted-foreground",
                )}
              />
              <span className="text-muted-foreground">{langLabel(s.lang, t)}</span>
              <span className="ml-auto font-numeric tabular-nums text-white">
                {s.clicks}
              </span>
              <span className="w-12 text-right font-numeric tabular-nums text-muted-foreground">
                {pct(s.share)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentTable({
  lang,
  t,
  data,
}: {
  lang: Locale;
  t: Dictionary["admin"];
  data: DashboardData;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>{t.colTime}</TableHead>
          <TableHead>{t.colOffer}</TableHead>
          <TableHead>{t.colNetwork}</TableHead>
          <TableHead>{t.colLanguage}</TableHead>
          <TableHead className="text-right">{t.colApy}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.recentClicks.map((c, i) => (
          <TableRow key={`${c.offerId}-${c.timestamp}-${i}`}>
            <TableCell className="font-numeric text-xs tabular-nums text-muted-foreground">
              {fmtDateTime(c.timestamp, lang)}
            </TableCell>
            <TableCell>
              <div className="font-medium text-white">{c.offerName}</div>
              <div className="text-xs text-muted-foreground">{c.protocol}</div>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{c.network}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  c.lang === "en"
                    ? "border-primary/30 bg-[--neon-soft] text-primary"
                    : c.lang === "ru"
                      ? "border-profit/30 bg-profit/10 text-profit"
                      : "border-border text-muted-foreground",
                )}
              >
                {c.lang ? langLabel(c.lang, t) : t.langUnknown}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-numeric font-semibold tabular-nums text-profit">
              {c.apy != null ? `${c.apy.toFixed(1)}%` : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
