"use client";

import { useCallback } from "react";
import { useLockinStore, type ViewId } from "@/lib/store";

/** Triggers the extension download and marks the user as having downloaded. */
export function useDownloadExtension() {
  const markDownloaded = useLockinStore((s) => s.markDownloaded);
  return useCallback(() => {
    // Create a temporary anchor to force the download with a filename.
    const a = document.createElement("a");
    a.href = "/lockin-extension.zip";
    a.download = "lockin-extension.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    markDownloaded();
  }, [markDownloaded]);
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
