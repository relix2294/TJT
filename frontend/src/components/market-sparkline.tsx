import { cn } from "@/lib/utils";

type MarketSparklineProps = {
  change24h: number;
  className?: string;
  width?: number;
  height?: number;
};

/** Synthetic micro-chart derived from 24h change direction. */
export function MarketSparkline({
  change24h,
  className,
  width = 72,
  height = 28,
}: MarketSparklineProps) {
  const up = change24h >= 0;
  const magnitude = Math.min(Math.abs(change24h) / 5, 1);
  const midY = height / 2;
  const amplitude = (height / 2 - 2) * (0.35 + magnitude * 0.65);

  const points = Array.from({ length: 8 }, (_, i) => {
    const x = (i / 7) * width;
    const wave = Math.sin((i / 7) * Math.PI * 1.2) * amplitude * 0.35;
    const trend = up ? -((i / 7) * amplitude) : (i / 7) * amplitude;
    const y = midY + trend + wave;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("shrink-0", className)}
      width={width}
      height={height}
      aria-hidden
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className={up ? "text-profit" : "text-loss"}
      />
    </svg>
  );
}
