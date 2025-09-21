// components/AvatarVideoFixed.tsx
"use client";
import { useEffect, useRef } from "react";

type Props = {
  src?: string;
  poster?: string;
  left?: string;
  z?: number;
  ignorePointer?: boolean;
  headroomVh?: number;  // дээр үлдээх зай
  zoom?: number;
};

export default function AvatarVideoFixed({
  src = "/media/newmodel.webm",
  poster,
  left = "50%",
  z = 80,
  ignorePointer = true,
  headroomVh = 18,   // ⬅️ логоноос үлдээх зай
  zoom = 1.1,        // ⬅️ жаахан томруулалт
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left,
        bottom: 0,
        transform: "translateX(-50%)",
        height: `calc(100vh - ${headroomVh}vh)`, // логоны доогуур үлдээх
        zIndex: z,
        pointerEvents: ignorePointer ? "none" : "auto",
        overflow: "hidden",
        width: "100vw", // дэлгэцийн өргөнийг бүхэлд нь эзэлнэ
      }}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          width: "100%",              // дэлгэцийг бүхэлд нь эзлэх
          height: "100%",
          display: "block",
          background: "transparent",
          objectFit: "cover",         // дүүртэл томруулна, тал хэсэг тайрагдаж болно
          objectPosition: "bottom center", // доороос төв
          transform: `scale(${zoom})`,
          transformOrigin: "bottom center",
        }}
      />
    </div>
  );
}
