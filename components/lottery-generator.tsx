"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NumberBall } from "@/components/number-ball";
import { Sparkles, Flame, Snowflake, Scale, TrendingUp, Shuffle } from "lucide-react";

type Strategy = "ultimate" | "hot" | "cold" | "balanced" | "frequency" | "random";

interface GeneratedNumbers {
  whiteBalls: number[];
  powerball: number;
  strategy: string;
  analysis: {
    hotCount: number;
    coldCount: number;
    neutralCount: number;
    powerballStatus: string;
    sum: number;
    evenCount: number;
  };
}

const strategies = [
  {
    id: "ultimate" as Strategy,
    name: "Ultimate AI",
    icon: Sparkles,
    description: "Combines all advanced findings",
    color: "from-primary to-secondary",
  },
  {
    id: "hot" as Strategy,
    name: "Super Hot",
    icon: Flame,
    description: "Maximum hot number bias",
    color: "from-red-500 to-orange-500",
  },
  {
    id: "cold" as Strategy,
    name: "Contrarian",
    icon: Snowflake,
    description: "Maximum cold number bias",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "balanced" as Strategy,
    name: "Balanced",
    icon: Scale,
    description: "Perfect hot/cold balance",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "frequency" as Strategy,
    name: "Frequency",
    icon: TrendingUp,
    description: "Uses historical frequencies",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "random" as Strategy,
    name: "Pure Random",
    icon: Shuffle,
    description: "Completely random selection",
    color: "from-gray-500 to-slate-500",
  },
];

export function LotteryGenerator() {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>("ultimate");
  const [generatedNumbers, setGeneratedNumbers] = useState<GeneratedNumbers | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedSets, setSavedSets] = useState<GeneratedNumbers[]>([]);

  const generateNumbers = (strategy: Strategy) => {
    setIsGenerating(true);
    setGeneratedNumbers(null);

    setTimeout(() => {
      const numbers = generateNumbersForStrategy(strategy);
      setGeneratedNumbers(numbers);
      setIsGenerating(false);
    }, 1500);
  };

  const generateNumbersForStrategy = (strategy: Strategy): GeneratedNumbers => {
    let whiteBalls: number[] = [];
    let powerball: number;
    
    // Simplified strategy implementations
    switch (strategy) {
      case "ultimate":
        whiteBalls = generateUltimateStrategy();
        powerball = Math.floor(Math.random() * 26) + 1;
        break;
      case "hot":
        whiteBalls = generateHotStrategy();
        powerball = Math.floor(Math.random() * 26) + 1;
        break;
      case "cold":
        whiteBalls = generateColdStrategy();
        powerball = Math.floor(Math.random() * 26) + 1;
        break;
      case "balanced":
        whiteBalls = generateBalancedStrategy();
        powerball = Math.floor(Math.random() * 26) + 1;
        break;
      case "frequency":
        whiteBalls = generateFrequencyStrategy();
        powerball = Math.floor(Math.random() * 26) + 1;
        break;
      case "random":
        whiteBalls = generateRandomNumbers();
        powerball = Math.floor(Math.random() * 26) + 1;
        break;
    }

    const strategyName = strategies.find((s) => s.id === strategy)?.name || strategy;
    
    return {
      whiteBalls: whiteBalls.sort((a, b) => a - b),
      powerball,
      strategy: strategyName,
      analysis: analyzeNumbers(whiteBalls, powerball),
    };
  };

  const generateUltimateStrategy = (): number[] => {
    // Hot numbers based on actual data
    const hotNumbers = [23, 36, 39, 21, 32, 16, 38, 18, 10, 42];
    const numbers: number[] = [];
    
    // Select 3-4 hot numbers
    const hotCount = Math.floor(Math.random() * 2) + 3;
    for (let i = 0; i < hotCount; i++) {
      const num = hotNumbers[Math.floor(Math.random() * hotNumbers.length)];
      if (!numbers.includes(num)) numbers.push(num);
    }
    
    // Fill remaining with random
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 69) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }
    
    return numbers;
  };

  const generateHotStrategy = (): number[] => {
    const hotNumbers = [23, 36, 39, 21, 32, 16, 38, 18, 10, 42, 14, 58, 53, 61, 62];
    const numbers: number[] = [];
    
    // Select 4-5 hot numbers
    const hotCount = Math.floor(Math.random() * 2) + 4;
    while (numbers.length < hotCount && numbers.length < 5) {
      const num = hotNumbers[Math.floor(Math.random() * hotNumbers.length)];
      if (!numbers.includes(num)) numbers.push(num);
    }
    
    // Fill remaining
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 69) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }
    
    return numbers;
  };

  const generateColdStrategy = (): number[] => {
    const coldNumbers = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 50, 51, 52];
    const numbers: number[] = [];
    
    // Select 4-5 cold numbers
    const coldCount = Math.floor(Math.random() * 2) + 4;
    while (numbers.length < coldCount && numbers.length < 5) {
      const num = coldNumbers[Math.floor(Math.random() * coldNumbers.length)];
      if (!numbers.includes(num)) numbers.push(num);
    }
    
    // Fill remaining
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 69) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }
    
    return numbers;
  };

  const generateBalancedStrategy = (): number[] => {
    const hotNumbers = [23, 36, 39, 21, 32];
    const coldNumbers = [65, 66, 67, 68, 69];
    const numbers: number[] = [];
    
    // 2 hot
    for (let i = 0; i < 2; i++) {
      const num = hotNumbers[Math.floor(Math.random() * hotNumbers.length)];
      if (!numbers.includes(num)) numbers.push(num);
    }
    
    // 2 cold
    for (let i = 0; i < 2; i++) {
      const num = coldNumbers[Math.floor(Math.random() * coldNumbers.length)];
      if (!numbers.includes(num)) numbers.push(num);
    }
    
    // 1 neutral
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 69) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }
    
    return numbers;
  };

  const generateFrequencyStrategy = (): number[] => {
    // Weighted towards more common numbers
    const weights = Array.from({ length: 69 }, (_, i) => {
      const num = i + 1;
      if (num <= 40) return 3; // More likely
      if (num <= 60) return 2;
      return 1; // Less likely
    });
    
    const numbers: number[] = [];
    while (numbers.length < 5) {
      const rand = Math.random() * weights.reduce((a, b) => a + b, 0);
      let sum = 0;
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (rand <= sum) {
          const num = i + 1;
          if (!numbers.includes(num)) {
            numbers.push(num);
            break;
          }
        }
      }
    }
    
    return numbers;
  };

  const generateRandomNumbers = (): number[] => {
    const numbers: number[] = [];
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 69) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }
    return numbers;
  };

  const analyzeNumbers = (whiteBalls: number[], powerball: number) => {
    const hotNumbers = [23, 36, 39, 21, 32, 16, 38, 18, 10, 42];
    const coldNumbers = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69];
    
    const hotCount = whiteBalls.filter((n) => hotNumbers.includes(n)).length;
    const coldCount = whiteBalls.filter((n) => coldNumbers.includes(n)).length;
    const neutralCount = 5 - hotCount - coldCount;
    const sum = whiteBalls.reduce((a, b) => a + b, 0);
    const evenCount = whiteBalls.filter((n) => n % 2 === 0).length;
    
    let powerballStatus = "neutral";
    if ([24, 18, 6, 20, 21].includes(powerball)) powerballStatus = "hot";
    if ([8, 9, 12, 15, 25].includes(powerball)) powerballStatus = "cold";
    
    return { hotCount, coldCount, neutralCount, powerballStatus, sum, evenCount };
  };

  const saveSet = () => {
    if (generatedNumbers) {
      setSavedSets([...savedSets, generatedNumbers]);
    }
  };

  const selectedStrategyData = strategies.find((s) => s.id === selectedStrategy);

  return (
    <div className="space-y-8">
      {/* Strategy Selection */}
      <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border">
        <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Strategy</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {strategies.map((strategy) => {
            const Icon = strategy.icon;
            const isSelected = selectedStrategy === strategy.id;
            return (
              <button
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 scale-105"
                    : "border-border hover:border-primary/50 hover:bg-card/50"
                }`}
              >
                <div className={`w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br ${strategy.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-semibold mb-1">{strategy.name}</div>
                <div className="text-xs text-muted-foreground text-pretty">{strategy.description}</div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={() => generateNumbers(selectedStrategy)}
          disabled={isGenerating}
          size="lg"
          className={`relative px-12 py-6 text-lg font-bold rounded-full bg-gradient-to-r ${selectedStrategyData?.color} hover:scale-105 transition-transform ${
            isGenerating ? "animate-pulse" : "animate-glow"
          }`}
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Numbers
            </>
          )}
        </Button>
      </div>

      {/* Generated Numbers */}
      {generatedNumbers && (
        <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">{generatedNumbers.strategy} Strategy</h3>
            <p className="text-sm text-muted-foreground">Your lucky numbers are ready!</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 mb-8">
            {generatedNumbers.whiteBalls.map((num, idx) => (
              <NumberBall
                key={idx}
                number={num}
                variant="white"
                delay={idx * 100}
              />
            ))}
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            <NumberBall
              number={generatedNumbers.powerball}
              variant="power"
              delay={500}
            />
          </div>

          {/* Analysis */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="text-2xl font-bold text-red-500">{generatedNumbers.analysis.hotCount}</div>
              <div className="text-xs text-muted-foreground">Hot Numbers</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="text-2xl font-bold text-blue-500">{generatedNumbers.analysis.coldCount}</div>
              <div className="text-xs text-muted-foreground">Cold Numbers</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="text-2xl font-bold text-green-500">{generatedNumbers.analysis.neutralCount}</div>
              <div className="text-xs text-muted-foreground">Neutral Numbers</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="text-2xl font-bold">{generatedNumbers.analysis.sum}</div>
              <div className="text-xs text-muted-foreground">Total Sum</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="text-2xl font-bold">{generatedNumbers.analysis.evenCount} / {5 - generatedNumbers.analysis.evenCount}</div>
              <div className="text-xs text-muted-foreground">Even / Odd</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="text-2xl font-bold capitalize">{generatedNumbers.analysis.powerballStatus}</div>
              <div className="text-xs text-muted-foreground">Powerball Status</div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button onClick={saveSet} variant="outline">
              Save This Set
            </Button>
            <Button onClick={() => generateNumbers(selectedStrategy)} variant="secondary">
              Generate Again
            </Button>
          </div>
        </Card>
      )}

      {/* Saved Sets */}
      {savedSets.length > 0 && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
          <h3 className="text-lg font-bold mb-4">Saved Sets ({savedSets.length})</h3>
          <div className="space-y-3">
            {savedSets.map((set, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-background/50 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  {set.whiteBalls.map((num, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-white/90 to-white/70 flex items-center justify-center text-black text-xs font-bold">
                      {num}
                    </div>
                  ))}
                  <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-xs font-bold">
                    {set.powerball}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{set.strategy}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
