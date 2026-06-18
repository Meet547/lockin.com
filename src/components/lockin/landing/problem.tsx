"use client";

import { Reveal, Eyebrow } from "../primitives";

const STATS = [
  { value: "4.8h", label: "Daily phone screen time", sub: "Average global user, 2024" },
  { value: "2,617", label: "Times we tap our phones", sub: "Per day, per person" },
  { value: "47", label: "Seconds of focus before a switch", sub: "Average attention span" },
  { value: "23 min", label: "To refocus after a distraction", sub: "Recovery cost per interruption" },
];

export function ProblemSection() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-3xl" amount={0.3}>
          <Eyebrow>The Problem</Eyebrow>
          <h2 className="mt-5 text-display-sm text-white">
            The internet was designed to{" "}
            <span className="text-white/40">steal your attention.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/55">
            Every infinite scroll, every red badge, every autoplay — engineered
            by thousands of the brightest minds to keep you hooked. Your focus is
            the product. Your time is the revenue.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.06}
              amount={0.4}
              className="bg-[#0c0c0d] p-7 sm:p-8"
            >
              <p className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {s.value}
              </p>
              <p className="mt-4 text-sm font-medium text-white/80">
                {s.label}
              </p>
              <p className="mt-1.5 text-xs text-white/40">{s.sub}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-14 max-w-2xl" amount={0.3}>
          <p className="text-xl leading-relaxed text-white/70 sm:text-2xl">
            <span className="text-white">LOCKIN is the antidote.</span> A focus
            operating system that puts you back in control — not of the internet,
            but of your own mind.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
