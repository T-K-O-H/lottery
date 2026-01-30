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
      
      <div className="relative z-10 container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-4xl mx-auto">
          {/* Compact Header with Disclaimer */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              LuckyDraw AI
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-3 text-balance">
              Pattern-powered lottery number generation for entertainment only
            </p>
            <p className="text-xs text-muted-foreground/70 max-w-md mx-auto">
              Lottery is random. Past patterns don't predict future results. Play responsibly.
            </p>
          </div>

          {/* Main Generator */}
          <LotteryGenerator />

          {/* Stats Toggle */}
          <div className="text-center mt-10">
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
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
