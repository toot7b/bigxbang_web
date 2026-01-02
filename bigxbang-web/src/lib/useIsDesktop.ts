"use client";

import { useSyncExternalStore } from "react";

/**
 * Simple media-query hook to split desktop/mobile rendering without touching desktop code.
 */
export function useIsDesktop(minWidth = 1024, defaultValue = true) {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mql = window.matchMedia(`(min-width: ${minWidth}px)`);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(`(min-width: ${minWidth}px)`).matches,
    () => defaultValue,
  );
}

