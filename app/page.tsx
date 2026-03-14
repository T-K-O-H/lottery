import Link from "next/link";
import { LotteryGenerator } from "@/components/lottery-generator";
import { StatsToggle } from "@/components/stats-toggle";
import { ParticleBackground } from "@/components/particle-background";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Brand mark as centered background */}
      <div
        className="fixed inset-0 z-0 bg-no-repeat bg-center bg-contain opacity-15 pointer-events-none"
        style={{ backgroundImage: "url('/brand-mark.webp')" }}
      />
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-10">
        <div className="max-w-4xl mx-auto">
          {/* Header — server-rendered for SEO */}
          <div className="text-center mb-0.5 sm:mb-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-1 sm:mb-2">
              PB Lucky Draw AI
            </h1>
            <p className="text-muted-foreground font-light text-base max-w-lg mx-auto mb-2 sm:mb-3 text-balance px-2">
              Free AI-powered lottery number generator for Powerball, Mega Millions, Pick 3 &amp; Pick 4
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-md mx-auto px-4">
              Lottery is random. Past patterns don&apos;t predict future results. Play responsibly.
            </p>
          </div>

          {/* Main Generator */}
          <LotteryGenerator />

          {/* Stats Toggle */}
          <StatsToggle />

          {/* Footer Navigation */}
          <footer className="mt-8 pt-6 border-t border-border/30">
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
