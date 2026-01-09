// components/TechBackground.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import TechWeekOverlay from "@/components/TechWeekOverlay";
import AvatarVideoFixed from "@/components/AvatarVideoFixed";
import ICTForumOverlay from "@/components/ICTForumOverlay";
import ClientPortal from "@/components/ClientPortal";

/* 🎨 Background */
const BASE_COLOR = "#0d2c63";
const TOP_SHADE = "rgba(0, 51, 102, 0.55)";
const BOTTOM_SHADE = "rgba(0, 30, 70, 0.55)";
const EDGE_SHADE = "rgba(0, 0, 40, 0.82)";

/* 🔖 Foreground logo */
const FG_LOGO_SRC = "/logos/toplogo.png";
const FG_LOGO_ALT = "TechWeek 2025";

/* ⚙️ Kiosk */
const FREEZE_ALL = true;
const ANIMATE_BEAMS = true;
const tr = (f: number) =>
  FREEZE_ALL
    ? "none"
    : `translate3d(calc(var(--px,0)*${f}px),calc(var(--py,0)*${f}px),0)`;

/* ---- Deterministic PRNG ---- */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const round3 = (n: number) => Math.round(n * 1000) / 1000;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type HexItem = {
  points: string;
  ax: number;
  ay: number;
  dur: number;
  delay: number;
};

export default function TechnologyBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parallax (OFF when kiosk)
  useEffect(() => {
    if (!mounted || FREEZE_ALL) return;
    const el = rootRef.current;
    if (!el) return;

    let targetX = 0,
      targetY = 0,
      curX = 0,
      curY = 0,
      raf = 0;

    const setVars = () => {
      el.style.setProperty("--px", curX.toFixed(4));
      el.style.setProperty("--py", curY.toFixed(4));
    };

    const tick = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      setVars();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2,
        cy = r.top + r.height / 2;
      targetX = (e.clientX - cx) / (r.width / 2);
      targetY = (e.clientY - cy) / (r.height / 2);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [mounted]);

  /* ---------- Client-side generated data ---------- */
  const { particles, nodes, links, hexes } = useMemo(() => {
    if (!mounted) {
      return { particles: [], nodes: [], links: [], hexes: [] as HexItem[] };
    }

    const rand = mulberry32(20250921);

    const parts = Array.from({ length: 70 }).map(() => ({
      w: 1 + Math.floor(rand() * 2),
      h: 1 + Math.floor(rand() * 2),
      l: round3(rand() * 100),
      t: round3(rand() * 100),
      d: round3(rand() * 8),
    }));

    // network — дунд хэсгийг сул орхино
    const ns = Array.from({ length: 64 }).map(() => {
      const x = lerp(6, 94, rand());
      let y = lerp(12, 96, rand());
      if (y < 36 && Math.abs(x - 50) < 18) y = 36 + rand() * 8;
      return {
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        r: 1 + Math.floor(rand() * 2),
      };
    });

    const ls = ns.flatMap((n, i) => [
      {
        x1: n.x * 10,
        y1: n.y * 10,
        x2: ns[(i + 1) % ns.length].x * 10,
        y2: ns[(i + 1) % ns.length].y * 10,
      },
      {
        x1: n.x * 10,
        y1: n.y * 10,
        x2: ns[(i + 7) % ns.length].x * 10,
        y2: ns[(i + 7) % ns.length].y * 10,
      },
    ]);

    const hx = hexScatterFloat({
      count: 22,
      minSize: 70,
      maxSize: 90,
      viewW: 1080,
      viewH: 1920,
      rand,
    });

    return { particles: parts, nodes: ns, links: ls, hexes: hx };
  }, [mounted]);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 z-0 overflow-hidden text-white"
      style={{
        backgroundColor: BASE_COLOR,
        backgroundImage: `
          radial-gradient(120% 80% at 50% 0%, ${TOP_SHADE}, transparent 60%),
          radial-gradient(90% 85% at 50% 100%, ${BOTTOM_SHADE}, ${EDGE_SHADE})
        `,
        isolation: "isolate",
      }}
    >
      {/* ==== BACKGROUND: PORTRAIT SVG (1080×1920) ==== */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <svg
          className="absolute inset-0 w-full h-full block"
          viewBox="0 0 1080 1920"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <defs>
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8" />
            </filter>

            <linearGradient
              id="lineOrange"
              gradientUnits="userSpaceOnUse"
              x1="-600"
              y1="560"
              x2="520"
              y2="760"
            >
              <stop offset="0" stopColor="rgba(255,165,0,0)" />
              <stop offset=".55" stopColor="rgba(255,165,0,0.95)" />
              <stop offset="1" stopColor="rgba(255,165,0,0)" />
            </linearGradient>

            <linearGradient
              id="lineCyan"
              gradientUnits="userSpaceOnUse"
              x1="1680"
              y1="560"
              x2="560"
              y2="760"
            >
              <stop offset="0" stopColor="rgba(0,212,255,0)" />
              <stop offset=".55" stopColor="rgba(0,212,255,0.95)" />
              <stop offset="1" stopColor="rgba(0,212,255,0)" />
            </linearGradient>

            <linearGradient id="stem" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#66E0FF" stopOpacity=".45" />
              <stop offset="1" stopColor="#66E0FF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* left curve */}
          <path
            d="M -600 560 H 120 Q 260 560 360 640 L 520 740"
            stroke="url(#lineOrange)"
            strokeWidth="22"
            filter="url(#glow)"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M -600 560 H 120 Q 260 560 360 640 L 520 740"
            stroke="url(#lineOrange)"
            strokeWidth="9"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M -600 560 H 120 Q 260 560 360 640 L 520 740"
            stroke="white"
            strokeOpacity=".08"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* right curve */}
          <path
            d="M 1680 560 H 960 Q 820 560 720 640 L 560 740"
            stroke="url(#lineCyan)"
            strokeWidth="22"
            filter="url(#glow)"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 1680 560 H 960 Q 820 560 720 640 L 560 740"
            stroke="url(#lineCyan)"
            strokeWidth="9"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 1680 560 H 960 Q 820 560 720 640 L 560 740"
            stroke="white"
            strokeOpacity=".08"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* center stem */}
          <path
            d="M 540 780 V 1920"
            stroke="url(#stem)"
            strokeWidth="7"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* ==== BEAMS ==== */}
      <div
        className="absolute inset-0 opacity-80 will-change-transform pointer-events-none"
        style={{ transform: tr(6) }}
        aria-hidden
      >
        <div
          className="absolute -inset-1 bg-[length:200%_200%]"
          style={{
            backgroundImage: `radial-gradient(900px 420px at 18% 48%, rgba(56,189,248,.35), transparent 70%),
              radial-gradient(900px 420px at 82% 36%, rgba(59,130,246,.30), transparent 70%),
              linear-gradient(120deg, rgba(56,189,248,.15), rgba(59,130,246,.12) 60%)`,
            animation: ANIMATE_BEAMS
              ? "twkGradient 12s linear infinite"
              : "none",
            backgroundPosition: "50% 50%",
          }}
        />
      </div>

      {/* ==== HEX CELLS ==== */}
      <div
        className="absolute inset-0 pointer-events-none opacity-75 will-change-transform"
        style={{ transform: tr(6) }}
        aria-hidden
      >
        <svg viewBox="0 0 1080 1920" className="w-full h-full">
          <defs>
            <linearGradient id="hx" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#00e0ff" />
              <stop offset="1" stopColor="#00bfff" />
            </linearGradient>
          </defs>

          {hexes.map((h, idx) => (
            <polygon
              key={idx}
              points={h.points}
              fill="transparent"
              stroke="url(#hx)"
              strokeWidth="1.2"
              className="[stroke-dasharray:10]"
              opacity={0.95}
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                dur={`${h.dur / 1.5}s`}
                begin={`${h.delay}s`}
                repeatCount="indefinite"
                values={`0 0; ${h.ax} ${h.ay}; 0 0`}
                keyTimes="0; 0.5; 1"
              />
            </polygon>
          ))}
        </svg>
      </div>

      {/* ==== NETWORK ==== */}
      <div
        className="absolute inset-0 pointer-events-none opacity-70 will-change-transform"
        style={{ transform: tr(7) }}
        aria-hidden
      >
        <svg viewBox="0 0 1000 1600" className="w-full h-full">
          {links.map((e, i) => (
            <line
              key={i}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="#6dd3ff"
              strokeOpacity="0.18"
              strokeWidth="0.6"
            />
          ))}
          {nodes.map((n, i) => (
            <circle
              key={i}
              cx={n.x * 10}
              cy={n.y * 10}
              r={n.r + 0.3}
              fill="#8be9ff"
              opacity="0.95"
            />
          ))}
        </svg>
      </div>

      {/* ==== PARTICLES ==== */}
      <div
        className="absolute inset-0 will-change-transform pointer-events-none"
        style={{ transform: tr(5) }}
        aria-hidden
      >
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute block rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(56,189,248,.9)] animate-[twkTwinkle_3.2s_ease-in-out_infinite]"
            style={{
              width: `${p.w + 1.5}px`,
              height: `${p.h + 1.5}px`,
              left: `${p.l}%`,
              top: `${p.t}%`,
              animationDelay: `${p.d}s`,
            }}
          />
        ))}
      </div>

      {/* ==== FOREGROUND (Logo + Buttons) ==== */}
      <div className="absolute inset-0 z-[60]">
        {/* Logo — дээд төв */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[10vh] sm:top-[9vh] md:top-[8vh] pointer-events-none">
          <img
            src={FG_LOGO_SRC}
            alt={FG_LOGO_ALT}
            className="select-none"
            style={{
              height: "12vh",
              width: "auto",
              filter: "drop-shadow(0 6px 24px rgba(0,0,0,.35))",
            }}
          />
        </div>

        <AvatarVideoFixed
          src="/media/newmodel.webm"
          left="50%"
          headroomVh={24}
          zoom={1.03}
          z={75}
          ignorePointer
        />

        <ClientPortal>
          <div
            className="pointer-events-auto"
            style={{
              position: "absolute",
              top: "56vh",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(66vw, 860px)",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              mixBlendMode: "normal",
              isolation: "isolate",
              WebkitBackdropFilter: "none",
              backdropFilter: "none",
            }}
          >
            {/* ===== 1-р мөр: TechWeek + ICT Forum ===== */}
            <div className="flex items-center justify-between gap-4">
              <TechWeekOverlay
                label="Tech Week"
                triggerClassName="relative px-[8vw] md:px-16 py-5 rounded-full font-bold text-white text-xl
                bg-gradient-to-r from-orange-400 to-orange-600
                border-2 border-orange-300/70 shadow-xl shadow-orange-500/40
                hover:shadow-orange-500/70 focus:outline-none focus:ring-4 focus:ring-orange-300/70
                mix-blend-normal"
              />
              <ICTForumOverlay />
            </div>

            {/* ===== 2-р мөр: IMAGE pill buttons (IT Park + Virtual zone) ===== */}
            <div className="grid grid-cols-2 gap-4">
              {/* IT Park */}
              <button
                type="button"
                className="group relative flex items-center justify-center
                h-[64px] w-full rounded-full
                border border-white/35 bg-white/10
                shadow-[0_10px_35px_rgba(0,0,0,.28)]
                backdrop-blur-[2px]
                hover:bg-white/14 hover:border-white/45
                focus:outline-none focus:ring-4 focus:ring-cyan-300/35"
                onClick={() => console.log("itpark")}
                aria-label="IT Park"
              >
                <img
                  src="/logos/itpark.png"
                  alt="IT Park"
                  className="h-[34px] w-auto select-none pointer-events-none
                  drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]
                  group-hover:scale-[1.01] transition-transform"
                  draggable={false}
                />
              </button>

              {/* Virtual zone */}
              <button
                type="button"
                className="group relative flex items-center justify-center
                h-[64px] w-full rounded-full
                border border-white/35 bg-white/10
                shadow-[0_10px_35px_rgba(0,0,0,.28)]
                backdrop-blur-[2px]
                hover:bg-white/14 hover:border-white/45
                focus:outline-none focus:ring-4 focus:ring-cyan-300/35"
                onClick={() => console.log("virtualzone")}
                aria-label="Виртуал бүс"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/logos/virtualzone.png"
                    alt="Виртуал бүс"
                    className="h-[34px] w-auto select-none pointer-events-none
                    drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]
                    group-hover:scale-[1.01] transition-transform"
                    draggable={false}
                  />
                  <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.85)]" />
                </div>
              </button>
              {/* EXTRA 1: Image pill button */}
              <button
                type="button"
                className="group relative flex items-center justify-center
      h-[64px] w-full rounded-full
      border border-white/35 bg-white/10
      shadow-[0_10px_35px_rgba(0,0,0,.28)]
      backdrop-blur-[2px]
      hover:bg-white/14 hover:border-white/45
      focus:outline-none focus:ring-4 focus:ring-cyan-300/35"
                onClick={() => console.log("extra-image")}
                aria-label="Extra Image Button"
              >
                <img
                  src="/logos/khurdan.png" // ✅ ЭНД өөрийн зургаа солиорой
                  alt="Extra"
                  className="h-[34px] w-auto select-none pointer-events-none
        drop-shadow-[0_8px_18px_rgba(0,0,0,.35)]
        group-hover:scale-[1.01] transition-transform"
                  draggable={false}
                />
              </button>

              {/* EXTRA 2: Text pill button */}
              <button
                type="button"
                className="group relative flex items-center justify-center
      h-[64px] w-full rounded-full
      border border-white/35 bg-white/10
      shadow-[0_10px_35px_rgba(0,0,0,.28)]
      backdrop-blur-[2px]
      hover:bg-white/14 hover:border-white/45
      focus:outline-none focus:ring-4 focus:ring-cyan-300/35"
                onClick={() => console.log("extra-text")}
                aria-label="Extra Text Button"
              >
                <span
                  className="text-[18px] font-semibold tracking-wide text-white/95
        drop-shadow-[0_6px_14px_rgba(0,0,0,.35)]"
                >
                  Дохионы хэл
                </span>
              </button>
            </div>
          </div>
        </ClientPortal>
      </div>
    </div>
  );
}

/* ---------- Hex utils ---------- */
function hexScatterFloat(opts: {
  count: number;
  minSize: number;
  maxSize: number;
  viewW: number;
  viewH: number;
  rand: () => number;
}): HexItem[] {
  const { count, minSize, maxSize, viewW, viewH, rand } = opts;
  const items: HexItem[] = [];
  const minDist = 120;
  let tries = 0;
  const MAX_TRIES = count * 120;

  while (items.length < count && tries < MAX_TRIES) {
    tries++;
    let x = round3(lerp(60, viewW - 60, rand()));
    let y = round3(lerp(120, viewH - 100, rand()));

    // дунд/логоны бүсийг сул тавина
    const nx = x / viewW - 0.5,
      ny = y / viewH - 0.5;
    const r = Math.hypot(nx, ny),
      minR = 0.18;
    if (r < minR) {
      const f = (minR + 0.02) / (r + 1e-6);
      x = round3(viewW * 0.5 + nx * f * viewW * 0.5);
      y = round3(viewH * 0.5 + ny * f * viewH * 0.5);
    }

    const ok = items.every(
      (it) => (x - itAx(it)) ** 2 + (y - itAy(it)) ** 2 > minDist ** 2
    );
    if (!ok) continue;

    const size = lerp(minSize, maxSize, rand());
    const ax = round3((rand() - 0.5) * 20);
    const ay = round3((rand() - 0.5) * 16);
    const dur = Math.round(lerp(10, 18, rand()));
    const delay = Math.round(lerp(0, 6, rand()));
    items.push({ points: hexPoints(x, y, size * 0.9), ax, ay, dur, delay });
  }
  return items;
}

function itAx(it: HexItem) {
  return parseFloat(it.points.split(" ")[0].split(",")[0]);
}
function itAy(it: HexItem) {
  return parseFloat(it.points.split(" ")[0].split(",")[1]);
}

function hexPoints(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    pts.push(`${round3(cx + r * Math.cos(a))},${round3(cy + r * Math.sin(a))}`);
  }
  return pts.join(" ");
}
