"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type PulsingCpaButtonProps = {
  label: string;
  href: string;
  className?: string;
};

export function PulsingCpaButton({ label, href, className }: PulsingCpaButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "animate-cta-pulse group flex w-full items-center justify-center gap-2 rounded-xl border border-profit/40 bg-gradient-to-r from-profit/20 via-profit/10 to-transparent px-6 py-4 text-sm font-bold text-profit shadow-[0_0_24px_rgba(63,185,80,0.15)] transition-all duration-300 hover:border-profit/60 hover:shadow-[0_0_32px_rgba(63,185,80,0.25)]",
        className,
      )}
    >
      {label}
      <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
    </Link>
  );
}
