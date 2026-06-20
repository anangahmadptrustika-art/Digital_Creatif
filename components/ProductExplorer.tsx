"use client";

import { useState } from "react";
import { PublicProduct } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ProductExplorer({
  products,
  categories,
}: {
  products: PublicProduct[];
  categories: string[];
}) {
  const [active, setActive] = useState("Semua");

  const filtered =
    active === "Semua"
      ? products
      : products.filter((p) => p.category === active);

  return (
    <div>
      {/* Chip filter kategori — scroll horizontal ala aplikasi */}
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                isActive
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid produk */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-slate-400">
          Belum ada produk di kategori ini.
        </p>
      )}
    </div>
  );
}
