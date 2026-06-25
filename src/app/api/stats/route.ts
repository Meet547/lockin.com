import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateDemoUser } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

// GET /api/stats — aggregated dashboard stats
// Single query for completed sessions (capped) + blockedSites + activeSession.
export async function GET() {
  try {
    const user = await getOrCreateDemoUser();

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    // One query for completed sessions (capped at 200 to bound memory),
    // one for blocked sites, one for the active session.
    const [completedSessions, blockedSites, activeSession] = await Promise.all([
      db.session.findMany({
        where: { userId: user.id, status: "completed" },
        orderBy: { startedAt: "desc" },
        take: 200,
      }),
      db.blockedSite.findMany({
        where: { userId: user.id },
        orderBy: { hits: "desc" },
      }),
      db.session.findFirst({
        where: { userId: user.id, status: "active" },
        orderBy: { startedAt: "desc" },
      }),
    ]);

    // Index sessions by day for O(1) lookup
    const sessionsAsc = [...completedSessions].reverse();
    const dayMap = new Map<string, { minutes: number; ts: number }>();
    for (const s of sessionsAsc) {
      const d = new Date(s.startedAt);
      d.setHours(0, 0, 0, 0);
      const key = String(d.getTime());
      const entry = dayMap.get(key);
      if (entry) entry.minutes += s.durationMin;
      else dayMap.set(key, { minutes: s.durationMin, ts: d.getTime() });
    }

    const todayMin = dayMap.get(String(startOfToday.getTime()))?.minutes ?? 0;
    const todaySessions = completedSessions.filter(
      (s) => s.startedAt >= startOfToday
    ).length;

    // Week minutes + 7-day bar data
    let weekMin = 0;
    const days: { label: string; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const entry = dayMap.get(String(d.getTime()));
      const minutes = entry?.minutes ?? 0;
      if (d >= startOfWeek) weekMin += minutes;
      days.push({
        label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()],
        minutes,
      });
    }

    // Streak: consecutive days (including today or yesterday)
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    if (!dayMap.has(String(cursor.getTime()))) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (dayMap.has(String(cursor.getTime()))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    // 5-week heatmap (35 cells)
    const heatmap: { date: number; intensity: number }[] = [];
    const heatStart = new Date(now);
    heatStart.setDate(heatStart.getDate() - 34);
    heatStart.setHours(0, 0, 0, 0);
    for (let i = 0; i < 35; i++) {
      const d = new Date(heatStart);
      d.setDate(heatStart.getDate() + i);
      d.setHours(0, 0, 0, 0);
      const minutes = dayMap.get(String(d.getTime()))?.minutes ?? 0;
      const intensity = minutes === 0 ? 0 : Math.min(1, 0.35 + minutes / 180);
      heatmap.push({ date: d.getTime(), intensity });
    }

    // Recent activity (completedSessions is already desc by startedAt)
    const recent = completedSessions.slice(0, 6).map((s) => ({
      type: "completed",
      label: `Completed ${s.mode} session · ${s.durationMin} min`,
      at: s.endedAt?.toISOString() ?? s.startedAt.toISOString(),
      blockedCount: s.blockedCount,
    }));

    const totalBlocked = blockedSites.reduce((s, x) => s + x.hits, 0);

    return NextResponse.json({
      today: { minutes: todayMin, sessions: todaySessions },
      week: { minutes: weekMin, days },
      streak,
      activeSession,
      blockedSites,
      totalBlocked,
      heatmap,
      recent,
    });
  } catch (e) {
    console.error("[LOCKIN] /api/stats error:", e);
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    );
  }
}
