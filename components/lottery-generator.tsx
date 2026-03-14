"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NumberBall } from "@/components/number-ball";
import { GenerationEffects } from "@/components/generation-effects";
import { Sparkles, Flame, Snowflake, Scale, TrendingUp, Shuffle, Save, RefreshCw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  generateNumbers as engineGenerate,
  type Strategy,
  type GeneratedResult,
  type NumberConfig as EngineNumberConfig,
} from "@/lib/lottery-engine";

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

// Component-level config for UI display and game selection
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
  { mode: "digits", count: 3, maxNumber: 9, bonusMax: 0, allowRepeats: true, label: "3 Pick" },
  { mode: "digits", count: 4, maxNumber: 9, bonusMax: 0, allowRepeats: true, label: "4 Pick" },
  { mode: "pool", count: 5, maxNumber: 69, bonusMax: 26, allowRepeats: false, label: "5 PB" },
  { mode: "pool", count: 5, maxNumber: 70, bonusMax: 25, allowRepeats: false, label: "5 MM" },
];

const DEFAULT_CONFIG = NUMBER_CONFIGS[2]; // 5 PB (current behavior)

const SET_COUNT_OPTIONS = [1, 3, 5, 10];

// Map component config to engine config
function toEngineConfig(config: NumberConfig): EngineNumberConfig {
  switch (config.label) {
    case "3 Pick":
      return { count: 3, min: 0, max: 9, bonusMin: 0, bonusMax: 0, mode: "3pick" };
    case "4 Pick":
      return { count: 4, min: 0, max: 9, bonusMin: 0, bonusMax: 0, mode: "4pick" };
    case "5 PB":
      return { count: 5, min: 1, max: 69, bonusMin: 1, bonusMax: 26, mode: "5pb" };
    case "5 MM":
      return { count: 5, min: 1, max: 70, bonusMin: 1, bonusMax: 25, mode: "5mm" };
    default:
      return { count: config.count, min: config.mode === "digits" ? 0 : 1, max: config.maxNumber, bonusMin: config.bonusMax > 0 ? 1 : 0, bonusMax: config.bonusMax, mode: "5pb" };
  }
}

// Map engine result to component's display format
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
    pattern?: string;
    sumInRange?: boolean;
    decadeCoverage?: number;
    sumQuality?: string;
  };
}

function toGeneratedNumbers(result: GeneratedResult, config: NumberConfig): GeneratedNumbers {
  const analysis = result.analysis;
  return {
    whiteBalls: result.numbers,
    powerball: result.bonusBall,
    strategy: analysis.strategy,
    numberConfig: config,
    analysis: {
      hotCount: analysis.hotCount,
      coldCount: analysis.coldCount,
      neutralCount: analysis.neutralCount,
      powerballStatus: analysis.bonusBallStatus ?? "none",
      sum: analysis.sum,
      evenCount: analysis.evenCount,
      pattern: analysis.pattern,
      sumInRange: analysis.sumQuality === "optimal",
      decadeCoverage: analysis.decadeCoverage,
      sumQuality: analysis.sumQuality,
    },
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
  const [setCount, setSetCount] = useState(1);
  const [generatedSets, setGeneratedSets] = useState<GeneratedNumbers[]>([]);

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
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setGlobalCount(data.count))
      .catch(() => {});

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

  const handleGenerate = (strategy: Strategy) => {
    setIsGenerating(true);
    setGeneratedSets([]);
    setShowFireworks(false);

    setTimeout(async () => {
      const engineConfig = toEngineConfig(numberConfig);
      const results = engineGenerate(strategy, engineConfig, setCount);

      const sets = results.map((r) => toGeneratedNumbers(r, numberConfig));
      setGeneratedNumbers(sets[0]);
      setGeneratedSets(sets.length > 1 ? sets.slice(1) : []);
      setIsGenerating(false);
      setShowFireworks(true);

      // Increment global counter
      try {
        const res = await fetch("/api/counter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ increment: setCount }),
        });
        if (res.ok) {
          const data = await res.json();
          setGlobalCount(data.count);
        }
      } catch {
      }

      // Reset fireworks after animation
      setTimeout(() => setShowFireworks(false), 2000);
    }, 1500);
  };

  const saveSet = () => {
    if (generatedNumbers) {
      const allSets = [generatedNumbers, ...generatedSets];
      setSavedSets([...savedSets, ...allSets]);
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

  const strategyGlowColors: Record<Strategy, string> = {
    ultimate: "rgba(139, 92, 246, 0.5)",
    hot: "rgba(239, 68, 68, 0.5)",
    cold: "rgba(59, 130, 246, 0.5)",
    balanced: "rgba(34, 197, 94, 0.5)",
    frequency: "rgba(168, 85, 247, 0.5)",
    random: "rgba(148, 163, 184, 0.4)",
  };

  return (
    <>
      <GenerationEffects trigger={showFireworks} type={strategyEffects[selectedStrategy]} />
    <div className="flex flex-col gap-4">
      {/* Global Counter - reserves space to prevent layout shift */}
      <div className="text-center min-h-[20px]">
        <span className={`text-sm text-muted-foreground transition-opacity ${globalCount !== null ? 'opacity-100' : 'opacity-0'}`}>
          <span className="font-semibold text-foreground">{(globalCount ?? 0).toLocaleString()}</span> lucky numbers generated worldwide
        </span>
      </div>

      {/* Game Mode + Set Count — combined row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Game</span>
          <div className="inline-flex items-center bg-card/60 border border-border/50 rounded-full p-1 gap-0.5">
            {NUMBER_CONFIGS.map((config) => (
              <button
                key={config.label}
                onClick={() => {
                  setNumberConfig(config);
                  setGeneratedNumbers(null);
                  setGeneratedSets([]);
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
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
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Sets</span>
          <div className="inline-flex items-center bg-card/60 border border-border/50 rounded-full p-1 gap-0.5">
            {SET_COUNT_OPTIONS.map((count) => (
              <button
                key={count}
                onClick={() => setSetCount(count)}
                className={`w-8 h-7 rounded-full text-xs font-medium transition-all ${
                  setCount === count
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
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
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-1.5 rounded-full text-sm font-medium transition-all ${
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

      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={() => handleGenerate(selectedStrategy)}
          disabled={isGenerating}
          size="lg"
          className={`px-6 sm:px-8 py-5 sm:py-6 text-lg font-bold rounded-full transition-all shadow-xl ${
            isGenerating
              ? "bg-muted text-muted-foreground"
              : `bg-gradient-to-r ${selectedStrategyData?.color} text-white hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98] animate-btn-pulse-glow`
          }`}
          style={{ "--btn-glow-color": strategyGlowColors[selectedStrategy] } as React.CSSProperties}
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

      {/* Number Balls Display - Always visible, stable layout */}
      <div>
        <div className="text-center mb-3 sm:mb-4 min-h-[24px]">
          <AnimatePresence mode="wait">
            {generatedNumbers && !isGenerating && (
              <motion.span
                key={generatedNumbers.strategy}
                className="text-base text-muted-foreground uppercase tracking-wider inline-block"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
              >
                {generatedNumbers.strategy} Strategy
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-2">
          {Array.from({ length: numberConfig.count }, (_, idx) => (
            <NumberBall
              key={idx}
              number={generatedNumbers?.whiteBalls[idx] ?? null}
              variant="white"
              delay={idx * 150}
              isLoading={isGenerating}
              maxNumber={numberConfig.maxNumber}
              effect={selectedStrategy}
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
                effect={selectedStrategy}
              />
            </>
          )}
        </div>

        {/* Analysis Row */}
        <div className="min-h-[20px] mb-4 sm:mb-6 px-4">
          <AnimatePresence mode="wait">
            {generatedNumbers && !isGenerating && (
              <motion.div
                key={`analysis-${generatedNumbers.analysis.sum}`}
                className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <span>
                  <span className="text-red-400 font-medium font-mono">{generatedNumbers.analysis.hotCount}</span> hot
                </span>
                <span>
                  <span className="text-blue-400 font-medium font-mono">{generatedNumbers.analysis.coldCount}</span> cold
                </span>
                <span>
                  Sum: <span className={`font-medium font-mono ${
                    generatedNumbers.analysis.sumInRange === true ? 'text-green-400' :
                    generatedNumbers.analysis.sumQuality === 'good' ? 'text-foreground' :
                    generatedNumbers.analysis.sumInRange === false ? 'text-yellow-400' : 'text-foreground'
                  }`}>{generatedNumbers.analysis.sum}</span>
                  {generatedNumbers.analysis.sumInRange === true && <span className="text-green-400 ml-0.5" title="In optimal range">&#10003;</span>}
                </span>
                {generatedNumbers.analysis.pattern && (
                  <span>
                    Pattern: <span className="text-foreground font-medium">{generatedNumbers.analysis.pattern}</span>
                  </span>
                )}
                {!generatedNumbers.analysis.pattern && (
                  <span>
                    E/O: <span className="text-foreground font-medium">{generatedNumbers.analysis.evenCount}/{generatedNumbers.whiteBalls.length - generatedNumbers.analysis.evenCount}</span>
                  </span>
                )}
                {generatedNumbers.analysis.decadeCoverage !== undefined && (
                  <span>
                    Decades: <span className="text-foreground font-medium font-mono">{generatedNumbers.analysis.decadeCoverage}</span>
                  </span>
                )}
                {generatedNumbers.analysis.powerballStatus !== "none" && (
                  <span>
                    PB: <span className={`font-medium ${
                      generatedNumbers.analysis.powerballStatus === 'hot' ? 'text-red-400' :
                      generatedNumbers.analysis.powerballStatus === 'cold' ? 'text-blue-400' : 'text-foreground'
                    }`}>{generatedNumbers.analysis.powerballStatus}</span>
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Save/Again buttons */}
        <div className="min-h-[36px]">
          <AnimatePresence>
            {generatedNumbers && !isGenerating && (
              <motion.div
                className="flex justify-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, delay: 0.3 }}
              >
                <Button onClick={saveSet} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-base h-8 sm:h-9 px-3">
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                  {generatedSets.length > 0 ? `Save All (${1 + generatedSets.length})` : "Save"}
                </Button>
                <Button onClick={() => handleGenerate(selectedStrategy)} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-base h-8 sm:h-9 px-3">
                  <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                  Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Extra sets from multi-set generation */}
        {generatedSets.length > 0 && (
          <div className="space-y-1.5 mt-3 pt-3 border-t border-border/20">
            {generatedSets.map((set, idx) => (
              <div key={idx} className="flex items-center justify-center gap-1.5 sm:gap-2 py-1">
                <span className="text-xs text-muted-foreground w-6 text-right">#{idx + 2}</span>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {set.whiteBalls.map((num, i) => (
                    <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-white/90 to-white/70 flex items-center justify-center text-black text-xs sm:text-sm font-bold shadow">
                      {num}
                    </div>
                  ))}
                  {set.powerball !== null && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow">
                      {set.powerball}
                    </div>
                  )}
                </div>
                {set.analysis.pattern && (
                  <span className="text-xs text-muted-foreground">{set.analysis.pattern}</span>
                )}
              </div>
            ))}
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
              <div key={idx} className="flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 group hover:bg-card/30 rounded-lg">
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
    </>
  );
}
