import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const STEPS = [
  {
    icon: "🛒",
    title: "Pilih Template",
    desc: "Pilih template atau landing page yang kamu suka dari katalog kami.",
  },
  {
    icon: "📱",
    title: "Bayar via QRIS",
    desc: "Scan QRIS pakai aplikasi e-wallet atau m-banking apa pun. Cepat & aman.",
  },
  {
    icon: "📧",
    title: "Link Dikirim Otomatis",
    desc: "Begitu pembayaran terkonfirmasi, link download langsung dikirim ke emailmu.",
  },
];

const FAQS = [
  {
    q: "Bagaimana cara pembayarannya?",
    a: "Cukup pilih produk, masukkan email, lalu scan QRIS yang muncul menggunakan aplikasi e-wallet (GoPay, OVO, DANA, ShopeePay) atau m-banking apa pun yang mendukung QRIS.",
  },
  {
    q: "Kapan saya menerima produknya?",
    a: "Otomatis dan instan! Begitu pembayaran terkonfirmasi (biasanya dalam hitungan detik), link download akan langsung dikirim ke alamat email yang kamu masukkan saat checkout.",
  },
  {
    q: "Apakah pembayaran aman?",
    a: "Sangat aman. Pembayaran diproses melalui Midtrans, payment gateway resmi berlisensi Bank Indonesia. Kami tidak menyimpan data pembayaranmu.",
  },
  {
    q: "Bisakah saya pakai template untuk banyak project?",
    a: "Ya. Setelah membeli, kamu mendapat lisensi penggunaan dan bisa memakai serta memodifikasi template sesuai kebutuhan project-mu.",
  },
  {
    q: "Email produk tidak masuk, bagaimana?",
    a: "Cek folder Spam/Promosi terlebih dahulu. Jika tetap tidak ada dalam beberapa menit, hubungi kami dengan menyertakan Order ID kamu dan kami akan kirim ulang.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ===== Navbar ===== */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2 font-extrabold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
              DC
            </span>
            <span className="text-lg">Digital Creatif</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#produk" className="hover:text-brand-600">
              Produk
            </a>
            <a href="#cara-kerja" className="hover:text-brand-600">
              Cara Kerja
            </a>
            <a href="#faq" className="hover:text-brand-600">
              FAQ
            </a>
          </nav>
          <a
            href="#produk"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Lihat Produk
          </a>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-blob absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand-200 opacity-50 blur-3xl" />
          <div className="animate-blob absolute right-0 top-20 h-72 w-72 rounded-full bg-fuchsia-200 opacity-40 blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-5 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
            ⚡ Bayar QRIS · Produk dikirim otomatis
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
            Template & Landing Page Premium,
            <span className="bg-gradient-to-r from-brand-600 to-fuchsia-600 bg-clip-text text-transparent">
              {" "}
              Langsung Jadi
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Hemat waktu berhari-hari. Pilih template, bayar pakai QRIS, dan
            terima link download produk otomatis di email kamu — semua dalam
            hitungan menit.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#produk"
              className="w-full rounded-xl bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 sm:w-auto"
            >
              Jelajahi Template
            </a>
            <a
              href="#cara-kerja"
              className="w-full rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition hover:border-slate-400 sm:w-auto"
            >
              Lihat Cara Kerja
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
            <span className="flex items-center gap-2">✅ Pembayaran QRIS</span>
            <span className="flex items-center gap-2">⚡ Pengiriman instan</span>
            <span className="flex items-center gap-2">🔒 Transaksi aman</span>
            <span className="flex items-center gap-2">♾️ Update seumur hidup</span>
          </div>
        </div>
      </section>

      {/* ===== Cara Kerja ===== */}
      <section id="cara-kerja" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
              Cara Kerjanya — Cuma 3 Langkah
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Proses 100% otomatis. Tidak perlu menunggu admin balas chat.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-3xl">
                  {step.icon}
                </div>
                <div className="mx-auto mt-4 grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Produk ===== */}
      <section id="produk" className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Pilih Template Favoritmu
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Semua template siap pakai, mudah dikustomisasi, dan loading cepat.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <h2 className="text-center text-3xl font-extrabold text-slate-900 md:text-4xl">
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <div className="mt-10 space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900">
                  {faq.q}
                  <span className="ml-4 text-brand-600 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-gradient-to-r from-brand-600 to-fuchsia-600">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center text-white">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Siap Hemat Waktu & Uang?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Mulai dari template favoritmu sekarang. Bayar QRIS, terima produk
            otomatis.
          </p>
          <a
            href="#produk"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-brand-700 shadow-lg transition hover:bg-slate-100"
          >
            Mulai Sekarang
          </a>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-500 md:flex-row">
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white">
              DC
            </span>
            Digital Creatif
          </div>
          <p>
            © {new Date().getFullYear()} Digital Creatif. Semua hak dilindungi.
          </p>
        </div>
      </footer>
    </main>
  );
}
