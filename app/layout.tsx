import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Digital Creatif — Template & Landing Page Premium",
  description:
    "Beli template website & landing page premium. Bayar pakai QRIS, link produk dikirim otomatis ke email kamu. Praktis, cepat, aman.",
  keywords: [
    "template website",
    "landing page",
    "jual template",
    "QRIS",
    "template digital",
  ],
  openGraph: {
    title: "Digital Creatif — Template & Landing Page Premium",
    description:
      "Beli template premium, bayar QRIS, link produk dikirim otomatis ke email.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
