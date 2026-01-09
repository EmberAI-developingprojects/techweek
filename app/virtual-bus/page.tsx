// app/virtual-bus/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TechBlueBackground from "@/components/TechBlueBackground";

type ModalKind = "desc" | "signup" | null;

export default function VirtualBusPage() {
  const router = useRouter();
  const [modal, setModal] = useState<ModalKind>(null);

  const isOpen = modal !== null;

  const modalTitle =
    modal === "signup"
      ? "Бүртгүүлэх заавар"
      : modal === "desc"
      ? "Виртуал бүс гэж юу вэ?"
      : "";

  const modalImgSrc =
    modal === "signup"
      ? "/images/signup.png"
      : modal === "desc"
      ? "/images/desc.png"
      : "";

  // Modal нээгдсэн үед ESC дарвал хаагдана
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* зөвхөн цэнхэр background */}
      <TechBlueBackground />

      {/* дээр нь UI */}
      <div className="pointer-events-none absolute inset-0 z-[50]">
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

        <div className="absolute left-1/2 top-[18vh] w-[min(86vw,560px)] -translate-x-1/2">
          {/* ===== Title LOGO (virtualzone.png) ===== */}
          <div className="flex items-center justify-center gap-3">
            <img
              src="/logos/virtualzone.png"
              alt="Виртуал бүс"
              className="h-[56px] sm:h-[68px] w-auto select-none pointer-events-none
                         drop-shadow-[0_10px_28px_rgba(0,0,0,.40)]"
              draggable={false}
            />
          </div>

          <div className="mt-10 flex flex-col gap-5">
            {/* ✅ ОДОО route биш — modal нээнэ */}
            <button
              type="button"
              className="pointer-events-auto h-12 w-full rounded-full
                         bg-emerald-800/95 text-white font-semibold
                         shadow-[0_14px_35px_rgba(0,0,0,.35)]
                         hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
              onClick={() => setModal("desc")}
            >
              ВИРТУАЛ БҮС ГЭЖ ЮУ ВЭ?
            </button>

            {/* ✅ энэ нь signup modal */}
            <button
              type="button"
              className="pointer-events-auto h-12 w-full rounded-full
                         bg-emerald-800/95 text-white font-semibold
                         shadow-[0_14px_35px_rgba(0,0,0,.35)]
                         hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
              onClick={() => setModal("signup")}
            >
              ВИРТУАЛ БҮСЭД БҮРТГҮҮЛЭХ ЗААВАР
            </button>
          </div>
        </div>

        {/* =========================
            MODAL (desc.png / signup.png)
           ========================= */}
        {isOpen && (
          <div
            className="pointer-events-auto fixed inset-0 z-[120] flex items-center justify-center"
            aria-modal="true"
            role="dialog"
          >
            {/* overlay (click to close) */}
            <button
              type="button"
              className="absolute inset-0 bg-black/55"
              onClick={() => setModal(null)}
              aria-label="Close modal"
            />

            {/* modal box */}
            <div className="relative w-[min(92vw,760px)] max-h-[88vh] overflow-hidden rounded-2xl border border-white/10 bg-[#071a3d]/85 shadow-[0_20px_80px_rgba(0,0,0,.55)]">
              {/* header */}
              <div className="relative flex items-center justify-center px-5 py-4">
                <div className="text-white font-semibold tracking-wide">
                  {modalTitle}
                </div>

                {/* close button (улаан X) */}
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center
                             rounded-full bg-red-600 text-white
                             shadow-[0_10px_25px_rgba(0,0,0,.35)]
                             hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300/40"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* content (scrollable) */}
              <div className="max-h-[calc(88vh-56px)] overflow-auto p-4">
                <img
                  src={modalImgSrc}
                  alt={modalTitle}
                  className="w-full h-auto rounded-xl"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
