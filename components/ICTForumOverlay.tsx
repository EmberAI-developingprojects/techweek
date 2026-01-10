// components/ICTForumOverlay.tsx
"use client";

import { useEffect, useState } from "react";

export default function ICTForumOverlay() {
  const [open, setOpen] = useState(false);

  // ✅ Modal нээгдэх үед page scroll lock
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement.style;
    const body = document.body.style;
    const prevHtml = html.overflow;
    const prevBody = body.overflow;
    html.overflow = "hidden";
    body.overflow = "hidden";
    return () => {
      html.overflow = prevHtml;
      body.overflow = prevBody;
    };
  }, [open]);

  // ✅ ESC дээр хаах
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button
        data-ict-trigger
        onClick={() => setOpen(true)}
        className="relative w-full h-[72px] px-10 md:px-16 rounded-full font-bold text-white text-xl inline-flex items-center justify-center
                   bg-gradient-to-r from-cyan-400 to-cyan-600
                   border-2 border-cyan-300/70 shadow-xl shadow-cyan-500/40
                   hover:shadow-cyan-500/70 focus:outline-none focus:ring-4 focus:ring-cyan-300/70"
      >
        ICT Forum
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            // ✅ backdrop дарвал хаана
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="relative w-full max-w-6xl h-[90vh] bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
            {/* ✅ Top overlay bar: iframe-ийн өөрийн улаан header/close bar-ыг дарж өгнө */}
            <div className="absolute inset-x-0 top-0 h-14 z-30">
              {/* iframe header-ийг харагдахгүй шахам болгох cover */}
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

              {/* ✅ жижиг дугуй Close */}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-3 left-3 z-40 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center text-lg font-medium shadow-md hover:bg-red-600 active:scale-95 transition"
              >
                ✕
              </button>
            </div>

            {/* ✅ iframe-ийг доош жаахан шилжүүлээд, дээрээс cover дарна */}
            <iframe
              src="/api/ict-proxy"
              className="w-full h-full border-0"
              loading="lazy"
              style={{ paddingTop: 56 }} // = h-14
              title="ICT Forum"
            />
          </div>
        </div>
      )}
    </>
  );
}
