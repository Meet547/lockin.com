"use client";

import * as React from "react";
import { LockMark } from "./primitives";
import { useLockinStore } from "@/lib/store";
import { useDownloadExtension, useGotoOrGate } from "@/lib/use-download";

export function Footer() {
  const setView = useLockinStore((s) => s.setView);
  const gotoOrGate = useGotoOrGate();
  const download = useDownloadExtension();

  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-black">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <LockMark className="h-5 w-5" />
              <span className="text-[15px] font-semibold tracking-[0.18em]">
                LOCKIN
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/45">
              Remove distractions. Build momentum.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: "Dashboard", onClick: () => gotoOrGate("dashboard") },
              { label: "Active Session", onClick: () => gotoOrGate("session") },
              { label: "Extension", onClick: () => setView("extension") },
            ]}
          />
          <FooterCol
            title="Get Started"
            links={[
              { label: "Download", onClick: download },
              { label: "Focus Modes", onClick: () => setView("landing") },
              { label: "Overview", onClick: () => setView("landing") },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} LOCKIN. Designed in black & white.
          </p>
          <p className="text-xs text-white/35">
            Focus is your unfair advantage.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; onClick: () => void }[];
}) {
  return (
    <div>
      <h4 className="text-eyebrow text-white/35">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <button
              onClick={l.onClick}
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
