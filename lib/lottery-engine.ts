// =============================================================================
// Lottery Number Generation Engine
// =============================================================================
// Provides genuinely different algorithms for each generation strategy.
// Pool mode (Powerball/Mega Millions) uses weighted statistical sampling.
// Digit mode (Pick 3/Pick 4) uses pattern-based generation with digit biasing.
// =============================================================================

import {
  getHotNumbers,
  getColdNumbers,
  getNumbersByGap,
  getFrequencyWeights,
  getBonusBallWeights,
  classifyNumber,
  classifyBonusBall,
  DIGIT_GAME_DATA,
  type GameMode,
} from "./lottery-data";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type Strategy =
  | "ultimate"
  | "hot"
  | "cold"
  | "balanced"
  | "frequency"
  | "random";

export type { GameMode } from "./lottery-data";

export interface NumberConfig {
  count: number;
  min: number;
  max: number;
  bonusMin: number;
  bonusMax: number;
  mode: GameMode;
}

export interface GeneratedResult {
  numbers: number[];
  bonusBall: number | null;
  analysis: NumberAnalysis;
}

export interface NumberAnalysis {
  hotCount: number;
  coldCount: number;
  neutralCount: number;
  evenCount: number;
  oddCount: number;
  sum: number;
  pattern?: string;
  bonusBallStatus?: string;
  strategy: string;
  decadeCoverage?: number;
  sumQuality?: string;
}

// -----------------------------------------------------------------------------
// Crypto-quality RNG Utilities
// -----------------------------------------------------------------------------

export function secureRandom(): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }
  return Math.random();
}

export function secureRandomInt(min: number, max: number): number {
  return Math.floor(secureRandom() * (max - min + 1)) + min;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = secureRandomInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// -----------------------------------------------------------------------------
// Weighted Sampling Without Replacement
// -----------------------------------------------------------------------------
// Uses the standard "remove-and-renormalize" algorithm. On each draw the
// cumulative weight distribution is rebuilt from the remaining items,
// guaranteeing correct conditional probabilities.
// -----------------------------------------------------------------------------

export function weightedSampleWithoutReplacement(
  items: number[],
  weights: number[],
  count: number
): number[] {
  if (count >= items.length) return shuffle([...items]);

  const remainingItems = [...items];
  const remainingWeights = [...weights];
  const result: number[] = [];

  for (let picked = 0; picked < count; picked++) {
    const totalWeight = remainingWeights.reduce((s, w) => s + w, 0);
    if (totalWeight <= 0) {
      // Fallback: uniform random from remaining
      const idx = secureRandomInt(0, remainingItems.length - 1);
      result.push(remainingItems[idx]);
      remainingItems.splice(idx, 1);
      remainingWeights.splice(idx, 1);
      continue;
    }

    const rand = secureRandom() * totalWeight;
    let cumulative = 0;
    let selectedIdx = remainingItems.length - 1; // fallback

    for (let i = 0; i < remainingWeights.length; i++) {
      cumulative += remainingWeights[i];
      if (rand <= cumulative) {
        selectedIdx = i;
        break;
      }
    }

    result.push(remainingItems[selectedIdx]);
    remainingItems.splice(selectedIdx, 1);
    remainingWeights.splice(selectedIdx, 1);
  }

  return result;
}

// -----------------------------------------------------------------------------
// Helper: pick a unique set uniformly at random
// -----------------------------------------------------------------------------

function pickUnique(count: number, min: number, max: number): number[] {
  const numbers: number[] = [];
  while (numbers.length < count) {
    const num = secureRandomInt(min, max);
    if (!numbers.includes(num)) numbers.push(num);
  }
  return numbers;
}

// -----------------------------------------------------------------------------
// Pool Mode: Scoring Function (used by Ultimate AI)
// -----------------------------------------------------------------------------
// Returns a score from 0-100 evaluating a candidate number set against
// multiple statistical constraints simultaneously.
// -----------------------------------------------------------------------------

export function scoreSet(
  numbers: number[],
  config: NumberConfig
): number {
  let score = 0;
  const count = numbers.length;
  const sum = numbers.reduce((a, b) => a + b, 0);

  // 1. Sum quality (0-25 points)
  // Optimal range for PB/MM is roughly 95-195, with peak at 140-160
  const optimalMin = 140;
  const optimalMax = 160;
  const acceptableMin = 95;
  const acceptableMax = 195;

  if (sum >= optimalMin && sum <= optimalMax) {
    score += 25;
  } else if (sum >= acceptableMin && sum <= acceptableMax) {
    // Linear falloff from peak zone
    const distFromOptimal = Math.min(
      Math.abs(sum - optimalMin),
      Math.abs(sum - optimalMax)
    );
    score += Math.max(0, 25 - distFromOptimal * 0.5);
  }
  // Outside acceptable range: 0 points

  // 2. Even/odd ratio (0-20 points)
  // Ideal: 3:2 or 2:3 for a 5-number set
  const evenCount = numbers.filter((n) => n % 2 === 0).length;
  const oddCount = count - evenCount;
  const eoBalance = Math.abs(evenCount - oddCount);
  if (eoBalance <= 1) {
    score += 20; // 3:2 or 2:3
  } else if (eoBalance === 2) {
    score += 10; // 4:1 or 1:4
  }
  // 5:0 or 0:5: 0 points

  // 3. High/low split (0-15 points)
  // High = above midpoint, Low = at or below midpoint
  const midpoint = Math.floor((config.min + config.max) / 2);
  const highCount = numbers.filter((n) => n > midpoint).length;
  const hlBalance = Math.abs(highCount - (count - highCount));
  if (hlBalance <= 1) {
    score += 15;
  } else if (hlBalance === 2) {
    score += 7;
  }

  // 4. Decade coverage (0-15 points)
  // How many decade groups (1-9, 10-19, 20-29, ...) are represented
  const decades = new Set(numbers.map((n) => Math.floor((n - 1) / 10)));
  const decadeCoverage = decades.size;
  if (decadeCoverage >= 4) {
    score += 15;
  } else if (decadeCoverage === 3) {
    score += 10;
  } else if (decadeCoverage === 2) {
    score += 4;
  }

  // 5. No more than 2 consecutive numbers (0-10 points)
  const sorted = [...numbers].sort((a, b) => a - b);
  let maxConsecutive = 1;
  let currentRun = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      currentRun++;
      maxConsecutive = Math.max(maxConsecutive, currentRun);
    } else {
      currentRun = 1;
    }
  }
  if (maxConsecutive <= 2) {
    score += 10;
  } else if (maxConsecutive === 3) {
    score += 4;
  }
  // 4+ consecutive: 0 points

  // 6. Hot number preference (0-15 points)
  // Slight weight toward numbers classified as hot
  let hotCount = 0;
  for (const num of numbers) {
    const classification = classifyNumber(num, config.mode);
    if (classification === "hot") hotCount++;
  }
  // Ideal: 1-3 hot numbers out of 5
  if (hotCount >= 1 && hotCount <= 3) {
    score += 15;
  } else if (hotCount === 4) {
    score += 8;
  } else {
    score += 3; // 0 or 5 hot numbers is less ideal
  }

  return Math.min(100, score);
}

// -----------------------------------------------------------------------------
// Pool Mode Strategy Implementations
// -----------------------------------------------------------------------------

function generateUltimate(config: NumberConfig): number[] {
  const candidateCount = 50;
  let bestSet: number[] = [];
  let bestScore = -1;

  for (let i = 0; i < candidateCount; i++) {
    const candidate = pickUnique(config.count, config.min, config.max);
    const s = scoreSet(candidate, config);
    if (s > bestScore) {
      bestScore = s;
      bestSet = candidate;
    }
  }

  return bestSet;
}

function generateHot(config: NumberConfig): number[] {
  // Build items and softmax-style weights from recent frequency
  const hotNumbers = getHotNumbers(config.mode);
  const allNumbers: number[] = [];
  const allWeights: number[] = [];

  for (let n = config.min; n <= config.max; n++) {
    allNumbers.push(n);
    // Check if this number is in the hot list — give it boosted weight
    const hotEntry = hotNumbers.find((h) => h.number === n);
    const recentFreq = hotEntry ? hotEntry.recentFrequency : 1;
    // Softmax-style: weight = recentFrequency^2
    allWeights.push(recentFreq * recentFreq);
  }

  return weightedSampleWithoutReplacement(allNumbers, allWeights, config.count);
}

function generateCold(config: NumberConfig): number[] {
  // Weight proportional to gap^1.5 (due numbers)
  const gapNumbers = getNumbersByGap(config.mode);
  const allNumbers: number[] = [];
  const allWeights: number[] = [];

  for (let n = config.min; n <= config.max; n++) {
    allNumbers.push(n);
    const gapEntry = gapNumbers.find((g) => g.number === n);
    const gap = gapEntry ? gapEntry.gap : 1;
    allWeights.push(Math.pow(gap, 1.5));
  }

  return weightedSampleWithoutReplacement(allNumbers, allWeights, config.count);
}

function generateBalanced(config: NumberConfig): number[] {
  const maxAttempts = 100;
  const rangeSize = config.max - config.min + 1;
  const thirdSize = Math.floor(rangeSize / 3);
  const third1Max = config.min + thirdSize - 1;
  const third2Max = config.min + thirdSize * 2 - 1;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = pickUnique(config.count, config.min, config.max);
    const evenCount = candidate.filter((n) => n % 2 === 0).length;
    const sum = candidate.reduce((a, b) => a + b, 0);
    const midpoint = Math.floor((config.min + config.max) / 2);
    const upperCount = candidate.filter((n) => n > midpoint).length;

    // Hard constraints
    const evenOk = evenCount >= 2 && evenCount <= 3;
    const upperOk = upperCount >= 2 && upperCount <= 3;
    const sumOk = sum >= 100 && sum <= 190;
    const hasFirst = candidate.some((n) => n >= config.min && n <= third1Max);
    const hasSecond = candidate.some((n) => n > third1Max && n <= third2Max);
    const hasThird = candidate.some((n) => n > third2Max && n <= config.max);
    const thirdsOk = hasFirst && hasSecond && hasThird;

    if (evenOk && upperOk && sumOk && thirdsOk) {
      return candidate;
    }

    // After 50 attempts, relax sum constraint
    if (attempt >= 50 && evenOk && thirdsOk) {
      return candidate;
    }
  }

  // Final fallback: return last generated set
  return pickUnique(config.count, config.min, config.max);
}

function generateFrequency(config: NumberConfig): number[] {
  // True frequency-proportional: each number's probability = its historical
  // frequency / total drawings. A number that appeared in 12% of drawings
  // has exactly a 12% chance of selection.
  const freqWeights = getFrequencyWeights(config.mode);
  const allNumbers: number[] = [];
  const allWeights: number[] = [];

  for (let n = config.min; n <= config.max; n++) {
    allNumbers.push(n);
    const entry = freqWeights.find((f) => f.number === n);
    allWeights.push(entry ? entry.frequency : 1);
  }

  return weightedSampleWithoutReplacement(allNumbers, allWeights, config.count);
}

function generateRandomPool(config: NumberConfig): number[] {
  return pickUnique(config.count, config.min, config.max);
}

// -----------------------------------------------------------------------------
// Pool Mode: Bonus Ball Generation
// -----------------------------------------------------------------------------

function generateBonusBall(
  strategy: Strategy,
  config: NumberConfig
): number | null {
  if (config.bonusMax <= 0) return null;

  const min = config.bonusMin || 1;
  const max = config.bonusMax;

  switch (strategy) {
    case "ultimate": {
      // Weighted by recent frequency
      const bbWeights = getBonusBallWeights(config.mode);
      const items: number[] = [];
      const weights: number[] = [];
      for (let n = min; n <= max; n++) {
        items.push(n);
        const entry = bbWeights.find((b) => b.number === n);
        weights.push(entry ? entry.weight : 1);
      }
      return weightedSampleWithoutReplacement(items, weights, 1)[0];
    }
    case "hot": {
      // Pick from top 5 bonus balls by recent frequency
      const bbWeights = getBonusBallWeights(config.mode);
      const top5 = bbWeights
        .filter((b) => b.number >= min && b.number <= max)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 5);
      if (top5.length === 0) return secureRandomInt(min, max);
      return top5[secureRandomInt(0, top5.length - 1)].number;
    }
    case "cold": {
      // Pick from highest-gap bonus balls
      const bbWeights = getBonusBallWeights(config.mode);
      const sorted = bbWeights
        .filter((b) => b.number >= min && b.number <= max)
        .sort((a, b) => a.weight - b.weight); // lowest weight = least frequent = "coldest"
      const bottom5 = sorted.slice(0, 5);
      if (bottom5.length === 0) return secureRandomInt(min, max);
      return bottom5[secureRandomInt(0, bottom5.length - 1)].number;
    }
    case "frequency": {
      // Frequency-proportional
      const bbWeights = getBonusBallWeights(config.mode);
      const items: number[] = [];
      const weights: number[] = [];
      for (let n = min; n <= max; n++) {
        items.push(n);
        const entry = bbWeights.find((b) => b.number === n);
        weights.push(entry ? entry.frequency || entry.weight : 1);
      }
      return weightedSampleWithoutReplacement(items, weights, 1)[0];
    }
    case "balanced":
    case "random":
    default:
      return secureRandomInt(min, max);
  }
}

// -----------------------------------------------------------------------------
// Digit Mode Helpers
// -----------------------------------------------------------------------------

function pickDigit(biasPool?: number[], biasChance = 0.5): number {
  if (biasPool && secureRandom() < biasChance) {
    return biasPool[secureRandomInt(0, biasPool.length - 1)];
  }
  return secureRandomInt(0, 9);
}

function pickDifferentDigit(
  exclude: number[],
  biasPool?: number[],
  biasChance = 0.5
): number {
  for (let attempt = 0; attempt < 50; attempt++) {
    const d = pickDigit(biasPool, biasChance);
    if (!exclude.includes(d)) return d;
  }
  const available = Array.from({ length: 10 }, (_, i) => i).filter(
    (d) => !exclude.includes(d)
  );
  return available.length > 0
    ? available[secureRandomInt(0, available.length - 1)]
    : secureRandomInt(0, 9);
}

function pickPattern(count: number): string {
  const weights = DIGIT_GAME_DATA.patternWeights[count];
  if (!weights) return "single";

  const totalWeight = weights.reduce((s, [, w]) => s + w, 0);
  const rand = secureRandom() * totalWeight;
  let cumulative = 0;
  for (const [pattern, weight] of weights) {
    cumulative += weight;
    if (rand <= cumulative) return pattern;
  }
  return "single";
}

function generateByPattern(
  count: number,
  pattern: string,
  biasPool?: number[],
  biasChance = 0.5
): number[] {
  switch (pattern) {
    case "single": {
      const digits: number[] = [];
      digits.push(pickDigit(biasPool, biasChance));
      for (let i = 1; i < count; i++) {
        digits.push(pickDifferentDigit(digits, biasPool, biasChance));
      }
      return shuffle(digits);
    }
    case "double": {
      const pair = pickDigit(biasPool, biasChance);
      const singles: number[] = [];
      for (let i = 0; i < count - 2; i++) {
        singles.push(
          pickDifferentDigit([pair, ...singles], biasPool, biasChance)
        );
      }
      return shuffle([pair, pair, ...singles]);
    }
    case "doublePair": {
      const p1 = pickDigit(biasPool, biasChance);
      const p2 = pickDifferentDigit([p1], biasPool, biasChance);
      return shuffle([p1, p1, p2, p2]);
    }
    case "triple": {
      const tripleDigit = pickDigit(biasPool, biasChance);
      const others: number[] = [];
      for (let i = 0; i < count - 3; i++) {
        others.push(
          pickDifferentDigit([tripleDigit, ...others], biasPool, biasChance)
        );
      }
      return shuffle([tripleDigit, tripleDigit, tripleDigit, ...others]);
    }
    case "quad": {
      const d = pickDigit(biasPool, biasChance);
      return [d, d, d, d];
    }
    default:
      return Array.from({ length: count }, () => pickDigit());
  }
}

function generateWithSumTarget(
  count: number,
  generator: () => number[],
  maxAttempts = 20
): number[] {
  const targetSum = DIGIT_GAME_DATA.sumRanges[count];
  if (!targetSum) return generator();

  for (let i = 0; i < maxAttempts; i++) {
    const digits = generator();
    const sum = digits.reduce((a, b) => a + b, 0);
    if (sum >= targetSum.min && sum <= targetSum.max) return digits;
  }
  return generator(); // fallback
}

// -----------------------------------------------------------------------------
// Digit Mode Strategy Implementations
// -----------------------------------------------------------------------------

function generateDigitStrategy(
  strategy: Strategy,
  config: NumberConfig
): number[] {
  const count = config.count;
  const hotDigits = DIGIT_GAME_DATA.hotDigits;
  const coldDigits = DIGIT_GAME_DATA.coldDigits;
  const neutralDigits = DIGIT_GAME_DATA.neutralDigits;

  switch (strategy) {
    case "ultimate": {
      // Pattern-based + sum targeting + hot/neutral mix
      const mixPool = [...hotDigits, ...neutralDigits];
      return generateWithSumTarget(count, () => {
        const pattern = pickPattern(count);
        return generateByPattern(count, pattern, mixPool, 0.6);
      });
    }
    case "hot": {
      // Pattern-based, biased heavily toward hot digits
      return generateWithSumTarget(count, () => {
        const pattern = pickPattern(count);
        return generateByPattern(count, pattern, hotDigits, 0.8);
      });
    }
    case "cold": {
      // Pattern-based, biased toward cold digits
      // No sum targeting -- cold digits naturally produce lower sums
      const pattern = pickPattern(count);
      return generateByPattern(count, pattern, coldDigits, 0.8);
    }
    case "balanced": {
      // Pattern-based + strict sum targeting + balanced distribution
      const allDigits = [...hotDigits, ...coldDigits, ...neutralDigits];
      return generateWithSumTarget(count, () => {
        const pattern = pickPattern(count);
        return generateByPattern(count, pattern, allDigits, 0.4);
      });
    }
    case "frequency": {
      // Pattern-based + frequency-weighted digit selection
      const weightedPool = [
        ...hotDigits,
        ...hotDigits,
        ...hotDigits, // 3x weight
        ...neutralDigits,
        ...neutralDigits, // 2x weight
        ...coldDigits, // 1x weight
      ];
      return generateWithSumTarget(count, () => {
        const pattern = pickPattern(count);
        return generateByPattern(count, pattern, weightedPool, 0.7);
      });
    }
    case "random":
    default: {
      // Structurally realistic pattern distribution but no bias or sum filter
      const pattern = pickPattern(count);
      return generateByPattern(count, pattern);
    }
  }
}

// -----------------------------------------------------------------------------
// Pattern Detection (for digit games)
// -----------------------------------------------------------------------------

function detectPattern(digits: number[]): string {
  const freq: Record<number, number> = {};
  for (const d of digits) freq[d] = (freq[d] || 0) + 1;
  const counts = Object.values(freq).sort((a, b) => b - a);
  if (counts.length === 1) return "Quad";
  if (counts[0] === 3) return "Triple";
  if (counts.length === 2 && counts[0] === 2) return "Double Pair";
  if (counts[0] === 2) return "Double";
  return "Single";
}

// -----------------------------------------------------------------------------
// Analysis Function
// -----------------------------------------------------------------------------

function analyzeNumbers(
  numbers: number[],
  bonusBall: number | null,
  config: NumberConfig,
  strategyName: string
): NumberAnalysis {
  const isDigitMode = config.mode === "3pick" || config.mode === "4pick";
  const sum = numbers.reduce((a, b) => a + b, 0);
  const evenCount = numbers.filter((n) => n % 2 === 0).length;
  const oddCount = numbers.length - evenCount;

  // Classify each number as hot/cold/neutral via the data layer
  let hotCount = 0;
  let coldCount = 0;
  let neutralCount = 0;

  for (const num of numbers) {
    const classification = classifyNumber(num, config.mode);
    if (classification === "hot") hotCount++;
    else if (classification === "cold") coldCount++;
    else neutralCount++;
  }

  // Bonus ball status
  let bonusBallStatus: string | undefined;
  if (bonusBall !== null) {
    bonusBallStatus = classifyBonusBall(bonusBall, config.mode);
  }

  // Pattern detection for digit games
  const pattern = isDigitMode ? detectPattern(numbers) : undefined;

  // Decade coverage for pool games
  let decadeCoverage: number | undefined;
  if (!isDigitMode) {
    const decades = new Set(numbers.map((n) => Math.floor((n - 1) / 10)));
    decadeCoverage = decades.size;
  }

  // Sum quality assessment
  let sumQuality: string | undefined;
  if (isDigitMode) {
    const sumRange = DIGIT_GAME_DATA.sumRanges[config.count];
    if (sumRange) {
      sumQuality =
        sum >= sumRange.min && sum <= sumRange.max ? "optimal" : "outside range";
    }
  } else {
    // Pool game sum quality
    if (sum >= 140 && sum <= 160) {
      sumQuality = "optimal";
    } else if (sum >= 95 && sum <= 195) {
      sumQuality = "good";
    } else {
      sumQuality = "outside range";
    }
  }

  return {
    hotCount,
    coldCount,
    neutralCount,
    evenCount,
    oddCount,
    sum,
    pattern,
    bonusBallStatus,
    strategy: strategyName,
    decadeCoverage,
    sumQuality,
  };
}

// -----------------------------------------------------------------------------
// Strategy Name Mapping
// -----------------------------------------------------------------------------

const STRATEGY_NAMES: Record<Strategy, string> = {
  ultimate: "Ultimate AI",
  hot: "Super Hot",
  cold: "Contrarian",
  balanced: "Balanced",
  frequency: "Frequency",
  random: "Random",
};

// -----------------------------------------------------------------------------
// Main Generation Function
// -----------------------------------------------------------------------------

export function generateNumbers(
  strategy: Strategy,
  config: NumberConfig,
  setCount: number
): GeneratedResult[] {
  const isDigitMode = config.mode === "3pick" || config.mode === "4pick";
  const strategyName = STRATEGY_NAMES[strategy] || strategy;
  const results: GeneratedResult[] = [];

  for (let i = 0; i < setCount; i++) {
    let numbers: number[];

    if (isDigitMode) {
      numbers = generateDigitStrategy(strategy, config);
    } else {
      numbers = generatePoolStrategy(strategy, config);
    }

    // Sort pool mode numbers ascending; digit mode keeps generation order
    if (!isDigitMode) {
      numbers.sort((a, b) => a - b);
    }

    const bonusBall = isDigitMode
      ? null
      : generateBonusBall(strategy, config);

    const analysis = analyzeNumbers(numbers, bonusBall, config, strategyName);

    results.push({ numbers, bonusBall, analysis });
  }

  return results;
}

// -----------------------------------------------------------------------------
// Pool Mode Strategy Dispatcher
// -----------------------------------------------------------------------------

function generatePoolStrategy(
  strategy: Strategy,
  config: NumberConfig
): number[] {
  switch (strategy) {
    case "ultimate":
      return generateUltimate(config);
    case "hot":
      return generateHot(config);
    case "cold":
      return generateCold(config);
    case "balanced":
      return generateBalanced(config);
    case "frequency":
      return generateFrequency(config);
    case "random":
    default:
      return generateRandomPool(config);
  }
}
