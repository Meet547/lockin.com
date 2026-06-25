import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateDemoUser } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

// Validate a hostname: only letters, digits, dots, hyphens. Max 253 chars.
function isValidHost(host: string): boolean {
  if (!host || host.length > 253) return false;
  const labels = host.split(".");
  if (labels.length < 2) return false;
  for (const label of labels) {
    if (!label || label.length > 63) return false;
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(label)) return false;
  }
  return true;
}

// GET /api/blocklist
export async function GET() {
  try {
    const user = await getOrCreateDemoUser();
    const sites = await db.blockedSite.findMany({
      where: { userId: user.id },
      orderBy: { hits: "desc" },
    });
    return NextResponse.json({ sites });
  } catch (e) {
    console.error("[LOCKIN] GET /api/blocklist error:", e);
    return NextResponse.json({ error: "Failed to load blocklist" }, { status: 500 });
  }
}

// POST /api/blocklist — add a site
export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDemoUser();
    const body = await req.json().catch(() => ({}));
    let host = String(body.host || "").trim().toLowerCase();
    if (!host) {
      return NextResponse.json({ error: "host required" }, { status: 400 });
    }
    host = host
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .split("?")[0];

    if (!isValidHost(host)) {
      return NextResponse.json(
        { error: "Invalid hostname. Use a format like example.com" },
        { status: 400 }
      );
    }

    const site = await db.blockedSite.upsert({
      where: { userId_host: { userId: user.id, host } },
      update: {},
      create: { userId: user.id, host },
    });
    return NextResponse.json({ site }, { status: 201 });
  } catch (e) {
    console.error("[LOCKIN] POST /api/blocklist error:", e);
    return NextResponse.json(
      { error: "Failed to add site" },
      { status: 500 }
    );
  }
}
