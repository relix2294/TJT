"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CpaOffer, Dictionary } from "@/lib/config";

const GATEWAY_MIN_MS = 900;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function OfferButton({
  offer,
  dict,
  lang,
  label,
  className,
}: {
  offer: CpaOffer;
  dict: Dictionary;
  lang?: "en" | "ru";
  label?: string;
  className?: string;
}) {
  const [pending, setPending] = useState(false);
  const t = dict.offerButton;
  const idleLabel = label ?? t.idle;

  async function handleClick() {
    if (pending) return;
    setPending(true);

    // Open the destination tab synchronously to preserve the user gesture
    // (avoids popup blockers once the async gateway resolves).
    const target = window.open("", "_blank", "noopener,noreferrer");

    const track = (async () => {
      const [res] = await Promise.all([
        fetch("/api/click-track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offerId: offer.id, lang }),
        }),
        sleep(GATEWAY_MIN_MS),
      ]);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as {
        ok: boolean;
        total: number;
        offer: { referralUrl: string };
      };
    })();

    toast.promise(track, {
      loading: t.loading,
      success: (data) => {
        const url = data.offer.referralUrl;
        if (target) target.location.href = url;
        else window.location.assign(url);
        const suffix = t.successSuffix ? ` ${t.successSuffix}` : "";
        return `${t.successPrefix} ${offer.name}${suffix}`;
      },
      description: `${offer.protocol} · ${offer.network} · ${offer.apy}% APY`,
      error: () => {
        target?.close();
        return t.error;
      },
      finally: () => setPending(false),
    });
  }

  return (
    <Button
      onClick={handleClick}
      disabled={pending}
      className={cn(
        "mt-6 w-full rounded-xl bg-white/5 font-semibold text-white transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-70",
        className,
      )}
    >
      {pending ? t.opening : idleLabel}
      <ArrowUpRight className="size-4" />
    </Button>
  );
}
