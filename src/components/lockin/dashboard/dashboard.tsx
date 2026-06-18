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
  X,
  ShieldOff,
  ChevronRight,
  Loader2,
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

type Stats = {
  today: { minutes: number; sessions: number };
  week: { minutes: number; days: { label: string; minutes: number }[] };
  streak: number;
  activeSession: {
    id: string;
    mode: string;
    durationMin: number;
    startedAt: string;
    status: string;
  } | null;
  blockedSites: { id: string; host: string; hits: number }[];
  totalBlocked: number;
  heatmap: { date: number; intensity: number }[];
  recent: { type: string; label: string; at: string; blockedCount: number }[];
};

export function Dashboard() {
  const setView = useLockinStore((s) => s.setView);
  const [active, setActive] = React.useState("overview");
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    try {
      const res = await fetch("/api/stats", { cache: "no-store" });
      const data = await res.json();
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

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
              <p className="truncate text-[11px] text-white/45">
                Pro · {stats?.streak ?? 0} day streak
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 px-5 pb-12 pt-24 sm:px-8 sm:pt-28 lg:px-2 lg:pt-24">
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
          <StartSessionButton
            disabled={!!stats?.activeSession}
            onStarted={load}
          />
        </div>

        {loading || !stats ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* stat row */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Today's Focus"
                value={fmtMin(stats.today.minutes)}
                sub={`${stats.today.sessions} session${
                  stats.today.sessions === 1 ? "" : "s"
                } today`}
                icon={Timer}
              />
              <StatCard
                label="Current Streak"
                value={`${stats.streak} day${stats.streak === 1 ? "" : "s"}`}
                sub="Keep it alive"
                icon={Flame}
              />
              <StatCard
                label="Focus Hours · Week"
                value={fmtMin(stats.week.minutes)}
                sub={`${stats.week.days.length} active days`}
                icon={Clock}
              />
              <StatCard
                label="Blocked Attempts"
                value={stats.totalBlocked.toLocaleString()}
                sub={`Across ${stats.blockedSites.length} sites`}
                icon={ShieldOff}
              />
            </div>

            {/* active session + blocked sites */}
            <div className="mt-4 grid gap-4 lg:grid-cols-5">
              <ActiveSessionPanel
                session={stats.activeSession}
                onChanged={load}
              />
              <BlockedSitesPanel
                sites={stats.blockedSites}
                onChanged={load}
              />
            </div>

            {/* chart + recent */}
            <div className="mt-4 grid gap-4 lg:grid-cols-5">
              <FocusChartPanel days={stats.week.days} weekMin={stats.week.minutes} />
              <RecentActivityPanel recent={stats.recent} />
            </div>

            <StreakCalendar
              heatmap={stats.heatmap}
              streak={stats.streak}
            />
          </>
        )}
      </main>
    </div>
  );
}

/* ---------------- helpers ---------------- */
function fmtMin(min: number) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/* ---------------- Start Session Button ---------------- */
function StartSessionButton({
  disabled,
  onStarted,
}: {
  disabled: boolean;
  onStarted: () => void;
}) {
  const setView = useLockinStore((s) => s.setView);
  const [busy, setBusy] = React.useState(false);
  const start = async () => {
    setBusy(true);
    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "monk", durationMin: 90 }),
      });
      await onStarted();
    } finally {
      setBusy(false);
    }
  };
  return (
    <button
      onClick={start}
      disabled={disabled || busy}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-transform active:scale-95",
        disabled
          ? "cursor-not-allowed bg-white/10 text-white/40"
          : "bg-white text-black hover:scale-[1.03]"
      )}
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <LockMark className="h-3.5 w-3.5" />
      )}
      {disabled ? "Session Running" : "Start Session"}
    </button>
  );
}

/* ---------------- Stat Card ---------------- */
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
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
      <p className="mt-2 text-xs text-white/45">{sub}</p>
    </div>
  );
}

/* ---------------- Active Session Panel ---------------- */
function ActiveSessionPanel({
  session,
  onChanged,
}: {
  session: Stats["activeSession"];
  onChanged: () => void;
}) {
  const setView = useLockinStore((s) => s.setView);
  const [remaining, setRemaining] = React.useState(0);

  const startedAt = session ? new Date(session.startedAt).getTime() : 0;
  const total = session ? session.durationMin * 60 : 0;

  React.useEffect(() => {
    if (!session) return;
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemaining(Math.max(0, total - elapsed));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session, startedAt, total]);

  if (!session) {
    return (
      <div className="lg:col-span-3">
        <div className="relative h-full overflow-hidden rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.01] p-6 sm:p-7">
          <div className="flex h-full flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/6 ring-1 ring-white/10">
              <Timer className="h-5 w-5 text-white/40" />
            </div>
            <p className="mt-5 text-sm font-medium text-white/70">
              No active session
            </p>
            <p className="mt-1.5 text-xs text-white/40">
              Hit Start Session to lock in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const p = (n: number) => n.toString().padStart(2, "0");
  const time = `${p(Math.floor(remaining / 3600))}:${p(
    Math.floor((remaining % 3600) / 60)
  )}:${p(remaining % 60)}`;
  const pct = total > 0 ? ((total - remaining) / total) * 100 : 0;

  const end = async (status: "completed" | "cancelled") => {
    await fetch(`/api/sessions/${session!.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    onChanged();
  };

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
            <span className="text-[11px] font-medium capitalize text-white/80">
              Active · {session.mode} Mode
            </span>
          </div>
          <button
            onClick={() => setView("session")}
            className="text-[12px] font-medium text-white/55 hover:text-white"
          >
            Open →
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
          <span>{Math.floor(pct)}% complete</span>
          <span>{session.durationMin} min planned</span>
        </div>

        <div className="relative mt-6 flex items-center gap-2">
          <button
            onClick={() => end("completed")}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-[12px] font-semibold text-black transition-transform hover:scale-[1.02] active:scale-95"
          >
            Mark Complete
          </button>
          <button
            onClick={() => end("cancelled")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2.5 text-[12px] font-semibold text-white/70 transition-colors hover:bg-white/[0.08]"
          >
            End Early
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Blocked Sites Panel (editable) ---------------- */
function BlockedSitesPanel({
  sites,
  onChanged,
}: {
  sites: Stats["blockedSites"];
  onChanged: () => void;
}) {
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const max = Math.max(1, ...sites.map((s) => s.hits));

  const add = async () => {
    const host = input.trim().toLowerCase();
    if (!host) return;
    setBusy(true);
    try {
      await fetch("/api/blocklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host }),
      });
      setInput("");
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setBusy(true);
    try {
      await fetch(`/api/blocklist/${id}`, { method: "DELETE" });
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="h-full rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <p className="text-eyebrow text-white/40">
            Blocked Sites · {sites.length}
          </p>
        </div>

        {/* add */}
        <div className="mt-4 flex items-center gap-1.5 rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/[0.06]">
          <Plus className="h-3.5 w-3.5 text-white/40" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            disabled={busy}
            placeholder="Add a website…"
            className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-white placeholder:text-white/30 focus:outline-none disabled:opacity-40"
          />
          {input && (
            <button
              onClick={add}
              disabled={busy}
              className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-medium text-white/80 disabled:opacity-40"
            >
              Add
            </button>
          )}
        </div>

        {/* list */}
        <div className="mt-4 max-h-64 space-y-3.5 overflow-y-auto scrollbar-thin pr-1">
          {sites.length === 0 && (
            <p className="py-6 text-center text-xs text-white/40">
              No blocked sites yet. Add one above.
            </p>
          )}
          {sites.map((s) => (
            <div key={s.id}>
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex min-w-0 items-center gap-2">
                  <Globe className="h-3.5 w-3.5 flex-none text-white/40" />
                  <span className="truncate font-mono text-white/80">
                    {s.host}
                  </span>
                </div>
                <div className="flex flex-none items-center gap-2">
                  <span className="font-mono text-[11px] text-white/40">
                    {s.hits}
                  </span>
                  <button
                    onClick={() => remove(s.id)}
                    disabled={busy}
                    className="flex h-4 w-4 items-center justify-center rounded text-white/40 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                    aria-label={`Remove ${s.host}`}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(s.hits / max) * 100}%` }}
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
function FocusChartPanel({
  days,
  weekMin,
}: {
  days: { label: string; minutes: number }[];
  weekMin: number;
}) {
  const max = Math.max(1, ...days.map((d) => d.minutes));
  return (
    <div className="lg:col-span-3">
      <div className="h-full rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-eyebrow text-white/40">Focus Hours</p>
            <p className="mt-1 text-2xl font-semibold text-white">This Week</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-white">
              {fmtMin(weekMin)}
            </p>
            <p className="text-xs text-white/45">total this week</p>
          </div>
        </div>

        <div className="mt-8 flex h-40 items-end justify-between gap-3">
          {days.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2.5">
              <div className="flex w-full flex-1 items-end">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(d.minutes / max) * 100}%` }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.9,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    "w-full rounded-md",
                    d.minutes === max && max > 0
                      ? "bg-white"
                      : "bg-gradient-to-t from-white/15 to-white/70"
                  )}
                />
              </div>
              <span className="text-[11px] text-white/40">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Recent Activity Panel ---------------- */
function RecentActivityPanel({
  recent,
}: {
  recent: Stats["recent"];
}) {
  return (
    <div className="lg:col-span-2">
      <div className="h-full rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-7">
        <p className="text-eyebrow text-white/40">Recent Activity</p>
        <div className="mt-5 max-h-72 space-y-1 overflow-y-auto scrollbar-thin pr-1">
          {recent.length === 0 && (
            <p className="py-6 text-center text-xs text-white/40">
              No activity yet. Complete a session.
            </p>
          )}
          {recent.map((act, i) => {
            const Icon =
              act.type === "completed" ? Flame : ShieldOff;
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
                    {act.label}
                  </p>
                  <p className="text-[11px] text-white/35">
                    {relTime(act.at)}
                    {act.blockedCount > 0 && ` · ${act.blockedCount} blocked`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function relTime(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "yesterday";
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

/* ---------------- Streak Calendar ---------------- */
function StreakCalendar({
  heatmap,
  streak,
}: {
  heatmap: { date: number; intensity: number }[];
  streak: number;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-eyebrow text-white/40">Streak</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {streak} day{streak === 1 ? "" : "s"} · keep it alive
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
        {heatmap.map((cell, i) => (
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
                cell.intensity === 0
                  ? "rgba(255,255,255,0.03)"
                  : `rgba(255,255,255,${0.15 + cell.intensity * 0.7})`,
            }}
            title={new Date(cell.date).toDateString()}
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

/* ---------------- Skeleton ---------------- */
function DashboardSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]"
          />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="h-72 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02] lg:col-span-3" />
        <div className="h-72 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02] lg:col-span-2" />
      </div>
      <div className="h-64 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
    </div>
  );
}
