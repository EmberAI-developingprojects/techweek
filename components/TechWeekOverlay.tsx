// components/TechWeekOverlay.tsx
"use client";

import { useEffect, useState } from "react";

// ===== Types =====
export type EventItem = {
  time?: string;
  title?: string;
  company?: string;
  type?: string;
  location?: string;
  pay?: string;      // e.g. "ТӨЛБӨРГҮЙ"
  desc?: string;
  image?: string;    // thumbnail / cover
  qr?: string;       // QR image path
  ctaLabel?: string; // optional custom label
};

export type DayPayload = { date?: string; events: EventItem[] };

export type TechWeekOverlayProps = {
  label?: string;
  triggerClassName?: string;
  /** Where JSON lives. Example: "/schedule" or "/api/schedule" */
  dataBase?: string;
  /** Force timezone when choosing today's file */
  timeZone?: string; // default "Asia/Ulaanbaatar"
};

// ===== Utils =====
function todayYMD(tz = "Asia/Ulaanbaatar") {
  const d = new Date();
  const y = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric" }).format(d);
  const m = new Intl.DateTimeFormat("en-CA", { timeZone: tz, month: "2-digit" }).format(d);
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: tz, day: "2-digit" }).format(d);
  return `${y}-${m}-${day}`; // 2025-09-21
}

// ===== Component =====
export default function TechWeekOverlay({
  label = "Tech Week",
  triggerClassName = "",
  dataBase = "/schedule",
  timeZone = "Asia/Ulaanbaatar",
}: TechWeekOverlayProps) {
  // List modal (day view)
  const [openList, setOpenList] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Detail modal
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [showQR, setShowQR] = useState(false);

  // Close on ESC (both modals)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selected) {
          setSelected(null);
          setShowQR(false);
        } else if (openList) {
          setOpenList(false);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openList, selected]);

  // Fetch today's events when list opens
  useEffect(() => {
    if (!openList) return;
    const ymd = todayYMD(timeZone);
    setLoading(true);
    setErr(null);
    setEvents([]);

    // Choose between static folder and API shape
    const url =
      dataBase.endsWith("/api/schedule") || dataBase.includes("/api/")
        ? `${dataBase.replace(/\/$/, "")}/${ymd}`
        : `${dataBase.replace(/\/$/, "")}/${ymd}.json`;

    fetch(url, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.json() as Promise<DayPayload>;
      })
      .then((json) => setEvents(Array.isArray(json.events) ? json.events : []))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [openList, dataBase, timeZone]);

  // Click-away helper
  const clickAway =
    (closer: () => void) => (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) closer();
    };

  // Lock page scroll while any modal is open
  useEffect(() => {
    const html = document.documentElement.style;
    const body = document.body.style;
    const lock = openList || !!selected;
    html.overflow = lock ? "hidden" : "";
    body.overflow = lock ? "hidden" : "";
    return () => {
      html.overflow = "";
      body.overflow = "";
    };
  }, [openList, selected]);

  return (
    <>
      <button onClick={() => setOpenList(true)} className={triggerClassName}>
        {label}
      </button>

      {/* ===================== LIST MODAL ===================== */}
      {openList && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center   p-4"
          role="dialog"
          aria-modal="true"
          onClick={clickAway(() => setOpenList(false))}
        >
          <div className="relative w-full max-w-6xl h-[90vh] overflow-hidden rounded-2xl shadow-2xl text-white bg-[#0f2d63] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-3 bg-[#0c2653] shrink-0">
              <h2 className="text-xl font-semibold">Tech Week 2025 — Өнөөдрийн хөтөлбөр</h2>
              <button
                onClick={() => setOpenList(false)}
                className="ml-auto h-9 w-9 grid place-items-center rounded-full bg-red-500/90 hover:bg-red-600 text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body scrollable */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-5">
              {loading && <div className="opacity-80">Ачаалж байна…</div>}
              {err && <div className="text-red-300">Алдаа: {err}</div>}
              {!loading && !err && events.length === 0 && (
                <div className="opacity-80">Энэ өдөр эвент алга.</div>
              )}

              <ul className="space-y-12">
                {events.map((ev, i) => (
                  <li key={i} className="relative">
                    <div className="absolute left-28 sm:left-32 top-0 bottom-0 w-px bg-white/10" />

                    <div className="grid grid-cols-[120px,1fr,auto] sm:grid-cols-[140px,1fr,auto] gap-4 items-start">
                      {/* LEFT: location/time */}
                      <div className="pt-1 text-sm">
                        {ev.location && <div className="opacity-90">{ev.location}</div>}
                        {ev.time && (
                          <div className="mt-2 font-bold text-cyan-200">
                            {ev.time} <span className="opacity-70">цаг</span>
                          </div>
                        )}
                      </div>

                      {/* CENTER: image + text */}
                      <div className="flex gap-5 min-w-0">
                        {ev.image && (
                          <img
                            src={ev.image}
                            alt=""
                            className="w-[120px] h-[120px] rounded-lg object-cover border border-white/10"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {ev.type && (
                              <span className="text-xs font-semibold tracking-wide px-2 py-0.5 rounded bg-[#0b4a78]">
                                {ev.type.toUpperCase()}
                              </span>
                            )}
                            {ev.company && (
                              <span className="text-[11px] sm:text-xs opacity-80 tracking-widest">
                                {ev.company}
                              </span>
                            )}
                          </div>

                          <h3 className="text-2xl sm:text-[26px] font-bold leading-tight text-cyan-300 hover:text-cyan-200">
                            {ev.title}
                          </h3>

                          {ev.desc && (
                            <p className="mt-2 text-sm sm:text-[15px] opacity-90 leading-relaxed line-clamp-3">
                              {ev.desc}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* RIGHT: buttons */}
                      <div className="flex flex-col gap-2 shrink-0">
                        {ev.pay && (
                          <span className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-[#163a6b] text-white text-sm font-semibold">
                            {ev.pay}
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setSelected(ev);
                            setShowQR(false);
                          }}
                          className="h-9 px-4 rounded-lg bg-cyan-400 text-[#063247] text-sm font-bold hover:brightness-110"
                        >
                          Дэлгэрэнгүй
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 h-px bg-white/10" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ===================== DETAIL MODAL ===================== */}
      {selected && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={clickAway(() => {
            setSelected(null);
            setShowQR(false);
          })}
        >
          <div className="relative w-full max-w-5xl h-[90vh] rounded-xl bg-[#0c2653] text-white shadow-2xl overflow-hidden flex flex-col">
            {/* round X */}
            <button
              onClick={() => {
                setSelected(null);
                setShowQR(false);
              }}
              className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-red-500/90 hover:bg-red-600 text-white"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Image on top, content under (both scrollable area) */}
            <div className="flex-1 overflow-y-auto">
              {/* Top image */}
              {selected.image && (
                <div className="w-full flex justify-center bg-[#153061] px-4 pt-4">
                  <img
                    src={selected.image}
                    alt=""
                    className="max-h-[45vh] w-auto object-contain rounded-lg"
                  />
                </div>
              )}

              {/* Info under image */}
              <div className="p-6">
                <h3 className="text-2xl md:text-3xl font-bold text-cyan-300 leading-tight">
                  {selected.title}
                </h3>
                {selected.company && (
                  <p className="mt-1 text-sm opacity-80 tracking-wide">{selected.company}</p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {selected.type && (
                    <span className="text-xs font-semibold tracking-wide px-2 py-0.5 rounded bg-[#0b4a78]">
                      {selected.type}
                    </span>
                  )}
                  {selected.pay && (
                    <span className="text-xs px-2 py-0.5 rounded bg-[#163a6b]">{selected.pay}</span>
                  )}
                </div>

                {selected.desc && (
                  <p className="mt-4 text-sm leading-relaxed opacity-95">{selected.desc}</p>
                )}

                <div className="mt-4 space-y-1 text-sm">
                  {selected.location && <div>📍 {selected.location}</div>}
                  {selected.time && <div>⏰ {selected.time}</div>}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowQR(true)}
                    className="px-4 py-2 rounded-lg bg-cyan-400 text-[#063247] font-bold hover:brightness-110"
                  >
                    {selected.ctaLabel || "БҮРТГҮҮЛЭХ"}
                  </button>
                </div>

                {showQR && selected.qr && (
                  <div className="mt-6">
                    <div className="text-sm mb-2 opacity-90">Доорх QR-ийг уншуулж бүртгүүлнэ үү.</div>
                    <img src={selected.qr} alt="QR" className="w-40 h-40 rounded bg-white p-2" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
