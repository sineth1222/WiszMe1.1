"use client";

import { useEffect, useRef } from "react";

interface FireworksProps {
  /** Bump this number to launch a fresh volley of rockets. */
  trigger: number;
  colors: string[];
  rocketCount?: number;
  intense?: boolean;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  trail: { x: number; y: number }[];
  exploded: boolean;
}

interface Spark {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  color: string;
  coreColor: string;
  isCore: boolean;
  life: number;
  maxLife: number;
  phase: "streamer" | "glitter";
  glitterSeed: number;
}

interface Flash {
  x: number;
  y: number;
  life: number;
  color: string;
}

interface Haze {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  radius: number;
  color: string;
}

/**
 * A "chrysanthemum"-style firework system, modeled closely on a real
 * reference clip:
 *  - dense radial LINE trails (not filled dots) bursting from a single
 *    point, evenly spread via golden-angle spacing so the sphere reads
 *    as deliberate and symmetric rather than a random dot-cloud
 *  - one dominant color per rocket, with a warm cream core near the
 *    very center of the burst
 *  - a bright ignition flash at the moment of explosion, plus a soft,
 *    longer-lived colored haze/bloom that lingers behind the whole
 *    sphere and fades out with it — the diffuse glow visible around the
 *    dense streak-ball in the reference footage
 *  - a two-phase spark life: sparks streak outward as short glowing
 *    trails ("streamer" phase), then — once they've slowed enough —
 *    settle into twinkling "glitter" points that crackle in place
 *    before fading, instead of just dissolving right after the burst
 *  - a flickering, slightly wavy rocket ascent trail instead of a
 *    straight-line dot
 */
export function Fireworks({
  trigger,
  colors,
  rocketCount = 2,
  intense = false,
}: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketsRef = useRef<Rocket[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const flashesRef = useRef<Flash[]>([]);
  const hazesRef = useRef<Haze[]>([]);
  const rafRef = useRef<number | null>(null);
  const frameRef = useRef(0);

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

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const count = reduced
      ? Math.max(1, Math.round(rocketCount / 3))
      : rocketCount;

    for (let i = 0; i < count; i++) {
      const x = canvas.width * (0.15 + Math.random() * 0.7);
      const targetY = canvas.height * (0.15 + Math.random() * 0.35);
      rocketsRef.current.push({
        x,
        y: canvas.height + 10,
        targetY,
        vy: -(9 + Math.random() * 4),
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
        exploded: false,
      });
    }

    const explode = (x: number, y: number, color: string) => {
      flashesRef.current.push({ x, y, life: 14, color });
      hazesRef.current.push({
        x,
        y,
        life: 110,
        maxLife: 110,
        radius: 95,
        color,
      });

      const sparkCount = intense ? 120 : 85;
      for (let i = 0; i < sparkCount; i++) {
        const angle = i * 2.399963 + Math.random() * 0.15;
        const speed = 2.4 + Math.random() * 3.6;
        const isCore = i % 7 === 0;
        sparksRef.current.push({
          x,
          y,
          prevX: x,
          prevY: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          coreColor: "#FFF3D6",
          isCore,
          life: 85 + Math.random() * 35,
          maxLife: 120,
          phase: "streamer",
          glitterSeed: Math.random() * 10,
        });
      }
    };

    const tick = () => {
      frameRef.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      hazesRef.current = hazesRef.current.filter((h) => {
        h.life -= 1;
        if (h.life <= 0) return false;
        const ratio = h.life / h.maxLife;
        ctx.save();
        ctx.globalAlpha = ratio * 0.35;
        const grad = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.radius);
        grad.addColorStop(0, h.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      rocketsRef.current = rocketsRef.current.filter((r) => {
        if (r.exploded) return false;
        r.y += r.vy;
        r.vy += 0.12;
        r.x += Math.sin(frameRef.current * 0.4 + r.y * 0.05) * 0.6;

        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 7) r.trail.shift();

        for (let i = 0; i < r.trail.length; i++) {
          const p = r.trail[i];
          const t = i / r.trail.length;
          ctx.save();
          ctx.globalAlpha = t * 0.8;
          ctx.fillStyle = r.color;
          const jitter = (Math.random() - 0.5) * (1 - t) * 2;
          ctx.beginPath();
          ctx.arc(p.x + jitter, p.y, 1.4 * t + 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.save();
        ctx.fillStyle = "#FFF3D6";
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y, r.color);
          r.exploded = true;
          return false;
        }
        return true;
      });

      flashesRef.current = flashesRef.current.filter((f) => {
        f.life -= 1;
        if (f.life <= 0) return false;
        ctx.save();
        ctx.globalAlpha = Math.max(f.life / 14, 0) * 0.9;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 30);
        grad.addColorStop(0, "#FFFFFF");
        grad.addColorStop(0.4, f.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      sparksRef.current = sparksRef.current.filter((s) => {
        s.life -= 1;
        if (s.life <= 0) return false;

        const speed = Math.hypot(s.vx, s.vy);
        if (s.phase === "streamer" && speed < 0.6) {
          s.phase = "glitter";
        }

        s.prevX = s.x;
        s.prevY = s.y;

        if (s.phase === "streamer") {
          s.vy += 0.045;
          s.vx *= 0.965;
          s.vy *= 0.965;
          s.x += s.vx;
          s.y += s.vy;
        } else {
          s.vy += 0.012;
          s.vx *= 0.9;
          s.vy *= 0.9;
          s.x += s.vx * 0.4;
          s.y += s.vy * 0.4;
        }

        const lifeRatio = Math.max(s.life / s.maxLife, 0);
        const color = s.isCore ? s.coreColor : s.color;

        ctx.save();
        if (s.phase === "streamer") {
          ctx.globalAlpha = lifeRatio;
          ctx.strokeStyle = color;
          ctx.lineWidth = s.isCore ? 1.6 : 1.1;
          ctx.beginPath();
          ctx.moveTo(s.prevX, s.prevY);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
        } else {
          const twinkle =
            0.4 +
            0.6 * Math.abs(Math.sin(frameRef.current * 0.3 + s.glitterSeed));
          ctx.globalAlpha = lifeRatio * twinkle;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.isCore ? 1.8 : 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        return true;
      });

      if (
        rocketsRef.current.length > 0 ||
        sparksRef.current.length > 0 ||
        flashesRef.current.length > 0 ||
        hazesRef.current.length > 0
      ) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
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

{
  /*"use client";

import { useEffect, useRef } from "react";

interface FireworksProps {
  trigger: number;
  colors: string[];
  rocketCount?: number;
  intense?: boolean;
}

interface Rocket {
  x: number;
  targetY: number;
  y: number;
  vy: number;
  color: string;
  exploded: boolean;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
}


 * A real rocket-launch-then-explode firework system on canvas — chosen
 * over a DOM-per-particle approach because a satisfying finale needs
 * hundreds of sparks across several bursts, which would be far too much
 * for individual motion.div elements to animate smoothly on mobile.
 /
export function Fireworks({ trigger, colors, rocketCount = 5, intense = false }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketsRef = useRef<Rocket[]>([]);
  const sparksRef = useRef<Spark[]>([]);
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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = reduced ? Math.max(1, Math.round(rocketCount / 3)) : rocketCount;

    for (let i = 0; i < count; i++) {
      const x = canvas.width * (0.15 + Math.random() * 0.7);
      const targetY = canvas.height * (0.15 + Math.random() * 0.35);
      rocketsRef.current.push({
        x,
        y: canvas.height + 10,
        targetY,
        vy: -(9 + Math.random() * 4),
        color: colors[Math.floor(Math.random() * colors.length)],
        exploded: false,
      });
    }

    const explode = (x: number, y: number, color: string) => {
      const sparkCount = intense ? 70 : 45;
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + Math.random() * 0.2;
        const speed = 2 + Math.random() * 4;
        sparksRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          life: 60 + Math.random() * 30,
          maxLife: 90,
        });
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rocketsRef.current = rocketsRef.current.filter((r) => {
        if (r.exploded) return false;
        r.y += r.vy;
        r.vy += 0.12;
        ctx.beginPath();
        ctx.fillStyle = r.color;
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y, r.color);
          r.exploded = true;
          return false;
        }
        return true;
      });

      sparksRef.current = sparksRef.current.filter((s) => {
        s.vy += 0.045;
        s.vx *= 0.985;
        s.vy *= 0.985;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 1;
        if (s.life <= 0) return false;
        ctx.save();
        ctx.globalAlpha = Math.max(s.life / s.maxLife, 0);
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      if (rocketsRef.current.length > 0 || sparksRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-30" aria-hidden="true" />;
}*/
}
