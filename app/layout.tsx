import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Клуб",
  description: "Закрытое сообщество",
  robots: "noindex, nofollow", // Скрываем от поисковиков
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-obsidian antialiased">{children}</body>
    </html>
  );
}
