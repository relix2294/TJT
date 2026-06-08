"use client";

import { useEffect, useState } from "react";
import type { AppConfig } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

type ConfigState = {
  config: AppConfig | null;
  loading: boolean;
  error: string | null;
};

/**
 * Client hook that streams the backend source of truth into the UI for the
 * active locale.
 *
 * It fetches the `/api/config?lang=` route handler (which reads the root
 * `config.json` and resolves it to `lang`) on mount and whenever `lang`
 * changes. Components use `loading`/`error` to render real skeleton and error
 * states — never hardcoded fallback data.
 */
export function useConfig(lang: Locale): ConfigState {
  const [state, setState] = useState<ConfigState>({
    config: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState({ config: null, loading: true, error: null });

    (async () => {
      try {
        const res = await fetch(`/api/config?lang=${lang}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(body?.error ?? `HTTP ${res.status}`);
        }
        const config = (await res.json()) as AppConfig;
        setState({ config, loading: false, error: null });
      } catch (err) {
        if (controller.signal.aborted) return;
        setState({
          config: null,
          loading: false,
          error: (err as Error).message,
        });
      }
    })();

    return () => controller.abort();
  }, [lang]);

  return state;
}
