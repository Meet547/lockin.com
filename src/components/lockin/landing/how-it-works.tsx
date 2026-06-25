"use client";

import { Target, Lock, TrendingUp, ArrowRight } from "lucide-react";
import { Reveal, Eyebrow } from "../primitives";
import { useLockinStore } from "@/lib/store";
import { useGotoOrGate } from "@/lib/use-download";

const STEPS = [
  {
    n: "01",
    icon: Target,
    title: "Choose what matters",
    body: "Define your deep work goal. Pick the sites that drain you. Set the duration. Three decisions, ten seconds.",
    cta: "Configure focus",
  },
  {
    n: "02",
    icon: Lock,
    title: "Lock distractions",
    body: "LOCKIN intercepts distracting requests at the browser level. No willpower required. No escape hatches.",
    cta: "See blocking",
  },
  {
    n: "03",
    icon: TrendingUp,
    title: "Build momentum",
    body: "Every session feeds your streak. Every streak rewires your defaults. Deep work becomes who you are.",
    cta: "View analytics",
  },
];

export function HowItWorks() {
  const setView = useLockinStore((s) => s.setView);
  const goToLandingSection = useLockinStore((s) => s.goToLandingSection);
  const gotoOrGate = useGotoOrGate();

  return (
    <section className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl" amount={0.3}>
          <Eyebrow>How It Works</Eyebrow>
          <h2 className="mt-5 text-display-sm text-white">
            Three steps to deep work.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal
                key={step.n}
                delay={i * 0.08}
                amount={0.3}
                className="group relative h-full"
              >
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-7 transition-colors duration-500 hover:border-white/[0.14] sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/8 ring-1 ring-white/10">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-mono text-xs tracking-widest text-white/30">
                      {step.n}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-semibold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/55">
                    {step.body}
                  </p>

                  <button
                    onClick={() =>
                      i === 0
                        ? setView("extension")
                        : i === 1
                        ? setView("blocked")
                        : gotoOrGate("dashboard")
                    }
                    className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-medium text-white/70 transition-colors hover:text-white"
                  >
                    {step.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-10 flex justify-center" amount={0.3}>
          <button
            onClick={() => goToLandingSection("download")}
            className="text-[13px] font-medium text-white/50 transition-colors hover:text-white"
          >
            Start your first session →
          </button>
        </Reveal>
      </div>
    </section>
  );
}
