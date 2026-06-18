"use client";

import * as React from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Section reveal — slow, elegant Apple-style fade + rise              */
/* ------------------------------------------------------------------ */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** viewport amount to trigger */
  amount?: number;
  as?: "div" | "section" | "li" | "span";
  variants?: Variants;
  once?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.25,
  as = "div",
  variants = fadeUp,
  once = true,
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount, once });
  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      ref={ref}
      className={cn(className)}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/* Glass card — premium dark surface                                   */
/* ------------------------------------------------------------------ */

export function GlassCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass rounded-2xl shadow-premium", className)} {...props}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Eyebrow label                                                       */
/* ------------------------------------------------------------------ */

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-eyebrow text-muted-foreground inline-flex items-center gap-2",
        className
      )}
    >
      <span className="h-1 w-1 rounded-full bg-white/60" />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* LOCKIN wordmark / lock icon                                         */
/* ------------------------------------------------------------------ */

export function LockMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="15" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 text-white transition-opacity hover:opacity-80",
        className
      )}
    >
      <LockMark className="h-5 w-5" />
      <span className="text-[15px] font-semibold tracking-[0.18em]">LOCKIN</span>
    </button>
  );
}
