"use client";

import { useState } from "react";
import Link from "next/link";
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
          {/* Compact Header with Disclaimer */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-1 sm:mb-2">
              PB Lucky Draw AI
            </h1>
            <p className="text-muted-foreground text-base max-w-lg mx-auto mb-2 sm:mb-3 text-balance px-2">
              Pattern-powered lottery number generation for entertainment only
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto px-4">
              Lottery is random. Past patterns don't predict future results. Play responsibly.
            </p>
          </div>

          {/* Main Generator */}
          <LotteryGenerator />

          {/* Stats Toggle */}
          <div className="text-center mt-8 sm:mt-10">
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-base text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
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

          {/* Footer Navigation */}
          <footer className="mt-12 pt-6 border-t border-border/30">
            <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-base text-muted-foreground">
              <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="/faq" className="hover:text-foreground transition-colors">
                FAQ
              </Link>
            </nav>
            <p className="text-center text-sm text-muted-foreground/60 mt-4">
              For entertainment purposes only. Play responsibly.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
