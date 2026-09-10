import { NextResponse } from "next/server";
import { getCompetitionsPayload } from "@/lib/competitions";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fresh =
    searchParams.get("fresh") === "1" || searchParams.get("live") === "1";

  const payload = await getCompetitionsPayload({ fresh });
  return NextResponse.json(
    {
      ...payload,
      checkedAt: new Date().toISOString(),
      live: fresh,
    },
    {
      headers: {
        "Cache-Control": fresh
          ? "no-store, max-age=0"
          : "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
