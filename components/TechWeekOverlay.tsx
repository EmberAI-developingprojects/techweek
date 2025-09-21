// components/TechWeekOverlay.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type EventItem = {
  time?: string;
  title?: string;
  location?: string;
  type?: string;
  price?: string | number;
  ctaUrl?: string;
  ctaLabel?: string;
  desc?: string;
  cover?: string; // optional thumbnail
};

type ApiData = {
  date: string;
  events: EventItem[];
};

type Props = {
  label?: string;
  triggerClassName?: string;
  /** 0 = today, -1 = yesterday, +1 = tomorrow ... */
  dateOffsetDays?: number;
  /** Хэрэв алдаа гарвал бүтэн сайт руу үсэрнэ */
  fallbackSrc?: string;
  /** API суурь path (өөрчилж болно) */
  apiBase?: string; // ж: "/api/schedule"
};

function toYMD(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function TechWeekOverlay({
  label = "Tech Week",
  triggerClassName = "",
  dateOffsetDays = 0,
  fallbackSrc = "https://tech-week.mn/index.html#section-schedule",
  apiBase = "/api/schedule",
}: Props) {
  const [open, setOpen] = useState(false);
  const [dateStr, setDateStr] = useState<string>("");
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Start date from offset
  const initialDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dateOffsetDays);
    return d;
  }, [dateOffsetDays]);

  useEffect(() => {
    setDateStr(toYMD(initialDate));
  }, [initialDate]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey, { passive: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock scroll when modal open
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    if (open) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [open]);

  // Fetch schedule
  const fetchSchedule = async (d: string) => {
    setLoading(true);
    setErr(null);
    setData(null);
    try {
      const r = await fetch(`${apiBase}/${d}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
      const json: ApiData = await r.json();
      setData(json);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message);
      } else {
        setErr("Татаж чадсангүй");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && dateStr) fetchSchedule(dateStr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dateStr]);

  const shiftDay = (delta: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + delta);
    setDateStr(toYMD(d));
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className={triggerClassName}>
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-[2vw]"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            className="relative w-full max-w-[1200px] h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b">
              <div className="font-semibold text-lg">Tech Week цагалбар</div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => shiftDay(-1)}
                  className="px-3 py-1 rounded-md border hover:bg-gray-50"
                  title="Өмнөх өдөр"
                >
                  ←
                </button>
                <div className="min-w-[9.5rem] text-center font-medium">
                  {dateStr}
                </div>
                <button
                  onClick={() => shiftDay(+1)}
                  className="px-3 py-1 rounded-md border hover:bg-gray-50"
                  title="Дараагийн өдөр"
                >
                  →
                </button>
                <button
                  onClick={() => fetchSchedule(dateStr)}
                  className="ml-2 px-3 py-1 rounded-md border hover:bg-gray-50"
                  title="Дахин ачаалах"
                >
                  Refresh
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="ml-2 px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white"
                  aria-label="Close"
                  dangerouslySetInnerHTML={{ __html: "&times;" }}
                />
              </div>
            </div>

            {/* Loading bar */}
            {loading && (
              <div className="absolute left-0 top-[49px] h-1 w-full bg-black/10">
                <div className="h-full w-1/3 animate-[twkLoad_1.2s_ease-in-out_infinite] bg-cyan-500/70" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              {err && (
                <div className="space-y-3">
                  <div className="text-red-600 font-medium">
                    Алдаа: {err}
                  </div>
                  <a
                    href={fallbackSrc}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Бүтэн сайтаар харах
                  </a>
                </div>
              )}

              {!err && !loading && (!data || data.events?.length === 0) && (
                <div className="text-gray-500">Энэ өдөр эвент алга.</div>
              )}

              {!err && data?.events?.length ? (
                <ul className="space-y-4">
                  {data.events.map((ev, i) => (
                    <li
                      key={i}
                      className="p-4 rounded-xl border shadow-sm hover:shadow transition bg-white/70"
                    >
                      <div className="flex items-start gap-4">
                        {ev.cover ? (
                          // optional thumbnail
                          <img
                            src={ev.cover}
                            alt=""
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                        ) : null}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            {ev.time && (
                              <span className="px-2 py-0.5 text-sm rounded bg-gray-900 text-white">
                                {ev.time}
                              </span>
                            )}
                            {ev.type && (
                              <span className="px-2 py-0.5 text-sm rounded bg-cyan-100 text-cyan-800">
                                {ev.type}
                              </span>
                            )}
                            {ev.location && (
                              <span className="px-2 py-0.5 text-sm rounded bg-gray-100 text-gray-700">
                                {ev.location}
                              </span>
                            )}
                            {ev.price && (
                              <span className="px-2 py-0.5 text-sm rounded bg-amber-100 text-amber-800">
                                {typeof ev.price === "number"
                                  ? new Intl.NumberFormat().format(ev.price)
                                  : ev.price}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-2 font-semibold text-lg leading-snug">
                            {ev.title || "No title"}
                          </h3>

                          {ev.desc && (
                            <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                              {ev.desc}
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2">
                            {ev.ctaUrl && (
                              <a
                                href={ev.ctaUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                              >
                                {ev.ctaLabel || "Дэлгэрэнгүй / Бүртгүүлэх"}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <style jsx>{`
            @keyframes twkLoad {
              0% {
                transform: translateX(-30%);
              }
              50% {
                transform: translateX(50%);
              }
              100% {
                transform: translateX(130%);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
