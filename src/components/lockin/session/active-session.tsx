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
  Loader2,
} from "lucide-react";
import { useLockinStore } from "@/lib/store";
import { Wordmark } from "../primitives";

export function ActiveSession() {
  const setView = useLockinStore((s) => s.setView);
  const [session, setSession] = React.useState<{
    id: string;
    mode: string;
    durationMin: number;
    startedAt: string;
  } | null>(null);
  const [remaining, setRemaining] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [pauseAccumulated, setPauseAccumulated] = React.useState(0);
  const [pauseStart, setPauseStart] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [ending, setEnding] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      const res = await fetch("/api/sessions/active", { cache: "no-store" });
      const data = await res.json();
      setSession(data.session);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const total = session ? session.durationMin * 60 : 0;
  const startedAt = session ? new Date(session.startedAt).getTime() : 0;

  React.useEffect(() => {
    if (!session) return;
    const tick = () => {
      if (paused) return; // frozen while paused
      const elapsed = Math.floor((Date.now() - startedAt - pauseAccumulated) / 1000);
      setRemaining(Math.max(0, total - elapsed));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session, startedAt, total, paused, pauseAccumulated]);

  const togglePause = () => {
    if (paused) {
      // resuming — accumulate the paused duration
      if (pauseStart) {
        setPauseAccumulated((p) => p + (Date.now() - pauseStart));
      }
      setPauseStart(null);
      setPaused(false);
    } else {
      setPauseStart(Date.now());
      setPaused(true);
    }
  };

  const end = async (status: "completed" | "cancelled") => {
    if (!session || ending) return;
    setEnding(true);
    try {
      await fetch(`/api/sessions/${session.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setView("dashboard");
    } catch {
      setEnding(false);
    }
  };

  const p = (n: number) => n.toString().padStart(2, "0");
  const time = `${p(Math.floor(remaining / 3600))}:${p(
    Math.floor((remaining % 3600) / 60)
  )}:${p(remaining % 60)}`;
  const pct = total > 0 ? ((total - remaining) / total) * 100 : 0;
  const R = 140;
  const C = 2 * Math.PI * R;

  return (
    <main className="relative mx-auto max-w-5xl px-5 pb-12 pt-28 sm:px-8 sm:pt-32">
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
          <span className="text-[11px] font-medium capitalize text-white/80">
            {session?.mode ?? "monk"} Mode
          </span>
        </div>
      </div>

      {loading ? (
        <div className="mt-24 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-white/40" />
        </div>
      ) : !session ? (
        <div className="relative mt-20 text-center">
          <h1 className="text-display-sm text-white">No active session.</h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/50">
            Head back to the dashboard and start one.
          </p>
          <button
            onClick={() => setView("dashboard")}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <>
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
                  className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                    paused ? "bg-white/40" : "bg-white"
                  }`}
                />
              </span>
              <span className="text-[12px] font-medium text-white/80">
                {paused ? "Paused" : "Focus Session Active"}
              </span>
            </motion.div>

            <h1 className="mt-6 text-display-sm text-white">Stay with it.</h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/50">
              Deep work is uncomfortable. That discomfort is the work happening.
              Don&apos;t leave now.
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
                onClick={togglePause}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-[13px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.08]"
              >
                <Pause className="h-4 w-4" />
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={() => end("completed")}
                disabled={ending}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-50"
              >
                <Square className="h-3.5 w-3.5 fill-black" />
                {ending ? "Saving…" : "Complete Session"}
              </button>
            </div>
          </div>

          {/* blocked sites info */}
          <div className="relative mt-16">
            <div className="flex items-center gap-2">
              <ShieldOff className="h-4 w-4 text-white/50" />
              <p className="text-eyebrow text-white/40">
                All distractions locked by the extension
              </p>
            </div>
            <p className="mt-3 text-sm text-white/55">
              Your full block list is enforced during this session. Trying to
              visit any of them redirects to the LOCKIN blocked page.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
              <Globe className="h-4 w-4 text-white/50" />
              <span className="text-[13px] text-white/70">
                Open the extension popup to view your live block list.
              </span>
            </div>
          </div>

          {/* quote */}
          <div className="relative mt-16 text-center">
            <blockquote className="mx-auto max-w-xl text-balance text-lg leading-relaxed text-white/70 sm:text-xl">
              &ldquo;You do not rise to the level of your goals. You fall to the
              level of your systems.&rdquo;
            </blockquote>
            <p className="mt-3 text-[12px] text-white/35">— James Clear</p>
          </div>
        </>
      )}
    </main>
  );
}
