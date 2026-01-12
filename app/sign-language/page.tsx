// app/sign-language/page.tsx
"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import TechBlueBackground from "@/components/TechBlueBackground";

// ✅ Хэмжээ тааруулах хувь (өргөн)
const W1 = "72%";
const W2 = "72%";
const W3 = "72%";
const W4 = "60%"; // ✅ screenshot дээрх шиг (сүүлийн видео)

export default function SignLanguagePage() {
  const router = useRouter();

  const VIDEO_1 = "/videos/sign1.mp4";
  const VIDEO_2 = "/videos/sign2.mp4";
  const VIDEO_3 = "/videos/sign3.mp4";
  const VIDEO_4 = "/videos/video5.mp4"; // 🟢 сүүлийн
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
        <div className="pointer-events-auto absolute inset-0 px-4">
          <div
            className="mx-auto w-full"
            style={{
              maxWidth: "980px",
              paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
            }}
          >
            <div
              className="mt-4 flex flex-col gap-3"
              style={{
                height:
                  "calc(100svh - (env(safe-area-inset-top, 0px) + 44px) - (env(safe-area-inset-bottom, 0px) + 28px) - 28px)",
              }}
            >
              {/* VIDEO 1 */}
              <Tile>
                <Video refCb={attachRef(0)} src={VIDEO_1} widthPct={W1} fit="contain" />
              </Tile>

              {/* VIDEO 2 */}
              <Tile>
                <Video refCb={attachRef(1)} src={VIDEO_2} widthPct={W2} fit="contain" />
              </Tile>

              {/* VIDEO 3 */}
              <Tile>
                <Video refCb={attachRef(2)} src={VIDEO_3} widthPct={W3} fit="contain" />
              </Tile>

              {/* ✅ VIDEO 4 — screenshot design: object-cover + width 60% */}
              <Tile>
                <Video
                  refCb={attachRef(3)}
                  src={VIDEO_4}
                  widthPct={W4}
                  fit="cover"
                />
              </Tile>

              {/* IMAGE */}
              <Tile>
                <img
                  src={IMAGE_1}
                  alt="Дохионы хэл зураг"
                  className="absolute inset-0 h-full w-full object-contain object-center"
                  draggable={false}
                />
              </Tile>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✅ aspect-гүй: өндөр нь flex-1-ээр тэнцүү */
function Tile({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-[22px] sm:rounded-[26px]">
      {children}
    </div>
  );
}

function Video({
  src,
  refCb,
  widthPct,
  fit = "contain",
}: {
  src: string;
  refCb?: (el: HTMLVideoElement | null) => void;
  widthPct?: string; // "60%" гэх мэт
  fit?: "contain" | "cover";
}) {
  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  return (
    <video
      ref={refCb}
      className={`absolute top-0 h-full ${fitClass} object-center`}
      style={
        widthPct
          ? {
              width: widthPct,
              left: "50%",
              transform: "translateX(-50%)",
            }
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
