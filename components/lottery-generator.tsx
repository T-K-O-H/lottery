"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NumberBall } from "@/components/number-ball";
import { Fireworks } from "@/components/fireworks";
import { Sparkles, Flame, Snowflake, Scale, TrendingUp, Shuffle, Save, RefreshCw, Trash2 } from "lucide-react";

const STORAGE_KEY_SAVED = "lottery-saved-sets";
const STORAGE_KEY_LAST = "lottery-last-generated";

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
  { id: "ultimate" as Strategy, name: "Ultimate AI", icon: Sparkles, color: "from-violet-600 to-purple-600" },
  { id: "hot" as Strategy, name: "Super Hot", icon: Flame, color: "from-red-500 to-orange-500" },
  { id: "cold" as Strategy, name: "Contrarian", icon: Snowflake, color: "from-blue-500 to-cyan-500" },
  { id: "balanced" as Strategy, name: "Balanced", icon: Scale, color: "from-green-500 to-emerald-500" },
  { id: "frequency" as Strategy, name: "Frequency", icon: TrendingUp, color: "from-purple-500 to-pink-500" },
  { id: "random" as Strategy, name: "Random", icon: Shuffle, color: "from-gray-500 to-slate-500" },
];

export function LotteryGenerator() {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>("ultimate");
  const [generatedNumbers, setGeneratedNumbers] = useState<GeneratedNumbers | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedSets, setSavedSets] = useState<GeneratedNumbers[]>([]);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY_SAVED);
    const lastGenerated = localStorage.getItem(STORAGE_KEY_LAST);
    
    if (savedData) {
      try {
        setSavedSets(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved sets", e);
      }
    }
    
    if (lastGenerated) {
      try {
        setGeneratedNumbers(JSON.parse(lastGenerated));
      } catch (e) {
        console.error("Failed to parse last generated", e);
      }
    }
    
    setIsHydrated(true);
  }, []);

  // Save to localStorage when savedSets changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedSets));
    }
  }, [savedSets, isHydrated]);

  // Save last generated numbers
  useEffect(() => {
    if (isHydrated && generatedNumbers) {
      localStorage.setItem(STORAGE_KEY_LAST, JSON.stringify(generatedNumbers));
    }
  }, [generatedNumbers, isHydrated]);

  const generateNumbers = (strategy: Strategy) => {
    setIsGenerating(true);
    setGeneratedNumbers(null);
    setShowFireworks(false);

    setTimeout(() => {
      const numbers = generateNumbersForStrategy(strategy);
      setGeneratedNumbers(numbers);
      setIsGenerating(false);
      setShowFireworks(true);
      
      // Reset fireworks after animation
      setTimeout(() => setShowFireworks(false), 2000);
    }, 1500);
  };

  const generateNumbersForStrategy = (strategy: Strategy): GeneratedNumbers => {
    let whiteBalls: number[] = [];
    let powerball: number;
    
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
    const hotNumbers = [23, 36, 39, 21, 32, 16, 38, 18, 10, 42];
    const numbers: number[] = [];
    const hotCount = Math.floor(Math.random() * 2) + 3;
    for (let i = 0; i < hotCount; i++) {
      const num = hotNumbers[Math.floor(Math.random() * hotNumbers.length)];
      if (!numbers.includes(num)) numbers.push(num);
    }
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 69) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }
    return numbers;
  };

  const generateHotStrategy = (): number[] => {
    const hotNumbers = [23, 36, 39, 21, 32, 16, 38, 18, 10, 42, 14, 58, 53, 61, 62];
    const numbers: number[] = [];
    const hotCount = Math.floor(Math.random() * 2) + 4;
    while (numbers.length < hotCount && numbers.length < 5) {
      const num = hotNumbers[Math.floor(Math.random() * hotNumbers.length)];
      if (!numbers.includes(num)) numbers.push(num);
    }
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 69) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }
    return numbers;
  };

  const generateColdStrategy = (): number[] => {
    const coldNumbers = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 50, 51, 52];
    const numbers: number[] = [];
    const coldCount = Math.floor(Math.random() * 2) + 4;
    while (numbers.length < coldCount && numbers.length < 5) {
      const num = coldNumbers[Math.floor(Math.random() * coldNumbers.length)];
      if (!numbers.includes(num)) numbers.push(num);
    }
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
    for (let i = 0; i < 2; i++) {
      const num = hotNumbers[Math.floor(Math.random() * hotNumbers.length)];
      if (!numbers.includes(num)) numbers.push(num);
    }
    for (let i = 0; i < 2; i++) {
      const num = coldNumbers[Math.floor(Math.random() * coldNumbers.length)];
      if (!numbers.includes(num)) numbers.push(num);
    }
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 69) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }
    return numbers;
  };

  const generateFrequencyStrategy = (): number[] => {
    const weights = Array.from({ length: 69 }, (_, i) => {
      const num = i + 1;
      if (num <= 40) return 3;
      if (num <= 60) return 2;
      return 1;
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

  const deleteSet = (index: number) => {
    setSavedSets(savedSets.filter((_, i) => i !== index));
  };

  const clearAllSets = () => {
    setSavedSets([]);
    localStorage.removeItem(STORAGE_KEY_SAVED);
  };

  const selectedStrategyData = strategies.find((s) => s.id === selectedStrategy);

  return (
    <div className="space-y-6">
      <Fireworks trigger={showFireworks} />
      
      {/* Strategy Selection - Compact pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {strategies.map((strategy) => {
          const Icon = strategy.icon;
          const isSelected = selectedStrategy === strategy.id;
          return (
            <button
              key={strategy.id}
              onClick={() => setSelectedStrategy(strategy.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? `bg-gradient-to-r ${strategy.color} text-white shadow-lg scale-105`
                  : "bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {strategy.name}
            </button>
          );
        })}
      </div>

      {/* Generate Button - Better readability */}
      <div className="text-center py-4">
        <Button
          onClick={() => generateNumbers(selectedStrategy)}
          disabled={isGenerating}
          size="lg"
          className={`relative px-8 py-6 text-base font-bold rounded-full transition-all shadow-xl ${
            isGenerating 
              ? "bg-muted text-muted-foreground" 
              : `bg-gradient-to-r ${selectedStrategyData?.color} text-white hover:scale-105 hover:shadow-2xl`
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

      {/* Generated Numbers - Clean layout */}
      {generatedNumbers && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {generatedNumbers.strategy} Strategy
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
            {generatedNumbers.whiteBalls.map((num, idx) => (
              <NumberBall key={idx} number={num} variant="white" delay={idx * 100} />
            ))}
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mx-1" />
            <NumberBall number={generatedNumbers.powerball} variant="power" delay={500} />
          </div>

          {/* Minimal Analysis Row */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground mb-6">
            <span>
              <span className="text-red-400 font-medium">{generatedNumbers.analysis.hotCount}</span> hot
            </span>
            <span>
              <span className="text-blue-400 font-medium">{generatedNumbers.analysis.coldCount}</span> cold
            </span>
            <span>
              Sum: <span className="text-foreground font-medium">{generatedNumbers.analysis.sum}</span>
            </span>
            <span>
              E/O: <span className="text-foreground font-medium">{generatedNumbers.analysis.evenCount}/{5 - generatedNumbers.analysis.evenCount}</span>
            </span>
            <span>
              PB: <span className={`font-medium ${
                generatedNumbers.analysis.powerballStatus === 'hot' ? 'text-red-400' : 
                generatedNumbers.analysis.powerballStatus === 'cold' ? 'text-blue-400' : 'text-foreground'
              }`}>{generatedNumbers.analysis.powerballStatus}</span>
            </span>
          </div>

          <div className="flex justify-center gap-2">
            <Button onClick={saveSet} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Save className="w-4 h-4 mr-1.5" />
              Save
            </Button>
            <Button onClick={() => generateNumbers(selectedStrategy)} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Again
            </Button>
          </div>
        </div>
      )}

      {/* Saved Sets - Compact */}
      {savedSets.length > 0 && (
        <div className="pt-6 border-t border-border/30">
          <div className="flex items-center justify-center gap-3 mb-3">
            <p className="text-xs text-muted-foreground">Saved Sets ({savedSets.length})</p>
            <button 
              onClick={clearAllSets}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {savedSets.map((set, idx) => (
              <div key={idx} className="flex items-center justify-center gap-2 py-2 group">
                <span className="text-xs text-muted-foreground w-16 text-right">{set.strategy}</span>
                <div className="flex items-center gap-1.5">
                  {set.whiteBalls.map((num, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-white/90 to-white/70 flex items-center justify-center text-black text-xs font-bold shadow">
                      {num}
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-xs font-bold shadow">
                    {set.powerball}
                  </div>
                </div>
                <button
                  onClick={() => deleteSet(idx)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
