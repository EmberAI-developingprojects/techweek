// components/ViewportFix.tsx
"use client";

import { useEffect } from "react";

/**
 * 100vh / 100svh iOS Safari, Android Chrome-ийн address bar өөрчлөгдөхөд
 * өндрийг зөв тооцоолохын тулд CSS custom property (--vh)-г тогтмол шинэчилнэ.
 */
export default function ViewportFix() {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);
    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  return null; // UI хэсэггүй, зөвхөн effect
}
