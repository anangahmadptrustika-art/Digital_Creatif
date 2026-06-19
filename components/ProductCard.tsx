import Link from "next/link";
import { Product, formatRupiah } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100
      )
    : 0;

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      {/* Thumbnail */}
      <div className="relative flex h-44 items-center justify-center rounded-t-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-6xl">
        <span aria-hidden>{product.emoji}</span>
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
          {product.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{product.tagline}</p>

        <ul className="mt-4 space-y-1.5">
          {product.features.slice(0, 3).map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-sm text-slate-600"
            >
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-end justify-between">
          <div>
            {product.compareAtPrice && (
              <span className="block text-xs text-slate-400 line-through">
                {formatRupiah(product.compareAtPrice)}
              </span>
            )}
            <span className="text-xl font-extrabold text-slate-900">
              {formatRupiah(product.price)}
            </span>
          </div>
        </div>

        <Link
          href={`/checkout/${product.id}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Beli Sekarang
        </Link>
      </div>
    </div>
  );
}
