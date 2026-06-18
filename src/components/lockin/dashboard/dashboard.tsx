"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Timer,
  Globe,
  Flame,
  Clock,
  Activity,
  Settings,
  Plus,
  ArrowUpRight,
  TrendingUp,
  ShieldOff,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLockinStore } from "@/lib/store";
import { Wordmark, LockMark } from "../primitives";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "session", label: "Active Session", icon: Timer },
  { id: "blocked", label: "Blocked Sites", icon: Globe },
  { id: "streak", label: "Streak", icon: Flame },
  { id: "hours", label: "Focus Hours", icon: Clock },
  { id: "activity", label: "Recent Activity", icon: Activity },
];

export function Dashboard() {
  const setView = useLockinStore((s) => s.setView);
  const [active, setActive] = React.useState("overview");

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-0 px-0 lg:gap-6 lg:px-5">
      {/* Sidebar */}
      <aside className="sticky top-[72px] hidden h-[calc(100vh-88px)] w-60 flex-none flex-col border-r border-white/[0.06] pr-4 lg:flex">
        <div className="px-2 py-6">
          <Wordmark onClick={() => setView("landing")} />
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-white/[0.07] text-white ring-1 ring-white/[0.06]"
                    : "text-white/55 hover:bg-white/[0.03] hover:text-white/80"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/[0.06] px-2 pt-4 pb-6">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/55 hover:bg-white/[0.03] hover:text-white/80">
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/[0.05]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
              AK
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-white">
                Alex Kim
              </p>
              <p className="truncate text-[11px] text-white/45">Pro · 32 day streak</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 px-5 pb-12 pt-24 sm:px-8 sm:pt-28 lg:px-2 lg:pt-24">
        {/* mobile wordmark */}
        <div className="mb-6 lg:hidden">
          <Wordmark onClick={() => setView("landing")} />
        </div>

        {/* header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-eyebrow text-white/35">Good afternoon, Alex</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Overview
            </h1>
          </div>
          <button
            onClick={() => setView("session")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
          >
            <LockMark className="h-3.5 w-3.5" />
            Start Session
          </button>
        </div>

        {/* Today's Focus stat row */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Today's Focus"
            value="3h 42m"
            sub="+48m vs yesterday"
            icon={Timer}
            trend="up"
          />
          <StatCard
            label="Current Streak"
            value="32 days"
            sub="Personal best"
            icon={Flame}
          />
          <StatCard
            label="Focus Hours · Week"
            value="25.1h"
            sub="+18% vs last week"
            icon={Clock}
            trend="up"
          />
          <StatCard
            label="Blocked Attempts"
            value="1,204"
            sub="Across 12 sites"
            icon={ShieldOff}
          />
        </div>

        {/* Active Session + Blocked Sites */}
        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <ActiveSessionPanel />
          <BlockedSitesPanel />
        </div>

        {/* Focus chart + recent activity */}
        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          <FocusChartPanel />
          <RecentActivityPanel />
        </div>

        {/* Streak calendar */}
        <StreakCalendar />
      </main>
    </div>
  );
}

/* ---------------- Stat Card ---------------- */
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down";
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-5">
      <div className="flex items-center justify-between">
        <p className="text-eyebrow text-white/40">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8 ring-1 ring-white/10">
          <Icon className="h-4 w-4 text-white/70" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {trend === "up" && <TrendingUp className="h-3 w-3 text-white/60" />}
        <p className="text-xs text-white/45">{sub}</p>
      </div>
    </div>
  );
}

/* ---------------- Active Session Panel ---------------- */
function ActiveSessionPanel() {
  const setView = useLockinStore((s) => s.setView);
  const [s, setS] = React.useState(37 * 60 + 14);
  React.useEffect(() => {
    const id = setInterval(() => setS((p) => (p <= 0 ? 37 * 60 : p - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => n.toString().padStart(2, "0");
  const time = `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
  const total = 90 * 60;
  const pct = ((total - s) / total) * 100;

  return (
    <div className="lg:col-span-3">
      <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/[0.04] blur-3xl" />

        <div className="relative flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="text-[11px] font-medium text-white/80">
              Active · Monk Mode
            </span>
          </div>
          <button
            onClick={() => setView("session")}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-white/55 hover:text-white"
          >
            Open
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="relative mt-8 text-center">
          <p className="text-eyebrow text-white/35">Time Remaining</p>
          <p className="mt-3 font-mono text-5xl font-semibold tabular-nums text-white sm:text-6xl">
            {time}
          </p>
        </div>

        <div className="relative mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-white/70 transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="relative mt-4 flex items-center justify-between text-xs text-white/45">
          <span>37:14 elapsed</span>
          <span>52:46 remaining</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Blocked Sites Panel ---------------- */
function BlockedSitesPanel() {
  const sites = [
    { name: "youtube.com", hits: 412, pct: 100 },
    { name: "instagram.com", hits: 287, pct: 70 },
    { name: "reddit.com", hits: 211, pct: 51 },
    { name: "x.com", hits: 168, pct: 41 },
    { name: "tiktok.com", hits: 126, pct: 31 },
  ];
  return (
    <div className="lg:col-span-2">
      <div className="h-full rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <p className="text-eyebrow text-white/40">Top Blocked Sites</p>
          <button className="inline-flex items-center gap-1 text-[12px] font-medium text-white/55 hover:text-white">
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>

        <div className="mt-5 space-y-3.5">
          {sites.map((s) => (
            <div key={s.name}>
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-mono text-white/80">{s.name}</span>
                <span className="font-mono text-white/40">{s.hits}</span>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/6">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.pct}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-white/60"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Focus Chart Panel ---------------- */
function FocusChartPanel() {
  const data = [2.1, 3.4, 1.8, 4.2, 3.9, 5.1, 4.6];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const max = Math.max(...data);
  return (
    <div className="lg:col-span-3">
      <div className="h-full rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-eyebrow text-white/40">Focus Hours</p>
            <p className="mt-1 text-2xl font-semibold text-white">This Week</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-white">25.1h</p>
            <p className="text-xs text-white/45">+18% vs last week</p>
          </div>
        </div>

        <div className="mt-8 flex h-40 items-end justify-between gap-3">
          {data.map((v, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col items-center gap-2.5"
            >
              <div className="flex w-full flex-1 items-end">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(v / max) * 100}%` }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.9,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    "w-full rounded-md",
                    v === max
                      ? "bg-white"
                      : "bg-gradient-to-t from-white/15 to-white/70"
                  )}
                />
              </div>
              <span className="text-[11px] text-white/40">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Recent Activity Panel ---------------- */
function RecentActivityPanel() {
  const activities = [
    { t: "2m ago", a: "Blocked attempt · youtube.com", icon: ShieldOff },
    { t: "14m ago", a: "Blocked attempt · reddit.com", icon: ShieldOff },
    { t: "37m ago", a: "Started Monk session · 90 min", icon: Timer },
    { t: "1h ago", a: "Completed session · 45 min", icon: Flame },
    { t: "3h ago", a: "Blocked attempt · x.com", icon: ShieldOff },
    { t: "Yesterday", a: "32-day streak unlocked", icon: Flame },
  ];
  return (
    <div className="lg:col-span-2">
      <div className="h-full rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-7">
        <p className="text-eyebrow text-white/40">Recent Activity</p>
        <div className="mt-5 max-h-72 space-y-1 overflow-y-auto scrollbar-thin pr-1">
          {activities.map((act, i) => {
            const Icon = act.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.03]"
              >
                <div className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-white/8 ring-1 ring-white/10">
                  <Icon className="h-3.5 w-3.5 text-white/70" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug text-white/80">
                    {act.a}
                  </p>
                  <p className="text-[11px] text-white/35">{act.t}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Streak Calendar ---------------- */
function StreakCalendar() {
  const days = Array.from({ length: 35 }, (_, i) => {
    // generate pseudo-random but stable intensities, favoring recent days active
    const seed = (i * 9301 + 49297) % 233280;
    const r = seed / 233280;
    const recent = i > 22;
    if (recent) return r > 0.15 ? 0.5 + r * 0.5 : 0;
    return r > 0.4 ? r * 0.7 : 0;
  });
  return (
    <div className="mt-4 rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-eyebrow text-white/40">Streak</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            32 days · Personal best
          </p>
        </div>
        <button className="inline-flex items-center gap-1 text-[12px] font-medium text-white/55 hover:text-white">
          History
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1.5">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] font-medium uppercase text-white/30"
          >
            {d}
          </div>
        ))}
        {days.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.4,
              delay: (i % 7) * 0.02 + Math.floor(i / 7) * 0.04,
            }}
            className="aspect-square rounded-md"
            style={{
              backgroundColor:
                v === 0
                  ? "rgba(255,255,255,0.03)"
                  : `rgba(255,255,255,${0.15 + v * 0.7})`,
            }}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 text-[11px] text-white/35">
        <span>Less</span>
        {[0.1, 0.35, 0.6, 0.85, 1].map((v) => (
          <div
            key={v}
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: `rgba(255,255,255,${v})` }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
