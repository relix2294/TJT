/**
 * Client-side, branded PDF generator for the opportunity-cost calculator.
 *
 * This is the "lead magnet": it turns the reactive calculation into a polished,
 * shareable document the visitor takes with them — and, crucially, embeds live,
 * clickable CPA referral links so the report itself keeps generating outbound
 * traffic ("evergreen traffic generator").
 *
 * It is intentionally dynamically imported (`await import("@/lib/pdf-report")`)
 * from the calculator so neither `jspdf` nor the embedded fonts ship in the
 * initial bundle. Russian (Cyrillic) is fully supported via a PT Sans face
 * loaded at runtime from `/public/fonts` — jsPDF's built-in Helvetica is
 * Latin-only and would mangle the `ru` locale.
 */
import type { CpaOffer } from "@/lib/config";
import type { Dictionary } from "@/lib/config";
import type { Locale } from "@/lib/i18n";
import { fmtYears } from "@/lib/format";

export type ReportResults = {
  bankGain: number;
  inflationLoss: number;
  web3Gain: number;
  missedYield: number;
};

export type ReportBenchmarks = {
  bankDepositApr: number;
  realInflationRate: number;
  web3AggregatorApy: number;
};

export type ReportInput = {
  lang: Locale;
  dict: Dictionary;
  capital: number;
  years: number;
  benchmarks: ReportBenchmarks;
  results: ReportResults;
  offers: CpaOffer[];
};

/* --------------------------------- theme --------------------------------- */

const INK = "#14151b";
const SUB = "#6b7280";
const ACCENT = "#4f46e5"; // titanium / indigo — the brand accent
const PROFIT = "#1f9d4d";
const LOSS = "#dc2626";
const LINE = "#e6e7ec";
const PANEL = "#f5f6f8";
const HEADER_BG = "#0b0c10";

const FONT = "PTSans";
const REG = "/fonts/PTSans-Regular.ttf";
const BOLD = "/fonts/PTSans-Bold.ttf";

/* ------------------------------ font loading ----------------------------- */

let fontCache: Promise<{ regular: string; bold: string }> | null = null;

function bufferToBase64(buf: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function fetchFontBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font fetch failed (${url}): HTTP ${res.status}`);
  return bufferToBase64(await res.arrayBuffer());
}

function loadFonts() {
  if (!fontCache) {
    fontCache = Promise.all([fetchFontBase64(REG), fetchFontBase64(BOLD)]).then(
      ([regular, bold]) => ({ regular, bold }),
    );
  }
  return fontCache;
}

/* ----------------------------- number helpers ---------------------------- */

function usd(value: number, lang: Locale): string {
  const locale = lang === "ru" ? "ru-RU" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function usdSigned(value: number, lang: Locale): string {
  const sign = value < 0 ? "−" : "+";
  return `${sign}${usd(Math.abs(value), lang)}`;
}

/* ------------------------------- generator ------------------------------- */

export async function generateOpportunityReport(input: ReportInput): Promise<void> {
  const { lang, capital, years, benchmarks, results, offers } = input;
  const t = input.dict.report;

  const [{ jsPDF }, fonts] = await Promise.all([import("jspdf"), loadFonts()]);

  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  doc.addFileToVFS("PTSans-Regular.ttf", fonts.regular);
  doc.addFont("PTSans-Regular.ttf", FONT, "normal");
  doc.addFileToVFS("PTSans-Bold.ttf", fonts.bold);
  doc.addFont("PTSans-Bold.ttf", FONT, "bold");
  doc.setFont(FONT, "normal");

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = 0;

  const setFill = (hex: string) => doc.setFillColor(hex);
  const setText = (hex: string) => doc.setTextColor(hex);
  const setDraw = (hex: string) => doc.setDrawColor(hex);

  /* ------------------------------- header -------------------------------- */
  const headerH = 92;
  setFill(HEADER_BG);
  doc.rect(0, 0, pageW, headerH, "F");
  // Accent hairline under the header.
  setFill(ACCENT);
  doc.rect(0, headerH, pageW, 3, "F");

  // Wordmark badge
  setFill(ACCENT);
  doc.roundedRect(margin, 30, 34, 34, 7, 7, "F");
  doc.setFont(FONT, "bold");
  doc.setFontSize(20);
  setText("#ffffff");
  doc.text("T", margin + 17, 53, { align: "center" });

  doc.setFontSize(20);
  setText("#ffffff");
  doc.text("TJT", margin + 48, 47);
  doc.setFont(FONT, "normal");
  doc.setFontSize(8.5);
  setText("#9aa0ad");
  doc.text(t.brandTagline, margin + 48, 61);

  // Document title (right aligned)
  doc.setFont(FONT, "bold");
  doc.setFontSize(13);
  setText("#ffffff");
  doc.text(t.documentTitle, pageW - margin, 44, { align: "right" });
  doc.setFont(FONT, "normal");
  doc.setFontSize(8.5);
  setText("#9aa0ad");
  const now = new Date().toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(`${t.generatedOn}: ${now}`, pageW - margin, 60, { align: "right" });

  y = headerH + 34;

  /* --------------------------- scenario inputs --------------------------- */
  sectionLabel(doc, t.inputsHeading, margin, y);
  y += 14;

  const boxGap = 16;
  const boxW = (contentW - boxGap) / 2;
  const boxH = 64;
  drawStatBox(doc, margin, y, boxW, boxH, t.capitalLabel, usd(capital, lang), ACCENT);
  drawStatBox(
    doc,
    margin + boxW + boxGap,
    y,
    boxW,
    boxH,
    t.horizonLabel,
    fmtYears(years, lang),
    INK,
  );
  y += boxH + 30;

  /* ----------------------- benchmark projection table -------------------- */
  sectionLabel(doc, t.benchmarksHeading, margin, y);
  y += 18;

  const rows: { label: string; rate: string; value: number; tone: string }[] = [
    {
      label: t.bankLabel,
      rate: `${benchmarks.bankDepositApr}%`,
      value: results.bankGain,
      tone: INK,
    },
    {
      label: t.inflationLabel,
      rate: `${benchmarks.realInflationRate}%`,
      value: -results.inflationLoss,
      tone: LOSS,
    },
    {
      label: t.web3Label,
      rate: `${benchmarks.web3AggregatorApy}%`,
      value: results.web3Gain,
      tone: PROFIT,
    },
  ];

  // Column geometry
  const cScenario = margin + 12;
  const cRate = margin + contentW * 0.5;
  const cResult = pageW - margin - 12;

  // Header row
  doc.setFont(FONT, "bold");
  doc.setFontSize(8);
  setText(SUB);
  doc.text(t.colScenario.toUpperCase(), cScenario, y);
  doc.text(t.colRate.toUpperCase(), cRate, y);
  doc.text(t.colResult.toUpperCase(), cResult, y, { align: "right" });
  y += 6;
  setDraw(LINE);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageW - margin, y);
  y += 18;

  const maxAbs = Math.max(
    Math.abs(results.web3Gain),
    Math.abs(results.bankGain),
    Math.abs(results.inflationLoss),
    1,
  );
  const barTrackX = cRate + 46;
  const barTrackW = cResult - barTrackX - 96;

  doc.setFontSize(11);
  for (const row of rows) {
    doc.setFont(FONT, "bold");
    setText(INK);
    doc.text(row.label, cScenario, y);
    doc.setFont(FONT, "normal");
    setText(SUB);
    doc.text(row.rate, cRate, y);

    // mini bar
    if (barTrackW > 20) {
      setFill("#eceef2");
      doc.roundedRect(barTrackX, y - 8, barTrackW, 6, 3, 3, "F");
      const w = Math.max((Math.abs(row.value) / maxAbs) * barTrackW, 2);
      setFill(row.tone);
      doc.roundedRect(barTrackX, y - 8, w, 6, 3, 3, "F");
    }

    doc.setFont(FONT, "bold");
    setText(row.tone);
    doc.text(usdSigned(row.value, lang), cResult, y, { align: "right" });

    y += 14;
    setDraw(LINE);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 18;
  }

  y += 8;

  /* ------------------------- headline: opportunity cost ------------------- */
  const heroH = 84;
  setFill(PANEL);
  doc.roundedRect(margin, y, contentW, heroH, 10, 10, "F");
  setFill(PROFIT);
  doc.roundedRect(margin, y, 4, heroH, 2, 2, "F");

  doc.setFont(FONT, "bold");
  doc.setFontSize(9);
  setText(PROFIT);
  doc.text(t.missedHeading.toUpperCase(), margin + 20, y + 24);

  doc.setFont(FONT, "bold");
  doc.setFontSize(30);
  setText(PROFIT);
  doc.text(usd(results.missedYield, lang), margin + 20, y + 56);

  doc.setFont(FONT, "normal");
  doc.setFontSize(8.5);
  setText(SUB);
  const subLines = doc.splitTextToSize(t.missedSub, contentW * 0.42);
  doc.text(subLines, pageW - margin - 16, y + 34, { align: "right" });

  y += heroH + 30;

  /* ------------------------------- offers -------------------------------- */
  doc.setFont(FONT, "bold");
  doc.setFontSize(13);
  setText(INK);
  doc.text(t.offersHeading, margin, y);
  y += 16;
  doc.setFont(FONT, "normal");
  doc.setFontSize(9);
  setText(SUB);
  const introLines = doc.splitTextToSize(t.offersIntro, contentW);
  doc.text(introLines, margin, y);
  y += introLines.length * 12 + 12;

  const rowH = 50;
  for (const offer of offers) {
    if (y + rowH > pageH - 110) {
      doc.addPage();
      y = margin + 6;
    }

    // Card
    setFill("#ffffff");
    setDraw(LINE);
    doc.setLineWidth(0.8);
    doc.roundedRect(margin, y, contentW, rowH, 8, 8, "FD");

    const padX = margin + 16;
    const midY = y + rowH / 2;

    // Name + meta
    doc.setFont(FONT, "bold");
    doc.setFontSize(11.5);
    setText(INK);
    doc.text(offer.name, padX, midY - 5);

    doc.setFont(FONT, "normal");
    doc.setFontSize(8.5);
    setText(SUB);
    const meta = `${offer.protocol} · ${offer.network} · ${t.minLabel} ${usd(
      offer.minEntryUsd,
      lang,
    )}`;
    doc.text(meta, padX, midY + 10);

    // APY pill
    doc.setFont(FONT, "bold");
    doc.setFontSize(15);
    setText(PROFIT);
    const apyText = `${offer.apy.toFixed(1)}%`;
    const apyX = pageW - margin - 150;
    doc.text(apyText, apyX, midY + 1, { align: "right" });
    doc.setFont(FONT, "normal");
    doc.setFontSize(7);
    setText(SUB);
    doc.text("APY", apyX + 2, midY + 11, { align: "right" });

    // Clickable CTA — this is the evergreen traffic hook.
    const ctaW = 120;
    const ctaH = 26;
    const ctaX = pageW - margin - 16 - ctaW;
    const ctaY = midY - ctaH / 2;
    setFill(ACCENT);
    doc.roundedRect(ctaX, ctaY, ctaW, ctaH, 6, 6, "F");
    doc.setFont(FONT, "bold");
    doc.setFontSize(9.5);
    setText("#ffffff");
    const ctaLabel = `${t.openLink}  →`;
    doc.textWithLink(ctaLabel, ctaX + ctaW / 2, ctaY + 17, {
      url: offer.referralUrl,
      align: "center",
    });
    // Make the whole card clickable too.
    doc.link(margin, y, contentW, rowH, { url: offer.referralUrl });

    y += rowH + 12;
  }

  /* ----------------------------- disclaimer ------------------------------ */
  if (y + 90 > pageH - 70) {
    doc.addPage();
    y = margin + 6;
  }
  y = Math.max(y + 6, pageH - 150);
  setDraw(LINE);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 18;
  doc.setFont(FONT, "bold");
  doc.setFontSize(8.5);
  setText(SUB);
  doc.text(t.disclaimerHeading.toUpperCase(), margin, y);
  y += 12;
  doc.setFont(FONT, "normal");
  doc.setFontSize(7.5);
  setText("#9aa0ad");
  const disLines = doc.splitTextToSize(t.disclaimer, contentW);
  doc.text(disLines, margin, y);

  /* --------------------------- footer + paging --------------------------- */
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    addFooter(doc, t, p, pageCount);
  }

  const safeCapital = Math.round(capital);
  doc.save(`${t.fileLabel}-${safeCapital}-${years}y.pdf`);
}

/* ------------------------------- drawing -------------------------------- */

function sectionLabel(
  doc: import("jspdf").jsPDF,
  text: string,
  x: number,
  y: number,
) {
  doc.setFont(FONT, "bold");
  doc.setFontSize(12);
  doc.setTextColor(INK);
  doc.text(text, x, y);
}

function drawStatBox(
  doc: import("jspdf").jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  valueColor: string,
) {
  doc.setFillColor(PANEL);
  doc.roundedRect(x, y, w, h, 9, 9, "F");
  doc.setFont(FONT, "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(SUB);
  doc.text(label.toUpperCase(), x + 16, y + 22);
  doc.setFont(FONT, "bold");
  doc.setFontSize(20);
  doc.setTextColor(valueColor);
  doc.text(value, x + 16, y + 48);
}

function addFooter(
  doc: import("jspdf").jsPDF,
  t: Dictionary["report"],
  page?: number,
  total?: number,
) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  doc.setDrawColor(LINE);
  doc.setLineWidth(0.5);
  doc.line(margin, pageH - 40, pageW - margin, pageH - 40);
  doc.setFont(FONT, "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(SUB);
  doc.text("TJT · tjt.example", margin, pageH - 26);
  if (page && total) {
    doc.text(
      `${t.pageLabel} ${page} ${t.ofLabel} ${total}`,
      pageW - margin,
      pageH - 26,
      { align: "right" },
    );
  }
}
