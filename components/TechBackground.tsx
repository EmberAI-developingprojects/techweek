// components/TechnologyBackground.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/* 🎨 Background */
const BASE_COLOR   = "#003366";
const TOP_SHADE    = "rgba(0, 51, 102, 0.55)";
const BOTTOM_SHADE = "rgba(0, 30, 70, 0.55)";
const EDGE_SHADE   = "rgba(0, 0, 40, 0.82)";

/* 🔖 Logo PNG (optional top-wave) */
const LOGO_SRC = "/logos/logo.png";
const LOGO_ALT = "TechWeek 2025";

/* ---- Deterministic PRNG ---- */
function mulberry32(seed:number){
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const round3 = (n:number)=>Math.round(n*1000)/1000;
const lerp = (a:number,b:number,t:number)=> a + (b-a)*t;

type HexItem = { points:string, ax:number, ay:number, dur:number, delay:number };

export default function TechnologyBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // pointer parallax
  useEffect(() => {
    if (!mounted) return;
    const el = rootRef.current; if (!el) return;
    let targetX = 0, targetY = 0, curX = 0, curY = 0, raf = 0;
    const setVars = () => {
      el.style.setProperty("--px", curX.toFixed(4));
      el.style.setProperty("--py", curY.toFixed(4));
    };
    const tick = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      setVars(); raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      targetX = (e.clientX - cx) / (r.width/2);
      targetY = (e.clientY - cy) / (r.height/2);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, [mounted]);

  /* ---------- Client-side generated data ---------- */
  const { particles, nodes, links, hexes } = useMemo(() => {
    if (!mounted) return { particles:[], nodes:[], links:[], hexes:[] as HexItem[] };
    const rand = mulberry32(20250921);

    const parts = Array.from({ length: 70 }).map(() => ({
      w: 1 + Math.floor(rand()*2),
      h: 1 + Math.floor(rand()*2),
      l: round3(rand()*100),
      t: round3(rand()*100),
      d: round3(rand()*8),
    }));

    const ns = Array.from({ length: 64 }).map(() => ({
      x: Math.round(lerp(6, 94, rand())*10)/10,
      y: Math.round(lerp(6, 94, rand())*10)/10,
      r: 1 + Math.floor(rand()*2),
    }));
    const ls = ns.flatMap((n, i) => ([
      { x1:n.x*10, y1:n.y*10, x2:ns[(i+1)%ns.length].x*10, y2:ns[(i+1)%ns.length].y*10 },
      { x1:n.x*10, y1:n.y*10, x2:ns[(i+7)%ns.length].x*10, y2:ns[(i+7)%ns.length].y*10 },
    ]));

    const hexes = hexScatterFloat({
      count: 22, minSize: 70, maxSize: 90, viewW: 1000, viewH: 620, rand
    });

    return { particles: parts, nodes: ns, links: ls, hexes };
  }, [mounted]);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 -z-10 overflow-hidden text-white"
      style={{
        backgroundColor: BASE_COLOR,
        backgroundImage: `
          radial-gradient(120% 80% at 50% 0%, ${TOP_SHADE}, transparent 60%),
          radial-gradient(90% 85% at 50% 100%, ${BOTTOM_SHADE}, ${EDGE_SHADE})
        `,
      }}
    >
      {/* ==== BACKGROUND: SVG glow lines + center logo (rear-most) ==== */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{ minHeight: "420px" }}>
        <svg
          className="absolute inset-0 w-full h-full block"
          viewBox="-800 0 1600 820"
          preserveAspectRatio="xMidYMin slice"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="7" />
            </filter>

            <linearGradient id="lineOrange" gradientUnits="userSpaceOnUse" x1="-1600" y1="160" x2="-24" y2="320">
              <stop offset="0" stopColor="rgba(255,165,0,0)" />
              <stop offset=".55" stopColor="rgba(255,165,0,.9)" />
              <stop offset="1" stopColor="rgba(255,165,0,0)" />
            </linearGradient>
            <linearGradient id="lineCyan" gradientUnits="userSpaceOnUse" x1="1600" y1="160" x2="24" y2="320">
              <stop offset="0" stopColor="rgba(0,212,255,0)" />
              <stop offset=".55" stopColor="rgba(0,212,255,.9)" />
              <stop offset="1" stopColor="rgba(0,212,255,0)" />
            </linearGradient>

            <linearGradient id="stem" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#66E0FF" stopOpacity=".35" />
              <stop offset="1" stopColor="#66E0FF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* left */}
          <path d="M -1600 160 H -340 Q -220 160 -110 238 L -24 310"
            stroke="url(#lineOrange)" strokeWidth="16" filter="url(#glow)"
            strokeLinecap="round" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />
          <path d="M -1600 160 H -340 Q -220 160 -110 238 L -24 310"
            stroke="url(#lineOrange)" strokeWidth="6"
            strokeLinecap="round" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />
          <path d="M -1600 160 H -340 Q -220 160 -110 238 L -24 310"
            stroke="white" strokeOpacity=".06" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />

          {/* right */}
          <path d="M 1600 160 H 340 Q 220 160 110 238 L 24 310"
            stroke="url(#lineCyan)" strokeWidth="16" filter="url(#glow)"
            strokeLinecap="round" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />
          <path d="M 1600 160 H 340 Q 220 160 110 238 L 24 310"
            stroke="url(#lineCyan)" strokeWidth="6"
            strokeLinecap="round" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />
          <path d="M 1600 160 H 340 Q 220 160 110 238 L 24 310"
            stroke="white" strokeOpacity=".06" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />

          {/* center stem */}
          <path d="M 0 322 V 820" stroke="url(#stem)" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

          {/* SVG logo (төв дээр) — ЖИЖИГРҮҮЛСЭН */}
          <image href="/logos/techweek_white.png"
                 x="-150" y="60" width="300" height="150" preserveAspectRatio="xMidYMid meet" />
        </svg>
      </div>

      {/* ==== OPTIONAL TOP WAVE LOGO (нуусан) ==== */}
      <div
        className="absolute top-0 left-0 w-full h-[180px] flex items-center justify-center pointer-events-none select-none"
        style={{ transform: "translate3d(calc(var(--px,0)*2px),0,0)", display: "none" }}
      >
        <img src={LOGO_SRC} alt={LOGO_ALT} className="h-full w-auto object-contain" />
      </div>

      {/* ==== BEAMS ==== */}
      <div
        className="absolute inset-0 opacity-55 mix-blend-screen will-change-transform"
        style={{ transform: "translate3d(calc(var(--px,0)*6px),calc(var(--py,0)*6px),0)" }}
      >
        <div
          className="absolute -inset-1 bg-[length:200%_200%] animate-[twkGradient_24s_linear_infinite]"
          style={{
            backgroundImage:
              `radial-gradient(900px 260px at 12% 60%, rgba(56,189,248,.18), transparent 60%),
               radial-gradient(900px 260px at 88% 40%, rgba(59,130,246,.16), transparent 60%),
               linear-gradient(105deg, rgba(56,189,248,.08), rgba(59,130,246,.05) 60%)`,
          }}
        />
      </div>

      {/* ==== HEX CELLS ==== */}
      <div
        className="absolute inset-0 pointer-events-none opacity-55 will-change-transform"
        style={{ transform: "translate3d(calc(var(--px,0)*6px),calc(var(--py,0)*6px),0)" }}
      >
        <svg viewBox="0 0 1000 620" className="w-full h-full">
          <defs>
            <linearGradient id="hx" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          {hexes.map((h, idx) => (
            <polygon
              key={idx}
              points={h.points}
              fill="transparent"
              stroke="url(#hx)"
              strokeWidth="0.7"
              className="[stroke-dasharray:12]"
              opacity={0.9}
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                dur={`${h.dur}s`}
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
        className="absolute inset-0 pointer-events-none opacity-60 will-change-transform"
        style={{ transform: "translate3d(calc(var(--px,0)*7px),calc(var(--py,0)*7px),0)" }}
      >
        <svg viewBox="0 0 1000 1000" className="w-full h-full">
          {links.map((e,i)=>(<line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#6dd3ff" strokeOpacity="0.14" strokeWidth="0.5"/>))}
          {nodes.map((n,i)=>(<circle key={i} cx={n.x*10} cy={n.y*10} r={n.r} fill="#8be9ff" opacity="0.9"/>))}
        </svg>
      </div>

      {/* ==== PARTICLES ==== */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: "translate3d(calc(var(--px,0)*5px),calc(var(--py,0)*5px),0)" }}
      >
        {particles.map((p,i)=>(
          <span
            key={i}
            className="absolute block rounded-full bg-cyan-300/70 shadow-[0_0_6px_rgba(56,189,248,.7)] animate-[twkTwinkle_4.8s_ease-in-out_infinite]"
            style={{
              width:`${p.w}px`,
              height:`${p.h}px`,
              left:`${p.l}%`,
              top:`${p.t}%`,
              animationDelay:`${p.d}s`
            }}
          />
        ))}
      </div>

      {/* ==== BUTTONS (edge-aligned, no-zoom) ==== */}
      <div className="absolute inset-x-0 top-[260px] z-20 pointer-events-auto px-6">
        <div className="flex w-full items-center justify-between gap-4">
          <Link
            href="/techweek"
            className="px-8 py-3 rounded-full font-semibold text-white
                       bg-gradient-to-r from-orange-400 to-orange-600
                       border border-orange-300/50 shadow-lg shadow-orange-500/30
                       backdrop-blur-sm
                       transform-none hover:scale-[1]
                       transition-shadow duration-200 hover:shadow-orange-500/50
                       focus:outline-none focus:ring-2 focus:ring-orange-300/60"
          >
            Tech Week
          </Link>

          <Link
            href="/ict-forum"
            className="px-8 py-3 rounded-full font-semibold text-white
                       bg-gradient-to-r from-cyan-400 to-cyan-600
                       border border-cyan-300/50 shadow-lg shadow-cyan-500/30
                       backdrop-blur-sm
                       transform-none hover:scale-[1]
                       transition-shadow duration-200 hover:shadow-cyan-500/50
                       focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
          >
            ICT Forum
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes twkGradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes twkTwinkle{0%,100%{opacity:.3;transform:scale(.9)}50%{opacity:1;transform:scale(1.1)}}
      `}</style>
    </div>
  );
}

/* ---------- Hex utils ---------- */
function hexScatterFloat(opts:{
  count:number, minSize:number, maxSize:number, viewW:number, viewH:number, rand:()=>number
}): HexItem[] {
  const { count, minSize, maxSize, viewW, viewH, rand } = opts;
  const items: HexItem[] = [];
  const minDist = 120;
  let tries = 0; const MAX_TRIES = count * 120;

  while (items.length < count && tries < MAX_TRIES) {
    tries++;
    let x = round3(lerp(60, viewW - 60, rand()));
    let y = round3(lerp(60, viewH - 60, rand()));

    const nx = x / viewW - 0.5, ny = y / viewH - 0.5;
    const r = Math.hypot(nx, ny), minR = 0.22;
    if (r < minR) {
      const f = (minR + 0.02) / (r + 1e-6);
      x = round3(viewW * 0.5 + nx * f * viewW * 0.5);
      y = round3(viewH * 0.5 + ny * f * viewH * 0.5);
    }

    const ok = items.every(it => ((x-itAx(it))**2 + (y-itAy(it))**2) > (minDist**2));
    if (!ok) continue;

    const size  = lerp(minSize, maxSize, rand());
    const ax    = round3((rand() - 0.5) * 20);
    const ay    = round3((rand() - 0.5) * 16);
    const dur   = Math.round(lerp(10, 18, rand()));
    const delay = Math.round(lerp(0, 6, rand()));

    items.push({ points: hexPoints(x, y, size * 0.9), ax, ay, dur, delay });
  }
  return items;
}
function itAx(it:HexItem){ return parseFloat(it.points.split(" ")[0].split(",")[0]); }
function itAy(it:HexItem){ return parseFloat(it.points.split(" ")[0].split(",")[1]); }
function hexPoints(cx:number,cy:number,r:number){
  const pts:string[]=[];
  for(let i=0;i<6;i++){
    const a=(Math.PI/3)*i+Math.PI/6;
    pts.push(`${round3(cx+r*Math.cos(a))},${round3(cy+r*Math.sin(a))}`);
  }
  return pts.join(" ");
}
