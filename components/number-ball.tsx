"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type BallEffect = "ultimate" | "hot" | "cold" | "balanced" | "frequency" | "random" | "none";

interface NumberBallProps {
  number: number | null;
  variant?: "white" | "power";
  delay?: number;
  isLoading?: boolean;
  maxNumber?: number;
  effect?: BallEffect;
}

const ringColors: Record<BallEffect, string> = {
  ultimate: "rgba(139, 92, 246, 0.6)",
  hot: "rgba(239, 68, 68, 0.6)",
  cold: "rgba(59, 130, 246, 0.6)",
  balanced: "rgba(34, 197, 94, 0.6)",
  frequency: "rgba(168, 85, 247, 0.6)",
  random: "rgba(148, 163, 184, 0.3)",
  none: "transparent",
};

export function NumberBall({ number, variant = "white", delay = 0, isLoading = false, maxNumber, effect = "none" }: NumberBallProps) {
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsRolling(true);
      setIsRevealed(false);
      const max = maxNumber ?? (variant === "power" ? 26 : 69);
      const min = max <= 9 ? 0 : 1;
      const rollInterval = setInterval(() => {
        setDisplayNumber(Math.floor(Math.random() * (max - min + 1)) + min);
      }, 60);
      return () => clearInterval(rollInterval);
    }

    if (number === null) {
      setDisplayNumber(null);
      setIsRolling(false);
      setIsRevealed(false);
      return;
    }

    const revealTimer = setTimeout(() => {
      setIsRolling(true);
      setIsRevealed(false);
      const max = maxNumber ?? (variant === "power" ? 26 : 69);
      const min = max <= 9 ? 0 : 1;
      let counter = 0;
      const maxRolls = 10;

      const roll = () => {
        if (counter >= maxRolls) {
          setDisplayNumber(number);
          setIsRolling(false);
          setIsRevealed(true);
          setTimeout(() => setIsRevealed(false), 1000);
          return;
        }
        setDisplayNumber(Math.floor(Math.random() * (max - min + 1)) + min);
        counter++;
        const nextDelay = 40 + counter * 15;
        setTimeout(roll, nextDelay);
      };
      roll();
    }, delay);

    return () => clearTimeout(revealTimer);
  }, [number, delay, variant, isLoading, maxNumber]);

  const isPower = variant === "power";
  const showNumber = displayNumber !== null;
  const isEmpty = !showNumber && !isLoading;
  const glowColor = ringColors[effect];

  return (
    <div className="relative flex items-center justify-center">
      {/* Ring pulses on reveal */}
      <AnimatePresence>
        {isRevealed && effect !== "none" && (
          <>
            <motion.div
              key="ring1"
              className="absolute inset-0 rounded-full"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ boxShadow: `0 0 12px 3px ${glowColor}` }}
            />
            <motion.div
              key="ring2"
              className="absolute inset-0 rounded-full"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
              style={{ boxShadow: `0 0 8px 2px ${glowColor}` }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Ball */}
      <motion.div
        className={`relative w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center text-lg sm:text-2xl md:text-4xl font-bold font-mono ${
          isPower
            ? isEmpty
              ? "bg-gradient-to-br from-red-900/50 to-red-950/50 text-red-400/30 border-2 sm:border-4 border-red-800/50"
              : "bg-gradient-to-br from-red-600 via-rose-500 to-red-800 text-white border-2 sm:border-4 border-red-400/60"
            : isEmpty
              ? "bg-gradient-to-br from-gray-700/30 to-gray-800/30 text-gray-500/50 border-2 sm:border-4 border-dashed border-gray-600/50"
              : "bg-gradient-to-br from-white via-gray-100 to-white text-black border-2 sm:border-4 border-gray-300"
        }`}
        animate={
          isRevealed
            ? {
                scale: [1, 1.12, 0.95, 1],
                boxShadow: [
                  !isEmpty
                    ? isPower
                      ? "0 10px 40px rgba(220, 38, 38, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.3)"
                      : "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 4px 12px rgba(255, 255, 255, 0.7)"
                    : "0 4px 20px rgba(0, 0, 0, 0.2)",
                  `0 0 30px ${glowColor}, 0 0 60px ${glowColor}`,
                  `0 0 15px ${glowColor}`,
                  !isEmpty
                    ? isPower
                      ? "0 10px 40px rgba(220, 38, 38, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.3)"
                      : "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 4px 12px rgba(255, 255, 255, 0.7)"
                    : "0 4px 20px rgba(0, 0, 0, 0.2)",
                ],
              }
            : isRolling
              ? { scale: 1, opacity: 0.9 }
              : { scale: 1, opacity: 1 }
        }
        transition={
          isRevealed
            ? { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } // spring-like bounce
            : { duration: 0.2 }
        }
        style={{
          boxShadow: !isEmpty
            ? isPower
              ? "0 10px 40px rgba(220, 38, 38, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2), inset 0 -4px 12px rgba(0, 0, 0, 0.08), inset 0 4px 12px rgba(255, 255, 255, 0.7)"
            : "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Number with crossfade */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayNumber ?? "empty"}
            initial={isRolling ? { y: -8, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            exit={isRolling ? { y: 8, opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.06 }}
          >
            {showNumber ? displayNumber : "?"}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
