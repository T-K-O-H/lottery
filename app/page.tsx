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
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-secondary animate-glow" />
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  LuckyDraw AI
                </h1>
              </div>
            </div>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto text-balance">
              Harness the power of advanced pattern analysis and historical data to generate your lottery numbers
            </p>
          </div>

          {/* Main Generator */}
          <LotteryGenerator />

          {/* Stats Toggle */}
          <div className="text-center mt-12">
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showStats ? "Hide" : "Show"} Pattern Statistics
            </button>
          </div>

          {/* Stats Panel */}
          {showStats && (
            <div className="mt-8">
              <StatsPanel />
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-16 p-6 rounded-lg bg-card border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-foreground">Disclaimer:</strong> This generator is for entertainment purposes only. 
              Lottery numbers are random and past patterns do not predict future results. 
              Always play responsibly and within your means.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
