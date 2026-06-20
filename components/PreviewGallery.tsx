"use client";

import { useEffect, useState } from "react";

// Galeri preview isi template dalam bingkai "jendela Excel" dengan animasi
// (fade + ken-burns) dan autoplay. Prop-driven agar bisa dipakai per produk.

export type PreviewSlide = { src: string; sheet: string; caption: string };

export default function PreviewGallery({
  slides,
  tabs,
  fileName = "Template.xlsx",
}: {
  slides: PreviewSlide[];
  tabs: string[];
  fileName?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % slides.length);
    }, 3500);
    return () => clearInterval(id);
  }, [slides.length]);

  if (!slides.length) return null;
  const activeSheet = slides[active].sheet;

  return (
    <div>
      {/* Bingkai jendela aplikasi */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-3 py-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="ml-1 flex items-center gap-1.5 truncate text-[11px] font-semibold text-slate-500">
            <span className="grid h-4 w-4 place-items-center rounded bg-emerald-600 text-[8px] font-bold text-white">
              X
            </span>
            {fileName}
          </span>
        </div>

        {/* Area gambar dengan animasi */}
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-50">
          {slides.map((slide, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={slide.src}
              src={slide.src}
              alt={`Preview sheet ${slide.sheet}`}
              loading={i === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${
                i === active ? "animate-kenburns opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <span className="absolute right-2 top-2 rounded-full bg-brand-600/95 px-2.5 py-1 text-[10px] font-bold text-white shadow">
            ✓ AHSP 2026
          </span>
        </div>

        {/* Tab sheet ala Excel */}
        <div className="flex items-center gap-0 overflow-x-auto border-t border-slate-200 bg-slate-100 px-1.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = tab === activeSheet;
            return (
              <span
                key={tab}
                className={`flex-shrink-0 rounded-t-md px-2.5 py-1 text-[10px] font-semibold ${
                  isActive
                    ? "border-b-2 border-emerald-600 bg-white text-emerald-700"
                    : "text-slate-400"
                }`}
              >
                {tab}
              </span>
            );
          })}
        </div>
      </div>

      {/* Caption + indikator */}
      <p className="mt-3 text-center text-[13px] font-medium text-slate-600">
        {slides[active].caption}
      </p>
      <div className="mt-2 flex justify-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.src}
            onClick={() => setActive(i)}
            aria-label={`Tampilkan ${s.sheet}`}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-brand-600" : "w-1.5 bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
