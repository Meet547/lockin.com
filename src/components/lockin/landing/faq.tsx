"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, Eyebrow } from "../primitives";

const FAQS = [
  {
    q: "How is LOCKIN different from a website blocker?",
    a: "A blocker is a feature. LOCKIN is an operating system for focus — blocking, sessions, analytics, anti-cheat, and accountability work as one. You're not just stopping distractions; you're building the habit of deep work.",
  },
  {
    q: "Does it work on Chrome, Arc, and Brave?",
    a: "Yes. LOCKIN is a Manifest V3 Chrome Extension, so it runs on every Chromium browser — Chrome, Arc, Brave, Edge, and Vivaldi. Firefox support is on the roadmap.",
  },
  {
    q: "What exactly does Anti-Cheat Mode do?",
    a: "When a session is active, Anti-Cheat disables the extension's disable switch, prevents blocklist edits, blocks incognito mode, and (in Monk Mode) requires an accountability partner to unlock early. The lock holds even if you try to outsmart it.",
  },
  {
    q: "Will LOCKIN slow down my browser?",
    a: "No. Blocking happens at the network request layer with sub-millisecond overhead. The extension uses less than 15MB of memory and zero background processes when idle.",
  },
  {
    q: "Is my browsing data private?",
    a: "Completely. All blocking decisions happen locally in your browser. We never see, store, or transmit your browsing history. Analytics sync is optional and end-to-end encrypted.",
  },
  {
    q: "What's the AI Accountability Coach?",
    a: "A coming-soon feature that learns your focus patterns and proactively schedules sessions, warns before likely relapses, and writes weekly reviews of your deep work. Join the waitlist to get early access.",
  },
  {
    q: "Can I try it for free?",
    a: "Yes. The core extension — blocking, sessions, and basic analytics — is free forever. Pro unlocks Monk Mode, Anti-Cheat, advanced analytics, and the AI Coach when it launches.",
  },
];

export function FAQ() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center" amount={0.3}>
          <div className="flex justify-center">
            <Eyebrow>FAQ</Eyebrow>
          </div>
          <h2 className="mt-5 text-display-sm text-white">
            Questions, answered.
          </h2>
        </Reveal>

        <Reveal delay={0.08} className="mt-12" amount={0.2}>
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="space-y-2.5"
          >
            {FAQS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 transition-colors data-[state=open]:bg-white/[0.04] sm:px-6"
              >
                <AccordionTrigger className="py-5 text-left text-[15px] font-medium text-white hover:no-underline sm:text-base">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
