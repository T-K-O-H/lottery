"use client";

import { useEffect, useState } from "react";

interface NumberBallProps {
  number: number;
  variant?: "white" | "power";
  delay?: number;
}

export function NumberBall({ number, variant = "white", delay = 0 }: NumberBallProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRolling, setIsRolling] = useState(true);
  const [displayNumber, setDisplayNumber] = useState(1);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(showTimer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    // Rolling animation
    let counter = 1;
    const maxRolls = 30;
    const rollDuration = 50;

    const rollInterval = setInterval(() => {
      if (counter >= maxRolls) {
        setDisplayNumber(number);
        setIsRolling(false);
        clearInterval(rollInterval);
      } else {
        const max = variant === "power" ? 26 : 69;
        setDisplayNumber(Math.floor(Math.random() * max) + 1);
        counter++;
      }
    }, rollDuration);

    return () => clearInterval(rollInterval);
  }, [isVisible, number, variant]);

  const isPower = variant === "power";

  return (
    <div
      className={`relative transition-all duration-500 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
      }`}
    >
      <div
        className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-lg sm:text-2xl md:text-3xl font-bold font-mono shadow-2xl ${
          isRolling ? "animate-spin" : "animate-float"
        } ${
          isPower
            ? "bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white border-2 sm:border-4 border-red-400"
            : "bg-gradient-to-br from-white via-gray-100 to-white text-black border-2 sm:border-4 border-gray-300"
        }`}
        style={{
          boxShadow: isPower
            ? "0 10px 40px rgba(220, 38, 38, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.3)"
            : "0 10px 40px rgba(0, 0, 0, 0.2), inset 0 2px 10px rgba(255, 255, 255, 0.5)",
        }}
      >
        {displayNumber}
      </div>
      {!isRolling && (
        <div
          className={`absolute inset-0 rounded-full ${
            isPower ? "animate-ping bg-red-500/30" : "animate-ping bg-white/30"
          }`}
          style={{ animationDuration: "2s" }}
        />
      )}
    </div>
  );
}
