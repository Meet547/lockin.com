import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateDemoUser } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

// GET /api/blocklist
export async function GET() {
  const user = await getOrCreateDemoUser();
  const sites = await db.blockedSite.findMany({
    where: { userId: user.id },
    orderBy: { hits: "desc" },
  });
  return NextResponse.json({ sites });
}

// POST /api/blocklist — add a site
export async function POST(req: NextRequest) {
  const user = await getOrCreateDemoUser();
  const body = await req.json().catch(() => ({}));
  let host = String(body.host || "").trim().toLowerCase();
  if (!host) return NextResponse.json({ error: "host required" }, { status: 400 });
  // normalize: strip scheme/path
  host = host.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];

  const site = await db.blockedSite.upsert({
    where: { userId_host: { userId: user.id, host } },
    update: {},
    create: { userId: user.id, host },
  });
  return NextResponse.json({ site }, { status: 201 });
}
