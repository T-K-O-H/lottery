"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  particles: Particle[];
}

const colors = [
  "#a855f7", // purple
  "#06b6d4", // cyan
  "#f59e0b", // amber
  "#ef4444", // red
  "#22c55e", // green
  "#ec4899", // pink
  "#ffffff", // white
];

export function Fireworks({ trigger }: { trigger: boolean }) {
  const [fireworks, setFireworks] = useState<Firework[]>([]);

  useEffect(() => {
    if (!trigger) return;

    // Create multiple fireworks
    const newFireworks: Firework[] = [];
    const count = 5;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const particles: Particle[] = [];
        const particleCount = 30;
        const centerX = 20 + Math.random() * 60; // % of container
        const centerY = 20 + Math.random() * 40;

        for (let j = 0; j < particleCount; j++) {
          const angle = (j / particleCount) * Math.PI * 2;
          const speed = 2 + Math.random() * 4;
          particles.push({
            id: j,
            x: centerX,
            y: centerY,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 3 + Math.random() * 4,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed,
            life: 1,
          });
        }

        const firework: Firework = {
          id: Date.now() + i,
          x: centerX,
          y: centerY,
          particles,
        };

        setFireworks((prev) => [...prev, firework]);

        // Remove firework after animation
        setTimeout(() => {
          setFireworks((prev) => prev.filter((f) => f.id !== firework.id));
        }, 1500);
      }, i * 200);
    }
  }, [trigger]);

  if (fireworks.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {fireworks.map((firework) => (
        <div key={firework.id} className="absolute inset-0">
          {firework.particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full animate-firework-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                "--speed-x": particle.speedX,
                "--speed-y": particle.speedY,
              } as React.CSSProperties}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
