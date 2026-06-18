"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Download,
  FolderArchive,
  Chrome,
  ToggleRight,
  FolderOpen,
  Pin,
  Play,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { Reveal, Eyebrow, LockMark } from "../primitives";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    n: "01",
    icon: Download,
    title: "Download the extension",
    body: "Grab the LOCKIN extension package. It's a single .zip file, under 20KB, with no external dependencies.",
    cta: "Download .zip",
    accent: true,
  },
  {
    n: "02",
    icon: FolderArchive,
    title: "Unzip the folder",
    body: "Extract lockin-extension.zip anywhere on your machine. Remember where — you'll point Chrome to it next.",
  },
  {
    n: "03",
    icon: Chrome,
    title: "Open Chrome extensions",
    body: "In a new tab, paste chrome://extensions or use the menu: ⋮ → Extensions → Manage Extensions.",
    mono: "chrome://extensions",
  },
  {
    n: "04",
    icon: ToggleRight,
    title: "Enable Developer mode",
    body: "Flip the Developer mode toggle in the top-right corner of the extensions page. This reveals the 'Load unpacked' button.",
  },
  {
    n: "05",
    icon: FolderOpen,
    title: "Load unpacked",
    body: "Click 'Load unpacked' and select the folder you unzipped in step 2. The LOCKIN icon appears in your toolbar.",
  },
  {
    n: "06",
    icon: Pin,
    title: "Pin LOCKIN",
    body: "Click the puzzle-piece icon in Chrome's toolbar and pin LOCKIN so it's always one click away.",
  },
  {
    n: "07",
    icon: Play,
    title: "Start your first session",
    body: "Click the LOCKIN icon. Pick Monk Mode. Choose 90 minutes. Hit Start. Welcome to deep work.",
  },
];

export function Onboarding() {
  const [copied, setCopied] = React.useState(false);

  const copyUrl = () => {
    navigator.clipboard?.writeText("chrome://extensions").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <section id="onboarding" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl" amount={0.3}>
          <Eyebrow>Onboarding</Eyebrow>
          <h2 className="mt-5 text-display-sm text-white">
            From zero to locked in.
            <br />
            <span className="text-white/40">Ninety seconds.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/55">
            Seven steps. No account required. By the end you'll have a working
            focus blocker running inside Chrome — blocking the sites that drain
            you, on your terms.
          </p>
        </Reveal>

        {/* download banner */}
        <Reveal delay={0.08} className="mt-12" amount={0.3}>
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/[0.05] blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black shadow-float">
                  <LockMark className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    LOCKIN Chrome Extension
                  </p>
                  <p className="mt-0.5 text-xs text-white/45">
                    v1.0.0 · Manifest V3 · 17KB · Free
                  </p>
                </div>
              </div>
              <a
                href="/lockin-extension.zip"
                download
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
              >
                <Download className="h-4 w-4" />
                Download Extension
              </a>
            </div>
          </div>
        </Reveal>

        {/* steps grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.n}
              delay={(i % 3) * 0.06}
              amount={0.3}
              className={cn(
                step.accent && "sm:col-span-2 lg:col-span-1",
                step.n === "03" && "sm:col-span-2 lg:col-span-1"
              )}
            >
              <StepCard step={step} onCopyUrl={copyUrl} copied={copied} />
            </Reveal>
          ))}
        </div>

        {/* verification checklist */}
        <Reveal delay={0.05} className="mt-12" amount={0.3}>
          <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-white/60" />
              <p className="text-eyebrow text-white/45">
                Verify it's working
              </p>
            </div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                "LOCKIN icon appears in your toolbar",
                "Clicking it opens the popup with Monk / Hard / Easy",
                "Visiting youtube.com during a session shows the blocked page",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2.5 rounded-xl bg-white/[0.02] p-3.5 text-sm text-white/75 ring-1 ring-white/[0.05]"
                >
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-white/70" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* help row */}
        <Reveal delay={0.05} className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row" amount={0.3}>
          <p className="text-sm text-white/45">
            Stuck? The extension is open and inspectable — read the manifest and
            background script anytime.
          </p>
          <a
            href="chrome://extensions"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/70 transition-colors hover:text-white"
          >
            Open chrome://extensions
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function StepCard({
  step,
  onCopyUrl,
  copied,
}: {
  step: (typeof STEPS)[number];
  onCopyUrl: () => void;
  copied: boolean;
}) {
  const Icon = step.icon;
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-colors hover:border-white/[0.14]"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/8 text-white ring-1 ring-white/10">
          <Icon className="h-5 w-5" />
        </div>
        <span className="font-mono text-xs tracking-widest text-white/30">
          {step.n}
        </span>
      </div>

      <h3 className="mt-6 text-lg font-semibold tracking-tight text-white">
        {step.title}
      </h3>
      <p className="mt-2.5 flex-1 text-[14px] leading-relaxed text-white/55">
        {step.body}
      </p>

      {step.mono && (
        <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-black/40 px-3.5 py-2.5 ring-1 ring-white/[0.08]">
          <code className="font-mono text-[12px] text-white/70">{step.mono}</code>
          <button
            onClick={onCopyUrl}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy
              </>
            )}
          </button>
        </div>
      )}

      {step.cta && (
        <a
          href="/lockin-extension.zip"
          download
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-black transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Download className="h-4 w-4" />
          {step.cta}
        </a>
      )}
    </motion.div>
  );
}
