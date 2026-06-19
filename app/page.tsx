import { getPublicProducts, CATEGORIES } from "@/lib/products";
import ProductExplorer from "@/components/ProductExplorer";

const TRUST = [
  { icon: "📐", label: "AHSP 2026" },
  { icon: "📗", label: "Format Excel" },
  { icon: "✏️", label: "Bisa Diedit" },
  { icon: "⚡", label: "Kirim Otomatis" },
];

const COCOK_UNTUK = [
  "Konsultan Perencana",
  "Kontraktor",
  "Estimator",
  "Pengawas Proyek",
  "Mahasiswa Teknik Sipil",
  "Freelancer Konstruksi",
];

const STEPS = [
  {
    icon: "🛒",
    title: "Pilih Template",
    desc: "Pilih RAB+AHSP, RKK, Kurva S, atau ambil bundle lengkap.",
  },
  {
    icon: "📱",
    title: "Bayar via QRIS",
    desc: "Scan QRIS pakai e-wallet / m-banking apa saja. Aman & instan.",
  },
  {
    icon: "📧",
    title: "File Dikirim Otomatis",
    desc: "Begitu lunas, link download file Excel langsung masuk ke emailmu.",
  },
];

const KEUNGGULAN = [
  {
    icon: "📐",
    title: "AHSP 2026 Terbaru",
    desc: "Database analisa harga satuan mengacu standar terbaru, siap pakai.",
  },
  {
    icon: "🧮",
    title: "Rumus Otomatis",
    desc: "Tinggal isi volume — RAB, rekap, dan kurva S terhitung sendiri.",
  },
  {
    icon: "🦺",
    title: "Lengkap untuk Tender",
    desc: "RKK / SMKK sesuai Permen PUPR untuk syarat administrasi tender.",
  },
  {
    icon: "✏️",
    title: "Mudah Disesuaikan",
    desc: "Semua sel terbuka & bisa diedit sesuai kebutuhan proyekmu.",
  },
];

const FAQS = [
  {
    q: "Apakah AHSP-nya versi 2026 terbaru?",
    a: "Ya. Template RAB sudah memakai database AHSP (Analisa Harga Satuan Pekerjaan) edisi 2026 terbaru, dan tetap bisa kamu sesuaikan dengan harga satuan daerahmu.",
  },
  {
    q: "Filenya bisa diedit sendiri?",
    a: "Bisa 100%. Seluruh file berformat Excel/Word dengan sel terbuka — kamu bebas mengubah item pekerjaan, volume, harga, hingga logo perusahaan.",
  },
  {
    q: "Setelah bayar, kapan filenya saya terima?",
    a: "Otomatis & instan. Begitu pembayaran QRIS terkonfirmasi (hitungan detik), link download dikirim langsung ke email yang kamu isi saat checkout.",
  },
  {
    q: "Bisa dipakai untuk dokumen tender?",
    a: "Sangat bisa. Dokumen RKK/SMKK disusun mengikuti Permen PUPR sehingga cocok untuk kelengkapan administrasi dan keselamatan konstruksi pada tender.",
  },
  {
    q: "Bagaimana cara pembayarannya?",
    a: "Cukup scan QRIS yang muncul memakai aplikasi e-wallet (GoPay, OVO, DANA, ShopeePay) atau m-banking apa pun yang mendukung QRIS. Diproses aman lewat Midtrans.",
  },
  {
    q: "File tidak masuk ke email, bagaimana?",
    a: "Cek folder Spam/Promosi dulu. Jika dalam beberapa menit belum ada, hubungi kami dengan menyertakan Order ID kamu untuk dikirim ulang.",
  },
];

export default function HomePage() {
  const products = getPublicProducts();

  return (
    <div className="min-h-screen bg-slate-100 bg-[radial-gradient(circle_at_1px_1px,theme(colors.slate.300)_1px,transparent_0)] [background-size:22px_22px]">
      {/* Shell aplikasi — kolom selebar HP, di tengah */}
      <div className="relative mx-auto min-h-screen max-w-[480px] bg-slate-50 pb-24 shadow-2xl ring-1 ring-slate-200">
        <span id="top" className="absolute top-0" />
        {/* ===== App bar ===== */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-sm font-extrabold text-white">
              RC
            </span>
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-slate-900">RAB Creatif</p>
              <p className="text-[11px] text-slate-500">Template Proyek Konstruksi</p>
            </div>
          </div>
          <a
            href="#produk"
            className="rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow active:scale-95"
          >
            Lihat Produk
          </a>
        </header>

        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden px-5 pb-8 pt-7">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-300/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 top-20 h-40 w-40 rounded-full bg-brand-300/40 blur-3xl" />

          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1 text-xs font-bold text-accent-700">
            🔥 Update AHSP 2026 Terbaru
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900">
            Template{" "}
            <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
              RAB &amp; AHSP 2026
            </span>{" "}
            untuk Konsultan &amp; Kontraktor
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Hemat waktu bikin <strong>RAB, RKK, Kurva S</strong>, &amp; laporan
            proyek. Format <strong>Excel siap edit</strong>, rumus otomatis.
            Bayar QRIS — file langsung dikirim ke emailmu.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="#produk"
              className="flex-1 rounded-2xl bg-brand-600 px-5 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-brand-600/30 active:scale-95"
            >
              Lihat Template
            </a>
            <a
              href="#cara"
              className="rounded-2xl bg-white px-5 py-3.5 text-center text-sm font-bold text-slate-700 ring-1 ring-slate-200 active:scale-95"
            >
              Cara Pesan
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            {TRUST.map((t) => (
              <div
                key={t.label}
                className="rounded-2xl bg-white p-2.5 text-center shadow-sm ring-1 ring-slate-100"
              >
                <div className="text-xl">{t.icon}</div>
                <div className="mt-1 text-[10px] font-semibold leading-tight text-slate-600">
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Cocok untuk ===== */}
        <section className="px-5 pb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Cocok untuk
          </p>
          <div className="flex flex-wrap gap-2">
            {COCOK_UNTUK.map((c) => (
              <span
                key={c}
                className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* ===== Cara kerja ===== */}
        <section id="cara" className="bg-white px-5 py-8">
          <h2 className="text-xl font-extrabold text-slate-900">
            Cara Pesan — 3 Langkah
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            100% otomatis, tanpa nunggu admin balas chat.
          </p>
          <div className="mt-5 space-y-3">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"
              >
                <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-white text-2xl shadow-sm">
                  {step.icon}
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-[11px] text-white">
                      {i + 1}
                    </span>
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-[13px] text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Keunggulan ===== */}
        <section className="px-5 py-8">
          <h2 className="text-xl font-extrabold text-slate-900">
            Kenapa Pilih Template Kami?
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {KEUNGGULAN.map((k) => (
              <div
                key={k.title}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-xl">
                  {k.icon}
                </div>
                <p className="mt-2.5 text-sm font-bold text-slate-900">
                  {k.title}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
                  {k.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Produk ===== */}
        <section id="produk" className="bg-white px-5 py-8">
          <h2 className="text-xl font-extrabold text-slate-900">
            Pilih Template
          </h2>
          <p className="mb-4 mt-1 text-sm text-slate-500">
            Ketuk kategori untuk memfilter produk.
          </p>
          <ProductExplorer products={products} categories={CATEGORIES} />
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="px-5 py-8">
          <h2 className="text-xl font-extrabold text-slate-900">
            Pertanyaan Umum
          </h2>
          <div className="mt-4 space-y-2.5">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl bg-white p-4 ring-1 ring-slate-100"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-slate-900">
                  {faq.q}
                  <span className="ml-3 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2.5 text-[13px] leading-relaxed text-slate-600">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="px-5 pb-8">
          <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-center text-white shadow-xl">
            <h2 className="text-xl font-extrabold">Siap Hemat Waktu Bikin RAB?</h2>
            <p className="mt-2 text-sm text-white/85">
              Tinggal beli, bayar QRIS, file Excel langsung di emailmu.
            </p>
            <a
              href="#produk"
              className="mt-5 inline-block rounded-2xl bg-white px-7 py-3 text-sm font-bold text-brand-700 shadow active:scale-95"
            >
              Lihat Semua Template
            </a>
          </div>
        </section>

        {/* ===== Footer ===== */}
        <footer className="px-5 pb-6 text-center">
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} RAB Creatif · Template Dokumen Proyek
            Konstruksi
          </p>
        </footer>

        {/* ===== Bottom navigation (ala aplikasi) ===== */}
        <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-[480px] -translate-x-1/2 items-center justify-around border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur">
          <BottomLink href="#top" icon="🏠" label="Beranda" />
          <BottomLink href="#produk" icon="🗂️" label="Produk" />
          <BottomLink href="#cara" icon="📝" label="Cara" />
          <BottomLink href="#faq" icon="❓" label="FAQ" />
        </nav>
      </div>
    </div>
  );
}

function BottomLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-slate-500 transition active:scale-90 active:bg-slate-100"
    >
      <span className="text-lg leading-none">{icon}</span>
      <span className="text-[10px] font-semibold">{label}</span>
    </a>
  );
}
