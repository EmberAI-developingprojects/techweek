import "./globals.css";           // ← энэ мөр заавал байна
import type { Metadata } from "next";

export const metadata: Metadata = { title: "TechWeek 2025" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
