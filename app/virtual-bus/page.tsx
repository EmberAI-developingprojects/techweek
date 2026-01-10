// app/virtual-bus/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TechBlueBackground from "@/components/TechBlueBackground";

type ModalKind = "desc" | "signup" | null;

export default function VirtualBusPage() {
  const router = useRouter();
  const [modal, setModal] = useState<ModalKind>(null);

  const isOpen = modal !== null;

  // ✅ history байвал back, байхгүй бол үндсэн рүү
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/"); // үндсэн page чинь өөр route бол энд солиорой (ж: "/techweek")
    }
  };

  const modalTitle =
    modal === "signup"
      ? "Бүртгүүлэх заавар"
      : modal === "desc"
      ? "Виртуал бүс гэж юу вэ?"
      : "";

  const modalImages = useMemo(() => {
    if (modal === "desc") return ["/images/desc1.png", "/images/desc2.png"];
    if (modal === "signup") return ["/images/signup1.png", "/images/signup2.png"];
    return [];
  }, [modal]);

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
      <TechBlueBackground />

      {/* ✅ BACK — pointer-events-none wrapper-ээс ГАДНА, тэгэхээр 100% дарна */}
      <button
        type="button"
        onClick={goBack}
        className="pointer-events-auto fixed left-6 z-[200] grid h-14 w-14 place-items-center
                   rounded-lg bg-emerald-700/95 text-white text-3xl font-bold leading-none
                   shadow-[0_12px_30px_rgba(0,0,0,.4)]
                   hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
        aria-label="Back"
        style={{
          top: "calc(env(safe-area-inset-top, 0px) + 44px)",
        }}
      >
        ‹
      </button>

      {/* UI layer */}
      <div className="pointer-events-none absolute inset-0 z-[50]">
        {/* ✅ 9:16 төвтэй main content */}
        <div className="pointer-events-auto absolute inset-0 grid place-items-center px-5">
          <div
            className="w-full -translate-y-10"
            style={{
              maxWidth: "560px",
              paddingTop: "calc(env(safe-area-inset-top, 0px) + 24px)",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
            }}
          >
            {/* Logo */}
            <div className="flex items-center justify-center">
              <img
                src="/logos/virtualzone.png"
                alt="Виртуал бүс"
                className="h-[56px] sm:h-[68px] w-auto select-none pointer-events-none
                           drop-shadow-[0_10px_28px_rgba(0,0,0,.40)]"
                draggable={false}
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-5">
              <button
                type="button"
                className="pointer-events-auto h-14 w-full rounded-full
                           bg-emerald-800/95 text-white font-semibold
                           shadow-[0_18px_45px_rgba(0,0,0,.35)]
                           hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
                onClick={() => setModal("desc")}
              >
                ВИРТУАЛ БҮС ГЭЖ ЮУ ВЭ?
              </button>

              <button
                type="button"
                className="pointer-events-auto h-14 w-full rounded-full
                           bg-emerald-800/95 text-white font-semibold
                           shadow-[0_18px_45px_rgba(0,0,0,.35)]
                           hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
                onClick={() => setModal("signup")}
              >
                ВИРТУАЛ БҮСЭД БҮРТГҮҮЛЭХ ЗААВАР
              </button>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {isOpen && (
          <div
            className="pointer-events-auto fixed inset-0 z-[120] flex items-center justify-center"
            aria-modal="true"
            role="dialog"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/55"
              onClick={() => setModal(null)}
              aria-label="Close modal"
            />

            <div className="relative w-[min(92vw,760px)] max-h-[88vh] overflow-hidden rounded-2xl border border-white/10 bg-[#071a3d]/85 shadow-[0_20px_80px_rgba(0,0,0,.55)]">
              <div className="relative flex items-center justify-center px-5 py-4">
                <div className="text-white font-semibold tracking-wide">
                  {modalTitle}
                </div>

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

              <div className="max-h-[calc(88vh-56px)] overflow-auto p-4">
                <div className="flex flex-col gap-4">
                  {modalImages.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${modalTitle} ${i + 1}`}
                      className="w-full h-auto rounded-xl"
                      draggable={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
