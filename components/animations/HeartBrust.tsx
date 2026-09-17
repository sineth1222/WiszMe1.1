"use client";

import { useEffect, useRef } from "react";

interface HeartBurstProps {
  trigger: number;
  colors: string[];
  count?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  life: number;
}

export function HeartBurst({ trigger, colors, count = 50 }: HeartBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (trigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * -7 - 2,
        size: 8 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.25,
        life: 90 + Math.random() * 50,
      });
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
      const s = size / 20;
      ctx.beginPath();
      ctx.moveTo(0, 9 * s);
      ctx.bezierCurveTo(-10 * s, 3 * s, -10 * s, -5 * s, 0, -3 * s);
      ctx.bezierCurveTo(10 * s, -5 * s, 10 * s, 3 * s, 0, 9 * s);
      ctx.fill();
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const next: Particle[] = [];
      for (const p of particlesRef.current) {
        p.vy += 0.22;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        p.life -= 1;
        if (p.life > 0 && p.y < canvas.height + 40) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(p.life / 140, 0);
          ctx.fillStyle = p.color;
          drawHeart(ctx, p.size);
          ctx.restore();
          next.push(p);
        }
      }
      particlesRef.current = next;
      if (next.length > 0) rafRef.current = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30"
      aria-hidden="true"
    />
  );
}
