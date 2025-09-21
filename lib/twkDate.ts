// lib/twkDate.ts
export function todayYMD(timeZone = "Asia/Ulaanbaatar") {
  const d = new Date();
  const y = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric" }).format(d); // 2025
  const m = new Intl.DateTimeFormat("en-CA", { timeZone, month: "2-digit" }).format(d); // 09
  const day = new Intl.DateTimeFormat("en-CA", { timeZone, day: "2-digit" }).format(d); // 21
  return `${y}-${m}-${day}`; // 2025-09-21
}
