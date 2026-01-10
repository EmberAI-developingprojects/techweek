// app/welcome/page.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const vRef = useRef<HTMLVideoElement | null>(null);

  // ✅ public/videos/та тавтай морилно уу.mp4 (кирилл + зайтай -> encode)
  const SRC = "/videos/v.mp4";

  useEffect(() => {
    const v = vRef.current;
    if (!v) return;

    const tryPlay = async () => {
      try {
        v.currentTime = 0;
        await v.play();
      } catch {
        // autoplay blockлогдвол user нэг дарж тоглуулж болно
      }
    };
    tryPlay();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video background */}
      <video
        ref={vRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        preload="auto"
        loop
        // autoplay заавал ажиллуулахыг хүсвэл доорх 2-г асаа
        // muted
        // autoPlay
      >
        <source src={SRC} />
      </video>

      {/* subtle overlay */}
      <div className="absolute inset-0 bg-black/15" />

      {/* ✅ Back button (top-left) зураг шиг */}
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute left-5 top-5 z-10 grid h-12 w-12 place-items-center
                   rounded-md bg-emerald-700/95 text-white
                   shadow-[0_10px_25px_rgba(0,0,0,.35)]
                   hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
        aria-label="Буцах"
      >
        ‹
      </button>
    </div>
  );
}
