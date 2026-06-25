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

  /** Whether the user has downloaded the extension (persisted to localStorage).
   * Used to gate Dashboard/Session access with a download prompt. */
  downloaded: boolean;
  markDownloaded: () => void;

  /** The gate modal — shown when a gated view is requested before download. */
  gateOpen: boolean;
  /** The view the user tried to access (so we can route them after download). */
  gateTarget: ViewId | null;
  openGate: (target: ViewId) => void;
  closeGate: () => void;
}

const DOWNLOADED_KEY = "lockin.downloaded";

function readDownloaded(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(DOWNLOADED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeDownloaded(v: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DOWNLOADED_KEY, v ? "1" : "0");
  } catch {}
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

  downloaded: readDownloaded(),
  markDownloaded: () => {
    writeDownloaded(true);
    set({ downloaded: true });
  },

  gateOpen: false,
  gateTarget: null,
  openGate: (target) => set({ gateOpen: true, gateTarget: target }),
  closeGate: () => set({ gateOpen: false }),
}));
