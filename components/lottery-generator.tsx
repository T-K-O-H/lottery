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
  const [globalCount, setGlobalCount] = useState<number | null>(null);

  // Load from localStorage on mount and fetch global counter
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
    
    // Fetch global generation count
    fetch("/api/counter")
      .then((res) => res.json())
      .then((data) => setGlobalCount(data.count))
      .catch((err) => console.error("Failed to fetch counter", err));
    
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

    setTimeout(async () => {
      const numbers = generateNumbersForStrategy(strategy);
      setGeneratedNumbers(numbers);
      setIsGenerating(false);
      setShowFireworks(true);
      
      // Increment global counter
      try {
        const res = await fetch("/api/counter", { method: "POST" });
        const data = await res.json();
        setGlobalCount(data.count);
      } catch (err) {
        console.error("Failed to increment counter", err);
      }
      
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
      
      {/* Global Counter */}
      {globalCount !== null && (
        <div className="text-center">
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{globalCount.toLocaleString()}</span> lucky numbers generated worldwide
          </span>
        </div>
      )}
      
      {/* Strategy Selection - Mobile optimized grid with themed effects */}
      <div className="grid grid-cols-3 sm:flex sm:flex-wrap sm:justify-center gap-1.5 sm:gap-2 px-1 sm:px-0">
        {strategies.map((strategy) => {
          const Icon = strategy.icon;
          const isSelected = selectedStrategy === strategy.id;
          return (
            <button
              key={strategy.id}
              onClick={() => setSelectedStrategy(strategy.id)}
              className={`relative overflow-hidden flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-full text-[11px] sm:text-sm font-medium transition-all ${
                isSelected
                  ? `bg-gradient-to-r ${strategy.color} text-white shadow-lg scale-[1.02] sm:scale-105`
                  : "bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50"
              }`}
            >
              {/* Fire effect for Super Hot */}
              {strategy.id === "hot" && isSelected && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute bottom-0 left-1/4 w-2 h-3 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full animate-flicker opacity-80" />
                  <div className="absolute bottom-0 left-1/2 w-2.5 h-4 bg-gradient-to-t from-red-500 via-orange-400 to-transparent rounded-full animate-flicker-delay opacity-80" />
                  <div className="absolute bottom-0 right-1/4 w-2 h-3 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full animate-flicker-fast opacity-80" />
                </div>
              )}
              
              {/* Ice crystals for Contrarian */}
              {strategy.id === "cold" && isSelected && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1 left-2 w-1 h-1 bg-cyan-200 rotate-45 animate-twinkle opacity-80" />
                  <div className="absolute top-2 right-3 w-1.5 h-1.5 bg-blue-200 rotate-12 animate-twinkle-delay opacity-80" />
                  <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-white rotate-45 animate-twinkle-fast opacity-80" />
                </div>
              )}
              
              {/* Sparkles for Ultimate AI */}
              {strategy.id === "ultimate" && isSelected && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1 left-3 w-1 h-1 bg-purple-200 rounded-full animate-sparkle opacity-90" />
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-300 rounded-full animate-sparkle-delay opacity-90" />
                  <div className="absolute bottom-1 left-1/3 w-1 h-1 bg-purple-100 rounded-full animate-sparkle-fast opacity-90" />
                </div>
              )}
              
              {/* Balance scales effect */}
              {strategy.id === "balanced" && isSelected && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-transparent to-emerald-400/20 animate-balance" />
                </div>
              )}
              
              {/* Frequency wave effect */}
              {strategy.id === "frequency" && isSelected && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-wave opacity-60" />
                </div>
              )}
              
              {/* Random dice dots */}
              {strategy.id === "random" && isSelected && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1.5 left-2 w-1 h-1 bg-slate-300 rounded-full animate-dice opacity-70" />
                  <div className="absolute bottom-1.5 right-2 w-1 h-1 bg-slate-300 rounded-full animate-dice-delay opacity-70" />
                </div>
              )}
              
              <Icon className={`relative z-10 w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSelected && strategy.id === "hot" ? "animate-pulse" : ""}`} />
              <span className="relative z-10 truncate">{strategy.name}</span>
            </button>
          );
        })}
      </div>

      {/* Generate Button - Better readability */}
      <div className="text-center py-3 sm:py-4">
        <Button
          onClick={() => generateNumbers(selectedStrategy)}
          disabled={isGenerating}
          size="lg"
          className={`relative px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-bold rounded-full transition-all shadow-xl ${
            isGenerating 
              ? "bg-muted text-muted-foreground" 
              : `bg-gradient-to-r ${selectedStrategyData?.color} text-white hover:scale-105 hover:shadow-2xl active:scale-95`
          }`}
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Generate Numbers
            </>
          )}
        </Button>
      </div>

      {/* Generated Numbers - Clean layout */}
      {generatedNumbers && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-3 sm:mb-4">
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
              {generatedNumbers.strategy} Strategy
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-2">
            {generatedNumbers.whiteBalls.map((num, idx) => (
              <NumberBall key={idx} number={num} variant="white" delay={idx * 100} />
            ))}
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-muted-foreground/50 mx-0.5 sm:mx-1" />
            <NumberBall number={generatedNumbers.powerball} variant="power" delay={500} />
          </div>

          {/* Minimal Analysis Row */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground mb-4 sm:mb-6 px-4">
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

          <div className="flex justify-center gap-1.5 sm:gap-2">
            <Button onClick={saveSet} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm h-8 sm:h-9 px-3">
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
              Save
            </Button>
            <Button onClick={() => generateNumbers(selectedStrategy)} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm h-8 sm:h-9 px-3">
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
              Again
            </Button>
          </div>
        </div>
      )}

      {/* Saved Sets - Compact */}
      {savedSets.length > 0 && (
        <div className="pt-4 sm:pt-6 border-t border-border/30">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <p className="text-[10px] sm:text-xs text-muted-foreground">Saved Sets ({savedSets.length})</p>
            <button 
              onClick={clearAllSets}
              className="text-[10px] sm:text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {savedSets.map((set, idx) => (
              <div key={idx} className="flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 group">
                <span className="text-[9px] sm:text-xs text-muted-foreground w-12 sm:w-16 text-right truncate">{set.strategy}</span>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {set.whiteBalls.map((num, i) => (
                    <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-white/90 to-white/70 flex items-center justify-center text-black text-[10px] sm:text-xs font-bold shadow">
                      {num}
                    </div>
                  ))}
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow">
                    {set.powerball}
                  </div>
                </div>
                <button
                  onClick={() => deleteSet(idx)}
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive ml-0.5 sm:ml-1"
                >
                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
