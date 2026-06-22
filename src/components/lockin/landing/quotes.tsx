"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote as QuoteIcon } from "lucide-react";
import { Reveal, Eyebrow } from "../primitives";
import { useLockinStore } from "@/lib/store";

interface Quote {
  text: string;
  author: string;
  context?: string;
}

// Powerful, urgent quotes about focus, discipline, and deep work.
const QUOTES: Quote[] = [
  {
    text: "We suffer more often in imagination than in reality.",
    author: "Seneca",
    context: "Stoic philosopher · 65 AD",
  },
  {
    text: "It is not that we have a short time to live, but that we waste a lot of it.",
    author: "Seneca",
    context: "On the Shortness of Life · 49 AD",
  },
  {
    text: "You could leave life right now. Let that determine what you do and say and think.",
    author: "Marcus Aurelius",
    context: "Meditations · 170 AD",
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    context: "Nicomachean Ethics · 350 BC",
  },
  {
    text: "Suffer the pain of discipline or suffer the pain of regret.",
    author: "Jim Rohn",
    context: "Entrepreneur · 1930–2009",
  },
  {
    text: "Either you run the day, or the day runs you.",
    author: "Jim Rohn",
    context: "Entrepreneur · 1930–2009",
  },
  {
    text: "Discipline equals freedom.",
    author: "Jocko Willink",
    context: "Former Navy SEAL Commander",
  },
  {
    text: "The successful warrior is the average person, with laser-like focus.",
    author: "Bruce Lee",
    context: "Martial artist · 1940–1973",
  },
  {
    text: "Focus is a matter of deciding what things you're not going to do.",
    author: "John Carmack",
    context: "Programmer · id Software, Oculus",
  },
  {
    text: "Until we can manage time, we can manage nothing else.",
    author: "Peter Drucker",
    context: "Father of modern management",
  },
];

const ROTATE_MS = 6000;

export function Quotes() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const { goToLandingSection } = useLockinStore();

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const go = (i: number) =>
    setIndex(((i % QUOTES.length) + QUOTES.length) % QUOTES.length);
  const current = QUOTES[index];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, transparent 35%, black 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, transparent 35%, black 85%)",
        }}
      />

      <div
        className="relative mx-auto max-w-4xl px-5 sm:px-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Reveal className="text-center" amount={0.3}>
          <div className="flex justify-center">
            <Eyebrow>Why it matters</Eyebrow>
          </div>
          <h2 className="mt-5 text-display-sm text-white">
            The clock is already running.
          </h2>
        </Reveal>

        <div className="relative mt-14 min-h-[280px] sm:min-h-[260px]">
          <QuoteIcon
            className="pointer-events-none absolute -top-8 left-1/2 h-16 w-16 -translate-x-1/2 text-white/[0.06]"
            strokeWidth={1}
          />

          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-center"
            >
              <blockquote className="mx-auto max-w-3xl text-balance text-2xl font-medium leading-snug tracking-tight text-white sm:text-3xl lg:text-4xl">
                &ldquo;{current.text}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex flex-col items-center gap-1">
                <span className="text-base font-semibold text-white">
                  — {current.author}
                </span>
                {current.context && (
                  <span className="text-xs text-white/40">{current.context}</span>
                )}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mx-auto mt-10 h-px w-40 max-w-xs overflow-hidden bg-white/8">
          <motion.div
            key={`${index}-${paused}`}
            initial={{ width: "0%" }}
            animate={{ width: paused ? "0%" : "100%" }}
            transition={{
              duration: paused ? 0 : ROTATE_MS / 1000,
              ease: "linear",
            }}
            className="h-full bg-white/50"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Quote ${i + 1}`}
              className="group p-1.5"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/25 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-14 text-center" amount={0.3}>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-white/45">
            Every minute you wait is a minute you won&apos;t get back. Block the
            noise. Start now.
          </p>
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => goToLandingSection("onboarding")}
            className="group relative mt-7 inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-black"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Start locking in →</span>
          </motion.button>
        </Reveal>
      </div>
    </section>
  );
}
