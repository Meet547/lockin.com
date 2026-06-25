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
  const landingTarget = useLockinStore((s) => s.landingTarget);
  const consumeLandingTarget = useLockinStore((s) => s.consumeLandingTarget);

  // React to landingTarget changes (set by goToLandingSection / download).
  React.useEffect(() => {
    if (!landingTarget) return;
    const id = setTimeout(() => {
      const el = document.getElementById(landingTarget);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      consumeLandingTarget();
    }, 140);
    return () => clearTimeout(id);
  }, [landingTarget, consumeLandingTarget]);

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
