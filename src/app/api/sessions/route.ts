import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateDemoUser } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

// GET /api/sessions — list sessions for the demo user
export async function GET() {
  const user = await getOrCreateDemoUser();
  const sessions = await db.session.findMany({
    where: { userId: user.id },
    orderBy: { startedAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ sessions });
}

// POST /api/sessions — start a new session
export async function POST(req: NextRequest) {
  const user = await getOrCreateDemoUser();
  const body = await req.json().catch(() => ({}));
  const mode = (body.mode as string) || "monk";
  const durationMin = Number(body.durationMin) || 90;

  // End any currently-active session first (one at a time)
  await db.session.updateMany({
    where: { userId: user.id, status: "active" },
    data: { status: "cancelled", endedAt: new Date() },
  });

  const session = await db.session.create({
    data: {
      userId: user.id,
      mode,
      durationMin,
      status: "active",
    },
  });
  return NextResponse.json({ session }, { status: 201 });
}
