import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateDemoUser } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

// PATCH /api/sessions/[id] — end a session (status: completed | cancelled)
// Also bumps blocked-site hits by a realistic amount on completion.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getOrCreateDemoUser();
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const status = body.status === "cancelled" ? "cancelled" : "completed";

    const existing = await db.session.findUnique({ where: { id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Already ended — return current state (idempotent)
    if (existing.status !== "active") {
      return NextResponse.json({ session: existing });
    }

    let blockedCount = existing.blockedCount;

    // Compute hit distribution + update everything atomically
    await db.$transaction(async (tx) => {
      if (status === "completed") {
        blockedCount = Math.floor(
          existing.durationMin *
            (existing.mode === "monk" ? 6.5 : existing.mode === "hard" ? 4.5 : 2.5)
        );
        const sites = await tx.blockedSite.findMany({
          where: { userId: user.id },
          orderBy: { hits: "desc" },
          take: 5,
        });
        const total = sites.reduce((s, x) => s + x.hits, 0) || 1;
        // Batch the updates inside the transaction
        await Promise.all(
          sites.map((s) =>
            tx.blockedSite.update({
              where: { id: s.id },
              data: { hits: { increment: Math.round(blockedCount * (s.hits / total)) } },
            })
          )
        );
      }

      await tx.session.update({
        where: { id },
        data: { status, endedAt: new Date(), blockedCount },
      });
    });

    const session = await db.session.findUnique({ where: { id } });
    return NextResponse.json({ session });
  } catch (e) {
    console.error("[LOCKIN] PATCH /api/sessions/[id] error:", e);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
