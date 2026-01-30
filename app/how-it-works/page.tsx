import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Sparkles, Flame, Snowflake, Scale, TrendingUp, Shuffle } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works - PB Lucky Draw AI | Powerball Strategy Guide",
  description: "Learn how PB Lucky Draw AI generates Powerball numbers using 6 unique strategies. Understand hot numbers, cold numbers, frequency analysis, and our AI-powered algorithms.",
  keywords: [
    "powerball strategy guide",
    "lottery number strategies",
    "hot numbers explained",
    "cold numbers lottery",
    "how to pick lottery numbers",
    "powerball number analysis",
    "lottery frequency analysis",
  ],
  alternates: {
    canonical: "/how-it-works",
  },
};

const strategies = [
  {
    id: "ultimate",
    name: "Ultimate AI",
    icon: Sparkles,
    color: "from-violet-600 to-purple-600",
    description: "Our most sophisticated strategy that combines multiple analytical approaches.",
    details: [
      "Analyzes historical frequency patterns across thousands of drawings",
      "Balances hot and cold numbers for optimal distribution",
      "Considers number spacing and sum totals",
      "Ensures a mix of even/odd and high/low numbers",
      "Applies mathematical constraints used by lottery analysts"
    ]
  },
  {
    id: "hot",
    name: "Super Hot",
    icon: Flame,
    color: "from-orange-500 to-red-500",
    description: "Focuses on numbers that have appeared most frequently in recent drawings.",
    details: [
      "Prioritizes numbers with highest recent appearance rates",
      "Based on the theory that streaks tend to continue",
      "Uses weighted probability based on frequency data",
      "Great for players who believe in momentum"
    ]
  },
  {
    id: "cold",
    name: "Contrarian",
    icon: Snowflake,
    color: "from-cyan-500 to-blue-500",
    description: "Selects numbers that haven't appeared recently and may be 'due'.",
    details: [
      "Targets numbers with lowest recent appearance rates",
      "Based on the law of averages theory",
      "Assumes cold numbers will eventually catch up",
      "Appeals to players who like going against the trend"
    ]
  },
  {
    id: "balanced",
    name: "Balanced",
    icon: Scale,
    color: "from-green-500 to-emerald-500",
    description: "Creates a mathematically balanced combination of numbers.",
    details: [
      "Mixes hot, cold, and neutral numbers evenly",
      "Ensures proper even/odd number ratio (typically 3:2 or 2:3)",
      "Balances high and low number distribution",
      "Targets optimal sum ranges based on historical winners"
    ]
  },
  {
    id: "frequency",
    name: "Frequency-Weighted",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    description: "Uses probability weighting based on historical appearance rates.",
    details: [
      "Each number's chance of selection matches its historical frequency",
      "More frequent numbers have proportionally higher odds",
      "Creates statistically representative combinations",
      "Mirrors the actual distribution seen in real drawings"
    ]
  },
  {
    id: "random",
    name: "Pure Random",
    icon: Shuffle,
    color: "from-slate-500 to-slate-600",
    description: "True random number generation with no pattern analysis.",
    details: [
      "Completely random selection with equal probability",
      "No bias toward any particular numbers",
      "Equivalent to a true quick pick",
      "For players who trust pure chance"
    ]
  }
];

const howItWorksJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Use PB Lucky Draw AI",
  "description": "Learn how to generate Powerball numbers using our AI-powered strategies",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Choose a Strategy",
      "text": "Select from 6 unique number generation strategies based on your preference"
    },
    {
      "@type": "HowToStep", 
      "name": "Generate Numbers",
      "text": "Click the Generate button to create your Powerball number combination"
    },
    {
      "@type": "HowToStep",
      "name": "Save Your Picks",
      "text": "Save combinations you like for later reference"
    }
  ]
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howItWorksJsonLd) }}
      />
      
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Generator
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
          How PB Lucky Draw AI Works
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Our Powerball number generator uses six unique strategies based on historical pattern analysis. 
          Choose the approach that matches your playing style.
        </p>

        {/* Quick Start */}
        <div className="bg-card/50 border border-border rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Quick Start Guide</h2>
          <ol className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center">1</span>
              <span><strong className="text-foreground">Choose a strategy</strong> - Select from 6 unique approaches based on your preference</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center">2</span>
              <span><strong className="text-foreground">Generate numbers</strong> - Click the button to create your Powerball combination</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-medium flex items-center justify-center">3</span>
              <span><strong className="text-foreground">Save your picks</strong> - Keep combinations you like for later reference</span>
            </li>
          </ol>
        </div>

        {/* Strategies */}
        <h2 className="text-2xl font-bold mb-6">Our 6 Strategies Explained</h2>
        
        <div className="space-y-6">
          {strategies.map((strategy) => {
            const Icon = strategy.icon;
            return (
              <div 
                key={strategy.id}
                className="border border-border rounded-xl overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${strategy.color} p-4 flex items-center gap-3`}>
                  <Icon className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">{strategy.name}</h3>
                </div>
                <div className="p-5 bg-card/50">
                  <p className="text-foreground mb-4">{strategy.description}</p>
                  <ul className="space-y-2">
                    {strategy.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground text-sm">
                        <span className="text-primary mt-1">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Understanding the Data */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Understanding Hot & Cold Numbers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Hot Numbers
              </h3>
              <p className="text-muted-foreground text-sm">
                Numbers that appear more frequently than average in historical drawings. 
                Some players believe these numbers are on a "hot streak" and more likely to continue appearing.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <Snowflake className="w-5 h-5" />
                Cold Numbers
              </h3>
              <p className="text-muted-foreground text-sm">
                Numbers that appear less frequently than average. 
                Contrarian players believe these numbers are "due" to appear based on the law of averages.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-5 bg-muted/30 rounded-xl border border-border">
          <h2 className="font-semibold mb-2">Important Disclaimer</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            PB Lucky Draw AI is designed for entertainment purposes only. The lottery is fundamentally random, 
            and no system, strategy, or algorithm can predict or guarantee winning numbers. Past patterns 
            do not influence future results. Please play responsibly and only spend what you can afford to lose.
          </p>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Ready to generate your numbers?</p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            Try the Generator
          </Link>
        </div>
      </div>
    </main>
  );
}
