import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "RAB Creatif — Template RAB AHSP 2026, RKK & Dokumen Proyek",
  description:
    "Jual template RAB dengan AHSP 2026 terbaru, RKK (SMKK), Kurva S, & laporan proyek format Excel untuk konsultan & kontraktor. Bayar QRIS, file dikirim otomatis ke email.",
  keywords: [
    "template RAB",
    "AHSP 2026",
    "RKK SMKK",
    "RAB Excel",
    "kurva S",
    "template konstruksi",
    "konsultan kontraktor",
    "analisa harga satuan",
  ],
  openGraph: {
    title: "RAB Creatif — Template RAB AHSP 2026, RKK & Dokumen Proyek",
    description:
      "Template RAB + AHSP 2026, RKK, Kurva S & laporan proyek (Excel). Bayar QRIS, file dikirim otomatis ke email.",
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
