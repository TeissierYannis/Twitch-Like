"use client";

import { Maximize, Minimize } from "lucide-react";
import { Hint } from "@/components/hint";
import { useTheaterMode } from "@/hooks/use-theater-mode";

export const TheaterControl = () => {
  const { isTheaterMode, toggle } = useTheaterMode();

  const Icon = isTheaterMode ? Minimize : Maximize;
  const label = isTheaterMode ? "Exit theater mode (t)" : "Theater mode (t)";

  return (
    <div className="flex items-center justify-center gap-4">
      <Hint label={label} asChild>
        <button
          onClick={toggle}
          className="text-white p-1.5 hover:bg-white/10 rounded-lg transition"
        >
          <Icon className="h-5 w-5" />
        </button>
      </Hint>
    </div>
  );
};
