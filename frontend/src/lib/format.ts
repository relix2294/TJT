const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const USD2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function fmtUsd(value: number): string {
  return USD.format(Math.round(value));
}

export function fmtUsd2(value: number): string {
  return USD2.format(value);
}

export function fmtUsdSigned(value: number): string {
  const sign = value < 0 ? "−" : "+";
  return `${sign}${USD.format(Math.abs(Math.round(value)))}`;
}

export function fmtPct(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function fmtCompactUsd(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return USD.format(value);
}

import type { Locale } from "@/lib/i18n";

const NEWS_DATE: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  ru: new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
};

/** Human-friendly publication date, e.g. "June 4, 2026" / "4 июня 2026". */
export function fmtNewsDate(iso: string, lang: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return NEWS_DATE[lang].format(date);
}

const DATE_TIME: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),
  ru: new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),
};

/** Compact date + time for log rows, e.g. "04 Jun, 19:47" / "04 июн, 19:47". */
export function fmtDateTime(iso: string, lang: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return DATE_TIME[lang].format(date);
}

/** Relative "time ago" label for fresh-news ticker badges. */
export function fmtTimeAgo(
  iso: string,
  lang: Locale,
  now: number = Date.now(),
): string {
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return "";
  const diffMs = Math.max(0, now - ts);
  const minutes = Math.floor(diffMs / 60000);

  if (lang === "ru") {
    if (minutes < 1) return "только что";
    if (minutes < 60) return `${minutes} мин назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ч назад`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} дн назад`;
    return fmtNewsDate(iso, lang);
  }

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} d ago`;
  return fmtNewsDate(iso, lang);
}

/** Localized "N years" label with correct Russian pluralization. */
export function fmtYears(n: number, lang: Locale): string {
  if (lang === "en") return `${n} ${n === 1 ? "year" : "years"}`;
  const mod10 = n % 10;
  const mod100 = n % 100;
  let unit: string;
  if (mod10 === 1 && mod100 !== 11) unit = "год";
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) unit = "года";
  else unit = "лет";
  return `${n} ${unit}`;
}
