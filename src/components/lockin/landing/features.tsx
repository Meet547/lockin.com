"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Globe,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Reveal, Eyebrow } from "../primitives";
import { useLockinStore } from "@/lib/store";

export function FeatureShowcase() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl" amount={0.3}>
          <Eyebrow>Features</Eyebrow>
          <h2 className="mt-5 text-display-sm text-white">
            Engineered for the work that matters.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/55">
            Every feature exists for one reason: to remove the friction between
            you and deep focus.
          </p>
        </Reveal>
      </div>

      <div className="mt-20 space-y-8 sm:space-y-12">
        <FeatureWebsiteBlocking />
        <FeatureFocusSessions />
        <FeatureAnalytics />
        <FeatureAntiCheat />
        <FeatureAICoach />
      </div>
    </section>
  );
}

/* ---------------- shared layout ---------------- */

function FeatureRow({
  index,
  eyebrow,
  title,
  body,
  bullets,
  visual,
  flip,
}: {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets?: string[];
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <div
        className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
          flip ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <Reveal amount={0.3}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-widest text-white/30">
              {index}
            </span>
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <h3 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h3>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/55">
            {body}
          </p>
          {bullets && (
            <ul className="mt-6 space-y-2.5">
              {bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 text-sm text-white/70"
                >
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-white/50" />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <Reveal delay={0.1} amount={0.2}>
          <div className="relative">{visual}</div>
        </Reveal>
      </div>
    </div>
  );
}

function VisualShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-1 shadow-premium">
      <div className="rounded-[1.5rem] bg-[#0a0a0b] p-6 sm:p-8">{children}</div>
    </div>
  );
}

/* ---------------- 1. Website Blocking ---------------- */

function FeatureWebsiteBlocking() {
  const sites = [
    { name: "youtube.com", status: "Blocked", hits: "1,204" },
    { name: "instagram.com", status: "Blocked", hits: "842" },
    { name: "reddit.com", status: "Blocked", hits: "671" },
    { name: "x.com", status: "Blocked", hits: "318" },
    { name: "tiktok.com", status: "Blocked", hits: "256" },
  ];
  return (
    <FeatureRow
      index="01"
      eyebrow="Website Blocking"
      title="Block what steals your attention."
      body="Add any site in one click. LOCKIN intercepts requests at the browser level — fast, silent, absolute. No timers to game, no loopholes to find."
      bullets={[
        "Wildcard & pattern matching",
        "Per-mode block lists",
        "Works offline, zero latency",
      ]}
      visual={
        <VisualShell>
          <div className="flex items-center justify-between">
            <span className="text-eyebrow text-white/35">Block List · 12 sites</span>
            <span className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-medium text-white/70">
              Active
            </span>
          </div>
          <div className="mt-5 space-y-1.5">
            {sites.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3.5 py-2.5 ring-1 ring-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-3.5 w-3.5 text-white/40" />
                  <span className="font-mono text-[13px] text-white/80">
                    {s.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-white/35">
                    {s.hits}
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </VisualShell>
      }
    />
  );
}

/* ---------------- 2. Focus Sessions ---------------- */

function FeatureFocusSessions() {
  const { setView } = useLockinStore();
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
    <FeatureRow
      flip
      index="02"
      eyebrow="Focus Sessions"
      title="A timer that defends itself."
      body="Start a session and LOCKIN takes over. Distractions aren't blocked later — they're blocked now. The only way out is forward."
      bullets={[
        "Pomodoro, deep work, or custom",
        "Auto-resume after crash",
        "End-of-session reflection",
      ]}
      visual={
        <VisualShell>
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <span className="text-[11px] font-medium text-white/80">
                Deep Work · 90 min
              </span>
            </div>

            <p className="mt-7 font-mono text-6xl font-semibold tabular-nums text-white">
              {time}
            </p>

            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-white/70 transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>

            <button
              onClick={() => setView("session")}
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/5"
            >
              Open live session
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </VisualShell>
      }
    />
  );
}

/* ---------------- 3. Deep Work Analytics ---------------- */

function FeatureAnalytics() {
  const { setView } = useLockinStore();
  const data = [2.1, 3.4, 1.8, 4.2, 3.9, 5.1, 4.6];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const max = Math.max(...data);

  return (
    <FeatureRow
      index="03"
      eyebrow="Deep Work Analytics"
      title="See the shape of your focus."
      body="Every minute is tracked, visualized, contextualized. Not to shame you — to show you the rhythm of your best work."
      bullets={[
        "Weekly & monthly trends",
        "Peak focus hour detection",
        "Distraction heatmaps",
      ]}
      visual={
        <VisualShell>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-eyebrow text-white/35">This Week</p>
              <p className="mt-2 text-3xl font-semibold text-white">25.1h</p>
              <p className="mt-1 text-xs text-white/45">+18% vs last week</p>
            </div>
            <button
              onClick={() => setView("dashboard")}
              className="rounded-full border border-white/12 px-3.5 py-1.5 text-[11px] font-medium text-white/70 hover:bg-white/5"
            >
              Open dashboard
            </button>
          </div>

          <div className="mt-7 flex h-32 items-end justify-between gap-2">
            {data.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(v / max) * 100}%` }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.9,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-full rounded-md bg-gradient-to-t from-white/15 to-white/80"
                />
                <span className="text-[10px] text-white/35">{days[i]}</span>
              </div>
            ))}
          </div>
        </VisualShell>
      }
    />
  );
}

/* ---------------- 4. Anti-Cheat Mode ---------------- */

function FeatureAntiCheat() {
  return (
    <FeatureRow
      flip
      index="04"
      eyebrow="Anti-Cheat Mode"
      title="No backdoors. No excuses."
      body="When you commit to a session, LOCKIN commits with you. Disable the extension, switch browsers, edit the hosts file — the lock holds."
      bullets={[
        "Uninstall-lock during active sessions",
        "Blocklist edits disabled mid-session",
        "Optional accountability partner unlock",
      ]}
      visual={
        <VisualShell>
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-4 ring-1 ring-white/[0.06]">
            <ShieldCheck className="h-5 w-5 text-white" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Anti-Cheat Active</p>
              <p className="text-xs text-white/45">
                Session locked · 37:14 remaining
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/70">
              Armed
            </span>
          </div>

          <div className="mt-3 space-y-1.5">
            {[
              "Disable extension — blocked",
              "Edit block list — blocked",
              "Open incognito — blocked",
              "Switch browser profile — blocked",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center gap-3 rounded-lg bg-white/[0.02] px-3.5 py-2.5 ring-1 ring-white/[0.04]"
              >
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-white/40" />
                <span className="font-mono text-[12px] text-white/55">{t}</span>
              </div>
            ))}
          </div>
        </VisualShell>
      }
    />
  );
}

/* ---------------- 5. AI Accountability Coach ---------------- */

function FeatureAICoach() {
  return (
    <FeatureRow
      index="05"
      eyebrow="Coming Soon"
      title="An AI coach that knows your patterns."
      body="LOCKIN learns when you slip, what triggers you, and how you recover. It nudges before the relapse and celebrates the streaks you'd otherwise miss."
      bullets={[
        "Pattern-aware nudges",
        "Weekly focus reviews",
        "Adaptive session suggestions",
      ]}
      visual={
        <VisualShell>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 ring-1 ring-white/10">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">LOCKIN Coach</p>
              <p className="text-[11px] text-white/45">Thinking with you</p>
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-white/8 px-4 py-2.5 text-[13px] text-white/85">
              I keep opening Reddit after lunch.
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/[0.04] px-4 py-2.5 text-[13px] text-white/70 ring-1 ring-white/[0.06]">
              Noticed. Your post-lunch dips hit hardest between 1:40–2:20pm.
              Tomorrow I'll auto-start a 25-min Monk session at 1:30pm. Sound
              good?
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/60 ring-1 ring-white/8">
                Yes, lock it
              </span>
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/60 ring-1 ring-white/8">
                Try 15 min first
              </span>
            </div>
          </div>
        </VisualShell>
      }
    />
  );
}
