import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateDemoUser } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

// GET /api/stats — aggregated dashboard stats
export async function GET() {
  const user = await getOrCreateDemoUser();

  const now = new Date();
  // Start of today (local-ish, fine for demo)
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  // Start of week (last 7 days)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 6);
  startOfWeek.setHours(0, 0, 0, 0);

  const [todaySessions, weekSessions, allSessions, blockedSites, activeSession] =
    await Promise.all([
      db.session.findMany({
        where: { userId: user.id, startedAt: { gte: startOfToday }, status: "completed" },
      }),
      db.session.findMany({
        where: { userId: user.id, startedAt: { gte: startOfWeek }, status: "completed" },
        orderBy: { startedAt: "asc" },
      }),
      db.session.findMany({
        where: { userId: user.id, status: "completed" },
        orderBy: { startedAt: "asc" },
      }),
      db.blockedSite.findMany({ where: { userId: user.id }, orderBy: { hits: "desc" } }),
      db.session.findFirst({
        where: { userId: user.id, status: "active" },
        orderBy: { startedAt: "desc" },
      }),
    ]);

  const sumMin = (arr: { durationMin: number }[]) =>
    arr.reduce((s, x) => s + x.durationMin, 0);

  const todayMin = sumMin(todaySessions);
  const weekMin = sumMin(weekSessions);

  // Streak: consecutive days (including today or yesterday) with >=1 completed session
  const daySet = new Set(
    allSessions.map((s) => {
      const d = new Date(s.startedAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  );
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  // If today has no session yet, start counting from yesterday so the streak isn't broken mid-day
  if (!daySet.has(cursor.getTime())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (daySet.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Last 7 days bar data
  const days: { label: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const minutes = allSessions
      .filter((s) => s.startedAt >= d && s.startedAt < next)
      .reduce((sum, s) => sum + s.durationMin, 0);
    days.push({
      label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()],
      minutes,
    });
  }

  // 5-week streak heatmap (35 cells)
  const heatmap: { date: number; intensity: number }[] = [];
  const heatStart = new Date(now);
  heatStart.setDate(heatStart.getDate() - 34);
  heatStart.setHours(0, 0, 0, 0);
  for (let i = 0; i < 35; i++) {
    const d = new Date(heatStart);
    d.setDate(heatStart.getDate() + i);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const minutes = allSessions
      .filter((s) => s.startedAt >= d && s.startedAt < next)
      .reduce((sum, s) => sum + s.durationMin, 0);
    // intensity 0..1
    const intensity = minutes === 0 ? 0 : Math.min(1, 0.35 + minutes / 180);
    heatmap.push({ date: d.getTime(), intensity });
  }

  // Recent activity (last 8 sessions + blocked attempts)
  const recent = [...allSessions]
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
    .slice(0, 6)
    .map((s) => ({
      type: s.status === "completed" ? "completed" : "cancelled",
      label:
        s.status === "completed"
          ? `Completed ${s.mode} session · ${s.durationMin} min`
          : `Cancelled ${s.mode} session · ${s.durationMin} min`,
      at: s.endedAt?.toISOString() ?? s.startedAt.toISOString(),
      blockedCount: s.blockedCount,
    }));

  // Total blocked attempts
  const totalBlocked = blockedSites.reduce((s, x) => s + x.hits, 0);

  return NextResponse.json({
    today: {
      minutes: todayMin,
      sessions: todaySessions.length,
    },
    week: {
      minutes: weekMin,
      days,
    },
    streak,
    activeSession,
    blockedSites,
    totalBlocked,
    heatmap,
    recent,
  });
}
