import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateDemoUser } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

// GET /api/sessions/active — the current active session (or null)
export async function GET() {
  const user = await getOrCreateDemoUser();
  const session = await db.session.findFirst({
    where: { userId: user.id, status: "active" },
    orderBy: { startedAt: "desc" },
  });
  return NextResponse.json({ session });
}
