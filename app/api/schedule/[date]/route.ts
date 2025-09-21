// app/api/schedule/[date]/route.ts
import { NextResponse } from "next/server";
import { load } from "cheerio";

export const revalidate = 300; // 5 мин кэш (шаардлагад тааруулж өөрчил)

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ date: string }> }
) {
  const { date } = await ctx.params; // ← ЭНД await хэрэгтэй!

  // #section-schedule нь сервер талд нөлөөгүй тул үндсэн index.html л татна
  const r = await fetch("https://tech-week.mn/index.html", {
    headers: { "user-agent": "Mozilla/5.0 (compatible; TWKProxy/1.0)" },
    cache: "no-store",
    next: { revalidate },
  });

  if (!r.ok) {
    return NextResponse.json({ error: r.statusText }, { status: r.status });
  }

  const raw = await r.text();
  const $ = load(raw);

  // --- Эндээс доош нь 2-р хэсэгт тайлбарласан шалтгаанаар events хоосон гарах магадлалтай ---
  // (Доорх нь “олдвол” ажиллах хэдэн selector-уудын fallback)
  const events: any[] = [];

  // 1) Possible day-wrapper by attribute
  const dateDot = date.replaceAll("-", "."); // "2025.09.21"
  const $day =
    $(`[data-day="${dateDot}"]`).first().length
      ? $(`[data-day="${dateDot}"]`).first()
      : $(`[data-date="${dateDot}"]`).first();

  // 2) Хэрвээ тусгай day wrapper олдохгүй бол бүх event картуудаас түүх (дүрмийн дагуу)
  const $scope = $day.length ? $day : $("body");

  $scope
    .find(
      [
        ".schedule-item",
        ".event-card",
        ".tw-event",
        "[class*='event']",
      ].join(",")
    )
    .each((_, el) => {
      const $el = $(el);
      const time =
        $el.find(".time, .event-time").text().trim() ||
        $el.find(":contains('цаг')").first().text().trim();
      const title =
        $el.find("h3, h2, .title, .event-title").first().text().trim();
      const location =
        $el.find(".location, .event-location").first().text().trim();
      const type = $el.find(".tag, .badge").first().text().trim();
      const desc =
        $el.find(".desc, .description, p").first().text().trim();
      const cover = $el.find("img").attr("src");

      if (title) events.push({ time, title, location, type, desc, cover });
    });

  return NextResponse.json({ date, events });
}
