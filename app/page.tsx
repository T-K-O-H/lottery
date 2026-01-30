"use client";

import { useState } from "react";
import { LotteryGenerator } from "@/components/lottery-generator";
import { StatsPanel } from "@/components/stats-panel";
import { ParticleBackground } from "@/components/particle-background";

export default function Home() {
  const [showStats, setShowStats] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-10">
        <div className="max-w-4xl mx-auto">
          {/* Compact Header with Logo and Disclaimer */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex justify-center mb-2 sm:mb-3">
              <img 
                src="/pb-lucky-logo.svg" 
                alt="PB Lucky" 
                className="h-12 sm:h-16 md:h-20 w-auto"
              />
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto mb-2 sm:mb-3 text-balance px-2">
              Pattern-powered lottery number generation for entertainment only
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground/70 max-w-md mx-auto px-4">
              Lottery is random. Past patterns don't predict future results. Play responsibly.
            </p>
          </div>

          {/* Main Generator */}
          <LotteryGenerator />

          {/* Stats Toggle */}
          <div className="text-center mt-8 sm:mt-10">
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              {showStats ? "Hide" : "Show"} Pattern Statistics
            </button>
          </div>

          {/* Stats Panel */}
          {showStats && (
            <div className="mt-6">
              <StatsPanel />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
