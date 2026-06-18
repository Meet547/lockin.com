"use client";

import * as React from "react";
import { useLockinStore } from "@/lib/store";
import { Hero } from "./hero";
import { ProblemSection } from "./problem";
import { HowItWorks } from "./how-it-works";
import { FeatureShowcase } from "./features";
import { FocusModes } from "./focus-modes";
import { SocialProof } from "./social-proof";
import { FAQ } from "./faq";
import { FinalCTA } from "./final-cta";

export function Landing() {
  const consumeLandingTarget = useLockinStore((s) => s.consumeLandingTarget);

  React.useEffect(() => {
    const target = consumeLandingTarget();
    if (!target) return;
    // small delay to let the landing mount
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
      <ProblemSection />
      <HowItWorks />
      <FeatureShowcase />
      <FocusModes />
      <SocialProof />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
