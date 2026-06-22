"use client";

import * as React from "react";
import { useLockinStore } from "@/lib/store";
import { Hero } from "./hero";
import { Quotes } from "./quotes";
import { HowItWorks } from "./how-it-works";
import { FocusModes } from "./focus-modes";
import { Onboarding } from "./onboarding";
import { FinalCTA } from "./final-cta";

export function Landing() {
  const consumeLandingTarget = useLockinStore((s) => s.consumeLandingTarget);

  React.useEffect(() => {
    const target = consumeLandingTarget();
    if (!target) return;
    const id = setTimeout(() => {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
    return () => clearTimeout(id);
  }, [consumeLandingTarget]);

  return (
    <main className="relative">
      <Hero />
      <Quotes />
      <HowItWorks />
      <FocusModes />
      <Onboarding />
      <FinalCTA />
    </main>
  );
}
