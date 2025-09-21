// components/AvatarVideoFixed.tsx
"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  src?: string;
  poster?: string;
  left?: string;
  z?: number;
  ignorePointer?: boolean;

  /** Доороос эхэлж сунгана: container height = 100vh - headroomVh */
  fitFromBottom?: boolean;
  headroomVh?: number; // логогийн доорх зай (vh)

  /** Сонголт: жаахан томруулж (доод талаасаа якорлох) */
  zoom?: number;       // ж: 1.00 ~ 1.10
};

export default function AvatarVideoFixed({
  src = "/media/newmodel.webm",
  poster,
  left = "50%",
  z = 80,
  ignorePointer = true,
  fitFromBottom = true,
  headroomVh = 24, // logo top ~10vh + logo height ~12vh + 2vh gap
  zoom = 1,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onMeta = () => setReady(true);
    v.addEventListener("loadedmetadata", onMeta);
    v.play().catch(() => {});
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left,
        bottom: 0,                                                // ⬅️ доороос наалдсан
        transform: "translateX(-50%)",
        height: fitFromBottom ? `calc(100vh - ${headroomVh}vh)` : undefined,
        zIndex: z,
        pointerEvents: ignorePointer ? "none" : "auto",
        overflow: "hidden",                                       // ⬅️ дээгүүр илүүдвэл тайрна
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
          height: "100%",                 // контейнерийн өндрийг дүүргэнэ
          width: "auto",
          display: "block",
          background: "transparent",
          objectFit: "cover",             // ⬅️ сул зай ҮГҮЙ
          objectPosition: "bottom center",// ⬅️ доод ирмэгт түгжинэ
          transform: `scale(${zoom})`,    // ⬅️ хүсвэл үл ялиг томруулж болно
          transformOrigin: "bottom center",
        }}
      />
    </div>
  );
}
