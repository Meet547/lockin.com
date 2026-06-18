"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Globe,
  Clock,
  Flame,
  Wind,
  Feather,
  Play,
  Square,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLockinStore } from "@/lib/store";
import { LockMark } from "../primitives";

type Mode = "easy" | "hard" | "monk";

const MODES: {
  id: Mode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "easy", label: "Easy", icon: Feather },
  { id: "hard", label: "Hard", icon: Wind },
  { id: "monk", label: "Monk", icon: Flame },
];

const DURATIONS = [15, 25, 45, 90];

const DEFAULT_SITES = [
  { name: "youtube.com", icon: Globe },
  { name: "instagram.com", icon: Globe },
  { name: "reddit.com", icon: Globe },
  { name: "x.com", icon: Globe },
];

export function ExtensionUI() {
  const setView = useLockinStore((s) => s.setView);
  const [mode, setMode] = React.useState<Mode>("monk");
  const [duration, setDuration] = React.useState(90);
  const [sites, setSites] = React.useState(DEFAULT_SITES);
  const [input, setInput] = React.useState("");
  const [active, setActive] = React.useState(false);
  const [remaining, setRemaining] = React.useState(90 * 60);

  React.useEffect(() => {
    if (!active) return;
    const id = setInterval(
      () => setRemaining((p) => (p <= 0 ? 0 : p - 1)),
      1000
    );
    return () => clearInterval(id);
  }, [active]);

  const addSite = () => {
    const v = input.trim().toLowerCase();
    if (!v) return;
    if (sites.some((s) => s.name === v)) {
      setInput("");
      return;
    }
    setSites((prev) => [...prev, { name: v, icon: Globe }]);
    setInput("");
  };

  const removeSite = (name: string) =>
    setSites((prev) => prev.filter((s) => s.name !== name));

  const start = () => {
    setRemaining(duration * 60);
    setActive(true);
  };
  const stop = () => setActive(false);

  const p = (n: number) => n.toString().padStart(2, "0");
  const time = `${p(Math.floor(remaining / 3600))}:${p(
    Math.floor((remaining % 3600) / 60)
  )}:${p(remaining % 60)}`;

  return (
    <main className="relative mx-auto max-w-6xl px-5 pb-12 pt-28 sm:px-8 sm:pt-32">
      {/* header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3.5 py-1.5 ring-1 ring-white/10"
        >
          <span className="text-[11px] font-medium tracking-wide text-white/80">
            Chrome Extension · Popup UI
          </span>
        </motion.div>
        <h1 className="mt-6 text-display-sm text-white">
          One click from focus.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/50">
          The extension lives in your toolbar. Configure once. Lock in instantly.
          A pocket-sized control panel for your attention.
        </p>
      </div>

      {/* extension popup + browser chrome */}
      <div className="mx-auto mt-14 flex max-w-md flex-col items-center">
        {/* browser toolbar mock */}
        <div className="flex w-full items-center gap-2 rounded-t-2xl border border-b-0 border-white/[0.08] bg-[#0c0c0d] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <div className="ml-3 flex flex-1 items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 ring-1 ring-white/[0.06]">
            <span className="h-2.5 w-2.5 rounded-full border border-white/20" />
            <span className="font-mono text-[11px] text-white/40">
              work session · deep focus
            </span>
          </div>
          {/* extension icon */}
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black ring-2 ring-white/30">
            <LockMark className="h-4 w-4" />
          </div>
        </div>

        {/* popup body */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="glass-strong w-full overflow-hidden rounded-b-[1.75rem] rounded-tr-[1.75rem] shadow-premium"
        >
          <div className="p-5 sm:p-6">
            {/* header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LockMark className="h-4 w-4 text-white" />
                <span className="text-[13px] font-semibold tracking-[0.16em] text-white">
                  LOCKIN
                </span>
              </div>
              {active ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-2.5 py-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  <span className="text-[10px] font-medium text-white/80">
                    Active
                  </span>
                </span>
              ) : (
                <span className="rounded-full bg-white/6 px-2.5 py-1 text-[10px] font-medium text-white/50">
                  Idle
                </span>
              )}
            </div>

            {/* active countdown (only when active) */}
            {active && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center"
              >
                <p className="text-eyebrow text-white/35">Remaining</p>
                <p className="mt-1.5 font-mono text-3xl font-semibold tabular-nums text-white">
                  {time}
                </p>
                <button
                  onClick={stop}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
                >
                  <Square className="h-3 w-3 fill-black" />
                  End Session
                </button>
              </motion.div>
            )}

            {/* mode selector */}
            <div className="mt-5">
              <p className="text-eyebrow text-white/40">Focus Mode</p>
              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const isActive = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      disabled={active}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-[11px] font-medium transition-colors disabled:opacity-40",
                        isActive
                          ? "bg-white text-black"
                          : "bg-white/[0.04] text-white/70 ring-1 ring-white/[0.06] hover:bg-white/[0.08]"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* duration */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-eyebrow text-white/40">Duration</p>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-white/50">
                  <Clock className="h-3 w-3" />
                  {duration} min
                </span>
              </div>
              <div className="mt-2.5 grid grid-cols-4 gap-1.5">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    disabled={active}
                    className={cn(
                      "rounded-lg py-2 font-mono text-[12px] font-medium transition-colors disabled:opacity-40",
                      duration === d
                        ? "bg-white/12 text-white ring-1 ring-white/15"
                        : "bg-white/[0.03] text-white/55 ring-1 ring-white/[0.05] hover:bg-white/[0.07]"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* add website */}
            <div className="mt-4">
              <p className="text-eyebrow text-white/40">Blocked Sites · {sites.length}</p>
              <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/[0.06]">
                <Plus className="h-3.5 w-3.5 text-white/40" />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSite()}
                  disabled={active}
                  placeholder="Add a website…"
                  className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-white placeholder:text-white/30 focus:outline-none disabled:opacity-40"
                />
                {input && (
                  <button
                    onClick={addSite}
                    disabled={active}
                    className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-medium text-white/80 disabled:opacity-40"
                  >
                    Add
                  </button>
                )}
              </div>

              {/* site chips */}
              <div className="mt-2.5 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto scrollbar-thin">
                {sites.map((site) => {
                  const Icon = site.icon;
                  return (
                    <div
                      key={site.name}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.05] py-1 pl-2 pr-1 ring-1 ring-white/[0.06]"
                    >
                      <Icon className="h-3 w-3 text-white/60" />
                      <span className="font-mono text-[11px] text-white/75">
                        {site.name}
                      </span>
                      <button
                        onClick={() => removeSite(site.name)}
                        disabled={active}
                        className="ml-0.5 flex h-4 w-4 items-center justify-center rounded text-white/40 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                        aria-label={`Remove ${site.name}`}
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* start button */}
            <button
              onClick={start}
              disabled={active}
              className={cn(
                "mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13px] font-semibold transition-transform",
                active
                  ? "cursor-not-allowed bg-white/10 text-white/40"
                  : "bg-white text-black hover:scale-[1.02] active:scale-95"
              )}
            >
              {active ? (
                <>
                  <Check className="h-4 w-4" />
                  Session Running
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-black" />
                  Start Session
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* feature callouts */}
      <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
        {[
          {
            title: "Instant access",
            body: "Cmd+Shift+L to open the popup. Configure in seconds, not minutes.",
          },
          {
            title: "Persists across tabs",
            body: "Your block list and preferences sync the moment you change them.",
          },
          {
            title: "Zero permissions bloat",
            body: "Only the permissions it needs. Nothing reads your browsing history.",
          },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-5"
          >
            <p className="text-sm font-semibold text-white">{f.title}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/55">
              {f.body}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => setView("landing")}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
        >
          <LockMark className="h-4 w-4" />
          Download for Chrome
        </button>
      </div>
    </main>
  );
}
