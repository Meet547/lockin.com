"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Pause,
  Square,
  ShieldOff,
  Wind,
  ArrowLeft,
} from "lucide-react";
import { useLockinStore } from "@/lib/store";
import { Wordmark } from "../primitives";

const BLOCKED = [
  { name: "YouTube", icon: Globe },
  { name: "Instagram", icon: Globe },
  { name: "Reddit", icon: Globe },
  { name: "X", icon: Globe },
];

export function ActiveSession() {
  const setView = useLockinStore((s) => s.setView);
  const total = 90 * 60;
  const [s, setS] = React.useState(52 * 60 + 46);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setS((p) => (p <= 0 ? 0 : p - 1)), 1000);
    return () => clearInterval(id);
  }, [paused]);

  const p = (n: number) => n.toString().padStart(2, "0");
  const time = `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
  const pct = ((total - s) / total) * 100;

  // ring math
  const R = 140;
  const C = 2 * Math.PI * R;

  return (
    <main className="relative mx-auto max-w-5xl px-5 pb-12 pt-28 sm:px-8 sm:pt-32">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

      {/* top bar */}
      <div className="relative flex items-center justify-between">
        <button
          onClick={() => setView("dashboard")}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </button>
        <Wordmark onClick={() => setView("landing")} />
        <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5">
          <Wind className="h-3.5 w-3.5 text-white" />
          <span className="text-[11px] font-medium text-white/80">Monk Mode</span>
        </div>
      </div>

      {/* status */}
      <div className="relative mt-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3.5 py-1.5"
        >
          <span className="relative flex h-1.5 w-1.5">
            {!paused && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
            )}
            <span
              className={cnBg(paused)}
            />
          </span>
          <span className="text-[12px] font-medium text-white/80">
            {paused ? "Paused" : "Focus Session Active"}
          </span>
        </motion.div>

        <h1 className="mt-6 text-display-sm text-white">
          Stay with it.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/50">
          Deep work is uncomfortable. That discomfort is the work happening. Don't
          leave now.
        </p>
      </div>

      {/* countdown ring */}
      <div className="relative mt-14 flex flex-col items-center">
        <div className="relative">
          <svg
            viewBox="0 0 320 320"
            className="h-[280px] w-[280px] sm:h-[340px] sm:w-[340px]"
          >
            <defs>
              <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
                <stop offset="60%" stopColor="rgba(255,255,255,0)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
              </radialGradient>
            </defs>
            <circle cx="160" cy="160" r="150" fill="url(#ringGlow)" />
            <circle
              cx="160"
              cy="160"
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2"
            />
            <motion.circle
              cx="160"
              cy="160"
              r={R}
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={C}
              transform="rotate(-90 160 160)"
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C - (pct / 100) * C }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-eyebrow text-white/35">Time Remaining</p>
            <p className="mt-2 font-mono text-5xl font-semibold tabular-nums text-white sm:text-6xl">
              {time}
            </p>
            <p className="mt-3 text-[12px] text-white/40">
              {Math.floor(pct)}% complete
            </p>
          </div>
        </div>

        {/* controls */}
        <div className="mt-10 flex items-center gap-3">
          <button
            onClick={() => setPaused((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-[13px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.08]"
          >
            <Pause className="h-4 w-4" />
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={() => setView("dashboard")}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
          >
            <Square className="h-3.5 w-3.5 fill-black" />
            End Session
          </button>
        </div>
      </div>

      {/* blocked sites */}
      <div className="relative mt-16">
        <div className="flex items-center gap-2">
          <ShieldOff className="h-4 w-4 text-white/50" />
          <p className="text-eyebrow text-white/40">
            {BLOCKED.length} sites locked
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BLOCKED.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }}
                className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 ring-1 ring-white/10">
                    <Icon className="h-4 w-4 text-white/70" />
                  </div>
                  <span className="text-sm font-medium text-white/85">
                    {b.name}
                  </span>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/35">
                  Locked
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* quote */}
      <div className="relative mt-16 text-center">
        <blockquote className="mx-auto max-w-xl text-balance text-lg leading-relaxed text-white/70 sm:text-xl">
          &ldquo;You do not rise to the level of your goals. You fall to the level
          of your systems.&rdquo;
        </blockquote>
        <p className="mt-3 text-[12px] text-white/35">— James Clear</p>
      </div>
    </main>
  );
}

function cnBg(paused: boolean) {
  return `relative inline-flex h-1.5 w-1.5 rounded-full ${
    paused ? "bg-white/40" : "bg-white"
  }`;
}
