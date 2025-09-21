// lib/loadSchedule.ts
export type EventItem = {
  time?: string;
  title?: string;
  company?: string;
  type?: string;
  location?: string;
  pay?: string;
  desc?: string;
  image?: string;
  qr?: string;
};
export type DayData = { date: string; events: EventItem[] };

async function fetchDay(ymd: string): Promise<DayData | null> {
  const r = await fetch(`/schedule/${ymd}.json`, { cache: "no-store" });
  if (!r.ok) return null;
  const json = await r.json();
  return { date: ymd, events: Array.isArray(json.events) ? json.events : [] };
}

async function readIndexDates(): Promise<string[]> {
  const r = await fetch(`/schedule/index.json`, { cache: "no-store" });
  if (!r.ok) return [];
  const j = await r.json();
  if (Array.isArray(j)) return j as string[];
  if (Array.isArray(j?.dates)) return j.dates as string[];
  return [];
}

export async function loadScheduleFor(ymd: string): Promise<DayData> {
  const ok = await fetchDay(ymd);
  if (ok) return ok;

  // fallback: index.json-оос хамгийн ойр өдрийг сонгох
  const dates = await readIndexDates();
  if (!dates.length) return { date: ymd, events: [] };

  // хамгийн ойрыг сонгох (≤ closest future, эс бөгөөс хамгийн сүүлийнх)
  const target = new Date(ymd);
  const sorted = dates.slice().sort(); // YMD тул лексикоор сортловол хангалттай
  const future = sorted.find((d) => new Date(d) >= target);
  const pick = future ?? sorted[sorted.length - 1];

  const fallback = await fetchDay(pick);
  return fallback ?? { date: pick, events: [] };
}
