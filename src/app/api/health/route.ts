import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;

  return NextResponse.json({
    ok: true,
    service: "ai-competition-radar",
    env: process.env.VERCEL ? "vercel" : "local",
    url: origin,
    ts: new Date().toISOString(),
  });
}
