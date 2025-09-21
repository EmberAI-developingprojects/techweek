"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export default function ClientPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const host = useMemo(() => {
    if (typeof document === "undefined") return null;
    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.inset = "0";
    el.style.pointerEvents = "none"; // зөвхөн хүүхдүүд дээр идэвхтэй болгоно
    el.style.zIndex = "9999";        // бүхнээс дээгүүр
    el.style.mixBlendMode = "normal";
    el.style.isolation = "isolate";
    return el;
  }, []);

  useEffect(() => {
    if (!host) return;
    setMounted(true);
    document.body.appendChild(host);
    return () => {
      document.body.removeChild(host);
    };
  }, [host]);

  if (!mounted || !host) return null;
  return createPortal(children, host);
}
