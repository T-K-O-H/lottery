"use client";

import { useEffect, useState } from "react";

interface NumberBallProps {
  number: number | null;
  variant?: "white" | "power";
  delay?: number;
  isLoading?: boolean;
}

export function NumberBall({ number, variant = "white", delay = 0, isLoading = false }: NumberBallProps) {
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setDisplayNumber(null);
      setIsRevealing(false);
      return;
    }

    if (number === null) {
      setDisplayNumber(null);
      setIsRevealing(false);
      return;
    }

    // Start reveal animation after delay
    const revealTimer = setTimeout(() => {
      setIsRevealing(true);
      
      // Roll through random numbers before settling
      let counter = 0;
      const maxRolls = 15;
      const rollDuration = 50;

      const rollInterval = setInterval(() => {
        if (counter >= maxRolls) {
          setDisplayNumber(number);
          clearInterval(rollInterval);
        } else {
          const max = variant === "power" ? 26 : 69;
          setDisplayNumber(Math.floor(Math.random() * max) + 1);
          counter++;
        }
      }, rollDuration);

      return () => clearInterval(rollInterval);
    }, delay);

    return () => clearTimeout(revealTimer);
  }, [number, delay, variant, isLoading]);

  const isPower = variant === "power";
  const showNumber = displayNumber !== null;

  return (
    <div className="relative">
      <div
        className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-lg sm:text-2xl md:text-3xl font-bold font-mono shadow-lg transition-all duration-300 ${
          isPower
            ? showNumber 
              ? "bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white border-2 sm:border-4 border-red-400"
              : "bg-gradient-to-br from-red-900/50 to-red-950/50 text-red-400/30 border-2 sm:border-4 border-red-800/50"
            : showNumber
              ? "bg-gradient-to-br from-white via-gray-100 to-white text-black border-2 sm:border-4 border-gray-300"
              : "bg-gradient-to-br from-gray-800/50 to-gray-900/50 text-gray-500/30 border-2 sm:border-4 border-gray-700/50"
        } ${isRevealing && !showNumber ? "animate-pulse" : ""}`}
        style={{
          boxShadow: showNumber
            ? isPower
              ? "0 10px 40px rgba(220, 38, 38, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.3)"
              : "0 10px 40px rgba(0, 0, 0, 0.2), inset 0 2px 10px rgba(255, 255, 255, 0.5)"
            : "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        {showNumber ? displayNumber : "?"}
      </div>
    </div>
  );
}
