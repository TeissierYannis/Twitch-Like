"use client";

import { create } from "zustand";
import { useEffect } from "react";

interface TheaterModeStore {
  isTheaterMode: boolean;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
}

export const useTheaterMode = create<TheaterModeStore>((set) => ({
  isTheaterMode: false,
  toggle: () => set((state) => ({ isTheaterMode: !state.isTheaterMode })),
  enable: () => set({ isTheaterMode: true }),
  disable: () => set({ isTheaterMode: false }),
}));

export function useTheaterModeKeyboard() {
  const { toggle, disable } = useTheaterMode();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // T key toggles theater mode
      if (e.key === "t" || e.key === "T") {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          const target = e.target as HTMLElement;
          // Don't toggle if user is typing in an input
          if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
            e.preventDefault();
            toggle();
          }
        }
      }

      // Escape exits theater mode
      if (e.key === "Escape") {
        disable();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle, disable]);
}
