import { useEffect, useRef, type ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type PixelSceneProps = {
  mode: 'moment' | 'finale';
};

// A lightweight, dependency-free canvas starfield. Uses requestAnimationFrame
// with a single canvas instead of hundreds of DOM nodes for performance.
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = performance.now();

    type Star = { x: number; y: number; r: number; phase: number; speed: number };
    let stars: Star[] = [];

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((width * height) / 12000) + 40;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.82,
        r: Math.random() < 0.82 ? 1 : 2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.3,
      }));
    };

    build();
    const observer = new ResizeObserver(build);
    observer.observe(canvas);

    const draw = (now: number) => {
      const delta = Math.min(60, now - last);
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#dbe6ff';
      for (const star of stars) {
        if (!reduced) star.phase += delta * 0.0022 * star.speed;
        ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(star.phase));
        ctx.fillRect(Math.round(star.x), Math.round(star.y), star.r, star.r);
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}

function PixelCloud({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 40 14" className={`cloud ${className}`} aria-hidden="true">
      <rect x="12" y="1" width="16" height="3" />
      <rect x="6" y="4" width="28" height="3" />
      <rect x="2" y="7" width="36" height="3" />
      <rect x="8" y="10" width="24" height="3" />
    </svg>
  );
}

// A tiny pixel character built from SVG rects. Minimal body animation only.
function PixelChar({
  shirt,
  hair,
  skin = '#e6b184',
  className = '',
}: {
  shirt: string;
  hair: string;
  skin?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 24"
      className={`pixel-char ${className}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x="6" y="1" width="4" height="2" fill={hair} />
      <rect x="5" y="2" width="6" height="2" fill={hair} />
      <rect x="6" y="3" width="4" height="4" fill={skin} />
      <rect x="6" y="5" width="1" height="1" fill="#20233a" />
      <rect x="9" y="5" width="1" height="1" fill="#20233a" />
      <rect x="5" y="7" width="6" height="7" fill={shirt} />
      <rect x="3" y="8" width="2" height="5" fill={shirt} />
      <rect x="11" y="8" width="2" height="5" fill={shirt} />
      <rect x="3" y="13" width="2" height="1" fill={skin} />
      <rect x="11" y="13" width="2" height="1" fill={skin} />
      <rect x="5" y="14" width="2" height="6" fill="#1b2148" />
      <rect x="9" y="14" width="2" height="6" fill="#1b2148" />
      <rect x="4" y="20" width="3" height="2" fill="#0b0f26" />
      <rect x="9" y="20" width="3" height="2" fill="#0b0f26" />
    </svg>
  );
}

const BUILDINGS: Array<[number, number, number]> = [
  [0, 70, 24],
  [24, 96, 20],
  [44, 58, 30],
  [74, 112, 22],
  [96, 80, 26],
  [122, 120, 18],
  [140, 66, 28],
  [168, 100, 20],
  [188, 74, 30],
  [218, 112, 22],
  [240, 60, 26],
  [266, 96, 20],
  [286, 78, 34],
];

function Building({ x, h, w, seed }: { x: number; h: number; w: number; seed: number }) {
  const rows = Math.max(0, Math.floor((h - 14) / 12));
  const cols = Math.max(0, Math.floor((w - 6) / 8));
  const windows: ReactNode[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if ((seed * 7 + row * 3 + col * 5) % 4 !== 0) continue;
      windows.push(
        <rect
          key={`${row}-${col}`}
          className="win"
          x={x + 4 + col * 8}
          y={150 - h + 8 + row * 12}
          width={3}
          height={4}
          style={{ animationDelay: `${((seed + row + col) % 7) * 0.45}s` }}
        />,
      );
    }
  }
  return (
    <g>
      <rect className="bldg" x={x} y={150 - h} width={w} height={h} />
      {windows}
    </g>
  );
}

// Cinematic night environment: parallax-ish layers, drifting clouds, a
// canvas starfield, a pixel skyline and a rooftop where the two characters
// stand. Everything is procedural — no external images required.
export default function PixelScene({ mode }: PixelSceneProps) {
  return (
    <div className={`pixel-scene mode-${mode}`} aria-hidden="true">
      <div className="scene-camera">
        <div className="sky" />
        <Starfield />
        <div className="moon" />
        <div className="clouds">
          <PixelCloud className="c1" />
          <PixelCloud className="c2" />
          <PixelCloud className="c3" />
        </div>
        <div className="skyline">
          <svg viewBox="0 0 320 150" preserveAspectRatio="none">
            {BUILDINGS.map(([x, h, w], index) => (
              <Building key={index} x={x} h={h} w={w} seed={index + 1} />
            ))}
          </svg>
        </div>
        <div className="haze" />
        <div className="rooftop">
          <div className="rooftop-details">
            <span className="vent" />
            <span className="antenna" />
          </div>
          <div className="chars">
            <PixelChar shirt="#2f9e63" hair="#2b2118" className="char char-adham" />
            <PixelChar shirt="#7c5cff" hair="#20160f" className="char char-seif" />
          </div>
        </div>
      </div>
    </div>
  );
}
