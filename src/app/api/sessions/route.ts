import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateDemoUser } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

const VALID_MODES = ["easy", "hard", "monk"] as const;
const MIN_DURATION = 1;
const MAX_DURATION = 480; // 8 hours cap

// GET /api/sessions — list sessions for the demo user
export async function GET() {
  try {
    const user = await getOrCreateDemoUser();
    const sessions = await db.session.findMany({
      where: { userId: user.id },
      orderBy: { startedAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ sessions });
  } catch (e) {
    console.error("[LOCKIN] GET /api/sessions error:", e);
    return NextResponse.json({ error: "Failed to load sessions" }, { status: 500 });
  }
}

// POST /api/sessions — start a new session
export async function POST(req: NextRequest) {
  try {
    const user = await getOrCreateDemoUser();
    const body = await req.json().catch(() => ({}));

    const mode =
      typeof body.mode === "string" &&
      VALID_MODES.includes(body.mode as (typeof VALID_MODES)[number])
        ? body.mode
        : "monk";

    const rawDur = Number(body.durationMin);
    const durationMin =
      Number.isFinite(rawDur) && rawDur >= MIN_DURATION && rawDur <= MAX_DURATION
        ? Math.floor(rawDur)
        : 90;

    // End any currently-active session first (one at a time)
    await db.session.updateMany({
      where: { userId: user.id, status: "active" },
      data: { status: "cancelled", endedAt: new Date() },
    });

    const session = await db.session.create({
      data: { userId: user.id, mode, durationMin, status: "active" },
    });
    return NextResponse.json({ session }, { status: 201 });
  } catch (e) {
    console.error("[LOCKIN] POST /api/sessions error:", e);
    return NextResponse.json(
      { error: "Failed to start session" },
      { status: 500 }
    );
  }
}
