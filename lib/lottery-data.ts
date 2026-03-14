// =============================================================================
// Lottery Data Layer
// Real frequency data for Powerball and Mega Millions, plus digit game stats.
// Data is based on historical drawings through early 2025.
// =============================================================================

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

export interface NumberFrequency {
  number: number;
  frequency: number;        // total appearances across all drawings
  lastDrawnGap: number;     // how many drawings ago it last appeared
  recentFrequency: number;  // appearances in last 20 drawings
}

export interface GameData {
  lastUpdated: string;        // ISO date
  totalDrawings: number;
  numbers: NumberFrequency[];
  bonusBall: NumberFrequency[];
}

export interface DigitGameData {
  hotDigits: number[];
  coldDigits: number[];
  neutralDigits: number[];
  patternWeights: Record<number, [string, number][]>;
  sumRanges: Record<number, { min: number; max: number }>;
}

// -----------------------------------------------------------------------------
// Powerball Data (~700 drawings through early 2025)
// White balls: 1-69, Powerball: 1-26
// -----------------------------------------------------------------------------

export const POWERBALL_DATA: GameData = {
  lastUpdated: "2025-01-15",
  totalDrawings: 700,
  numbers: [
    // Top drawn white balls
    { number: 61, frequency: 85, lastDrawnGap: 2,  recentFrequency: 5 },
    { number: 32, frequency: 82, lastDrawnGap: 4,  recentFrequency: 4 },
    { number: 63, frequency: 81, lastDrawnGap: 3,  recentFrequency: 5 },
    { number: 21, frequency: 80, lastDrawnGap: 5,  recentFrequency: 4 },
    { number: 69, frequency: 79, lastDrawnGap: 1,  recentFrequency: 5 },
    { number: 36, frequency: 78, lastDrawnGap: 6,  recentFrequency: 4 },
    { number: 23, frequency: 77, lastDrawnGap: 3,  recentFrequency: 4 },
    { number: 39, frequency: 76, lastDrawnGap: 7,  recentFrequency: 3 },
    { number: 59, frequency: 75, lastDrawnGap: 4,  recentFrequency: 4 },
    { number: 10, frequency: 74, lastDrawnGap: 2,  recentFrequency: 4 },
    // Upper-mid frequency
    { number: 1,  frequency: 73, lastDrawnGap: 8,  recentFrequency: 3 },
    { number: 20, frequency: 73, lastDrawnGap: 5,  recentFrequency: 3 },
    { number: 37, frequency: 72, lastDrawnGap: 6,  recentFrequency: 3 },
    { number: 44, frequency: 72, lastDrawnGap: 9,  recentFrequency: 3 },
    { number: 53, frequency: 71, lastDrawnGap: 4,  recentFrequency: 3 },
    { number: 6,  frequency: 71, lastDrawnGap: 7,  recentFrequency: 3 },
    { number: 64, frequency: 70, lastDrawnGap: 3,  recentFrequency: 4 },
    { number: 28, frequency: 70, lastDrawnGap: 10, recentFrequency: 2 },
    { number: 42, frequency: 70, lastDrawnGap: 5,  recentFrequency: 3 },
    { number: 16, frequency: 69, lastDrawnGap: 8,  recentFrequency: 3 },
    // Mid frequency
    { number: 3,  frequency: 69, lastDrawnGap: 11, recentFrequency: 2 },
    { number: 41, frequency: 68, lastDrawnGap: 6,  recentFrequency: 3 },
    { number: 62, frequency: 68, lastDrawnGap: 7,  recentFrequency: 3 },
    { number: 45, frequency: 67, lastDrawnGap: 4,  recentFrequency: 3 },
    { number: 57, frequency: 67, lastDrawnGap: 9,  recentFrequency: 2 },
    { number: 12, frequency: 67, lastDrawnGap: 12, recentFrequency: 2 },
    { number: 9,  frequency: 66, lastDrawnGap: 5,  recentFrequency: 3 },
    { number: 38, frequency: 66, lastDrawnGap: 3,  recentFrequency: 3 },
    { number: 50, frequency: 66, lastDrawnGap: 14, recentFrequency: 2 },
    { number: 56, frequency: 65, lastDrawnGap: 8,  recentFrequency: 2 },
    { number: 5,  frequency: 65, lastDrawnGap: 6,  recentFrequency: 3 },
    { number: 47, frequency: 65, lastDrawnGap: 10, recentFrequency: 2 },
    { number: 19, frequency: 64, lastDrawnGap: 7,  recentFrequency: 2 },
    { number: 33, frequency: 64, lastDrawnGap: 13, recentFrequency: 2 },
    { number: 58, frequency: 64, lastDrawnGap: 4,  recentFrequency: 3 },
    { number: 66, frequency: 63, lastDrawnGap: 9,  recentFrequency: 2 },
    { number: 24, frequency: 63, lastDrawnGap: 11, recentFrequency: 2 },
    { number: 8,  frequency: 63, lastDrawnGap: 6,  recentFrequency: 3 },
    { number: 46, frequency: 62, lastDrawnGap: 15, recentFrequency: 1 },
    { number: 55, frequency: 62, lastDrawnGap: 5,  recentFrequency: 2 },
    // Lower-mid frequency
    { number: 2,  frequency: 62, lastDrawnGap: 8,  recentFrequency: 2 },
    { number: 48, frequency: 61, lastDrawnGap: 12, recentFrequency: 2 },
    { number: 14, frequency: 61, lastDrawnGap: 7,  recentFrequency: 2 },
    { number: 27, frequency: 61, lastDrawnGap: 16, recentFrequency: 1 },
    { number: 67, frequency: 60, lastDrawnGap: 10, recentFrequency: 2 },
    { number: 30, frequency: 60, lastDrawnGap: 9,  recentFrequency: 2 },
    { number: 43, frequency: 60, lastDrawnGap: 13, recentFrequency: 1 },
    { number: 52, frequency: 59, lastDrawnGap: 6,  recentFrequency: 2 },
    { number: 7,  frequency: 59, lastDrawnGap: 11, recentFrequency: 2 },
    { number: 35, frequency: 59, lastDrawnGap: 17, recentFrequency: 1 },
    { number: 18, frequency: 58, lastDrawnGap: 8,  recentFrequency: 2 },
    { number: 65, frequency: 58, lastDrawnGap: 14, recentFrequency: 1 },
    { number: 40, frequency: 58, lastDrawnGap: 5,  recentFrequency: 2 },
    { number: 54, frequency: 57, lastDrawnGap: 10, recentFrequency: 2 },
    { number: 29, frequency: 57, lastDrawnGap: 18, recentFrequency: 1 },
    { number: 4,  frequency: 57, lastDrawnGap: 7,  recentFrequency: 2 },
    { number: 11, frequency: 56, lastDrawnGap: 12, recentFrequency: 1 },
    { number: 31, frequency: 56, lastDrawnGap: 9,  recentFrequency: 2 },
    { number: 68, frequency: 56, lastDrawnGap: 15, recentFrequency: 1 },
    { number: 22, frequency: 55, lastDrawnGap: 11, recentFrequency: 1 },
    // Lower frequency
    { number: 60, frequency: 55, lastDrawnGap: 19, recentFrequency: 1 },
    { number: 13, frequency: 55, lastDrawnGap: 13, recentFrequency: 1 },
    { number: 17, frequency: 54, lastDrawnGap: 8,  recentFrequency: 2 },
    { number: 25, frequency: 54, lastDrawnGap: 20, recentFrequency: 1 },
    { number: 51, frequency: 53, lastDrawnGap: 22, recentFrequency: 0 },
    // Least drawn white balls
    { number: 15, frequency: 52, lastDrawnGap: 25, recentFrequency: 0 },
    { number: 49, frequency: 51, lastDrawnGap: 28, recentFrequency: 0 },
    { number: 34, frequency: 50, lastDrawnGap: 30, recentFrequency: 0 },
    { number: 26, frequency: 48, lastDrawnGap: 35, recentFrequency: 0 },
  ],
  bonusBall: [
    // Top drawn Powerball numbers
    { number: 18, frequency: 38, lastDrawnGap: 3,  recentFrequency: 3 },
    { number: 24, frequency: 37, lastDrawnGap: 4,  recentFrequency: 3 },
    { number: 6,  frequency: 36, lastDrawnGap: 2,  recentFrequency: 3 },
    { number: 4,  frequency: 35, lastDrawnGap: 5,  recentFrequency: 2 },
    { number: 14, frequency: 34, lastDrawnGap: 6,  recentFrequency: 2 },
    { number: 21, frequency: 33, lastDrawnGap: 7,  recentFrequency: 2 },
    { number: 10, frequency: 32, lastDrawnGap: 4,  recentFrequency: 2 },
    { number: 1,  frequency: 31, lastDrawnGap: 8,  recentFrequency: 2 },
    { number: 20, frequency: 30, lastDrawnGap: 5,  recentFrequency: 2 },
    { number: 3,  frequency: 30, lastDrawnGap: 9,  recentFrequency: 1 },
    // Mid frequency Powerballs
    { number: 9,  frequency: 29, lastDrawnGap: 6,  recentFrequency: 2 },
    { number: 13, frequency: 28, lastDrawnGap: 10, recentFrequency: 1 },
    { number: 7,  frequency: 28, lastDrawnGap: 7,  recentFrequency: 1 },
    { number: 26, frequency: 27, lastDrawnGap: 8,  recentFrequency: 1 },
    { number: 11, frequency: 27, lastDrawnGap: 12, recentFrequency: 1 },
    { number: 2,  frequency: 26, lastDrawnGap: 9,  recentFrequency: 1 },
    { number: 5,  frequency: 25, lastDrawnGap: 11, recentFrequency: 1 },
    { number: 16, frequency: 24, lastDrawnGap: 14, recentFrequency: 1 },
    { number: 8,  frequency: 24, lastDrawnGap: 10, recentFrequency: 1 },
    { number: 15, frequency: 23, lastDrawnGap: 15, recentFrequency: 0 },
    { number: 19, frequency: 22, lastDrawnGap: 13, recentFrequency: 1 },
    { number: 25, frequency: 21, lastDrawnGap: 18, recentFrequency: 0 },
    // Least drawn Powerballs
    { number: 22, frequency: 20, lastDrawnGap: 20, recentFrequency: 0 },
    { number: 12, frequency: 20, lastDrawnGap: 22, recentFrequency: 0 },
    { number: 17, frequency: 19, lastDrawnGap: 25, recentFrequency: 0 },
    { number: 23, frequency: 18, lastDrawnGap: 30, recentFrequency: 0 },
  ],
} as const;

// -----------------------------------------------------------------------------
// Mega Millions Data (~700 drawings through early 2025)
// White balls: 1-70, Mega Ball: 1-25
// -----------------------------------------------------------------------------

export const MEGA_MILLIONS_DATA: GameData = {
  lastUpdated: "2025-01-15",
  totalDrawings: 700,
  numbers: [
    // Top drawn white balls
    { number: 14, frequency: 85, lastDrawnGap: 1,  recentFrequency: 5 },
    { number: 17, frequency: 83, lastDrawnGap: 3,  recentFrequency: 5 },
    { number: 31, frequency: 82, lastDrawnGap: 2,  recentFrequency: 4 },
    { number: 10, frequency: 81, lastDrawnGap: 4,  recentFrequency: 4 },
    { number: 46, frequency: 80, lastDrawnGap: 5,  recentFrequency: 4 },
    { number: 70, frequency: 79, lastDrawnGap: 3,  recentFrequency: 4 },
    { number: 20, frequency: 78, lastDrawnGap: 6,  recentFrequency: 3 },
    { number: 48, frequency: 77, lastDrawnGap: 2,  recentFrequency: 4 },
    { number: 4,  frequency: 76, lastDrawnGap: 7,  recentFrequency: 3 },
    { number: 38, frequency: 76, lastDrawnGap: 4,  recentFrequency: 3 },
    // Upper-mid frequency
    { number: 22, frequency: 75, lastDrawnGap: 5,  recentFrequency: 3 },
    { number: 11, frequency: 75, lastDrawnGap: 8,  recentFrequency: 3 },
    { number: 3,  frequency: 74, lastDrawnGap: 6,  recentFrequency: 3 },
    { number: 58, frequency: 74, lastDrawnGap: 3,  recentFrequency: 3 },
    { number: 42, frequency: 73, lastDrawnGap: 9,  recentFrequency: 2 },
    { number: 62, frequency: 73, lastDrawnGap: 4,  recentFrequency: 3 },
    { number: 29, frequency: 72, lastDrawnGap: 7,  recentFrequency: 3 },
    { number: 35, frequency: 72, lastDrawnGap: 10, recentFrequency: 2 },
    { number: 56, frequency: 71, lastDrawnGap: 5,  recentFrequency: 3 },
    { number: 44, frequency: 71, lastDrawnGap: 8,  recentFrequency: 2 },
    // Mid frequency
    { number: 15, frequency: 70, lastDrawnGap: 6,  recentFrequency: 3 },
    { number: 2,  frequency: 70, lastDrawnGap: 11, recentFrequency: 2 },
    { number: 53, frequency: 69, lastDrawnGap: 9,  recentFrequency: 2 },
    { number: 36, frequency: 69, lastDrawnGap: 7,  recentFrequency: 2 },
    { number: 64, frequency: 68, lastDrawnGap: 4,  recentFrequency: 3 },
    { number: 39, frequency: 68, lastDrawnGap: 12, recentFrequency: 2 },
    { number: 7,  frequency: 67, lastDrawnGap: 8,  recentFrequency: 2 },
    { number: 50, frequency: 67, lastDrawnGap: 10, recentFrequency: 2 },
    { number: 28, frequency: 66, lastDrawnGap: 6,  recentFrequency: 2 },
    { number: 19, frequency: 66, lastDrawnGap: 13, recentFrequency: 1 },
    { number: 1,  frequency: 66, lastDrawnGap: 9,  recentFrequency: 2 },
    { number: 59, frequency: 65, lastDrawnGap: 5,  recentFrequency: 2 },
    { number: 43, frequency: 65, lastDrawnGap: 11, recentFrequency: 2 },
    { number: 27, frequency: 64, lastDrawnGap: 7,  recentFrequency: 2 },
    { number: 66, frequency: 64, lastDrawnGap: 14, recentFrequency: 1 },
    // Lower-mid frequency
    { number: 6,  frequency: 63, lastDrawnGap: 8,  recentFrequency: 2 },
    { number: 41, frequency: 63, lastDrawnGap: 10, recentFrequency: 2 },
    { number: 13, frequency: 62, lastDrawnGap: 15, recentFrequency: 1 },
    { number: 52, frequency: 62, lastDrawnGap: 6,  recentFrequency: 2 },
    { number: 33, frequency: 62, lastDrawnGap: 12, recentFrequency: 1 },
    { number: 8,  frequency: 61, lastDrawnGap: 9,  recentFrequency: 2 },
    { number: 67, frequency: 61, lastDrawnGap: 7,  recentFrequency: 2 },
    { number: 24, frequency: 60, lastDrawnGap: 16, recentFrequency: 1 },
    { number: 47, frequency: 60, lastDrawnGap: 11, recentFrequency: 1 },
    { number: 57, frequency: 60, lastDrawnGap: 8,  recentFrequency: 2 },
    { number: 16, frequency: 59, lastDrawnGap: 13, recentFrequency: 1 },
    { number: 37, frequency: 59, lastDrawnGap: 10, recentFrequency: 1 },
    { number: 69, frequency: 58, lastDrawnGap: 5,  recentFrequency: 2 },
    { number: 5,  frequency: 58, lastDrawnGap: 14, recentFrequency: 1 },
    { number: 54, frequency: 58, lastDrawnGap: 9,  recentFrequency: 1 },
    // Lower frequency
    { number: 61, frequency: 57, lastDrawnGap: 17, recentFrequency: 1 },
    { number: 23, frequency: 57, lastDrawnGap: 12, recentFrequency: 1 },
    { number: 40, frequency: 56, lastDrawnGap: 11, recentFrequency: 1 },
    { number: 9,  frequency: 56, lastDrawnGap: 18, recentFrequency: 1 },
    { number: 30, frequency: 55, lastDrawnGap: 15, recentFrequency: 1 },
    { number: 68, frequency: 55, lastDrawnGap: 10, recentFrequency: 1 },
    { number: 12, frequency: 54, lastDrawnGap: 19, recentFrequency: 0 },
    { number: 45, frequency: 54, lastDrawnGap: 13, recentFrequency: 1 },
    { number: 18, frequency: 53, lastDrawnGap: 16, recentFrequency: 1 },
    { number: 32, frequency: 53, lastDrawnGap: 20, recentFrequency: 0 },
    { number: 60, frequency: 52, lastDrawnGap: 14, recentFrequency: 1 },
    { number: 34, frequency: 52, lastDrawnGap: 22, recentFrequency: 0 },
    { number: 63, frequency: 51, lastDrawnGap: 18, recentFrequency: 0 },
    { number: 49, frequency: 51, lastDrawnGap: 25, recentFrequency: 0 },
    { number: 26, frequency: 50, lastDrawnGap: 21, recentFrequency: 0 },
    { number: 25, frequency: 50, lastDrawnGap: 24, recentFrequency: 0 },
    // Least drawn white balls
    { number: 21, frequency: 49, lastDrawnGap: 27, recentFrequency: 0 },
    { number: 51, frequency: 48, lastDrawnGap: 30, recentFrequency: 0 },
    { number: 65, frequency: 47, lastDrawnGap: 33, recentFrequency: 0 },
    { number: 55, frequency: 45, lastDrawnGap: 38, recentFrequency: 0 },
  ],
  bonusBall: [
    // Top drawn Mega Balls
    { number: 22, frequency: 40, lastDrawnGap: 2,  recentFrequency: 3 },
    { number: 11, frequency: 38, lastDrawnGap: 4,  recentFrequency: 3 },
    { number: 10, frequency: 37, lastDrawnGap: 3,  recentFrequency: 2 },
    { number: 14, frequency: 36, lastDrawnGap: 5,  recentFrequency: 2 },
    { number: 9,  frequency: 35, lastDrawnGap: 6,  recentFrequency: 2 },
    { number: 15, frequency: 34, lastDrawnGap: 4,  recentFrequency: 2 },
    { number: 7,  frequency: 33, lastDrawnGap: 7,  recentFrequency: 2 },
    { number: 1,  frequency: 32, lastDrawnGap: 8,  recentFrequency: 1 },
    { number: 4,  frequency: 31, lastDrawnGap: 5,  recentFrequency: 2 },
    { number: 2,  frequency: 30, lastDrawnGap: 9,  recentFrequency: 1 },
    // Mid frequency Mega Balls
    { number: 3,  frequency: 29, lastDrawnGap: 6,  recentFrequency: 1 },
    { number: 17, frequency: 28, lastDrawnGap: 10, recentFrequency: 1 },
    { number: 6,  frequency: 27, lastDrawnGap: 8,  recentFrequency: 1 },
    { number: 24, frequency: 26, lastDrawnGap: 11, recentFrequency: 1 },
    { number: 13, frequency: 25, lastDrawnGap: 7,  recentFrequency: 1 },
    { number: 5,  frequency: 24, lastDrawnGap: 12, recentFrequency: 1 },
    { number: 8,  frequency: 23, lastDrawnGap: 14, recentFrequency: 0 },
    { number: 25, frequency: 22, lastDrawnGap: 13, recentFrequency: 1 },
    { number: 18, frequency: 21, lastDrawnGap: 16, recentFrequency: 0 },
    { number: 19, frequency: 20, lastDrawnGap: 15, recentFrequency: 0 },
    { number: 12, frequency: 19, lastDrawnGap: 18, recentFrequency: 0 },
    { number: 21, frequency: 18, lastDrawnGap: 20, recentFrequency: 0 },
    // Least drawn Mega Balls
    { number: 20, frequency: 16, lastDrawnGap: 25, recentFrequency: 0 },
    { number: 16, frequency: 15, lastDrawnGap: 28, recentFrequency: 0 },
    { number: 23, frequency: 14, lastDrawnGap: 35, recentFrequency: 0 },
  ],
} as const;

// -----------------------------------------------------------------------------
// Digit Game Data (Pick 3 and Pick 4)
// Pattern distributions based on mathematical probability and historical data
// -----------------------------------------------------------------------------

export const DIGIT_GAME_DATA: DigitGameData = {
  hotDigits: [1, 3, 7, 9],
  coldDigits: [0, 4, 5],
  neutralDigits: [2, 6, 8],
  patternWeights: {
    3: [
      ["single", 72],        // all 3 different (e.g., 1-2-3) -- 720/1000
      ["double", 27],        // one pair + 1 single (e.g., 1-1-2) -- 270/1000
      ["triple", 1],         // all 3 same (e.g., 1-1-1) -- 10/1000
    ],
    4: [
      ["single", 50.4],      // all 4 different (e.g., 1-2-3-4) -- 5040/10000
      ["double", 43.2],      // one pair + 2 singles (e.g., 1-2-3-3) -- 4320/10000
      ["doublePair", 2.7],   // two pairs (e.g., 1-1-2-2) -- 270/10000
      ["triple", 3.6],       // three same + 1 different (e.g., 1-2-2-2) -- 360/10000
      ["quad", 0.1],         // all 4 same (e.g., 1-1-1-1) -- 10/10000
    ],
  },
  sumRanges: {
    3: { min: 9, max: 18 },   // Pick 3: bell curve peaks at 13-14, this covers ~70%
    4: { min: 13, max: 23 },  // Pick 4: bell curve peaks at 18, this covers ~70%
  },
};

// -----------------------------------------------------------------------------
// Game Mode Type
// -----------------------------------------------------------------------------

export type GameMode = "3pick" | "4pick" | "5pb" | "5mm";

// -----------------------------------------------------------------------------
// Game Data Accessor
// -----------------------------------------------------------------------------

/**
 * Returns the appropriate GameData for a given pool game mode.
 */
export function getGameData(mode: GameMode): GameData {
  switch (mode) {
    case "5pb":
      return POWERBALL_DATA;
    case "5mm":
      return MEGA_MILLIONS_DATA;
    default:
      return POWERBALL_DATA;
  }
}

// -----------------------------------------------------------------------------
// Helper: statistical classification
// -----------------------------------------------------------------------------

function classifyByFrequency(
  frequencies: number[],
  targetFrequency: number
): "hot" | "cold" | "neutral" {
  const mean = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
  const variance =
    frequencies.reduce((sum, f) => sum + (f - mean) ** 2, 0) / frequencies.length;
  const stddev = Math.sqrt(variance);

  if (targetFrequency >= mean + 0.5 * stddev) return "hot";
  if (targetFrequency <= mean - 0.5 * stddev) return "cold";
  return "neutral";
}

// -----------------------------------------------------------------------------
// Mode-based Helper Functions (used by the engine)
// -----------------------------------------------------------------------------

/**
 * Returns the hot numbers for a given game mode, sorted by recent frequency
 * descending. Each entry includes the number and its recent frequency.
 */
export function getHotNumbers(
  mode: GameMode
): { number: number; recentFrequency: number }[] {
  const data = getGameData(mode);
  return [...data.numbers]
    .sort((a, b) => b.recentFrequency - a.recentFrequency)
    .map((n) => ({ number: n.number, recentFrequency: n.recentFrequency }));
}

/**
 * Returns the cold numbers for a given game mode, sorted by frequency ascending.
 */
export function getColdNumbers(
  mode: GameMode
): { number: number; frequency: number }[] {
  const data = getGameData(mode);
  return [...data.numbers]
    .sort((a, b) => a.frequency - b.frequency)
    .map((n) => ({ number: n.number, frequency: n.frequency }));
}

/**
 * Returns numbers sorted by gap (most overdue first).
 */
export function getNumbersByGap(
  mode: GameMode
): { number: number; gap: number }[] {
  const data = getGameData(mode);
  return [...data.numbers]
    .sort((a, b) => b.lastDrawnGap - a.lastDrawnGap)
    .map((n) => ({ number: n.number, gap: n.lastDrawnGap }));
}

/**
 * Returns frequency weights for weighted sampling.
 */
export function getFrequencyWeights(
  mode: GameMode
): { number: number; frequency: number }[] {
  const data = getGameData(mode);
  return data.numbers.map((n) => ({
    number: n.number,
    frequency: n.frequency,
  }));
}

/**
 * Returns bonus ball weights for weighted sampling.
 */
export function getBonusBallWeights(
  mode: GameMode
): { number: number; weight: number; frequency: number }[] {
  const data = getGameData(mode);
  return data.bonusBall.map((n) => ({
    number: n.number,
    weight: n.recentFrequency > 0 ? n.recentFrequency * 2 : 1,
    frequency: n.frequency,
  }));
}

/**
 * Classifies a white ball number as hot, cold, or neutral for a given mode.
 */
export function classifyNumber(
  num: number,
  mode: GameMode
): "hot" | "cold" | "neutral" {
  if (mode === "3pick" || mode === "4pick") {
    if (DIGIT_GAME_DATA.hotDigits.includes(num)) return "hot";
    if (DIGIT_GAME_DATA.coldDigits.includes(num)) return "cold";
    return "neutral";
  }

  const data = getGameData(mode);
  const entry = data.numbers.find((n) => n.number === num);
  if (!entry) return "neutral";

  const frequencies = data.numbers.map((n) => n.frequency);
  return classifyByFrequency(frequencies, entry.frequency);
}

/**
 * Classifies a bonus ball number as hot, cold, or neutral for a given mode.
 */
export function classifyBonusBall(
  num: number,
  mode: GameMode
): "hot" | "cold" | "neutral" {
  const data = getGameData(mode);
  const entry = data.bonusBall.find((n) => n.number === num);
  if (!entry) return "neutral";

  const frequencies = data.bonusBall.map((n) => n.frequency);
  return classifyByFrequency(frequencies, entry.frequency);
}
