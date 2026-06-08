import { NextResponse } from "next/server";
import { fetchLivePriceTick } from "@/lib/market-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Lightweight LIVE price tick (~10s polling from the client). */
export async function GET() {
  const payload = await fetchLivePriceTick();
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
