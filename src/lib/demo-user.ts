import { db } from "@/lib/db";

// Demo single-user setup. In production this would be NextAuth.
export const DEMO_USER = {
  email: "alex@lockin.app",
  name: "Alex Kim",
};

export async function getOrCreateDemoUser() {
  let user = await db.user.findUnique({
    where: { email: DEMO_USER.email },
  });
  if (!user) {
    user = await db.user.create({ data: { email: DEMO_USER.email, name: DEMO_USER.name } });
    // Seed default block list
    await db.blockedSite.createMany({
      data: [
        { host: "youtube.com", userId: user.id, hits: 412 },
        { host: "instagram.com", userId: user.id, hits: 287 },
        { host: "reddit.com", userId: user.id, hits: 211 },
        { host: "x.com", userId: user.id, hits: 168 },
        { host: "tiktok.com", userId: user.id, hits: 126 },
      ],
    });
    // Seed a couple of historical sessions for the streak/analytics
    const now = new Date();
    const mk = (daysAgo: number, dur: number, mode: string) => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      d.setHours(9, 0, 0, 0);
      const e = new Date(d.getTime() + dur * 60_000);
      return {
        userId: user.id,
        mode,
        durationMin: dur,
        startedAt: d,
        endedAt: e,
        status: "completed",
        blockedCount: Math.floor(dur * 4.5),
      };
    };
    await db.session.createMany({
      data: [
        mk(6, 90, "monk"),
        mk(6, 45, "hard"),
        mk(5, 60, "monk"),
        mk(4, 30, "easy"),
        mk(4, 75, "monk"),
        mk(3, 90, "monk"),
        mk(2, 50, "hard"),
        mk(2, 40, "easy"),
        mk(1, 90, "monk"),
        mk(1, 35, "hard"),
        mk(0, 45, "monk"),
      ],
    });
  }
  return user;
}
