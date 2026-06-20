// Katalog produk template dokumen konstruksi (RAB, AHSP 2026, RKK, dll).
//
// `downloadUrl` adalah link RAHASIA yang dikirim ke pembeli SETELAH pembayaran
// terkonfirmasi. JANGAN pernah mengirim field ini ke client/browser.
// Gunakan getPublicProducts() untuk data yang aman ditampilkan publik.

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Harga dalam Rupiah (tanpa desimal). */
  price: number;
  /** Harga coret (opsional) untuk menampilkan diskon. */
  compareAtPrice?: number;
  category: string;
  /** Emoji/ikon sederhana sebagai placeholder thumbnail. */
  emoji: string;
  /** Format file produk, mis. "Excel (.xlsx)". */
  format: string;
  features: string[];
  /** Label badge opsional, mis. "TERLARIS", "BARU". */
  badge?: string;
  /** Tandai produk unggulan (ditonjolkan di UI). */
  bestSeller?: boolean;
  /** Nama file untuk judul bingkai jendela di galeri preview. */
  previewFile?: string;
  /** Label tab sheet (ala Excel) yang ditampilkan di galeri preview. */
  previewTabs?: string[];
  /** Daftar gambar preview isi template (aman ditampilkan ke publik). */
  previews?: { src: string; sheet: string; caption: string }[];
  /** Link download produk yang dikirim setelah pembayaran sukses. RAHASIA. */
  downloadUrl: string;
};

/** Versi produk tanpa field rahasia — aman dikirim ke client. */
export type PublicProduct = Omit<Product, "downloadUrl">;

export const PRODUCTS: Product[] = [
  {
    id: "rab-ahsp-2026",
    name: "Template RAB + AHSP 2026",
    tagline: "RAB lengkap dengan AHSP terbaru 2026",
    description:
      "Template Rencana Anggaran Biaya (RAB) format Excel dengan database AHSP (Analisa Harga Satuan Pekerjaan) 2026 terbaru. Rumus otomatis: tinggal isi volume, RAB langsung terhitung. Cocok untuk konsultan perencana & kontraktor.",
    price: 250000,
    compareAtPrice: 1000000,
    category: "RAB & AHSP",
    emoji: "📊",
    format: "Excel (.xlsx)",
    badge: "PROMO",
    bestSeller: false,
    features: [
      "Database AHSP 2026 terbaru",
      "Rumus otomatis volume → harga",
      "Rekap RAB & rekapitulasi otomatis",
      "Mudah diedit per item pekerjaan",
    ],
    previewFile: "Template-RAB-AHSP-2026.xlsx",
    previewTabs: ["Sheet1", "HSD", "AHSP", "RAB", "BACKUP VOLUME"],
    previews: [
      { src: "/preview/rab.svg", sheet: "RAB", caption: "RAB otomatis — tinggal isi volume, harga langsung muncul" },
      { src: "/preview/ahsp.svg", sheet: "AHSP", caption: "Analisa Harga Satuan (AHSP 2026) sesuai Permen PUPR" },
      { src: "/preview/volume.svg", sheet: "BACKUP VOLUME", caption: "Backup perhitungan volume tersinkron ke RAB" },
    ],
    downloadUrl:
      process.env.PRODUCT_LINK_RAB_AHSP_2026 ||
      "https://example.com/download/template-rab-ahsp-2026.xlsx",
  },
  {
    id: "rkk-smkk",
    name: "Dokumen RKK (SMKK)",
    tagline: "Rencana Keselamatan Konstruksi lengkap",
    description:
      "Template Rencana Keselamatan Konstruksi (RKK) sesuai SMKK / Permen PUPR untuk syarat tender. Sudah termasuk HIRARC, JSA, struktur organisasi K3, dan rencana penerapan SMKK. Tinggal sesuaikan dengan proyekmu.",
    price: 99000,
    compareAtPrice: 250000,
    category: "K3 & RKK",
    emoji: "🦺",
    format: "Word & Excel",
    features: [
      "Sesuai SMKK / Permen PUPR",
      "HIRARC & JSA siap pakai",
      "Struktur organisasi K3",
      "Untuk kelengkapan tender",
    ],
    previewFile: "Dokumen-RKK-SMKK.xlsx",
    previewTabs: ["PETUNJUK", "DATA PROYEK", "DAFTAR ISI", "STRUKTUR ORGANISASI", "IBPRP"],
    previews: [
      { src: "/preview/rkk-data.svg", sheet: "DATA PROYEK", caption: "Isi data proyek sekali — mengalir ke semua dokumen RKK" },
      { src: "/preview/rkk-daftarisi.svg", sheet: "DAFTAR ISI", caption: "Kerangka RKK lengkap sesuai elemen SMKK (A–E)" },
      { src: "/preview/rkk-ibprp.svg", sheet: "IBPRP", caption: "Identifikasi bahaya & risiko — nilai & tingkat otomatis" },
    ],
    downloadUrl:
      process.env.PRODUCT_LINK_RKK_SMKK ||
      "https://example.com/download/dokumen-rkk-smkk.zip",
  },
  {
    id: "kurva-s",
    name: "Kurva S & Time Schedule",
    tagline: "Penjadwalan proyek otomatis",
    description:
      "Template Kurva S dan Time Schedule format Excel. Kurva S terbentuk otomatis dari bobot pekerjaan, lengkap dengan grafik progress rencana vs realisasi. Cocok untuk monitoring proyek.",
    price: 59000,
    compareAtPrice: 150000,
    category: "Penjadwalan",
    emoji: "📅",
    format: "Excel (.xlsx)",
    features: [
      "Kurva S otomatis dari bobot",
      "Time schedule mingguan & bulanan",
      "Grafik rencana vs realisasi",
      "Bobot tersinkron dengan RAB",
    ],
    downloadUrl:
      process.env.PRODUCT_LINK_KURVA_S ||
      "https://example.com/download/kurva-s-time-schedule.xlsx",
  },
  {
    id: "laporan-proyek",
    name: "Laporan Proyek Harian–Bulanan",
    tagline: "Laporan harian, mingguan, bulanan",
    description:
      "Paket template laporan proyek: laporan harian, mingguan, dan bulanan dalam format Excel. Rekap otomatis dari laporan harian ke mingguan & bulanan. Rapi, profesional, dan siap cetak.",
    price: 49000,
    compareAtPrice: 120000,
    category: "Laporan",
    emoji: "📋",
    format: "Excel (.xlsx)",
    features: [
      "Laporan harian, mingguan, bulanan",
      "Rekap antar laporan otomatis",
      "Catatan cuaca, tenaga & material",
      "Format rapi siap cetak",
    ],
    downloadUrl:
      process.env.PRODUCT_LINK_LAPORAN_PROYEK ||
      "https://example.com/download/laporan-proyek.zip",
  },
  {
    id: "bundle-lengkap",
    name: "Bundle Lengkap Konsultan & Kontraktor",
    tagline: "Semua dokumen proyek dalam 1 paket — hemat 65%",
    description:
      "Paket komplet untuk konsultan & kontraktor: RAB + AHSP 2026, RKK (SMKK), Kurva S & Time Schedule, plus paket laporan proyek. Semua format Excel/Word, bisa diedit. Solusi sekali beli untuk semua kebutuhan dokumen proyek.",
    price: 299000,
    compareAtPrice: 870000,
    category: "Bundle",
    emoji: "📦",
    format: "Excel & Word",
    badge: "HEMAT 65%",
    bestSeller: true,
    features: [
      "RAB + AHSP 2026 terbaru",
      "Dokumen RKK lengkap (SMKK)",
      "Kurva S + Time Schedule",
      "Paket laporan harian–bulanan",
      "Update gratis & bonus pendamping",
    ],
    downloadUrl:
      process.env.PRODUCT_LINK_BUNDLE_LENGKAP ||
      "https://example.com/download/bundle-lengkap-konstruksi.zip",
  },
];

/** Daftar kategori untuk filter (chip) di landing page. */
export const CATEGORIES = [
  "Semua",
  "RAB & AHSP",
  "K3 & RKK",
  "Penjadwalan",
  "Laporan",
  "Bundle",
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** Mengembalikan produk tanpa field rahasia (downloadUrl) untuk dipakai client. */
export function getPublicProducts(): PublicProduct[] {
  return PRODUCTS.map(({ downloadUrl, ...rest }) => rest);
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
