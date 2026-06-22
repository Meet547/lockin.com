"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLockinStore, type ViewId } from "@/lib/store";
import { Wordmark } from "./primitives";

const NAV_ITEMS: { label: string; view: ViewId }[] = [
  { label: "Dashboard", view: "dashboard" },
  { label: "Session", view: "session" },
  { label: "Extension", view: "extension" },
];

export function NavBar() {
  const { view, setView, goToLandingSection } = useLockinStore();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (v: ViewId) => {
    setView(v);
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled
            ? "rgba(10,10,11,0.72)"
            : "rgba(10,10,11,0.35)",
          borderColor: scrolled
            ? "rgba(255,255,255,0.10)"
            : "rgba(255,255,255,0.05)",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "flex w-full max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 sm:px-5",
          "backdrop-blur-2xl backdrop-saturate-150 border"
        )}
        style={{ WebkitBackdropFilter: "blur(24px) saturate(150%)" }}
      >
        <Wordmark onClick={() => handleNav("landing")} />

        {/* desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = view === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNav(item.view)}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "text-white"
                    : "text-white/55 hover:text-white/90"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/10"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:block">
          <button
            onClick={() => goToLandingSection("onboarding")}
            className="rounded-full bg-white px-4 py-1.5 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
          >
            Get Extension
          </button>
        </div>

        {/* mobile toggle */}
        <button
          className="rounded-full p-2 text-white/80 hover:bg-white/5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.nav>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-3 right-3 top-[68px] z-50 md:hidden"
          >
            <div className="glass-strong rounded-2xl p-2 shadow-premium">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.view}
                  onClick={() => handleNav(item.view)}
                  className={cn(
                    "block w-full rounded-xl px-4 py-3 text-left text-[15px] font-medium transition-colors",
                    view === item.view
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5"
                  )}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  goToLandingSection("onboarding");
                  setOpen(false);
                }}
                className="mt-1 block w-full rounded-xl bg-white px-4 py-3 text-center text-[15px] font-semibold text-black"
              >
                Get Extension
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
