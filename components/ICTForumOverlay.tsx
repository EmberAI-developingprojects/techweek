// components/ICTForumOverlay.tsx
"use client";
import { useState } from "react";

export default function ICTForumOverlay() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative px-[8vw] md:px-16 py-5 rounded-full font-bold text-white text-xl
                   bg-gradient-to-r from-cyan-400 to-cyan-600
                   border-2 border-cyan-300/70 shadow-xl shadow-cyan-500/40
                   hover:shadow-cyan-500/70 focus:outline-none focus:ring-4 focus:ring-cyan-300/70"
      >
        ICT Forum
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999]  flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-[90vh] bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
              aria-label="Close"
            >
              ✕
            </button>

            <iframe
  src="/api/ict-proxy"   // ← энд
  className="w-full h-full border-0"
  loading="lazy"
/>

          </div>
        </div>
      )}
    </>
  );
}
