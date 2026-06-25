"use client";

import { useCallback } from "react";
import { useLockinStore, type ViewId } from "@/lib/store";

/** Triggers the extension download, marks the user as having downloaded,
 * and auto-scrolls to the onboarding / install guide section. */
export function useDownloadExtension() {
  const markDownloaded = useLockinStore((s) => s.markDownloaded);
  const goToLandingSection = useLockinStore((s) => s.goToLandingSection);
  return useCallback(() => {
    // Force the file download via a temporary anchor.
    const a = document.createElement("a");
    a.href = "/lockin-extension.zip";
    a.download = "lockin-extension.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    markDownloaded();
    // Send the user to the install guide so they know what to do next.
    goToLandingSection("onboarding");
  }, [markDownloaded, goToLandingSection]);
}

/** Navigates to a gated view (dashboard/session). If the user hasn't
 * downloaded the extension yet, opens the gate modal instead. */
export function useGotoOrGate() {
  const { downloaded, setView, openGate } = useLockinStore();
  return useCallback(
    (view: ViewId) => {
      if (downloaded) {
        setView(view);
      } else {
        openGate(view);
      }
    },
    [downloaded, setView, openGate]
  );
}
