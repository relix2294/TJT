"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/config";
import { tradingViewSymbol } from "@/lib/market-utils";
import { cn } from "@/lib/utils";

type TimeframeKey = "1D" | "1W" | "1M" | "3M" | "1Y";

const INTERVAL_MAP: Record<TimeframeKey, string> = {
  "1D": "D",
  "1W": "W",
  "1M": "M",
  "3M": "3M",
  "1Y": "12M",
};

type TradingViewChartProps = {
  symbol: string;
  dict: Dictionary;
  locale?: "en" | "ru";
};

export function TradingViewChart({ symbol, dict, locale = "en" }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<TimeframeKey>("1D");
  const t = dict.marketDetail;

  const timeframes: { key: TimeframeKey; label: string }[] = [
    { key: "1D", label: t.timeframe1D },
    { key: "1W", label: t.timeframe1W },
    { key: "1M", label: t.timeframe1M },
    { key: "3M", label: t.timeframe3M },
    { key: "1Y", label: t.timeframe1Y },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const widgetHost = document.createElement("div");
    widgetHost.className = "tradingview-widget-container h-full w-full";
    widgetHost.style.height = "100%";

    const widgetInner = document.createElement("div");
    widgetInner.className = "tradingview-widget-container__widget";
    widgetInner.style.height = "100%";
    widgetHost.appendChild(widgetInner);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tradingViewSymbol(symbol),
      interval: INTERVAL_MAP[timeframe],
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale,
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
      backgroundColor: "#0B0E11",
      gridColor: "rgba(255, 255, 255, 0.06)",
    });

    widgetHost.appendChild(script);
    container.appendChild(widgetHost);

    return () => {
      container.innerHTML = "";
    };
  }, [symbol, timeframe, locale]);

  return (
    <div className="glass overflow-hidden rounded-2xl border border-white/[0.06]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
        <h3 className="font-heading text-sm font-bold text-foreground">{t.chartTitle}</h3>
        <div className="flex flex-wrap gap-1">
          {timeframes.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTimeframe(key)}
              className={cn(
                "rounded-lg px-2.5 py-1 font-numeric text-[11px] font-semibold transition-all duration-200",
                timeframe === key
                  ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div ref={containerRef} className="h-[420px] w-full sm:h-[480px]" />
    </div>
  );
}
