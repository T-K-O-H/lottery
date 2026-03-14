"use client";

import { useState } from "react";
import { StatsPanel } from "@/components/stats-panel";

export function StatsToggle() {
  const [showStats, setShowStats] = useState(false);

  return (
    <>
      <div className="text-center mt-8 sm:mt-10">
        <button
          onClick={() => setShowStats(!showStats)}
          className="text-base text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
        >
          {showStats ? "Hide" : "Show"} Pattern Statistics
        </button>
      </div>

      {showStats && (
        <div className="mt-6">
          <StatsPanel />
        </div>
      )}
    </>
  );
}
