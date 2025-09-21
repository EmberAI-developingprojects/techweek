// components/AvatarVideoFixed.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src?: string;
  poster?: string;
  left?: string;
  z?: number;
  ignorePointer?: boolean;
  fitFromBottom?: boolean;
  headroomVh?: number;
  zoom?: number;
};

export default function AvatarVideoFixed({
  src = "/media/newmodel.webm",
  poster,
  left = "50%",
  z = 80,
  ignorePointer = true,
  fitFromBottom = true,
  headroomVh = 18,   // дээр үлдээх чөлөөт зай
  zoom = 1.1,        // жаахан томруулалт
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
        bottom: 0,
        transform: "translateX(-50%)",
        height: fitFromBottom ? `calc(100vh - ${headroomVh}vh)` : undefined,
        zIndex: z,
        pointerEvents: ignorePointer ? "none" : "auto",
        overflow: "hidden",
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
          height: "100%",
          width: "100%",
          display: "block",
          background: "transparent",
          objectFit: "cover",          // ⬅️ томруулж багтаана, тал бага зэрэг тайрагдаж болно
          objectPosition: "bottom center",
          transform: `scale(${zoom})`,
          transformOrigin: "bottom center",
        }}
      />
    </div>
  );
}
