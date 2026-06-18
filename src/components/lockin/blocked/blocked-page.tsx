"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Globe } from "lucide-react";
import { useLockinStore } from "@/lib/store";
import { LockMark, Wordmark } from "../primitives";

const QUOTES = [
  {
    q: "The successful warrior is the average person, with laser-like focus.",
    a: "Bruce Lee",
  },
  {
    q: "Where attention goes, energy flows and reality grows.",
    a: "James Redfield",
  },
  {
    q: "Concentrate all your thoughts upon the work at hand.",
    a: "Alexander Graham Bell",
  },
  {
    q: "You do not rise to the level of your goals. You fall to the level of your systems.",
    a: "James Clear",
  },
];

export function BlockedPage() {
  const setView = useLockinStore((s) => s.setView);
  const total = 52 * 60 + 46;
  const [s, setS] = React.useState(total);
  React.useEffect(() => {
    const id = setInterval(() => setS((p) => (p <= 0 ? total : p - 1)), 1000);
    return () => clearInterval(id);
  }, [total]);

  const quote = React.useMemo(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
    []
  );

  const p = (n: number) => n.toString().padStart(2, "0");
  const time = `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;

  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-3xl flex-col items-center justify-center px-5 pb-12 pt-28 sm:px-8 sm:pt-32">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-30 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_40%,black,transparent)]" />

      {/* top wordmark */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-5 pt-6 sm:px-8 sm:pt-8">
        <Wordmark onClick={() => setView("landing")} />
        <button
          onClick={() => setView("landing")}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full text-center"
      >
        {/* logo */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black shadow-float"
        >
          <LockMark className="h-7 w-7" />
        </motion.div>

        {/* status pill */}
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/8 px-3.5 py-1.5 ring-1 ring-white/10">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="text-[11px] font-medium tracking-wide text-white/80">
            Focus Mode Active
          </span>
        </div>

        <h1 className="mt-7 text-display-sm text-white">
          This site is blocked.
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/50">
          You chose to lock this. The discomfort you feel right now is the work
          happening. Stay.
        </p>

        {/* countdown */}
        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8">
          <p className="text-eyebrow text-white/35">Remaining Time</p>
          <p className="mt-3 font-mono text-5xl font-semibold tabular-nums text-white sm:text-6xl">
            {time}
          </p>
          <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/8">
            <motion.div
              initial={{ width: "58%" }}
              animate={{ width: "58%" }}
              className="h-full rounded-full bg-white/70"
            />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-white/40">
            <Globe className="h-3 w-3" />
            <span className="font-mono">reddit.com</span>
            <span>·</span>
            <span>Monk Mode</span>
          </div>
        </div>

        {/* back button */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-[13px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.08] sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
          <button
            onClick={() => setView("session")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
          >
            View active session
          </button>
        </div>

        {/* quote */}
        <div className="mt-14">
          <blockquote className="mx-auto max-w-lg text-balance text-lg leading-relaxed text-white/70 sm:text-xl">
            &ldquo;{quote.q}&rdquo;
          </blockquote>
          <p className="mt-3 text-[12px] text-white/35">— {quote.a}</p>
        </div>
      </motion.div>
    </main>
  );
}
