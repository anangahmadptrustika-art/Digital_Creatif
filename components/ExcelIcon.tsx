// Ikon bergaya Microsoft Excel (SVG inline) untuk menandai produk berformat
// Excel. Dipakai di kartu produk dan ringkasan checkout.

export default function ExcelIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Tile (hijau Excel) — fill solid + sorotan halus, tanpa id agar aman
          dipakai berkali-kali di halaman yang sama */}
      <rect x="2" y="2" width="44" height="44" rx="11" fill="#107C41" />
      <rect
        x="2"
        y="2"
        width="44"
        height="22"
        rx="11"
        fill="#ffffff"
        opacity="0.12"
      />

      {/* Lembar spreadsheet (putih) */}
      <rect x="21" y="11" width="19" height="26" rx="2" fill="#ffffff" />
      {/* Baris header diberi warna lembut */}
      <rect x="21" y="11" width="19" height="4.5" fill="#e6f7ee" />
      {/* Garis grid */}
      <g stroke="#9bd9b8" strokeWidth="1">
        <line x1="21" y1="20" x2="40" y2="20" />
        <line x1="21" y1="28.5" x2="40" y2="28.5" />
        <line x1="27.3" y1="11" x2="27.3" y2="37" />
        <line x1="33.6" y1="11" x2="33.6" y2="37" />
      </g>

      {/* Panel "X" Excel */}
      <rect x="6" y="11" width="17" height="26" rx="3" fill="#0b6e37" />
      <path
        d="M11 17 L18 31 M18 17 L11 31"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
