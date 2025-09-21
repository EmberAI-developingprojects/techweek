// components/TechWeekOverlay.tsx
"use client";
import { useEffect, useState } from "react";

type Props = {
  label?: string;
  triggerClassName?: string;
  src?: string;
};

export default function TechWeekOverlay({
  label = "Tech Week",
  triggerClassName = "",
  src = "https://tech-week.mn/index.html",
}: Props) {
  const [open, setOpen] = useState(false);

  // ESC → close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        {label}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-[fadeIn_.25s_ease-out] p-[2vw]"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            // click outside → close
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="relative w-full h-full max-w-[1600px] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_.25s_ease-out]">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow"
              aria-label="Close"
            >
              ✕
            </button>
            <iframe
              src={src}
              className="w-full h-full"
              frameBorder={0}
              // sandbox/allow–ыг шаардлагатай бол нэмж болно:
              // sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes scaleIn { from { transform:scale(.96); opacity:0 } to { transform:scale(1); opacity:1 } }
      `}</style>
    </>
  );
}
