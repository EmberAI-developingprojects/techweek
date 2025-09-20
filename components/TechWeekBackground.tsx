export default function TechWeekBackground() {
  return (
    // Виньет/grain нь БҮХ дэлгэцэд — hard edge үүсгэхгүй
    <div className="absolute inset-0 -z-10 bg-[var(--twk-navy)] bg-vignette bg-grain">
      {/* TOP зурагт хэсэг: зөв хэмжээ + aspect (гажихгүй) */}
      <svg
        className="absolute inset-x-0 top-0 w-full block pointer-events-none"
        viewBox="0 0 1280 560"
        preserveAspectRatio="xMidYMid slice"
        style={{ height: "clamp(420px, 52vh, 560px)" }}
        fill="none"
        role="presentation"
        aria-hidden="true"
      >
        <defs>
          {/* шугамын өнгө */}
          <linearGradient id="lineCyan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#00D4FF" />
            <stop offset="0.55" stopColor="#00D4FF" stopOpacity="0.45" />
            <stop offset="1" stopColor="#00D4FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineOrange" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#FFA500" />
            <stop offset="0.55" stopColor="#FFA500" stopOpacity="0.45" />
            <stop offset="1" stopColor="#FFA500" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="stem" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#66E0FF" stopOpacity="0.28" />
            <stop offset="0.55" stopColor="#66E0FF" stopOpacity="0.12" />
            <stop offset="1" stopColor="#66E0FF" stopOpacity="0" />
          </linearGradient>

          {/* зөөлөн гэрэл */}
          <filter id="glow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="10" />
          </filter>

          {/* Логоны бүс – дээд хэсгийг бүтнээр үлдээгээд доошоо аажмаар алга болгоно */}
          <linearGradient id="logoSafeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.00" stopColor="white" stopOpacity="1" />
            <stop offset="0.38" stopColor="white" stopOpacity="1" />
            <stop offset="0.52" stopColor="white" stopOpacity="0.25" />
            <stop offset="0.64" stopColor="white" stopOpacity="0.08" />
            <stop offset="1.00" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="logoSafeMask">
            {/* mask-ийн өндрийг svg-гээс илүү том болгох нь доод “хил” арилгана */}
            <rect x="0" y="-80" width="1280" height="720" fill="url(#logoSafeGrad)" />
          </mask>
        </defs>

        {/* зөвхөн неон elbow-ууд + төв иш — панелийн том fill-үүдийг авч, “банд” үүсгэх шалтгааныг арилгав */}
        <g mask="url(#logoSafeMask)">
          {/* Right / Cyan */}
          <g>
            <path
              d="M 1258 96 H 920 Q 845 96 790 150 L 652 288 Q 635 305 635 330 V 392"
              stroke="url(#lineCyan)" strokeWidth="24" opacity="0.22"
              strokeLinecap="round" filter="url(#glow)"
            />
            <path
              d="M 1258 96 H 920 Q 845 96 790 150 L 652 288 Q 635 305 635 330 V 392"
              stroke="url(#lineCyan)" strokeWidth="8" opacity="0.98"
              strokeLinecap="round"
            />
            <path
              d="M 1258 96 H 920 Q 845 96 790 150 L 652 288 Q 635 305 635 330 V 392"
              stroke="white" strokeOpacity="0.12" strokeWidth="3" strokeLinecap="round"
            />
          </g>

          {/* Left / Orange */}
          <g>
            <path
              d="M 22 96 H 360 Q 435 96 490 150 L 628 288 Q 645 305 645 330 V 392"
              stroke="url(#lineOrange)" strokeWidth="24" opacity="0.20"
              strokeLinecap="round" filter="url(#glow)"
            />
            <path
              d="M 22 96 H 360 Q 435 96 490 150 L 628 288 Q 645 305 645 330 V 392"
              stroke="url(#lineOrange)" strokeWidth="8" opacity="0.98"
              strokeLinecap="round"
            />
            <path
              d="M 22 96 H 360 Q 435 96 490 150 L 628 288 Q 645 305 645 330 V 392"
              stroke="white" strokeOpacity="0.10" strokeWidth="3" strokeLinecap="round"
            />
          </g>

          {/* center stem */}
          <path d="M 640 220 V 440" stroke="url(#stem)" strokeWidth="6" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
