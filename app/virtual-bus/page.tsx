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

  // ✅ BACK – history байвал back, байхгүй бол үндсэн рүү
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/"); // үндсэн page чинь өөр бол энд солиорой
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

      <div className="pointer-events-none absolute inset-0 z-[50]">
        {/* ✅ BACK BUTTON */}
        <button
          type="button"
          onClick={goBack}
          className="pointer-events-auto fixed left-6 grid h-14 w-14 place-items-center
                     rounded-lg bg-emerald-700/95 text-white
                     text-3xl font-bold leading-none
                     shadow-[0_12px_30px_rgba(0,0,0,.4)]
                     hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
          aria-label="Back"
          style={{
            top: "calc(env(safe-area-inset-top, 0px) + 44px)",
          }}
        >
          ‹
        </button>

        {/* CONTENT */}
        <div className="pointer-events-auto absolute inset-0 grid place-items-center px-5">
          <div
            className="w-full -translate-y-12" // ✅ VALID Tailwind утга
            style={{
              maxWidth: "560px",
              paddingTop: "calc(env(safe-area-inset-top, 0px) + 24px)",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
            }}
          >
            {/* LOGO */}
            <div className="flex justify-center">
              <img
                src="/logos/virtualzone.png"
                alt="Виртуал бүс"
                className="h-[206px] sm:h-[148px] w-auto select-none pointer-events-none
                           drop-shadow-[0_10px_28px_rgba(0,0,0,.40)]"
                draggable={false}
              />
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex flex-col gap-5">
              <button
                type="button"
                className="h-14 w-full rounded-full
                           bg-emerald-800/95 text-white font-semibold
                           shadow-[0_18px_45px_rgba(0,0,0,.35)]
                           hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
                onClick={() => setModal("desc")}
              >
                ВИРТУАЛ БҮС ГЭЖ ЮУ ВЭ?
              </button>

              <button
                type="button"
                className="h-12 w-full rounded-full
                           bg-emerald-800/95 text-white font-semibold
                           shadow-[0_14px_35px_rgba(0,0,0,.35)]
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
          <div className="pointer-events-auto fixed inset-0 z-[120] flex items-center justify-center">
            <button
              className="absolute inset-0 bg-black/55"
              onClick={() => setModal(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
