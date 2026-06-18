"use client";

import { Reveal, Eyebrow } from "../primitives";

const TESTIMONIALS = [
  {
    quote:
      "I wrote my thesis in 9 weeks after 14 months of paralysis. LOCKIN didn't just block sites — it gave me my identity back.",
    name: "Maya R.",
    role: "PhD Candidate, MIT",
  },
  {
    quote:
      "Monk Mode is the closest thing I've found to a religious experience for engineers. Three hours vanish and I've shipped a feature.",
    name: "Daniel K.",
    role: "Staff Engineer, Linear",
  },
  {
    quote:
      "I'm a creator. My job is to be online. LOCKIN lets me be online on purpose, not by accident. That changed everything.",
    name: "Aisha T.",
    role: "Creator, 1.2M subs",
  },
  {
    quote:
      "The analytics showed me I do my best work at 6am. Now I protect that window like my life depends on it. Honestly, it does.",
    name: "Marcus L.",
    role: "Founder, Pre-seed",
  },
];

export function SocialProof() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl" amount={0.3}>
          <Eyebrow>Social Proof</Eyebrow>
          <h2 className="mt-5 text-display-sm text-white">
            Quietly used by the ambitious.
          </h2>
        </Reveal>

        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-2 [&>*]:mb-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={t.name}
              delay={(i % 2) * 0.06}
              amount={0.3}
              className="break-inside-avoid"
            >
              <figure className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-7 sm:p-8">
                <blockquote className="text-lg leading-relaxed text-white/85 sm:text-xl">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-xs font-semibold text-white ring-1 ring-white/10">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-white/45">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
