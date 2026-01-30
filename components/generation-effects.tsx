"use client";

import { useEffect, useState } from "react";

type EffectType = "fireworks" | "lightning" | "snowflakes" | "dollars" | "shooting-star" | "none";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  speedX: number;
  speedY: number;
  color?: string;
}

interface GenerationEffectsProps {
  trigger: boolean;
  type: EffectType;
}

const fireworkColors = ["#ef4444", "#f97316", "#eab308", "#ffffff"];
const lightningColors = ["#a855f7", "#c084fc", "#e879f9", "#ffffff"];
const snowflakeColors = ["#67e8f9", "#a5f3fc", "#ffffff", "#e0f2fe"];
const dollarColor = "#22c55e";
const shootingStarColors = ["#ec4899", "#f472b6", "#a855f7", "#ffffff"];

export function GenerationEffects({ trigger, type }: GenerationEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger || type === "none") {
      setParticles([]);
      return;
    }

    const newParticles: Particle[] = [];

    switch (type) {
      case "fireworks":
        // Multiple burst points
        for (let burst = 0; burst < 4; burst++) {
          const centerX = 15 + Math.random() * 70;
          const centerY = 15 + Math.random() * 40;
          for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            newParticles.push({
              id: burst * 100 + i,
              x: centerX,
              y: centerY,
              size: 4 + Math.random() * 4,
              opacity: 1,
              rotation: 0,
              speedX: Math.cos(angle) * speed,
              speedY: Math.sin(angle) * speed,
              color: fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
            });
          }
        }
        break;

      case "lightning":
        // Lightning bolts across screen
        for (let i = 0; i < 8; i++) {
          newParticles.push({
            id: i,
            x: 10 + Math.random() * 80,
            y: -10,
            size: 3 + Math.random() * 2,
            opacity: 1,
            rotation: Math.random() * 30 - 15,
            speedX: Math.random() * 2 - 1,
            speedY: 8 + Math.random() * 4,
            color: lightningColors[Math.floor(Math.random() * lightningColors.length)],
          });
        }
        break;

      case "snowflakes":
        // Falling snowflakes
        for (let i = 0; i < 30; i++) {
          newParticles.push({
            id: i,
            x: Math.random() * 100,
            y: -10 - Math.random() * 20,
            size: 8 + Math.random() * 12,
            opacity: 0.7 + Math.random() * 0.3,
            rotation: Math.random() * 360,
            speedX: Math.random() * 1 - 0.5,
            speedY: 1.5 + Math.random() * 1.5,
            color: snowflakeColors[Math.floor(Math.random() * snowflakeColors.length)],
          });
        }
        break;

      case "dollars":
        // Floating dollar signs
        for (let i = 0; i < 20; i++) {
          newParticles.push({
            id: i,
            x: Math.random() * 100,
            y: 110 + Math.random() * 20,
            size: 16 + Math.random() * 12,
            opacity: 0.8 + Math.random() * 0.2,
            rotation: Math.random() * 20 - 10,
            speedX: Math.random() * 1 - 0.5,
            speedY: -(2 + Math.random() * 2),
            color: dollarColor,
          });
        }
        break;

      case "shooting-star":
        // Shooting stars across the screen
        for (let i = 0; i < 6; i++) {
          newParticles.push({
            id: i,
            x: -10 - Math.random() * 20,
            y: 10 + Math.random() * 40,
            size: 4 + Math.random() * 3,
            opacity: 1,
            rotation: 45,
            speedX: 6 + Math.random() * 4,
            speedY: 2 + Math.random() * 2,
            color: shootingStarColors[Math.floor(Math.random() * shootingStarColors.length)],
          });
        }
        break;
    }

    setParticles(newParticles);

    // Clear after animation
    const timeout = setTimeout(() => {
      setParticles([]);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [trigger, type]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${type === "fireworks" || type === "lightning" || type === "shooting-star" ? "animate-effect-burst" : "animate-effect-fall"}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            "--speed-x": particle.speedX,
            "--speed-y": particle.speedY,
            "--rotation": `${particle.rotation}deg`,
          } as React.CSSProperties}
        >
          {type === "fireworks" && (
            <div
              className="rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                opacity: particle.opacity,
              }}
            />
          )}
          
          {type === "lightning" && (
            <svg
              width={particle.size * 4}
              height={particle.size * 8}
              viewBox="0 0 24 48"
              fill="none"
              style={{ opacity: particle.opacity, filter: `drop-shadow(0 0 8px ${particle.color})` }}
            >
              <path
                d="M13 2L4 20h7l-2 26 13-24h-8l6-20z"
                fill={particle.color}
              />
            </svg>
          )}
          
          {type === "snowflakes" && (
            <svg
              width={particle.size}
              height={particle.size}
              viewBox="0 0 24 24"
              fill="none"
              style={{ 
                opacity: particle.opacity,
                transform: `rotate(${particle.rotation}deg)`,
                filter: `drop-shadow(0 0 4px ${particle.color})`,
              }}
            >
              <path
                d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"
                stroke={particle.color}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
          
          {type === "dollars" && (
            <span
              style={{
                fontSize: particle.size,
                color: particle.color,
                opacity: particle.opacity,
                transform: `rotate(${particle.rotation}deg)`,
                filter: `drop-shadow(0 0 6px ${particle.color})`,
                fontWeight: "bold",
              }}
            >
              $
            </span>
          )}
          
          {type === "shooting-star" && (
            <div
              className="relative"
              style={{ opacity: particle.opacity }}
            >
              <div
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
                }}
              />
              <div
                className="absolute"
                style={{
                  width: particle.size * 8,
                  height: particle.size / 2,
                  background: `linear-gradient(90deg, ${particle.color}, transparent)`,
                  transform: "translateX(-100%)",
                  borderRadius: "50%",
                  opacity: 0.6,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
