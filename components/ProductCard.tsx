import Link from "next/link";
import { PublicProduct, formatRupiah } from "@/lib/products";

export default function ProductCard({ product }: { product: PublicProduct }) {
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100
      )
    : 0;

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 transition active:scale-[0.99] ${
        product.bestSeller
          ? "ring-2 ring-accent-400 shadow-accent-200/40"
          : "ring-slate-200"
      }`}
    >
      {product.bestSeller && (
        <div className="bg-gradient-to-r from-accent-500 to-accent-400 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-white">
          ⭐ Paling Direkomendasikan
        </div>
      )}

      <div className="flex gap-4 p-4">
        {/* Ikon app-style */}
        <div className="relative grid h-20 w-20 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-4xl shadow-inner">
          <span aria-hidden>{product.emoji}</span>
          {product.badge && (
            <span className="absolute -right-1.5 -top-1.5 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
              {product.badge}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-tight text-slate-900">
            {product.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
            {product.tagline}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
              {product.category}
            </span>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              {product.format}
            </span>
          </div>
        </div>
      </div>

      {/* Fitur ringkas */}
      <ul className="space-y-1.5 px-4">
        {product.features.slice(0, 3).map((f) => (
          <li key={f} className="flex items-start gap-2 text-[13px] text-slate-600">
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      {/* Harga + tombol */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 p-4">
        <div className="min-w-0">
          {product.compareAtPrice && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 line-through">
                {formatRupiah(product.compareAtPrice)}
              </span>
              {discount > 0 && (
                <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
                  -{discount}%
                </span>
              )}
            </div>
          )}
          <span className="block text-lg font-extrabold text-slate-900">
            {formatRupiah(product.price)}
          </span>
        </div>
        <Link
          href={`/checkout/${product.id}`}
          className="inline-flex flex-shrink-0 items-center justify-center gap-1 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition active:scale-95"
        >
          Beli
        </Link>
      </div>
    </div>
  );
}
