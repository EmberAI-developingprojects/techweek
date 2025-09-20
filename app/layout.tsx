import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-dvh overflow-hidden bg-[var(--twk-navy)] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
