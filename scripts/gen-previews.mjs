// Generator gambar preview (SVG) berbentuk tampilan spreadsheet Excel.
// Dipakai untuk galeri di landing page & halaman checkout agar calon pembeli
// melihat isi produk. Jalankan: node scripts/gen-previews.mjs
//
// Catatan: ini MOCKUP representatif dari isi template (data dari contoh nyata).
// Untuk hasil paling meyakinkan, ganti file di public/preview/*.svg dengan
// SCREENSHOT ASLI file Excel (format .png/.jpg) lalu sesuaikan `previews`
// pada masing-masing produk di lib/products.ts.

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
  navy: "#1e3a5f",
  cream: "#fffbeb",
  orange: "#f59e0b",
};

const green = "#15803d";
const blue = "#1d4ed8";
const amber = "#b45309";

function buildSheet({
  title,
  subtitle,
  banner,
  subBanner,
  note,
  bounds,
  aligns,
  rows,
}) {
  const nCols = bounds.length - 1;
  // tinggi header area (banner/title)
  let headTop = LETTER_H;
  const blocks = [];
  if (banner) {
    blocks.push({ kind: "banner", text: banner, h: 30 });
  } else if (title) {
    blocks.push({ kind: "title", text: title, h: 26 });
  }
  if (subBanner) {
    blocks.push({ kind: "subBanner", text: subBanner, h: 22 });
  } else if (subtitle) {
    blocks.push({ kind: "subtitle", text: subtitle, h: 18 });
  }
  if (note) blocks.push({ kind: "note", text: note, h: 18 });
  const headH = blocks.reduce((a, b) => a + b.h, 0);
  const gridTop = headTop + headH;
  const height = gridTop + rows.length * ROW_H + 6;

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

  // --- Header blocks (banner/title/subtitle/note) ---
  let by = headTop;
  for (const b of blocks) {
    if (b.kind === "banner") {
      parts.push(
        `<rect x="${GUTTER}" y="${by}" width="${W - GUTTER}" height="${b.h}" fill="${FILL.navy}"/>`
      );
      parts.push(
        `<text x="${(GUTTER + W) / 2}" y="${by + b.h / 2 + 6}" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">${esc(b.text)}</text>`
      );
    } else if (b.kind === "subBanner") {
      parts.push(
        `<rect x="${GUTTER}" y="${by}" width="${W - GUTTER}" height="${b.h}" fill="${FILL.orange}"/>`
      );
      parts.push(
        `<text x="${(GUTTER + W) / 2}" y="${by + b.h / 2 + 5}" font-size="11.5" font-weight="700" fill="#ffffff" text-anchor="middle">${esc(b.text)}</text>`
      );
    } else if (b.kind === "title") {
      parts.push(
        `<text x="${GUTTER + 6}" y="${by + 18}" font-size="15" font-weight="700" fill="#0f172a">${esc(b.text)}</text>`
      );
    } else if (b.kind === "subtitle") {
      parts.push(
        `<text x="${GUTTER + 6}" y="${by + 13}" font-size="10.5" font-style="italic" fill="#dc2626">${esc(b.text)}</text>`
      );
    } else if (b.kind === "note") {
      parts.push(
        `<text x="${GUTTER + 6}" y="${by + 13}" font-size="10" fill="#64748b">${esc(b.text)}</text>`
      );
    }
    by += b.h;
  }

  // --- Rows ---
  rows.forEach((row, idx) => {
    const ry = gridTop + idx * ROW_H;
    let bg = idx % 2 === 0 ? FILL.altA : FILL.altB;
    if (row.type && FILL[row.type]) bg = FILL[row.type];
    if (row.type === "navhead") bg = FILL.navy;
    if (row.type === "form") bg = FILL.cream;
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

    const bold = [
      "header",
      "section",
      "total",
      "highlight",
      "subhead",
      "navhead",
      "form",
    ].includes(row.type);
    const weight = bold ? "700" : "400";

    if (row.span) {
      parts.push(
        `<text x="${GUTTER + 8}" y="${ry + 16}" font-size="11.5" font-weight="${weight}" fill="#0f172a">${esc(row.span)}</text>`
      );
    } else if (row.type === "form") {
      // 2 kolom: label (navy) | value (cream, biru)
      const b0 = bounds[0],
        b1 = bounds[1],
        b2 = bounds[2];
      parts.push(
        `<rect x="${b0}" y="${ry}" width="${b1 - b0}" height="${ROW_H}" fill="${FILL.navy}"/>`
      );
      parts.push(
        `<text x="${b0 + 8}" y="${ry + 16}" font-size="10.5" font-weight="700" fill="#ffffff">${esc(row.cells[0])}</text>`
      );
      parts.push(
        `<text x="${b1 + 8}" y="${ry + 16}" font-size="10.5" fill="${blue}">${esc(row.cells[1])}</text>`
      );
    } else if (row.type === "navhead") {
      // kode (putih) | judul (putih) di atas latar navy
      parts.push(
        `<text x="${(bounds[0] + bounds[1]) / 2}" y="${ry + 16}" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">${esc(row.cells[0])}</text>`
      );
      parts.push(
        `<text x="${bounds[1] + 8}" y="${ry + 16}" font-size="10.5" font-weight="700" fill="#ffffff">${esc(row.cells[1])}</text>`
      );
    } else if (row.cells) {
      row.cells.forEach((cell, ci) => {
        if (cell === "" || cell == null) return;
        const left = bounds[ci];
        const right = bounds[ci + 1];
        const align = aligns[ci] || "left";
        // latar khusus cell (mis. tingkat risiko)
        if (typeof cell === "object" && cell.bg) {
          parts.push(
            `<rect x="${left + 1}" y="${ry + 1}" width="${right - left - 2}" height="${ROW_H - 2}" fill="${cell.bg}"/>`
          );
        }
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

    parts.push(
      `<line x1="0" y1="${ry + ROW_H}" x2="${W}" y2="${ry + ROW_H}" stroke="${FILL.grid}" stroke-width="0.5"/>`
    );
  });

  // --- Garis vertikal kolom ---
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

const sheets = {};

// ============================ Sheet AHSP ============================
sheets["ahsp.svg"] = buildSheet({
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
sheets["rab.svg"] = buildSheet({
  title: "RENCANA ANGGARAN BIAYA (RAB) — DIVISI 1: PERSIAPAN / SITE WORK",
  subtitle: "Sumber analisa: AHSP 2026 (Permen PUPR) — Volume tinggal diisi, harga otomatis",
  bounds: [GUTTER, 64, 168, 560, 620, 720, 850, W],
  aligns: ["center", "left", "left", "center", "right", "right", "right"],
  rows: [
    { type: "header", cells: ["No", "Kode", "Uraian Pekerjaan", "Sat", "Volume", "Harga Satuan", "Jumlah Harga"] },
    { type: "section", span: "1.1  PEKERJAAN PERSIAPAN" },
    { type: "subhead", cells: ["", "1.1.1", { t: "Pembuatan Pagar Proyek", color: "#334155" }, "", "", "", ""] },
    { cells: ["1", "1.1.1.1", { t: "Pagar Sementara dari Kayu Tinggi 2 m", color: green }, "m'", "20,00", "581.295", "11.625.892"] },
    { cells: ["2", "1.1.1.2", { t: "Pagar Sementara Seng Gelombang Rangka Kayu", color: green }, "m'", "1,00", "408.556", "408.556"] },
    { cells: ["3", "1.1.1.3", { t: "Pagar Sementara dari Kawat Duri Tinggi 2 m", color: green }, "m'", "1,00", "432.410", "432.410"] },
    { cells: ["4", "1.1.1.4", { t: "Pagar Sementara Seng Rangka Baja L.40.40.4", color: green }, "m'", "1,00", "707.190", "707.190"] },
    { cells: ["5", "1.1.1.5", { t: "Pagar BRC Galvanis", color: green }, "m2", "1,00", "20.026", "20.026"] },
    { cells: ["6", "1.1.1.6", { t: "Panel Beton Pracetak 50x50x240 untuk Pagar", color: green }, "m2", "1,00", "888.488", "888.488"] },
    { type: "subhead", cells: ["", "1.1.2", { t: "Alat dan/atau Sarana Penunjang", color: "#334155" }, "", "", "", ""] },
    { cells: ["7", "1.1.2.1", { t: "Papan Nama Pekerjaan 0,8x1,2 Multiflex 18 mm", color: green }, "bh", "1,00", "1.305.480", "1.305.480"] },
    { cells: ["8", "1.1.2.3", { t: "Kantor Sementara/Gudang Semen & Peralatan", color: green }, "m2", "1,00", "1.888.051", "1.888.051"] },
    { cells: ["9", "1.1.2.4", { t: "Direksi Keet (Kantor), Los Kerja dan Gudang", color: green }, "m2", "1,00", "3.227.180", "3.227.180"] },
    { cells: ["10", "1.1.2.5", { t: "Jalan Sementara Lapis Macadam", color: green }, "m2", "1,00", "2.675.812", "2.675.812"] },
    { type: "total", cells: ["", "", "JUMLAH DIVISI 1 — PEKERJAAN PERSIAPAN", "", "", "", "23.178.085"] },
  ],
});

// ============================ Sheet BACKUP VOLUME ============================
sheets["volume.svg"] = buildSheet({
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
    { type: "subhead", cells: ["", "1.1.2", { t: "Alat dan/atau Sarana Penunjang", color: "#334155" }, "", "", "", "", "", "", ""] },
    { cells: ["7", "1.1.2.1", { t: "Papan Nama Pekerjaan Multiflex 18 mm", color: green }, "bh", { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: "#0f172a" }, "Isi dimensi relevan"] },
    { cells: ["8", "1.1.2.3", { t: "Kantor Sementara / Gudang Semen", color: green }, "m2", { t: "4,00", color: blue }, { t: "3,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "12,00", color: "#0f172a" }, "P x L"] },
    { cells: ["9", "1.1.2.4", { t: "Direksi Keet, Los Kerja dan Gudang", color: green }, "m2", { t: "6,00", color: blue }, { t: "4,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "24,00", color: "#0f172a" }, "P x L"] },
    { cells: ["10", "1.1.2.5", { t: "Jalan Sementara Lapis Macadam", color: green }, "m2", { t: "30,00", color: blue }, { t: "3,00", color: blue }, { t: "1,00", color: blue }, { t: "1,00", color: blue }, { t: "90,00", color: "#0f172a" }, "P x L"] },
  ],
});

// ======================= RKK — Sheet DATA PROYEK =======================
sheets["rkk-data.svg"] = buildSheet({
  banner: "DATA PROYEK",
  subBanner: "Isi sekali — mengalir otomatis ke seluruh dokumen RKK",
  note: "Isi seluruh kolom di bawah (teks biru = input).",
  bounds: [GUTTER, 340, W],
  aligns: ["left", "left"],
  rows: [
    { type: "form", cells: ["Nama Paket Pekerjaan", "Pembangunan Gedung Kantor 2 Lantai"] },
    { type: "form", cells: ["Lokasi Pekerjaan", "Kabupaten Luwu Timur, Sulawesi Selatan"] },
    { type: "form", cells: ["Nomor Kontrak", "..../SPK/.../2026"] },
    { type: "form", cells: ["Tanggal Kontrak", "01 Juli 2026"] },
    { type: "form", cells: ["Nilai Kontrak (Rp)", "(otomatis mengikuti RAB)"] },
    { type: "form", cells: ["Masa Pelaksanaan", "180 hari kalender"] },
    { type: "form", cells: ["Sumber Dana / Tahun Anggaran", "APBD / 2026"] },
    { type: "form", cells: ["Nama Penyedia Jasa (Kontraktor)", "PT / CV ............................"] },
    { type: "form", cells: ["Nama Direktur / Pimpinan", "............................"] },
    { type: "form", cells: ["Jabatan Penandatangan", "Direktur"] },
    { type: "form", cells: ["Petugas Keselamatan Konstruksi", "............................"] },
    { type: "form", cells: ["Jabatan Petugas K3", "Ahli K3 Konstruksi / Petugas K3"] },
  ],
});

// ======================= RKK — Sheet DAFTAR ISI =======================
sheets["rkk-daftarisi.svg"] = buildSheet({
  banner: "KERANGKA / DAFTAR ISI RKK",
  subBanner: "Elemen Sistem Manajemen Keselamatan Konstruksi (SMKK)",
  bounds: [GUTTER, 120, W],
  aligns: ["center", "left"],
  rows: [
    { type: "navhead", cells: ["A", "KEPEMIMPINAN & PARTISIPASI TENAGA KERJA DALAM KESELAMATAN KONSTRUKSI"] },
    { cells: [{ t: "A.1", color: amber }, "Kepedulian Pimpinan terhadap Isu Eksternal dan Internal"] },
    { cells: [{ t: "A.2", color: amber }, "Komitmen Keselamatan Konstruksi (Pakta Komitmen)"] },
    { cells: [{ t: "A.3", color: amber }, "Organisasi Pengelola SMKK – Unit Keselamatan Konstruksi (UKK)"] },
    { type: "navhead", cells: ["B", "PERENCANAAN KESELAMATAN KONSTRUKSI"] },
    { cells: [{ t: "B.1", color: amber }, "Identifikasi Bahaya, Penilaian Risiko, Pengendalian & Peluang (IBPRP)"] },
    { cells: [{ t: "B.2", color: amber }, "Rencana Tindakan: Sasaran Khusus & Program Khusus"] },
    { cells: [{ t: "B.3", color: amber }, "Standar dan Peraturan Perundang-undangan"] },
    { type: "navhead", cells: ["C", "DUKUNGAN KESELAMATAN KONSTRUKSI"] },
    { cells: [{ t: "C.1", color: amber }, "Sumber Daya (Peralatan, Material, Biaya SMKK)"] },
    { cells: [{ t: "C.2", color: amber }, "Kompetensi Tenaga Kerja"] },
    { cells: [{ t: "C.3", color: amber }, "Kepedulian & Komunikasi"] },
    { cells: [{ t: "C.4", color: amber }, "Informasi Terdokumentasi"] },
    { type: "navhead", cells: ["D", "OPERASI KESELAMATAN KONSTRUKSI"] },
    { cells: [{ t: "D.1", color: amber }, "Perencanaan & Pengendalian Operasi (SOP, AKB/JSA, Izin Kerja, APD)"] },
    { cells: [{ t: "D.2", color: amber }, "Kesiapan & Tanggap Darurat"] },
    { type: "navhead", cells: ["E", "EVALUASI KINERJA KESELAMATAN KONSTRUKSI"] },
    { cells: [{ t: "E.1", color: amber }, "Pemantauan & Inspeksi"] },
    { cells: [{ t: "E.2", color: amber }, "Audit Internal"] },
    { cells: [{ t: "E.3", color: amber }, "Tinjauan Manajemen & Peningkatan Kinerja"] },
  ],
});

// ======================= RKK — Sheet IBPRP =======================
const SEDANG = { bg: "#fde68a" };
const BESAR = { bg: "#fecaca" };
sheets["rkk-ibprp.svg"] = buildSheet({
  banner: "IDENTIFIKASI BAHAYA, PENILAIAN RISIKO, PENGENDALIAN & PELUANG (IBPRP)",
  subBanner: "Elemen B.1 — Nilai & Tingkat Risiko terhitung otomatis (Kekerapan × Keparahan)",
  note: "Paket: Pembangunan Gedung Kantor 2 Lantai  |  Lokasi: Kab. Luwu Timur, Sulawesi Selatan",
  bounds: [GUTTER, 64, 250, 440, 690, 760, W],
  aligns: ["center", "left", "left", "left", "center", "center"],
  rows: [
    { type: "header", cells: ["No", "Uraian Pekerjaan", "Identifikasi Bahaya", "Pengendalian Awal", "Nilai", "Tingkat"] },
    { cells: ["1", { t: "Galian tanah pondasi", color: blue }, "Longsor; pekerja terjatuh", "Turap/sloping, barikade, rambu", "12", { t: "SEDANG", bg: SEDANG.bg, color: amber }] },
    { cells: ["2", { t: "Pekerjaan di ketinggian", color: blue }, "Jatuh dari ketinggian", "Body harness, lifeline, perancah", "20", { t: "BESAR", bg: BESAR.bg, color: "#b91c1c" }] },
    { cells: ["3", { t: "Pekerjaan pengelasan", color: blue }, "Percikan api, kebakaran", "Kacamata las, APAR, fire watch", "9", { t: "SEDANG", bg: SEDANG.bg, color: amber }] },
    { cells: ["4", { t: "Mobilisasi alat berat", color: blue }, "Tertabrak, terguling", "Operator SIO, flagman, area steril", "12", { t: "SEDANG", bg: SEDANG.bg, color: amber }] },
    { cells: ["5", { t: "Pekerjaan pembesian", color: blue }, "Tertusuk besi, tergores", "Sarung tangan, sepatu safety", "8", { t: "SEDANG", bg: SEDANG.bg, color: amber }] },
    { cells: ["6", { t: "Instalasi listrik sementara", color: blue }, "Sengatan listrik, korsleting", "Panel ber-ELCB, prosedur LOTO", "15", { t: "BESAR", bg: BESAR.bg, color: "#b91c1c" }] },
    { cells: ["7", { t: "Pengecoran beton", color: blue }, "Iritasi kulit/mata, kelelahan", "APD lengkap, atur jam kerja", "6", { t: "SEDANG", bg: SEDANG.bg, color: amber }] },
  ],
});

for (const [name, svg] of Object.entries(sheets)) {
  writeFileSync(join(OUT, name), svg);
}
console.log("Preview SVG dibuat di public/preview/:", Object.keys(sheets).join(", "));
