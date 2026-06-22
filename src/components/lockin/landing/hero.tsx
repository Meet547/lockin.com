"use client";

import * as React from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Play, ShieldOff, Globe } from "lucide-react";
import { useLockinStore } from "@/lib/store";
import { LockMark } from "../primitives";

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

/* Word-by-word reveal: blur + rise + fade. Apple-style. */
const wordContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.15 },
  },
};
const wordDim: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};
const wordBright: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(14px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  const { goToLandingSection, setView } = useLockinStore();
  const seconds = useCountdown(3 * 3600 + 42 * 60 + 11);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
  });
  // Smoother, deeper parallax — content drifts up and fades as you scroll
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 lg:pt-44">
      {/* ---- Layered premium background ---- */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="pointer-events-none absolute inset-0"
      >
        {/* Base radial fade */}
        <div className="absolute inset-0 bg-radial-fade" />

        {/* Spotlight grid — very subtle (0.022), fades to transparent at the
            center where the headline sits, drawing the eye inward. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 55% 48% at 50% 44%, transparent 0%, transparent 30%, black 82%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 55% 48% at 50% 44%, transparent 0%, transparent 30%, black 82%)",
          }}
        />

        {/* Slow-breathing radial glow behind the headline */}
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-[44%] h-[440px] w-[720px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 45%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      </motion.div>

      {/* Top vignette to anchor the floating nav */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />

      <motion.div
        style={{ y: contentY }}
        className="relative mx-auto max-w-6xl px-5 sm:px-8"
      >
        {/* eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="text-eyebrow text-white/70">
              The Focus Operating System
            </span>
          </div>
        </motion.div>

        {/* headline — word stagger, emphasis on "unfair advantage" */}
        <motion.h1
          variants={wordContainer}
          initial="hidden"
          animate="visible"
          className="mt-8 text-center text-display"
        >
          <span className="block">
            <motion.span variants={wordDim} className="inline-block text-white/20">
              Focus
            </motion.span>{" "}
            <motion.span variants={wordDim} className="inline-block text-white/20">
              is
            </motion.span>{" "}
            <motion.span variants={wordDim} className="inline-block text-white/20">
              your
            </motion.span>
          </span>
          <span className="relative mt-2 block">
            {/* shimmer sweep behind the bold words */}
            <motion.span
              aria-hidden
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{
                duration: 2.6,
                delay: 1.4,
                ease: [0.16, 1, 0.3, 1],
                repeat: Infinity,
                repeatDelay: 5,
              }}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/12 to-transparent blur-md"
            />
            <motion.span
              variants={wordBright}
              className="relative inline-block font-bold text-white"
              style={{ textShadow: "0 0 48px rgba(255,255,255,0.22)" }}
            >
              unfair advantage.
            </motion.span>
          </span>
        </motion.h1>

        {/* subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 max-w-xl text-balance text-center text-lg leading-relaxed text-white/50 sm:text-xl"
        >
          Block distractions. Build deep work habits. Finish what matters.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => goToLandingSection("onboarding")}
            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-black sm:w-auto"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <LockMark className="relative h-4 w-4" />
            <span className="relative">Download Extension</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setView("session")}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-7 py-3.5 text-[15px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.08] sm:w-auto"
          >
            <Play className="h-4 w-4 fill-white transition-transform group-hover:scale-110" />
            Watch Demo
          </motion.button>
        </motion.div>

        {/* floating glass focus card — gentle float + scroll parallax */}
        <motion.div
          style={{ y: cardY, scale: cardScale, opacity: cardOpacity }}
          className="relative mx-auto mt-20 max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <FocusSessionCard seconds={seconds} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function FocusSessionCard({ seconds }: { seconds: number }) {
  const sites = [
    { name: "YouTube", icon: Globe },
    { name: "Instagram", icon: Globe },
    { name: "Reddit", icon: Globe },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="relative"
    >
      {/* glow */}
      <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-white/[0.035] blur-2xl" />

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

        {/* progress bar */}
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
                      <Icon className="h-3.5 w-3.5 text-white/80" />
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
