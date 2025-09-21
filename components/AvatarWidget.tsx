// components/AvatarWidget.tsx
"use client";
import { useState } from "react";

export default function AvatarWidget() {
  const [hoverSide, setHoverSide] = useState<"idle" | "left" | "right">("idle");

  return (
    <div className="relative">
      {/* Толгойн хоёр талын товчлуурууд */}
      <div
        className="
          absolute left-1/2 -translate-x-1/2
          -top-10 md:-top-14
          flex items-center justify-center gap-3 md:gap-6
          z-10
        "
      >
        <button
          onMouseEnter={() => setHoverSide("left")}
          onMouseLeave={() => setHoverSide("idle")}
          className="px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-cyan-500/90 hover:bg-cyan-400
                     text-xs md:text-sm font-semibold shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          🚀 Explore
        </button>

        <button
          onMouseEnter={() => setHoverSide("right")}
          onMouseLeave={() => setHoverSide("idle")}
          className="px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-fuchsia-500/90 hover:bg-fuchsia-400
                     text-xs md:text-sm font-semibold shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          🎤 Speak
        </button>
      </div>

      {/* Видео — тасралтгүй(loop) тоглох */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disableRemotePlayback
        className="
          block mx-auto
          h-[clamp(420px,65vh,900px)]
          max-w-full
          drop-shadow-[0_30px_60px_rgba(0,0,0,.45)]
        "
      >
        {/* <source src="/avatar.webm" type="video/webm" />   alpha channel-тэй хувилбар */}
        <source src="/output.webm" type="video/webm" />     {/* fallback хувилбар */}
        Таны браузер видео tag дэмжихгүй байна.
      </video>

      {/* Статус */}
      <div className="mt-2 text-center text-xs opacity-60">state: {hoverSide}</div>
    </div>
  );
}
