// app/api/ict-proxy/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  const SRC = "https://tech-week.mn/index_ict.html";

  const r = await fetch(SRC, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; TWKProxy/1.0)" },
    cache: "no-store",
    next: { revalidate },
  });
  if (!r.ok) {
    return new NextResponse(`Load failed: ${r.status}`, {
      status: r.status,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  let html = await r.text();

  const INJECT = `
  <base href="https://tech-week.mn/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    /* ---------- Reset / base ---------- */
    *{box-sizing:border-box}
    html,body{
      height:100%; margin:0; padding:0;
      background:transparent !important; color:#e7eef6;
      font-family: Inter, Roboto, system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
      line-height:1.6;
    }
    img,video{max-width:100%;height:auto}
    a{color:#87e8ff; text-decoration:none}
    a:hover{opacity:.9; text-decoration:underline}

    /* ---------- Hide junk ---------- */
    header, footer, .subfooter, .float-text, .scrollbar-v,
    .rot-2, .rot-min-1, .de-marquee-list-1, .de-marquee-list-2,
    .sw-overlay, .jarallax-img,
    a[href="#top"], .scroll-top, .scroll-to-top, [id*="scroll"]{
      display:none !important;
    }

    /* ---------- Layout ---------- */
    body > *{max-width:1100px; margin:0 auto !important; padding:0 20px;}
    .container{width:100% !important; max-width:1100px !important;}

    /* Sections = зөөлөн card */
    section{
      margin:24px auto !important;
      padding:24px !important;
      background:rgba(8,28,70,0.55);
      border:1px solid rgba(255,255,255,0.06);
      border-radius:16px;
      box-shadow:0 8px 24px rgba(0,0,0,.28);
      backdrop-filter:blur(12px) saturate(120%);
    }

    /* Hero-г намжаана */
    #section-hero{padding:20px !important; background:none !important; min-height:auto !important;}
    #section-hero .abs, #section-hero .abs-centered{position:static !important; transform:none !important; width:auto !important;}
    #section-hero .w-80{width:100% !important}
    #section-hero .d-block.d-md-flex.justify-content-center{gap:16px; flex-wrap:wrap}

    /* ---------- Buttons ---------- */
    .fx-slide{transform:none !important}
    .mx-2{margin:0 .5rem !important}
    .btn-main{
      display:inline-flex; align-items:center; justify-content:center;
      padding:.75rem 1.25rem !important;
      border-radius:9999px !important;
      font-weight:700; letter-spacing:.2px;
      background:linear-gradient(135deg,#11c8ff,#0e6bff) !important;
      color:#0a1b3a !important;
      border:1px solid rgba(255,255,255,0.18) !important;
      box-shadow:0 8px 18px rgba(17,200,255,.25), inset 0 1px 0 rgba(255,255,255,.25) !important;
    }
    .btn-main span{color:#0a1b3a !important}
    .btn-main:hover{filter:saturate(110%) brightness(1.03)}
    .btn-line{
      background:transparent !important;
      color:#cfe5ff !important;
      border:1px solid rgba(135,232,255,.45) !important;
      box-shadow:none !important;
    }
    #section-hero a.btn-main{margin:.25rem .35rem !important}
    a[href*="event-paid"]{ 
      background:linear-gradient(135deg,#1bdbec,#3aa9ff) !important;
      color:#082035 !important;
      border-color:rgba(27,219,234,.35) !important;
    }

    /* ---------- Cards ---------- */
    .bg-blur, .panelist, .event-card, .border-white-bottom-op-2{
      background:rgba(255,255,255,0.035) !important;
      border:1px solid rgba(255,255,255,0.06) !important;
      border-radius:12px; padding:14px 16px !important; margin:8px 0 !important;
    }
    .border-white-bottom-op-2 .row{align-items:center}
    .event-line{color:#9edcff !important}

    /* ---------- Headings / text ---------- */
    h1,h2,h3,h4,h5{color:#fff !important; font-weight:800; letter-spacing:-.3px}
    p,li,small,span{color:#cfe5ff !important}
    .subtitle{color:#87e8ff !important; font-weight:700; letter-spacing:.4px}
    .lead{color:#d7ebff !important}

    /* ---------- Speaker cards ---------- */
    .hover.relative{border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,.35)}
    .hover.relative img{transition:transform .35s ease}
    .hover.relative:hover img{transform:scale(1.04)}

    /* ---------- Countdown RIBBON ---------- */
    /* Countdown байгаа хэсгийг ribbon маягаар */
    section:has(#defaultCountdown1),
    section:has(#defaultCountdown),
    section:has(.defaultCountdown){
      padding:16px !important;
      background:rgba(10,27,58,0.55) !important;
      border-radius:18px !important;
    }
    /* Ribbon доторхи wrapper */
    .twk-ribbon{
      position:relative;
      border-radius:14px;
      overflow:hidden;
      border:1px solid rgba(255,255,255,.12);
      background:linear-gradient(180deg, rgba(0,208,255,.22), rgba(0,208,255,.08) 52%, rgba(0,0,0,0));
      box-shadow:0 8px 24px rgba(0,0,0,.25);
      padding:14px 16px;
    }
    .twk-ribbon .twk-head{
      font-size:12px; font-weight:700; opacity:.9; margin-bottom:8px;
    }
    /* Ерөнхий container */
    .twk-count{
      display:flex; align-items:center; justify-content:space-between; gap:12px;
      padding:8px 6px;
    }
    .twk-title{
      font-size:clamp(20px,3.6vw,40px); font-weight:800; line-height:1.15;
    }
    .twk-cells{
      display:flex; align-items:center; gap:8px;
      padding:6px 8px; border-radius:9999px;
      border:1px solid rgba(255,255,255,.15);
      background:rgba(255,255,255,.06); backdrop-filter: blur(8px);
    }
    .twk-cell{
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      min-width:66px; padding:2px 6px;
    }
    .twk-num{
      font-size:clamp(22px,3.2vw,34px);
      font-weight:900; line-height:1; letter-spacing:.5px;
    }
    .twk-label{
      margin-top:4px; font-size:10px; letter-spacing:.18em; text-transform:uppercase; opacity:.85;
    }
    .twk-sep{ width:1px; height:26px; background:rgba(255,255,255,.15); margin:0 4px; }

    /* Плагинтай тохиолдолд (countdown-section/amount/period) – шууд гоё стилээр */
    #defaultCountdown1, #defaultCountdown, .defaultCountdown{
      display:flex; align-items:center; gap:8px;
    }
    #defaultCountdown1 .countdown-section,
    #defaultCountdown  .countdown-section,
    .defaultCountdown  .countdown-section{
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      min-width:66px; padding:4px 6px;
      border-radius:12px;
      color:#fff;
    }
    #defaultCountdown1 .countdown-amount,
    #defaultCountdown  .countdown-amount,
    .defaultCountdown  .countdown-amount{
      font-weight:900; font-size:clamp(22px,3.2vw,34px); line-height:1;
    }
    #defaultCountdown1 .countdown-period,
    #defaultCountdown  .countdown-period,
    .defaultCountdown  .countdown-period{
      margin-top:4px; font-size:10px; letter-spacing:.18em; opacity:.85; text-transform:uppercase;
    }
    #defaultCountdown1 .countdown-section + .countdown-section::before,
    #defaultCountdown  .countdown-section + .countdown-section::before,
    .defaultCountdown  .countdown-section + .countdown-section::before{
      content:""; display:block; width:1px; height:26px; background:rgba(255,255,255,.15);
      position:relative; left:-8px; margin-right:-8px;
    }

    /* ---------- Newsletter overrides (таны өмнөх CSS хэвээр) ---------- */
    .section-dark form.row.justify-content-center{ max-width:720px; margin:20px auto !important; gap:12px 10px; }
    .section-dark .subtitle + h2{ margin-top:6px !important; }
    .section-dark .lead, .section-dark p{ color:#d6ecff !important; }
    .section-dark input.form-control{
      height:56px !important; border-radius:9999px !important; padding:0 18px !important;
      text-align:left !important; background:rgba(255,255,255,.08) !important;
      border:1px solid rgba(135,232,255,.45) !important; color:#eaf6ff !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.25);
    }
    .section-dark input.form-control::placeholder{ color:#b8d8ff; }
    .section-dark input.form-control:focus{ outline:none; border-color:#59e0ff !important; box-shadow:0 0 0 3px rgba(89,224,255,.25); }
    .section-dark button.btn.bg-color{
      height:56px !important; border-radius:9999px !important; padding:0 26px !important;
      font-weight:800; letter-spacing:.3px; border:1px solid rgba(255,255,255,.18) !important;
      background:linear-gradient(135deg,#1bdbec,#3aa9ff) !important; color:#062039 !important;
      box-shadow:0 10px 22px rgba(27,219,236,.25), inset 0 1px 0 rgba(255,255,255,.35) !important; text-transform:uppercase;
    }
    .section-dark button.btn.bg-color:hover{ filter:saturate(115%) brightness(1.05); transform:translateY(-1px); }
    .section-dark .form-check{ gap:10px; align-items:center; justify-content:center; }
    .section-dark .form-check-input{ width:18px; height:18px; border-radius:4px; background:rgba(255,255,255,.1); border:1px solid rgba(135,232,255,.45); }
    .section-dark .form-check-input:checked{ background-color:#1bdbec; border-color:#1bdbec; box-shadow:0 0 0 2px rgba(27,219,236,.25); }
    .section-dark .form-check-label{ color:#cfe5ff !important; }
    @media (max-width:560px){
      .section-dark form.row.justify-content-center{ gap:10px 0; }
      .section-dark .col-auto{ width:100%; }
      .section-dark button.btn.bg-color{ width:100%; }
    }

    /* === Хоосон slide / section зайг арилгана === */
    .swiper-container:empty, .swiper:empty, .carousel:empty, .owl-stage:empty, section:empty { display:none !important; height:0 !important; margin:0 !important; padding:0 !important; border:0 !important; box-shadow:none !important; }
    .panelist img:only-child[src=""], .panelist img:only-child:not([src]) { display:none !important; }
    .swiper-slide:empty, .carousel-item:empty { display:none !important; min-height:0 !important; }
    section:empty, div:empty { margin:0 !important; padding:0 !important; }

    /* === Лого carousel хэсгийг нуух === */
    section.bg-dark.section-dark.pt-80.relative.jarallax:has(.owl-6),
    .owl-6, .owl-carousel, .owl-stage-outer, .owl-stage, .owl-nav, .owl-dots {
      display:none !important; height:0 !important; margin:0 !important; padding:0 !important; border:0 !important; box-shadow:none !important;
    }
    section.bg-dark.section-dark.pt-80.relative.jarallax:has(.owl-6) .sw-overlay,
    section.bg-dark.section-dark.pt-80.relative.jarallax:has(.owl-6) .gradient-edge-top,
    section.bg-dark.section-dark.pt-80.relative.jarallax:has(.owl-6) .gradient-edge-bottom,
    section.bg-dark.section-dark.pt-80.relative.jarallax:has(.owl-6) img.jarallax-img { display:none !important; }
  </style>

  <script>
    (function () {
      // Countdown элементийг олно
      var el = document.querySelector('#defaultCountdown1, #defaultCountdown, .defaultCountdown');
      if (!el) return;

      // Ribbon wrapper-тай болгохын тулд эргэн тойрны section-д wrapper үүсгэнэ
      var section = el.closest('section') || document.body;
      if (!section.querySelector('.twk-ribbon')) {
        var wrap = document.createElement('div');
        wrap.className = 'twk-ribbon';
        // head/title мөр
        var head = document.createElement('div');
        head.className = 'twk-head';
        head.textContent = 'ICT Forum 2025';
        wrap.appendChild(head);

        // content мөр
        var row = document.createElement('div');
        row.className = 'twk-count';

        var titleBox = document.createElement('div');
        titleBox.className = 'twk-title';
        titleBox.textContent = 'ХӨТӨЛБӨР ЭХЛЭХЭД';
        row.appendChild(titleBox);

        var cells = document.createElement('div');
        cells.className = 'twk-cells';
        row.appendChild(cells);

        wrap.appendChild(row);

        // Countdown-ыг ribbon дотор байрлуулна
        // Хэрэв plugin бүрдүүлж өгсөн бүтэцтэй бол түүнийг cells-д зөөлөн оруулна
        if (el.querySelector('.countdown-section')) {
          el.classList.add('twk-countdown-plugin');
          // секцүүдийг cells рүү шилжүүлж, сепаратор нэмнэ
          var secs = Array.prototype.slice.call(el.querySelectorAll('.countdown-section'));
          secs.forEach(function (s, i) {
            var c = document.createElement('div');
            c.className = 'twk-cell';
            var num = s.querySelector('.countdown-amount')?.textContent || s.querySelector('*')?.textContent || '';
            var lab = s.querySelector('.countdown-period')?.textContent || s.getAttribute('data-label') || '';
            c.innerHTML = '<div class="twk-num">' + num + '</div><div class="twk-label">' + lab + '</div>';
            cells.appendChild(c);
            if (i < secs.length - 1) { var sep = document.createElement('div'); sep.className = 'twk-sep'; cells.appendChild(sep); }
          });
          // Эх countdown-ыг нуух
          el.style.display = 'none';
        } else {
          // Текст хэлбэртэй (ж: "4Days12Hours57Minutes22Seconds") бол regex-оор задалж 4 нүд үүсгэнэ
          var txt = (el.textContent || '').replace(/\\s+/g, '').trim();
          var m = txt.match(/(\\d+).*?(\\d+).*?(\\d+).*?(\\d+)/);
          var labels = ['DAYS','HOURS','MINUTES','SECONDS'];
          if (m) {
            for (var i=1; i<=4; i++) {
              var cc = document.createElement('div');
              cc.className = 'twk-cell';
              cc.innerHTML = '<div class="twk-num">'+ m[i] +'</div><div class="twk-label">'+ labels[i-1] +'</div>';
              cells.appendChild(cc);
              if (i<4) { var sp=document.createElement('div'); sp.className='twk-sep'; cells.appendChild(sp); }
            }
            el.style.display = 'none';
          } else {
            // Текст мэдэгдэхгүй бол, countdown элементийг өөрийг нь cells-д хийнэ
            cells.appendChild(el);
          }
        }

        // section-ийн эхэнд ribbon-оо оруулна
        section.insertBefore(wrap, section.firstChild);
      }
    })();
  </script>
  `;

  html = html.replace(/<\/head>/i, `${INJECT}\n</head>`);

  return new NextResponse(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
