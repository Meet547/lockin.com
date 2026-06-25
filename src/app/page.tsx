"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLockinStore } from "@/lib/store";
import { NavBar } from "@/components/lockin/nav";
import { Footer } from "@/components/lockin/footer";
import { GateModal } from "@/components/lockin/gate-modal";
import { Landing } from "@/components/lockin/landing";
import { Dashboard } from "@/components/lockin/dashboard/dashboard";
import { ActiveSession } from "@/components/lockin/session/active-session";
import { BlockedPage } from "@/components/lockin/blocked/blocked-page";
import { ExtensionUI } from "@/components/lockin/extension/extension-ui";

export default function Page() {
  const view = useLockinStore((s) => s.view);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <NavBar />
      <div className="flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-1 flex-col"
          >
            {view === "landing" && <Landing />}
            {view === "dashboard" && <Dashboard />}
            {view === "session" && <ActiveSession />}
            {view === "blocked" && <BlockedPage />}
            {view === "extension" && <ExtensionUI />}
          </motion.div>
        </AnimatePresence>
        <Footer />
      </div>
      <GateModal />
    </div>
  );
}
