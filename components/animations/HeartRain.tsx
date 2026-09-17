"use client";

import { useEffect, useState } from "react";

interface HeartRainProps {
  colors: string[];
  count?: number;
}

interface Drop {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
  color: string;
}

export function HeartRain({ colors, count = 18 }: HeartRainProps) {
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    setDrops(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 6,
        size: 8 + Math.random() * 10,
        color: colors[i % colors.length],
      })),
    );
  }, [colors, count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute top-[-5%]"
          style={{
            left: `${d.left}%`,
            animation: `heart-fall ${d.duration}s linear ${d.delay}s infinite`,
          }}
        >
          <svg
            width={d.size}
            height={d.size * 0.9}
            viewBox="0 0 20 18"
            fill="none"
          >
            <path
              d="M10 18C4 13 0 9 0 5.5C0 2 3 0 5.5 1.2C7.5 2 9 4 10 6C11 4 12.5 2 14.5 1.2C17 0 20 2 20 5.5C20 9 16 13 10 18Z"
              fill={d.color}
              opacity="0.55"
            />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes heart-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          100% { transform: translateY(110vh) rotate(180deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
