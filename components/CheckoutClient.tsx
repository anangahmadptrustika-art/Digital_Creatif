"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import PreviewGallery, { PreviewSlide } from "./PreviewGallery";

type Props = {
  productId: string;
  productName: string;
  tagline: string;
  emoji: string;
  price: number;
  priceLabel: string;
  previews?: PreviewSlide[];
  previewTabs?: string[];
  previewFile?: string;
};

type Stage = "form" | "pay" | "paid";

type CheckoutResponse = {
  orderId: string;
  amount: number;
  qrString?: string;
  qrUrl?: string;
  demoMode: boolean;
};

export default function CheckoutClient(props: Props) {
  const [stage, setStage] = useState<Stage>("form");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<CheckoutResponse | null>(null);
  const [simulating, setSimulating] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Polling status pembayaran setiap 3 detik saat di tahap "pay".
  useEffect(() => {
    if (stage !== "pay" || !data?.orderId) return;

    async function check() {
      try {
        const res = await fetch(`/api/transaction/${data!.orderId}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        if (json.status === "paid") {
          setStage("paid");
        } else if (json.status === "failed" || json.status === "expired") {
          setError(
            "Pembayaran gagal atau kedaluwarsa. Silakan coba lagi."
          );
          setStage("form");
        }
      } catch {
        /* abaikan error sementara, coba lagi di interval berikutnya */
      }
    }

    pollRef.current = setInterval(check, 3000);
    check();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [stage, data]);

  // Stop polling ketika sudah paid.
  useEffect(() => {
    if (stage === "paid" && pollRef.current) {
      clearInterval(pollRef.current);
    }
  }, [stage]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: props.productId, email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal membuat transaksi.");
        return;
      }
      setData(json);
      setStage("pay");
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSimulate() {
    if (!data?.orderId) return;
    setSimulating(true);
    try {
      await fetch("/api/simulate-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderId }),
      });
      // Polling akan menangkap perubahan status; ini hanya mempercepat.
    } finally {
      setSimulating(false);
    }
  }

  return (
    <div className="mx-auto max-w-[480px] px-5 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        ← Kembali ke katalog
      </Link>

      {/* Ringkasan produk */}
      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-3xl">
          {props.emoji}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-slate-900">
            {props.productName}
          </h1>
          <p className="truncate text-sm text-slate-500">{props.tagline}</p>
        </div>
        <div className="ml-auto text-right">
          <span className="text-xl font-extrabold text-slate-900">
            {props.priceLabel}
          </span>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Galeri preview isi produk (hanya di tahap form) */}
      {stage === "form" && props.previews && props.previews.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-bold text-slate-700">
            👀 Intip isi templatenya
          </p>
          <PreviewGallery
            slides={props.previews}
            tabs={props.previewTabs || []}
            fileName={props.previewFile}
          />
        </div>
      )}

      {/* ===== Tahap 1: Form email ===== */}
      {stage === "form" && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h2 className="text-base font-bold text-slate-900">
            Ke mana produk dikirim?
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Link download akan dikirim otomatis ke email ini setelah pembayaran
            berhasil.
          </p>
          <label className="mt-5 block text-sm font-medium text-slate-700">
            Alamat Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-brand-500/30 focus:border-brand-500 focus:ring-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Memproses…" : `Lanjut Bayar ${props.priceLabel}`}
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            🔒 Pembayaran aman diproses oleh Midtrans
          </p>
        </form>
      )}

      {/* ===== Tahap 2: Bayar QRIS ===== */}
      {stage === "pay" && data && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center">
          {data.demoMode && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-700">
              ⚠️ MODE DEMO — Midtrans belum dikonfigurasi. Gunakan tombol
              “Simulasi Bayar” di bawah untuk menguji alur.
            </div>
          )}

          <h2 className="text-base font-bold text-slate-900">
            Scan QRIS untuk Membayar
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Buka aplikasi e-wallet / m-banking, scan kode di bawah ini.
          </p>

          {/* QR */}
          <div className="mx-auto mt-5 flex h-60 w-60 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
            {data.qrUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.qrUrl}
                alt="QRIS Pembayaran"
                className="h-52 w-52 object-contain"
              />
            ) : (
              <div className="px-6 text-center">
                <div className="text-5xl">🔳</div>
                <p className="mt-3 text-xs text-slate-400">
                  {data.demoMode
                    ? "QR simulasi (mode demo)"
                    : "Memuat kode QR…"}
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm">
            <span className="text-slate-500">Total:</span>
            <span className="font-bold text-slate-900">{props.priceLabel}</span>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            Menunggu pembayaran…
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Order ID: {data.orderId}
          </p>

          {data.demoMode && (
            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
            >
              {simulating ? "Memproses…" : "✅ Simulasi Bayar (Demo)"}
            </button>
          )}
        </div>
      )}

      {/* ===== Tahap 3: Sukses ===== */}
      {stage === "paid" && data && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-3xl text-white">
            ✓
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-slate-900">
            Pembayaran Berhasil! 🎉
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
            Link download <strong>{props.productName}</strong> sudah kami kirim
            ke email <strong>{email}</strong>. Cek inbox (atau folder
            Spam/Promosi) ya.
          </p>
          <div className="mt-5 rounded-xl bg-white px-4 py-3 text-xs text-slate-500">
            Order ID: <span className="font-mono">{data.orderId}</span>
          </div>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Belanja Lagi
          </Link>
        </div>
      )}
    </div>
  );
}
