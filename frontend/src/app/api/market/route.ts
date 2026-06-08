import { NextResponse } from "next/server";
import { fetchLiveMarket } from "@/lib/market-data";
import { sendErrorToTelegram } from "@/lib/telegram-logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Live market quotes from CoinGecko with self-healing fallback to
 * `config.json` → `market_snapshot`.
 */
export async function GET() {
  try {
    const payload = await fetchLiveMarket();
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    await sendErrorToTelegram(
      error,
      "market feed: failed to load CoinGecko or config.json fallback",
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
