/**
 * Smart error informer (Telegram alert).
 *
 * Because there is no database and the shared source-of-truth files
 * (`config.json`, `sys_registry.json`) are continuously rewritten by both the
 * Node.js (Next.js) and Python/Streamlit processes, a corrupt mid-write payload
 * or a file lock can break the site at any moment. This utility pushes an alert
 * to a private Telegram bot the instant a critical read/write fault is caught in
 * an API route, so the failure is noticed immediately instead of being buried in
 * server logs.
 *
 * It is intentionally best-effort: it never throws (so it can be safely awaited
 * inside a `catch` block), is time-bounded so it can never hang a response, and
 * silently no-ops when the bot credentials are not configured.
 */

const TELEGRAM_API = "https://api.telegram.org";

/** How long to wait on the Telegram API before giving up (ms). */
const REQUEST_TIMEOUT_MS = 4000;

/**
 * Minimum gap between identical alerts (ms). A locked file can throw on every
 * request; without a cooldown a single incident would flood the chat. Keyed by
 * note + error signature, in module memory (good enough per server instance).
 */
const ALERT_COOLDOWN_MS = 60_000;
const lastSentAt = new Map<string, number>();

/** Escape the small subset of HTML that Telegram's HTML parse mode cares about. */
function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildMessage(error: Error, note?: string): string {
  const lines = [
    "🚨 Ошибка на фронтенде! Нарушена схема config.json или файл-источник правды недоступен для чтения/записи.",
  ];
  if (note) lines.push("", `<b>Контекст:</b> ${escapeHtml(note)}`);
  lines.push(
    "",
    `<b>Тип:</b> <code>${escapeHtml(error.name || "Error")}</code>`,
    `<b>Детали:</b> <code>${escapeHtml(error.message)}</code>`,
    `<b>Время (UTC):</b> <code>${new Date().toISOString()}</code>`,
  );
  return lines.join("\n");
}

async function postToTelegram(
  token: string,
  chatId: string,
  text: string,
): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(
        `[telegram-logger] Telegram API responded ${res.status}: ${body}`,
      );
    }
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Report a critical file read/write error to the private Telegram bot.
 *
 * Safe to `await` inside any `catch` block: it resolves even when delivery
 * fails and never rejects. Requires the `TELEGRAM_BOT_TOKEN` and
 * `TELEGRAM_CHAT_ID` environment variables; when they are absent it logs a
 * one-line warning and does nothing else.
 *
 * @param error The thrown error (e.g. a `ConfigError` from `server-config.ts`).
 * @param note  Short human context describing where/why it broke.
 */
export async function sendErrorToTelegram(
  error: Error,
  note?: string,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "[telegram-logger] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID not set — skipping alert.",
    );
    return;
  }

  const key = `${note ?? ""}::${error.name}::${error.message}`;
  const now = Date.now();
  const previous = lastSentAt.get(key);
  if (previous && now - previous < ALERT_COOLDOWN_MS) return;
  lastSentAt.set(key, now);

  try {
    await postToTelegram(token, chatId, buildMessage(error, note));
  } catch (deliveryError) {
    // The alert pipeline must never crash the route that called it.
    console.error("[telegram-logger] Failed to deliver alert:", deliveryError);
  }
}
