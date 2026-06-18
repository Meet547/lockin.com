"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ShieldOff, Globe } from "lucide-react";
import { useLockinStore } from "@/lib/store";
import { Reveal, Eyebrow, LockMark } from "../primitives";

/** Live-ish countdown used in the floating hero card. */
function useCountdown(startSeconds: number) {
  const [s, setS] = React.useState(startSeconds);
  React.useEffect(() => {
    const id = setInterval(() => {
      setS((prev) => (prev <= 0 ? startSeconds : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [startSeconds]);
  return s;
}

function formatClock(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(sec)}`;
}

export function Hero() {
  const { goToLandingSection, setView } = useLockinStore();
  const seconds = useCountdown(3 * 3600 + 42 * 60 + 11);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  });
  const cardY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-40">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* eyebrow */}
        <Reveal className="flex justify-center" amount={0.5}>
          <Eyebrow>The Focus Operating System</Eyebrow>
        </Reveal>

        {/* headline */}
        <Reveal delay={0.05} className="mt-6 text-center" amount={0.4}>
          <h1 className="text-display text-white">
            Focus is your
            <br />
            <span className="text-white/40">unfair advantage.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.12} className="mt-7 text-center" amount={0.3}>
          <p className="mx-auto max-w-xl text-balance text-lg leading-relaxed text-white/55 sm:text-xl">
            Block distractions. Build deep work habits. Finish what matters.
          </p>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={0.18} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" amount={0.3}>
          <button
            onClick={() => goToLandingSection("download")}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
          >
            <LockMark className="h-4 w-4" />
            Download Extension
          </button>
          <button
            onClick={() => setView("session")}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-7 py-3.5 text-[15px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.07] sm:w-auto"
          >
            <Play className="h-4 w-4 fill-white" />
            Watch Demo
          </button>
        </Reveal>

        {/* floating glass focus card */}
        <motion.div
          style={{ y: cardY, scale: cardScale, opacity: cardOpacity }}
          className="relative mx-auto mt-16 max-w-md sm:mt-20"
        >
          <FocusSessionCard seconds={seconds} />
        </motion.div>
      </div>
    </section>
  );
}

function FocusSessionCard({ seconds }: { seconds: number }) {
  const sites = [
    { name: "YouTube", icon: Globe, color: "text-white/80" },
    { name: "Instagram", icon: Globe, color: "text-white/80" },
    { name: "Reddit", icon: Globe, color: "text-white/80" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      className="relative"
    >
      {/* glow */}
      <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-white/[0.04] blur-2xl" />

      <div className="glass-strong relative overflow-hidden rounded-[2rem] p-6 shadow-premium sm:p-7">
        {/* status row */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="text-[11px] font-medium tracking-wide text-white/80">
              Focus Session Active
            </span>
          </div>
          <ShieldOff className="h-4 w-4 text-white/40" />
        </div>

        {/* timer */}
        <div className="mt-7 text-center">
          <p className="text-eyebrow text-white/35">Time Remaining</p>
          <p className="mt-3 font-mono text-5xl font-semibold tracking-tight tabular-nums text-white sm:text-6xl">
            {formatClock(seconds)}
          </p>
        </div>

        {/* progress ring as a thin bar */}
        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/8">
          <motion.div
            initial={{ width: "62%" }}
            animate={{ width: "62%" }}
            className="h-full rounded-full bg-white/70"
          />
        </div>

        {/* blocked sites */}
        <div className="mt-7">
          <p className="text-eyebrow text-white/35">Blocked</p>
          <div className="mt-3 space-y-2">
            {sites.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.name}
                  className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-2.5 ring-1 ring-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/8">
                      <Icon className={`h-3.5 w-3.5 ${s.color}`} />
                    </div>
                    <span className="text-sm font-medium text-white/85">
                      {s.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-white/35">
                    Blocked
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
