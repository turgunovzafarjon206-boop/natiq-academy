import type { Metadata } from "next";
import "./globals.css";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: "Onlayn taʼlim boshqaruv platformasi: LMS, talaba/oʻqituvchi boshqaruvi, admin panel, Telegram bot.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Til va yoʻnalish (RTL) keyinchalik next-intl orqali dinamik boʻladi.
  return (
    <html lang="uz" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
