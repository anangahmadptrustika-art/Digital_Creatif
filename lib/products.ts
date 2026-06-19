// Katalog produk template digital.
// `downloadUrl` adalah link rahasia yang akan dikirim ke pembeli SETELAH pembayaran
// terkonfirmasi. Jangan tampilkan link ini di sisi client / halaman publik.
//
// Untuk produksi, sebaiknya simpan link di environment variable atau database,
// dan gunakan signed URL (mis. Google Drive/S3 presigned) yang punya masa berlaku.

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
  features: string[];
  /** Link download produk yang dikirim setelah pembayaran sukses. */
  downloadUrl: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "landing-saas",
    name: "SaaS Landing Pro",
    tagline: "Landing page modern untuk produk SaaS",
    description:
      "Template landing page SaaS lengkap dengan section hero, fitur, pricing, testimoni, dan FAQ. Dibangun dengan Next.js + Tailwind, siap deploy.",
    price: 149000,
    compareAtPrice: 299000,
    category: "Landing Page",
    emoji: "🚀",
    features: [
      "Next.js 14 + Tailwind CSS",
      "Fully responsive & dark mode",
      "8+ section siap pakai",
      "Gratis update seumur hidup",
    ],
    downloadUrl:
      process.env.PRODUCT_LINK_LANDING_SAAS ||
      "https://example.com/download/landing-saas-pro.zip",
  },
  {
    id: "portfolio-minimal",
    name: "Portfolio Minimal",
    tagline: "Tunjukkan karya terbaikmu",
    description:
      "Template portfolio bersih dan elegan untuk desainer, developer, dan kreator. Mudah dikustomisasi, loading cepat, dan SEO friendly.",
    price: 99000,
    compareAtPrice: 199000,
    category: "Portfolio",
    emoji: "🎨",
    features: [
      "Desain minimalis & elegan",
      "Galeri project interaktif",
      "Form kontak terintegrasi",
      "Optimasi SEO bawaan",
    ],
    downloadUrl:
      process.env.PRODUCT_LINK_PORTFOLIO_MINIMAL ||
      "https://example.com/download/portfolio-minimal.zip",
  },
  {
    id: "ecommerce-starter",
    name: "E-Commerce Starter Kit",
    tagline: "Toko online siap jualan",
    description:
      "Starter kit toko online dengan katalog produk, keranjang belanja, dan halaman checkout. Cocok untuk UMKM yang mau go digital.",
    price: 249000,
    compareAtPrice: 499000,
    category: "E-Commerce",
    emoji: "🛍️",
    features: [
      "Katalog & keranjang belanja",
      "Halaman checkout siap pakai",
      "Integrasi payment gateway",
      "Panel admin sederhana",
    ],
    downloadUrl:
      process.env.PRODUCT_LINK_ECOMMERCE_STARTER ||
      "https://example.com/download/ecommerce-starter.zip",
  },
  {
    id: "notion-template-bundle",
    name: "Notion Productivity Bundle",
    tagline: "Atur hidup & bisnis dalam satu workspace",
    description:
      "Bundle template Notion untuk produktivitas: planner harian, manajemen proyek, CRM sederhana, dan tracker keuangan. Tinggal duplicate.",
    price: 79000,
    compareAtPrice: 149000,
    category: "Notion",
    emoji: "📋",
    features: [
      "5 template Notion premium",
      "Planner & project management",
      "CRM & tracker keuangan",
      "Panduan setup video",
    ],
    downloadUrl:
      process.env.PRODUCT_LINK_NOTION_BUNDLE ||
      "https://example.com/download/notion-productivity-bundle.zip",
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
