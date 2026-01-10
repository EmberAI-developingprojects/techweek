// app/sign-language/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TechBlueBackground from "@/components/TechBlueBackground";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function SignLanguagePage() {
  const router = useRouter();

  const VIDEO_1 = "/videos/sign1.mp4";
  const VIDEO_2 = "/videos/sign2.mp4";
  const VIDEO_3 = "/videos/sign3.mp4";
  const VIDEO_4 = "/videos/video5.mp4";
  const IMAGE_1 = "/images/sign.jpg";

  const vRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const pauseAll = () => {
    vRefs.current.forEach((v) => {
      if (!v) return;
      try {
        v.pause();
      } catch {}
    });
  };

  const attachRef = (idx: number) => (el: HTMLVideoElement | null) => {
    vRefs.current[idx] = el;
  };

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/"); // үндсэн route өөр бол энд солиорой
    }
  };

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      <TechBlueBackground />

      {/* BACK */}
      <button
        type="button"
        onClick={goBack}
        className="fixed left-6 z-[200] grid h-14 w-14 place-items-center
                   rounded-lg bg-emerald-700/95 text-white text-3xl font-bold leading-none
                   shadow-[0_12px_30px_rgba(0,0,0,.4)]
                   hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
        aria-label="Back"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 44px)" }}
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
            {/* scroll байхгүй — 5 tile-ийг flex-ээр тэнцүү хуваана */}
            <div
              className="mt-4 flex flex-col gap-3"
              style={{
                height:
                  "calc(100svh - (env(safe-area-inset-top, 0px) + 44px) - (env(safe-area-inset-bottom, 0px) + 28px) - 28px)",
              }}
            >
              {/* VIDEO 1 */}
              <Tile43>
                <video
                  ref={attachRef(0)}
                  className="absolute inset-0 h-full w-full object-cover"
                  playsInline
                  preload="metadata"
                >
                  <source src={VIDEO_1} />
                </video>
                <VideoOverlay pauseOthers={pauseAll} getVideo={() => vRefs.current[0]} />
              </Tile43>

              {/* VIDEO 2 */}
              <Tile43>
                <video
                  ref={attachRef(1)}
                  className="absolute inset-0 h-full w-full object-cover"
                  playsInline
                  preload="metadata"
                >
                  <source src={VIDEO_2} />
                </video>
                <VideoOverlay pauseOthers={pauseAll} getVideo={() => vRefs.current[1]} />
              </Tile43>

              {/* VIDEO 3 */}
              <Tile43>
                <video
                  ref={attachRef(2)}
                  className="absolute inset-0 h-full w-full object-cover"
                  playsInline
                  preload="metadata"
                >
                  <source src={VIDEO_3} />
                </video>
                <VideoOverlay pauseOthers={pauseAll} getVideo={() => vRefs.current[2]} />
              </Tile43>

              {/* VIDEO 4 */}
              <Tile43>
                <video
                  ref={attachRef(3)}
                  className="absolute inset-0 h-full w-full object-cover"
                  playsInline
                  preload="metadata"
                >
                  <source src={VIDEO_4} />
                </video>
                <VideoOverlay pauseOthers={pauseAll} getVideo={() => vRefs.current[3]} />
              </Tile43>

              {/* IMAGE */}
              <Tile43>
                <img
                  src={IMAGE_1}
                  alt="Дохионы хэл зураг"
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable={false}
                />
              </Tile43>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== 4:3 TILE (scroll-гүй байлгахын тулд flex-1 + aspect) ===== */
function Tile43({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-0 flex-1 aspect-[4/3]
                    rounded-2xl border border-white/12 bg-white/8 p-2
                    shadow-[0_18px_60px_rgba(0,0,0,.35)] overflow-hidden">
      {children}
    </div>
  );
}

function VideoOverlay({
  getVideo,
  pauseOthers,
}: {
  getVideo: () => HTMLVideoElement | null | undefined;
  pauseOthers: () => void;
}) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = getVideo();
    if (!v) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = async () => {
    const v = getVideo();
    if (!v) return;

    try {
      if (v.paused) {
        pauseOthers();
        await v.play();
      } else {
        v.pause();
      }
    } catch {}
  };

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="absolute inset-0"
        aria-label={playing ? "Pause video" : "Play video"}
      />

      {!playing && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div
            className="grid h-12 w-12 place-items-center rounded-full
                       bg-black/45 backdrop-blur-[2px]
                       shadow-[0_18px_50px_rgba(0,0,0,.45)]"
          >
            <PlayIcon />
          </div>
        </div>
      )}
    </>
  );
}
