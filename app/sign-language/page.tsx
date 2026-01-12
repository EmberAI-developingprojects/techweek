// app/sign-language/page.tsx
"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import TechBlueBackground from "@/components/TechBlueBackground";

// ✅ Дизайны fixed өргөн
const CONTENT_W = 980;

// бусад видеонууд
const W1 = "72%";
const W2 = "72%";
const W3 = "72%";

// ✅ НОГООН ВИДЕО — ЯГ ХҮССЭН STYLE
const GREEN_STYLE = {
  width: "51%",
  left: "50%",
  transform: "translateX(-50%)",
} as const;

export default function SignLanguagePage() {
  const router = useRouter();

  const VIDEO_1 = "/videos/sign1.mp4";
  const VIDEO_2 = "/videos/sign2.mp4";
  const VIDEO_3 = "/videos/sign3.mp4";
  const VIDEO_4 = "/videos/video5.mp4"; // 🟢 ногоон
  const IMAGE_1 = "/images/sign.jpg";

  const vRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const attachRef = (idx: number) => (el: HTMLVideoElement | null) => {
    vRefs.current[idx] = el;
  };

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      <TechBlueBackground />

      {/* BACK */}
      <button
        type="button"
        onClick={goBack}
        className="fixed left-6 z-[200] grid h-14 w-14 place-items-center
                   rounded-lg bg-emerald-700/95 text-white text-3xl font-bold
                   shadow-[0_12px_30px_rgba(0,0,0,.4)]
                   hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 44px)" }}
        aria-label="Back"
      >
        ‹
      </button>

      {/* CONTENT */}
      <div className="pointer-events-none absolute inset-0 z-[50]">
        <div className="pointer-events-auto absolute inset-0 overflow-y-auto px-4">
          <div
            className="mx-auto"
            style={{
              width: CONTENT_W,
              paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
            }}
          >
            <div className="mt-36 flex flex-col gap-3">
              {/* VIDEO 1 */}
              <TileFixed>
                <Video
                  refCb={attachRef(0)}
                  src={VIDEO_1}
                  widthPct={W1}
                  fit="contain"
                />
              </TileFixed>

              {/* VIDEO 2 */}
              <TileFixed>
                <Video
                  refCb={attachRef(1)}
                  src={VIDEO_2}
                  widthPct={W2}
                  fit="contain"
                />
              </TileFixed>

              {/* VIDEO 3 */}
              <TileFixed>
                <Video
                  refCb={attachRef(2)}
                  src={VIDEO_3}
                  widthPct={W3}
                  fit="contain"
                />
              </TileFixed>

              {/* ✅ НОГООН VIDEO — FIXED 51% */}
              <TileFixed>
                <video
                  ref={attachRef(3)}
                  className="absolute top-0 h-full object-cover object-center"
                  style={GREEN_STYLE}
                  playsInline
                  preload="auto"
                  muted
                  loop
                  autoPlay
                >
                  <source src={VIDEO_4} />
                </video>
              </TileFixed>

              {/* IMAGE */}
              <TileFixed>
                <img
                  src={IMAGE_1}
                  alt="Дохионы хэл зураг"
                  className="absolute inset-0 h-full w-full object-contain object-center"
                  draggable={false}
                />
              </TileFixed>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✅ Fixed height tile — дэлгэцээс хамаарахгүй */
function TileFixed({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-[22px] sm:rounded-[26px]">
      {children}
    </div>
  );
}

/* бусад видеонууд */
function Video({
  src,
  refCb,
  widthPct,
  fit = "contain",
}: {
  src: string;
  refCb?: (el: HTMLVideoElement | null) => void;
  widthPct?: string;
  fit?: "contain" | "cover";
}) {
  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  return (
    <video
      ref={refCb}
      className={`absolute top-0 h-full ${fitClass} object-center`}
      style={
        widthPct
          ? { width: widthPct, left: "50%", transform: "translateX(-50%)" }
          : { width: "100%", left: 0 }
      }
      playsInline
      preload="auto"
      muted
      loop
      autoPlay
    >
      <source src={src} />
    </video>
  );
}
