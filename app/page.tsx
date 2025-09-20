import TechWeekBackground from "@/components/TechWeekBackground";

export default function Page() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      <TechWeekBackground />

      {/* Лого – зурган дээрх шиг дээд төвд */}
      <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 z-50">
        {/* Өөрийн лого зураг/компонентоо энд тавина */}
        <img
          src="/techweek-logo.svg"
          alt="TECH WEEK 2025"
          className="w-[140px] h-auto"
        />
      </div>

      {/* Дээр гарах бусад контентууд энд */}
    </main>
  );
}
