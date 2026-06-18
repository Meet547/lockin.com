"use client";

import { motion } from "framer-motion";
import { Feather, Flame, Wind } from "lucide-react";
import { Reveal, Eyebrow } from "../primitives";
import { cn } from "@/lib/utils";

const MODES = [
  {
    id: "easy",
    name: "Easy Mode",
    icon: Feather,
    tagline: "Gentle friction",
    desc: "Blocks your top 5 distractions. Escape with a 10-second breathing delay. Perfect for building the habit.",
    features: ["5 site block list", "10s override delay", "Soft reminders"],
    accent: false,
  },
  {
    id: "hard",
    name: "Hard Mode",
    icon: Wind,
    tagline: "Real commitment",
    desc: "Blocks everything on your list. No overrides during the session. The only way out is finishing.",
    features: ["Full block list", "No override", "End-of-session reflection"],
    accent: false,
  },
  {
    id: "monk",
    name: "Monk Mode",
    icon: Flame,
    tagline: "Total isolation",
    desc: "The internet, minus your allowlist. Anti-cheat armed. Accountability partner notified if you break. For the work that changes everything.",
    features: ["Allowlist-only internet", "Anti-cheat armed", "Partner accountability", "Uninstall-locked"],
    accent: true,
  },
];

export function FocusModes() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl" amount={0.3}>
          <Eyebrow>Focus Modes</Eyebrow>
          <h2 className="mt-5 text-display-sm text-white">
            Choose your level of commitment.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/55">
            From gentle nudges to total isolation. Start where you are. Climb
            when you're ready.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-center">
          {MODES.map((mode, i) => {
            const Icon = mode.icon;
            return (
              <Reveal
                key={mode.id}
                delay={i * 0.08}
                amount={0.3}
                className={cn(mode.accent && "lg:-my-4")}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "relative h-full overflow-hidden rounded-2xl p-7 sm:p-8",
                    mode.accent
                      ? "border border-white/15 bg-gradient-to-b from-white/[0.10] to-white/[0.02] shadow-premium"
                      : "border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent"
                  )}
                >
                  {mode.accent && (
                    <>
                      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/[0.06] blur-2xl" />
                      <div className="absolute right-5 top-5">
                        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-black">
                          Recommended
                        </span>
                      </div>
                    </>
                  )}

                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl ring-1",
                      mode.accent
                        ? "bg-white text-black ring-white/20"
                        : "bg-white/8 text-white ring-white/10"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <p className="mt-6 text-eyebrow text-white/40">
                    {mode.tagline}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    {mode.name}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/55">
                    {mode.desc}
                  </p>

                  <ul className="mt-6 space-y-2 border-t border-white/[0.06] pt-6">
                    {mode.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-sm text-white/70"
                      >
                        <span className="h-1 w-1 rounded-full bg-white/50" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
