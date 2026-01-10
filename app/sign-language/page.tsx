// app/sign-language/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TechBlueBackground from "@/components/TechBlueBackground";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function SignLanguagePage() {
  const router = useRouter();

  // ✅ paths (public/ дотор байх ёстой)
  const VIDEO_1 = "/videos/sign1.mp4";
  const VIDEO_2 = "/videos/sign2.mp4";
  const VIDEO_3 = "/videos/sign3.mp4";
  const VIDEO_4 = "/videos/video5.mp4";
  const IMAGE_1 = "/images/sign.jpg";

  // ✅ нэг видео тоглоход бусдыг pause болгох
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <TechBlueBackground />

      <div className="pointer-events-none absolute inset-0 z-[50]">
        {/* back */}
        <button
          type="button"
          onClick={() => router.back()}
          className="pointer-events-auto absolute left-5 top-5 grid h-10 w-10 place-items-center
                     rounded-md bg-emerald-700/95 text-white
                     shadow-[0_10px_25px_rgba(0,0,0,.35)]
                     hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
          aria-label="Back"
        >
          ‹
        </button>

        {/* content */}
        <div className="pointer-events-auto absolute left-1/2 top-[12vh] w-[min(92vw,900px)] -translate-x-1/2">
          {/* title */}
          <div className="flex items-center justify-center">
            <h1 className="text-white text-3xl font-semibold tracking-wide drop-shadow-[0_10px_28px_rgba(0,0,0,.45)]">
              Дохионы хэл
            </h1>
          </div>

          {/* ✅ GRID: дандаа 1 багана (доошоо дарааллаад) */}
          <div className="mt-8 grid grid-cols-1 gap-5">
            {/* video 1 */}
            <div className="rounded-2xl border border-white/12 bg-white/8 p-3 shadow-[0_18px_60px_rgba(0,0,0,.35)]">
              <div className="relative overflow-hidden rounded-xl">
                <video
                  ref={attachRef(0)}
                  className="w-full aspect-video object-cover"
                  playsInline
                  preload="metadata"
                >
                  <source src={VIDEO_1} />
                </video>
                <VideoOverlay
                  pauseOthers={pauseAll}
                  getVideo={() => vRefs.current[0]}
                />
              </div>
            </div>

            {/* video 2 */}
            <div className="rounded-2xl border border-white/12 bg-white/8 p-3 shadow-[0_18px_60px_rgba(0,0,0,.35)]">
              <div className="relative overflow-hidden rounded-xl">
                <video
                  ref={attachRef(1)}
                  className="w-full aspect-video object-cover"
                  playsInline
                  preload="metadata"
                >
                  <source src={VIDEO_2} />
                </video>
                <VideoOverlay
                  pauseOthers={pauseAll}
                  getVideo={() => vRefs.current[1]}
                />
              </div>
            </div>

            {/* video 3 */}
            <div className="rounded-2xl border border-white/12 bg-white/8 p-3 shadow-[0_18px_60px_rgba(0,0,0,.35)]">
              <div className="relative overflow-hidden rounded-xl">
                <video
                  ref={attachRef(2)}
                  className="w-full aspect-video object-cover"
                  playsInline
                  preload="metadata"
                >
                  <source src={VIDEO_3} />
                </video>
                <VideoOverlay
                  pauseOthers={pauseAll}
                  getVideo={() => vRefs.current[2]}
                />
              </div>
            </div>

            {/* video 4 */}
            <div className="rounded-2xl border border-white/12 bg-white/8 p-3 shadow-[0_18px_60px_rgba(0,0,0,.35)]">
              <div className="relative overflow-hidden rounded-xl">
                <video
                  ref={attachRef(3)}
                  className="w-full aspect-video object-cover"
                  playsInline
                  preload="metadata"
                >
                  <source src={VIDEO_4} />
                </video>
                <VideoOverlay
                  pauseOthers={pauseAll}
                  getVideo={() => vRefs.current[3]}
                />
              </div>
            </div>

            {/* image (бас доошоо дарааллаад нэг мөрөнд) */}
            <div className="rounded-2xl border border-white/12 bg-white/8 p-3 shadow-[0_18px_60px_rgba(0,0,0,.35)]">
              <img
                src={IMAGE_1}
                alt="Дохионы хэл зураг"
                className="w-full rounded-xl"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Video дээр play icon overlay + click-to-toggle
 * (controls ашиглахгүй)
 */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {/* click layer */}
      <button
        type="button"
        onClick={toggle}
        className="absolute inset-0"
        aria-label={playing ? "Pause video" : "Play video"}
      />

      {/* play icon */}
      {!playing && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div
            className="grid h-16 w-16 place-items-center rounded-full
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
