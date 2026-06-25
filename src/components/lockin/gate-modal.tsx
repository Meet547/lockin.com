"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ArrowRight } from "lucide-react";
import { useLockinStore } from "@/lib/store";
import { useDownloadExtension } from "@/lib/use-download";
import { LockMark } from "./primitives";

export function GateModal() {
  const { gateOpen, gateTarget, closeGate, setView } = useLockinStore();
  const download = useDownloadExtension();
  const [downloaded, setDownloaded] = React.useState(false);

  const handleDownload = () => {
    download();
    setDownloaded(true);
  };

  const handleContinue = () => {
    closeGate();
    if (gateTarget) setView(gateTarget);
  };

  return (
    <AnimatePresence>
      {gateOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-5"
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={closeGate}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong relative w-full max-w-md overflow-hidden rounded-[1.75rem] p-7 shadow-premium sm:p-8"
          >
            <button
              onClick={closeGate}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* lock badge */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black shadow-float"
            >
              <LockMark className="h-5 w-5" />
            </motion.div>

            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white">
              {downloaded ? "You're all set." : "Download to continue."}
            </h2>

            <p className="mt-3 text-[14px] leading-relaxed text-white/55">
              {downloaded ? (
                <>
                  The LOCKIN extension is downloaded. Unzip it, load it unpacked
                  in{" "}
                  <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px] text-white/80">
                    chrome://extensions
                  </code>
                  , then enter your dashboard.
                </>
              ) : (
                <>
                  The dashboard and live sessions run alongside the LOCKIN
                  browser extension. Grab it first — it&apos;s free, 19KB, and
                  takes 90 seconds to install.
                </>
              )}
            </p>

            {/* actions */}
            <div className="mt-7 flex flex-col gap-2.5">
              {!downloaded ? (
                <button
                  onClick={handleDownload}
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3.5 text-[14px] font-semibold text-black transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <Download className="relative h-4 w-4" />
                  <span className="relative">Download Extension</span>
                </button>
              ) : (
                <button
                  onClick={handleContinue}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-semibold text-black transition-transform hover:scale-[1.02] active:scale-95"
                >
                  Enter {gateTarget === "session" ? "Session" : "Dashboard"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              )}

              <button
                onClick={closeGate}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white"
              >
                {downloaded ? "Maybe later" : "Not now"}
              </button>
            </div>

            {!downloaded && (
              <p className="mt-5 text-center text-[11px] text-white/35">
                v1.3.0 · Manifest V3 · Free · No account needed
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
