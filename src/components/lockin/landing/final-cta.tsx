"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal, Eyebrow, LockMark } from "../primitives";
import { useDownloadExtension, useGotoOrGate } from "@/lib/use-download";

export function FinalCTA() {
  const download = useDownloadExtension();
  const gotoOrGate = useGotoOrGate();

  return (
    <section id="download" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal amount={0.3}>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent px-6 py-16 text-center sm:px-12 sm:py-24">
            {/* ambient */}
            <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
            <div className="pointer-events-none absolute inset-0 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black shadow-float"
              >
                <LockMark className="h-6 w-6" />
              </motion.div>

              <div className="mt-8 flex justify-center">
                <Eyebrow>Begin</Eyebrow>
              </div>

              <h2 className="mt-5 text-display text-white">
                The best version of you
                <br />
                <span className="text-white/40">is waiting.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/55">
                Install the extension. Start your first session. Reclaim the next
                hour of your life.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={download}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
                >
                  Start Locking In
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => gotoOrGate("dashboard")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-8 py-4 text-[15px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/[0.07] sm:w-auto"
                >
                  Explore the Dashboard
                </button>
              </div>

              <p className="mt-6 text-xs text-white/35">
                Free forever · No credit card · 2-minute setup
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
