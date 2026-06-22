import { db } from "@/lib/db";

// Demo single-user setup. In production this would be NextAuth.
// NO seeded data — the dashboard starts empty and only shows real user
// activity (sessions started, sites added) as it happens.
export const DEMO_USER = {
  email: "alex@lockin.app",
  name: "Alex Kim",
};

export async function getOrCreateDemoUser() {
  let user = await db.user.findUnique({
    where: { email: DEMO_USER.email },
  });
  if (!user) {
    user = await db.user.create({
      data: { email: DEMO_USER.email, name: DEMO_USER.name },
    });
  }
  return user;
}
