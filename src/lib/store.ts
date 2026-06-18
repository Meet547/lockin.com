import { create } from "zustand";

export type ViewId =
  | "landing"
  | "dashboard"
  | "session"
  | "blocked"
  | "extension";

interface LockinState {
  view: ViewId;
  setView: (view: ViewId) => void;
  /** Scrolls to a landing section id after switching to landing view. */
  landingTarget: string | null;
  goToLandingSection: (id: string) => void;
  consumeLandingTarget: () => string | null;
}

export const useLockinStore = create<LockinState>((set, get) => ({
  view: "landing",
  setView: (view) => {
    set({ view });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  },
  landingTarget: null,
  goToLandingSection: (id) => {
    set({ view: "landing", landingTarget: id });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  },
  consumeLandingTarget: () => {
    const t = get().landingTarget;
    if (t) set({ landingTarget: null });
    return t;
  },
}));
