import { NextResponse, type NextRequest } from "next/server";
import { loadAppConfig } from "@/lib/server-config";
import { sendErrorToTelegram } from "@/lib/telegram-logger";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public read-only endpoint that exposes the backend `config.json`
 * (benchmarks, CPA offers, market snapshot, news, interface dictionary),
 * already resolved to the locale requested via `?lang=`.
 *
 * The Python backend remains the single source of truth: this handler reads,
 * validates, normalizes and localizes that file on every request so the site
 * reflects the latest values without a redeploy.
 */
export async function GET(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get("lang");
  const lang = isLocale(langParam) ? langParam : DEFAULT_LOCALE;

  try {
    const config = await loadAppConfig(lang);
    return NextResponse.json(config, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    await sendErrorToTelegram(
      error,
      `config resolver: failed to load/normalize config.json (lang=${lang}) — ` +
        "source of truth is missing, locked or malformed",
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
