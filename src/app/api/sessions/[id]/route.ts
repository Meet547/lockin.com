import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// PATCH /api/sessions/[id] — end a session (status: completed | cancelled)
// Also bumps blocked-site hits by a realistic amount on completion.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const status = (body.status as string) === "cancelled" ? "cancelled" : "completed";

  const existing = await db.session.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // On a real completion, simulate blocked attempts and bump hits.
  let blockedCount = existing.blockedCount;
  if (status === "completed" && existing.status === "active") {
    blockedCount = Math.floor(existing.durationMin * (existing.mode === "monk" ? 6.5 : existing.mode === "hard" ? 4.5 : 2.5));
    // Distribute hits across blocked sites
    const sites = await db.blockedSite.findMany({ orderBy: { hits: "desc" }, take: 5 });
    const total = sites.reduce((s, x) => s + x.hits, 0) || 1;
    for (const s of sites) {
      const add = Math.round(blockedCount * (s.hits / total));
      await db.blockedSite.update({ where: { id: s.id }, data: { hits: { increment: add } } });
    }
  }

  const session = await db.session.update({
    where: { id },
    data: { status, endedAt: new Date(), blockedCount },
  });
  return NextResponse.json({ session });
}
