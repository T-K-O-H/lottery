"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NumberBall } from "@/components/number-ball";
import { GenerationEffects } from "@/components/generation-effects";
import { Sparkles, Flame, Snowflake, Scale, TrendingUp, Shuffle, Save, RefreshCw, Trash2 } from "lucide-react";

const strategyEffects: Record<string, "fireworks" | "lightning" | "snowflakes" | "dollars" | "shooting-star" | "none"> = {
  hot: "fireworks",
  ultimate: "lightning",
  cold: "snowflakes",
  balanced: "dollars",
  frequency: "shooting-star",
  random: "none",
};

const STORAGE_KEY_SAVED = "lottery-saved-sets";
const STORAGE_KEY_LAST = "lottery-last-generated";
const STORAGE_KEY_CONFIG = "lottery-number-config";

// Crypto-quality RNG helpers
function secureRandom(): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / (0xFFFFFFFF + 1);
  }
  return Math.random();
}

function secureRandomInt(min: number, max: number): number {
  return Math.floor(secureRandom() * (max - min + 1)) + min;
}

// Number count configuration
type GameMode = "digits" | "pool";

interface NumberConfig {
  mode: GameMode;
  count: number;
  maxNumber: number;     // 9 for digits (0-9), 69 for pool (1-69)
  bonusMax: number;      // 0 = no bonus ball
  allowRepeats: boolean;
  label: string;
}

const NUMBER_CONFIGS: NumberConfig[] = [
  { mode: "digits", count: 4, maxNumber: 9, bonusMax: 0, allowRepeats: true, label: "4 Digits" },
  { mode: "pool", count: 5, maxNumber: 69, bonusMax: 26, allowRepeats: false, label: "5 + Bonus" },
];

const DEFAULT_CONFIG = NUMBER_CONFIGS[1]; // 5 + Bonus (current behavior)

type Strategy = "ultimate" | "hot" | "cold" | "balanced" | "frequency" | "random";

interface GeneratedNumbers {
  whiteBalls: number[];
  powerball: number | null;
  strategy: string;
  numberConfig: NumberConfig;
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
  const [numberConfig, setNumberConfig] = useState<NumberConfig>(DEFAULT_CONFIG);

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

    const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        const match = NUMBER_CONFIGS.find((c) => c.label === parsed.label);
        if (match) setNumberConfig(match);
      } catch (e) {
        console.error("Failed to parse config", e);
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

  // Save number config
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(numberConfig));
    }
  }, [numberConfig, isHydrated]);

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

  // --- Digit mode helpers (each position 0-9, repeats allowed) ---
  const generateDigits = (count: number): number[] =>
    Array.from({ length: count }, () => secureRandomInt(0, 9));

  const generateDigitsWeighted = (count: number, weights: number[]): number[] => {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    return Array.from({ length: count }, () => {
      const rand = secureRandom() * totalWeight;
      let sum = 0;
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (rand <= sum) return i;
      }
      return 9;
    });
  };

  // Hot digits: 1, 3, 7, 9 appear more often in historical pick-4 data
  const hotDigits = [1, 3, 7, 9];
  // Cold digits: 0, 4, 5 appear less often
  const coldDigits = [0, 4, 5];

  // --- Pool mode helpers (unique numbers, no repeats) ---
  const pickUnique = (count: number, min: number, max: number): number[] => {
    const numbers: number[] = [];
    while (numbers.length < count) {
      const num = secureRandomInt(min, max);
      if (!numbers.includes(num)) numbers.push(num);
    }
    return numbers;
  };

  const pickFromPool = (count: number, pool: number[], existing: number[] = []): number[] => {
    const numbers = [...existing];
    let added = 0;
    while (added < count) {
      const num = pool[secureRandomInt(0, pool.length - 1)];
      if (!numbers.includes(num)) { numbers.push(num); added++; }
    }
    return numbers;
  };

  const generateNumbersForStrategy = (strategy: Strategy): GeneratedNumbers => {
    const isDigitMode = numberConfig.mode === "digits";
    let whiteBalls: number[];

    if (isDigitMode) {
      whiteBalls = generateDigitStrategy(strategy, numberConfig);
    } else {
      whiteBalls = generatePoolStrategy(strategy, numberConfig);
    }

    const powerball = numberConfig.bonusMax > 0 ? secureRandomInt(1, numberConfig.bonusMax) : null;
    const strategyName = strategies.find((s) => s.id === strategy)?.name || strategy;

    return {
      whiteBalls: isDigitMode ? whiteBalls : whiteBalls.sort((a, b) => a - b),
      powerball,
      strategy: strategyName,
      numberConfig,
      analysis: analyzeNumbers(whiteBalls, powerball, numberConfig),
    };
  };

  // --- Digit mode strategies (0-9 per position, repeats OK) ---
  const generateDigitStrategy = (strategy: Strategy, config: NumberConfig): number[] => {
    const { count } = config;
    switch (strategy) {
      case "ultimate": {
        // Mix: ~60% positions from hot digits, rest random
        const hotPositions = Math.ceil(count * 0.6);
        return Array.from({ length: count }, (_, i) =>
          i < hotPositions
            ? hotDigits[secureRandomInt(0, hotDigits.length - 1)]
            : secureRandomInt(0, 9)
        );
      }
      case "hot": {
        // ~80% hot digits
        const hotPositions = Math.ceil(count * 0.8);
        return Array.from({ length: count }, (_, i) =>
          i < hotPositions
            ? hotDigits[secureRandomInt(0, hotDigits.length - 1)]
            : secureRandomInt(0, 9)
        );
      }
      case "cold": {
        // ~80% cold digits
        const coldPositions = Math.ceil(count * 0.8);
        return Array.from({ length: count }, (_, i) =>
          i < coldPositions
            ? coldDigits[secureRandomInt(0, coldDigits.length - 1)]
            : secureRandomInt(0, 9)
        );
      }
      case "balanced": {
        // 2 hot, 1 cold, 1 random
        const hotCount = Math.max(1, Math.floor(count * 0.4));
        const coldCount = Math.max(1, Math.floor(count * 0.4));
        const result: number[] = [];
        for (let i = 0; i < hotCount; i++) result.push(hotDigits[secureRandomInt(0, hotDigits.length - 1)]);
        for (let i = 0; i < coldCount; i++) result.push(coldDigits[secureRandomInt(0, coldDigits.length - 1)]);
        while (result.length < count) result.push(secureRandomInt(0, 9));
        return result;
      }
      case "frequency": {
        // Weighted: hot digits 3x, neutral 2x, cold 1x
        const weights = Array.from({ length: 10 }, (_, d) => {
          if (hotDigits.includes(d)) return 3;
          if (coldDigits.includes(d)) return 1;
          return 2;
        });
        return generateDigitsWeighted(count, weights);
      }
      case "random":
      default:
        return generateDigits(count);
    }
  };

  // --- Pool mode strategies (unique numbers from 1-maxNumber) ---
  const generatePoolStrategy = (strategy: Strategy, config: NumberConfig): number[] => {
    const hotNumbers = [23, 36, 39, 21, 32, 16, 38, 18, 10, 42].filter((n) => n <= config.maxNumber);
    const allColdNumbers = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 50, 51, 52];
    const coldNumbers = allColdNumbers.filter((n) => n <= config.maxNumber);
    const coldPool = coldNumbers.length >= 3
      ? coldNumbers
      : Array.from({ length: Math.min(10, config.maxNumber) }, (_, i) => config.maxNumber - i);

    switch (strategy) {
      case "ultimate": {
        const hotCount = Math.min(
          secureRandomInt(Math.ceil(config.count * 0.6), Math.ceil(config.count * 0.7)),
          hotNumbers.length
        );
        const numbers = pickFromPool(hotCount, hotNumbers);
        while (numbers.length < config.count) {
          const num = secureRandomInt(1, config.maxNumber);
          if (!numbers.includes(num)) numbers.push(num);
        }
        return numbers;
      }
      case "hot": {
        const hotCount = Math.min(
          secureRandomInt(Math.ceil(config.count * 0.8), config.count),
          hotNumbers.length
        );
        const numbers = pickFromPool(hotCount, hotNumbers);
        while (numbers.length < config.count) {
          const num = secureRandomInt(1, config.maxNumber);
          if (!numbers.includes(num)) numbers.push(num);
        }
        return numbers;
      }
      case "cold": {
        const coldCount = Math.min(
          secureRandomInt(Math.ceil(config.count * 0.8), config.count),
          coldPool.length
        );
        const numbers = pickFromPool(coldCount, coldPool);
        while (numbers.length < config.count) {
          const num = secureRandomInt(1, config.maxNumber);
          if (!numbers.includes(num)) numbers.push(num);
        }
        return numbers;
      }
      case "balanced": {
        const hc = Math.max(1, Math.floor(config.count * 0.4));
        const cc = Math.max(1, Math.floor(config.count * 0.4));
        let numbers = pickFromPool(hc, hotNumbers);
        numbers = pickFromPool(cc, coldPool, numbers);
        while (numbers.length < config.count) {
          const num = secureRandomInt(1, config.maxNumber);
          if (!numbers.includes(num)) numbers.push(num);
        }
        return numbers;
      }
      case "frequency": {
        const threshold60 = Math.floor(config.maxNumber * 0.58);
        const threshold85 = Math.floor(config.maxNumber * 0.87);
        const weights = Array.from({ length: config.maxNumber }, (_, i) => {
          const num = i + 1;
          if (num <= threshold60) return 3;
          if (num <= threshold85) return 2;
          return 1;
        });
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const numbers: number[] = [];
        while (numbers.length < config.count) {
          const rand = secureRandom() * totalWeight;
          let sum = 0;
          for (let i = 0; i < weights.length; i++) {
            sum += weights[i];
            if (rand <= sum) {
              const num = i + 1;
              if (!numbers.includes(num)) numbers.push(num);
              break;
            }
          }
        }
        return numbers;
      }
      case "random":
      default:
        return pickUnique(config.count, 1, config.maxNumber);
    }
  };

  const analyzeNumbers = (whiteBalls: number[], powerball: number | null, config: NumberConfig) => {
    const isDigitMode = config.mode === "digits";
    const poolHot = [23, 36, 39, 21, 32, 16, 38, 18, 10, 42];
    const poolCold = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69];

    const hotCount = isDigitMode
      ? whiteBalls.filter((n) => hotDigits.includes(n)).length
      : whiteBalls.filter((n) => poolHot.includes(n)).length;
    const coldCount = isDigitMode
      ? whiteBalls.filter((n) => coldDigits.includes(n)).length
      : whiteBalls.filter((n) => poolCold.includes(n)).length;
    const neutralCount = whiteBalls.length - hotCount - coldCount;
    const sum = whiteBalls.reduce((a, b) => a + b, 0);
    const evenCount = whiteBalls.filter((n) => n % 2 === 0).length;

    let powerballStatus = "none";
    if (powerball !== null) {
      powerballStatus = "neutral";
      if ([24, 18, 6, 20, 21].includes(powerball)) powerballStatus = "hot";
      if ([8, 9, 12, 15, 25].includes(powerball)) powerballStatus = "cold";
    }
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
      <GenerationEffects trigger={showFireworks} type={strategyEffects[selectedStrategy]} />
      
      {/* Global Counter */}
      {globalCount !== null && (
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{globalCount.toLocaleString()}</span> lucky numbers generated worldwide
          </span>
        </div>
      )}
      
      {/* Number Count Selector */}
      <div className="flex justify-center">
        <div className="inline-flex items-center bg-card/60 border border-border/50 rounded-full p-1 gap-0.5">
          {NUMBER_CONFIGS.map((config) => (
            <button
              key={config.label}
              onClick={() => {
                setNumberConfig(config);
                setGeneratedNumbers(null);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                numberConfig.label === config.label
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Strategy Selection - Clean mobile optimized grid */}
      <div className="grid grid-cols-3 sm:flex sm:flex-wrap sm:justify-center gap-1.5 sm:gap-2 px-1 sm:px-0">
        {strategies.map((strategy) => {
          const Icon = strategy.icon;
          const isSelected = selectedStrategy === strategy.id;
          return (
            <button
              key={strategy.id}
              onClick={() => setSelectedStrategy(strategy.id)}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-full text-base font-medium transition-all ${
                isSelected
                  ? `bg-gradient-to-r ${strategy.color} text-white shadow-lg`
                  : "bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50"
              }`}
            >
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="truncate">{strategy.name}</span>
            </button>
          );
        })}
      </div>

      {/* Generate Button - Clean with strategy icon */}
      <div className="text-center py-3 sm:py-4">
        <Button
          onClick={() => generateNumbers(selectedStrategy)}
          disabled={isGenerating}
          size="lg"
          className={`px-6 sm:px-8 py-5 sm:py-6 text-lg font-bold rounded-full transition-all shadow-xl ${
            isGenerating 
              ? "bg-muted text-muted-foreground" 
              : `bg-gradient-to-r ${selectedStrategyData?.color} text-white hover:scale-105 hover:shadow-2xl active:scale-95`
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              {selectedStrategy === "hot" && <Flame className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
              {selectedStrategy === "cold" && <Snowflake className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
              {selectedStrategy === "ultimate" && <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
              {selectedStrategy === "balanced" && <Scale className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
              {selectedStrategy === "frequency" && <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
              {selectedStrategy === "random" && <Shuffle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
              Generate Numbers
            </>
          )}
        </Button>
      </div>

      {/* Number Balls Display - Always visible */}
      <div>
        {generatedNumbers && (
          <div className="text-center mb-3 sm:mb-4">
            <span className="text-base text-muted-foreground uppercase tracking-wider">
              {generatedNumbers.strategy} Strategy
            </span>
          </div>
        )}

        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-2">
          {Array.from({ length: numberConfig.count }, (_, idx) => (
            <NumberBall
              key={idx}
              number={generatedNumbers?.whiteBalls[idx] ?? null}
              variant="white"
              delay={idx * 150}
              isLoading={isGenerating}
              maxNumber={numberConfig.maxNumber}
            />
          ))}
          {numberConfig.bonusMax > 0 && (
            <>
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-muted-foreground/50 mx-0.5 sm:mx-1" />
              <NumberBall
                number={generatedNumbers?.powerball ?? null}
                variant="power"
                delay={numberConfig.count * 150}
                isLoading={isGenerating}
                maxNumber={numberConfig.bonusMax}
              />
            </>
          )}
        </div>

        {/* Analysis Row - Only show when we have numbers */}
        {generatedNumbers && (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-4 sm:mb-6 px-4">
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
              E/O: <span className="text-foreground font-medium">{generatedNumbers.analysis.evenCount}/{generatedNumbers.whiteBalls.length - generatedNumbers.analysis.evenCount}</span>
            </span>
            {generatedNumbers.analysis.powerballStatus !== "none" && (
              <span>
                PB: <span className={`font-medium ${
                  generatedNumbers.analysis.powerballStatus === 'hot' ? 'text-red-400' :
                  generatedNumbers.analysis.powerballStatus === 'cold' ? 'text-blue-400' : 'text-foreground'
                }`}>{generatedNumbers.analysis.powerballStatus}</span>
              </span>
            )}
          </div>
        )}

        {generatedNumbers && (
          <div className="flex justify-center gap-1.5 sm:gap-2">
            <Button onClick={saveSet} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-base h-8 sm:h-9 px-3">
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
              Save
            </Button>
            <Button onClick={() => generateNumbers(selectedStrategy)} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-base h-8 sm:h-9 px-3">
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
              Again
            </Button>
          </div>
        )}
      </div>

      {/* Saved Sets - Compact */}
      {savedSets.length > 0 && (
        <div className="pt-4 sm:pt-6 border-t border-border/30">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <p className="text-sm text-muted-foreground">Saved Sets ({savedSets.length})</p>
            <button 
              onClick={clearAllSets}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {savedSets.map((set, idx) => (
              <div key={idx} className="flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 group">
                <span className="text-sm text-muted-foreground w-12 sm:w-16 text-right truncate">{set.strategy}</span>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {set.whiteBalls.map((num, i) => (
                    <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-white/90 to-white/70 flex items-center justify-center text-black text-sm font-bold shadow">
                      {num}
                    </div>
                  ))}
                  {set.powerball !== null && (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-sm font-bold shadow">
                      {set.powerball}
                    </div>
                  )}
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
