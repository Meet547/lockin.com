import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateDemoUser } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

// DELETE /api/blocklist/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getOrCreateDemoUser();
    const { id } = await params;
    const site = await db.blockedSite.findUnique({ where: { id } });
    if (!site || site.userId !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await db.blockedSite.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[LOCKIN] DELETE /api/blocklist/[id] error:", e);
    return NextResponse.json(
      { error: "Failed to remove site" },
      { status: 500 }
    );
  }
}
