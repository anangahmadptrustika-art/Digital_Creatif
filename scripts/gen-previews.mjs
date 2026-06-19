// Generator gambar preview (SVG) berbentuk tampilan spreadsheet Excel.
// Dipakai untuk galeri di landing page agar calon pembeli melihat isi produk.
// Jalankan: node scripts/gen-previews.mjs
//
// Catatan: ini MOCKUP representatif dari isi template (data dari contoh nyata).
// Untuk hasil paling meyakinkan, ganti file di public/preview/*.svg dengan
// SCREENSHOT ASLI file Excel-mu (format .png/.jpg) — lalu sesuaikan daftar
// gambar di components/PreviewGallery.tsx.

import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "preview");
mkdirSync(OUT, { recursive: true });

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const W = 980;
const LETTER_H = 18;
const TITLE_H = 26;
const SUB_H = 18;
const ROW_H = 23;
const GUTTER = 30;
const COL_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const FILL = {
  header: "#dbeafe",
  section: "#eef5ff",
  total: "#f1f5f9",
  highlight: "#fef3c7",
  altA: "#ffffff",
  altB: "#fcfcfd",
  gutter: "#f3f4f6",
  letter: "#eef2f7",
  grid: "#e5e7eb",
};

function buildSheet({ title, subtitle, bounds, aligns, rows, accent = "#16a34a" }) {
  const nCols = bounds.length - 1;
  const height = LETTER_H + TITLE_H + SUB_H + rows.length * ROW_H + 6;
  const parts = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${height}" font-family="Segoe UI, Arial, sans-serif">`
  );
  parts.push(`<rect width="${W}" height="${height}" fill="#ffffff"/>`);

  // --- Column letter band ---
  parts.push(`<rect width="${W}" height="${LETTER_H}" fill="${FILL.letter}"/>`);
  parts.push(
    `<rect x="0" y="0" width="${GUTTER}" height="${LETTER_H}" fill="${FILL.gutter}"/>`
  );
  for (let i = 0; i < nCols; i++) {
    const cx = (bounds[i] + bounds[i + 1]) / 2;
    parts.push(
      `<text x="${cx}" y="${LETTER_H - 5}" font-size="10" fill="#94a3b8" text-anchor="middle">${COL_LETTERS[i]}</text>`
    );
  }

  // --- Title + subtitle ---
  let y = LETTER_H;
  parts.push(
    `<text x="${GUTTER + 6}" y="${y + 18}" font-size="15" font-weight="700" fill="#0f172a">${esc(title)}</text>`
  );
  y += TITLE_H;
  parts.push(
    `<text x="${GUTTER + 6}" y="${y + 13}" font-size="10.5" font-style="italic" fill="#dc2626">${esc(subtitle)}</text>`
  );
  y += SUB_H;

  // --- Rows ---
  rows.forEach((row, idx) => {
    const ry = y + idx * ROW_H;
    let bg = idx % 2 === 0 ? FILL.altA : FILL.altB;
    if (row.type && FILL[row.type]) bg = FILL[row.type];
    parts.push(
      `<rect x="0" y="${ry}" width="${W}" height="${ROW_H}" fill="${bg}"/>`
    );
    // gutter (row number)
    parts.push(
      `<rect x="0" y="${ry}" width="${GUTTER}" height="${ROW_H}" fill="${FILL.gutter}"/>`
    );
    if (row.num) {
      parts.push(
        `<text x="${GUTTER / 2}" y="${ry + 16}" font-size="9.5" fill="#94a3b8" text-anchor="middle">${row.num}</text>`
      );
    }

    const bold = ["header", "section", "total", "highlight", "subhead"].includes(
      row.type
    );
    const weight = bold ? "700" : "400";

    if (row.span) {
      // teks membentang (judul section / subhead)
      parts.push(
        `<text x="${GUTTER + 8}" y="${ry + 16}" font-size="11.5" font-weight="${weight}" fill="#0f172a">${esc(row.span)}</text>`
      );
    } else if (row.cells) {
      row.cells.forEach((cell, ci) => {
        if (cell === "" || cell == null) return;
        const left = bounds[ci];
        const right = bounds[ci + 1];
        const align = aligns[ci] || "left";
        let tx = left + 6;
        let anchor = "start";
        if (align === "right") {
          tx = right - 5;
          anchor = "end";
        } else if (align === "center") {
          tx = (left + right) / 2;
          anchor = "middle";
        }
        const color =
          typeof cell === "object" && cell.color
            ? cell.color
            : row.type === "highlight"
              ? "#92400e"
              : "#1f2937";
        const text = typeof cell === "object" ? cell.t : cell;
        const fs = ci === 0 ? "10" : "10.5";
        parts.push(
          `<text x="${tx}" y="${ry + 16}" font-size="${fs}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${esc(text)}</text>`
        );
      });
    }

    // garis bawah baris
    parts.push(
      `<line x1="0" y1="${ry + ROW_H}" x2="${W}" y2="${ry + ROW_H}" stroke="${FILL.grid}" stroke-width="0.5"/>`
    );
  });

  // --- Garis vertikal kolom ---
  const gridTop = LETTER_H + TITLE_H + SUB_H;
  const gridBottom = gridTop + rows.length * ROW_H;
  parts.push(
    `<line x1="${GUTTER}" y1="${LETTER_H}" x2="${GUTTER}" y2="${gridBottom}" stroke="${FILL.grid}" stroke-width="0.5"/>`
  );
  bounds.forEach((bx) => {
    parts.push(
      `<line x1="${bx}" y1="${gridTop}" x2="${bx}" y2="${gridBottom}" stroke="${FILL.grid}" stroke-width="0.5"/>`
    );
  });

  parts.push(`</svg>`);
  return parts.join("\n");
}

const green = "#15803d";
const blue = "#1d4ed8";

// ============================ Sheet AHSP ============================
const ahsp = buildSheet({
  title: "ANALISA HARGA SATUAN PEKERJAAN (AHSP) — DIVISI 1: PERSIAPAN",
  subtitle: "Sesuai Permen PUPR No. 8 Tahun 2023, Lampiran B — Lokasi: Kab. Luwu Timur",
  bounds: [GUTTER, 300, 360, 430, 545, 730, W],
  aligns: ["left", "center", "center", "right", "right", "right"],
  rows: [
    { type: "header", cells: ["Uraian", "Kode", "Satuan", "Koefisien", "Harga Satuan (Rp)", "Jumlah Harga (Rp)"] },
    { type: "section", span: "Pembuatan 1 m' Pagar Sementara dari Kayu Tinggi 2 meter" },
    { type: "subhead", span: "A. Tenaga Kerja" },
    { num: 7, cells: ["Pekerja", "L.01", "OH", "0,6000", "110.000,00", "66.000,00"] },
    { num: 8, cells: ["Tukang Kayu", "L.02", "OH", "0,2000", "135.000,00", "27.000,00"] },
    { num: 9, cells: ["Tukang Batu", "L.02", "OH", "0,2000", "135.000,00", "27.000,00"] },
    { num: 10, cells: ["Kepala Tukang", "L.03", "OH", "0,0400", "155.000,00", "6.200,00"] },
    { num: 11, cells: ["Mandor", "L.04", "OH", "0,0130", "145.000,00", "1.885,00"] },
    { type: "total", cells: ["Jumlah Harga Tenaga Kerja", "", "", "", "", "128.085,00"] },
    { type: "subhead", span: "B. Bahan" },
    { num: 14, cells: ["Kayu Kaso 5/7 kelas II", "", "m3", "0,0387", "3.500.000,00", "135.450,00"] },
    { num: 15, cells: ["Papan Kayu 2/20", "", "m3", "0,0396", "4.000.000,00", "158.400,00"] },
    { num: 16, cells: ["Paku biasa 5 inch", "", "kg", "0,5872", "22.000,00", "12.918,40"] },
    { num: 17, cells: ["Semen Portland (PC)", "", "kg", "26,4060", "1.800,00", "47.530,80"] },
    { type: "total", cells: ["Jumlah Harga Bahan", "", "", "", "", "400.364,65"] },
    { type: "highlight", cells: ["F. Harga Satuan Pekerjaan (D+E)", "", "", "", "", "581.294,62"] },
  ],
});

// ============================ Sheet RAB ============================
const rab = buildSheet({
  title: "RENCANA ANGGARAN BIAYA (RAB) — DIVISI 1: PERSIAPAN / SITE WORK",
  subtitle: "Sumber analisa: AHSP 2026 (Permen PUPR) — Volume tinggal diisi, harga otomatis",
  bounds: [GUTTER, 64, 168, 560, 620, 720, 850, W],
  aligns: ["center", "left", "left", "center", "right", "right", "right"],
  rows: [
    { type: "header", cells: ["No", "Kode", "Uraian Pekerjaan", "Sat", "Volume", "Harga Satuan", "Jumlah Harga"] },
    { type: "section", span: "1.1  PEKERJAAN PERSIAPAN" },
    { num: "", cells: ["", "1.1.1", { t: "Pembuatan Pagar Proyek", color: "#334155" }, "", "", "", ""], type: "subhead" },
    { cells: ["1", "1.1.1.1", { t: "Pagar Sementara dari Kayu Tinggi 2 m", color: green }, "m'", "20,00", "581.295", "11.625.892"] },
    { cells: ["2", "1.1.1.2", { t: "Pagar Sementara Seng Gelombang Rangka Kayu", color: green }, "m'", "1,00", "408.556", "408.556"] },
    { cells: ["3", "1.1.1.3", { t: "Pagar Sementara dari Kawat Duri Tinggi 2 m", color: green }, "m'", "1,00", "432.410", "432.410"] },
    { cells: ["4", "1.1.1.4", { t: "Pagar Sementara Seng Rangka Baja L.40.40.4", color: green }, "m'", "1,00", "707.190", "707.190"] },
    { cells: ["5", "1.1.1.5", { t: "Pagar BRC Galvanis", color: green }, "m2", "1,00", "20.026", "20.026"] },
    { cells: ["6", "1.1.1.6", { t: "Panel Beton Pracetak 50x50x240 untuk Pagar", color: green }, "m2", "1,00", "888.488", "888.488"] },
    { num: "", cells: ["", "1.1.2", { t: "Alat dan/atau Sarana Penunjang", color: "#334155" }, "", "", "", ""], type: "subhead" },
    { cells: ["7", "1.1.2.1", { t: "Papan Nama Pekerjaan 0,8x1,2 Multiflex 18 mm", color: green }, "bh", "1,00", "1.305.480", "1.305.480"] },
    { cells: ["8", "1.1.2.3", { t: "Kantor Sementara/Gudang Semen & Peralatan", color: green }, "m2", "1,00", "1.888.051", "1.888.051"] },
    { cells: ["9", "1.1.2.4", { t: "Direksi Keet (Kantor), Los Kerja dan Gudang", color: green }, "m2", "1,00", "3.227.180", "3.227.180"] },
    { cells: ["10", "1.1.2.5", { t: "Jalan Sementara Lapis Macadam", color: green }, "m2", "1,00", "2.675.812", "2.675.812"] },
    { type: "total", cells: ["", "", "JUMLAH DIVISI 1 — PEKERJAAN PERSIAPAN", "", "", "", "23.178.085"] },
  ],
});

// ============================ Sheet BACKUP VOLUME ============================
const volume = buildSheet({
  title: "BACK UP DATA PERHITUNGAN VOLUME — DIVISI 1: PERSIAPAN",
  subtitle: "Dimensi P/L/T & Jumlah = input (biru). Volume otomatis terhitung & masuk ke RAB",
  bounds: [GUTTER, 64, 150, 470, 520, 580, 640, 700, 760, 840, W],
  aligns: ["center", "left", "left", "center", "right", "right", "right", "right", "right", "left"],
  rows: [
    { type: "header", cells: ["No", "Kode", "Uraian Pekerjaan", "Sat", "P (m)", "L (m)", "T (m)", "Jml", "Volume", "Ket"] },
    { type: "section", span: "1.1  PEKERJAAN PERSIAPAN" },
    { cells: ["1", "1.1.1.1", { t: "Pagar Sementara Kayu Tinggi 2 m", color: green }, "m'", { t: "20,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "20,00", color: "#0f172a" }, "Isi dimensi relevan"] },
    { cells: ["2", "1.1.1.2", { t: "Pagar Seng Gelombang Rangka Kayu", color: green }, "m'", { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: "#0f172a" }, "Isi dimensi relevan"] },
    { cells: ["3", "1.1.1.3", { t: "Pagar Kawat Duri Tinggi 2 m", color: green }, "m'", { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: "#0f172a" }, "Isi dimensi relevan"] },
    { cells: ["4", "1.1.1.4", { t: "Pagar Seng Rangka Baja L.40.40.4", color: green }, "m'", { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: "#0f172a" }, "Isi dimensi relevan"] },
    { cells: ["5", "1.1.1.5", { t: "Pagar BRC Galvanis", color: green }, "m2", { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: "#0f172a" }, "Isi dimensi relevan"] },
    { cells: ["6", "1.1.1.6", { t: "Panel Beton Pracetak 50x50x240", color: green }, "m2", { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: "#0f172a" }, "Isi dimensi relevan"] },
    { num: "", cells: ["", "1.1.2", { t: "Alat dan/atau Sarana Penunjang", color: "#334155" }, "", "", "", "", "", "", ""], type: "subhead" },
    { cells: ["7", "1.1.2.1", { t: "Papan Nama Pekerjaan Multiflex 18 mm", color: green }, "bh", { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: "#0f172a" }, "Isi dimensi relevan"] },
    { cells: ["8", "1.1.2.3", { t: "Kantor Sementara / Gudang Semen", color: green }, "m2", { t: "4,00", color: blue }, { t: "3,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "12,00", color: "#0f172a" }, "P x L"] },
    { cells: ["9", "1.1.2.4", { t: "Direksi Keet, Los Kerja dan Gudang", color: green }, "m2", { t: "6,00", color: blue }, { t: "4,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "24,00", color: "#0f172a" }, "P x L"] },
    { cells: ["10", "1.1.2.5", { t: "Jalan Sementara Lapis Macadam", color: green }, "m2", { t: "30,00", color: blue }, { t: "3,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "90,00", color: "#0f172a" }, "P x L"] },
  ],
});

writeFileSync(join(OUT, "ahsp.svg"), ahsp);
writeFileSync(join(OUT, "rab.svg"), rab);
writeFileSync(join(OUT, "volume.svg"), volume);
console.log("Preview SVG dibuat di public/preview/ (ahsp.svg, rab.svg, volume.svg)");
