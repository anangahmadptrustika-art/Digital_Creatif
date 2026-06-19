# Digital Creatif — Landing Page Jual Template (QRIS Otomatis)

Landing page untuk menjual template & landing page digital. Pembeli membayar
lewat **QRIS (Midtrans)**, dan begitu pembayaran terkonfirmasi, **link download
produk dikirim otomatis ke email** pembeli.

> ✨ Bisa langsung dijalankan tanpa konfigurasi apa pun dalam **Mode Demo**
> (pembayaran & email disimulasikan), lalu tinggal isi kredensial untuk go-live.

## Fitur

- 🛍️ Landing page responsif + katalog produk
- 📱 Pembayaran **QRIS** via Midtrans Core API
- 🔔 **Webhook** menerima notifikasi pembayaran (dengan verifikasi signature)
- 📧 **Pengiriman email otomatis** berisi link produk setelah lunas (idempotent)
- 🔁 Polling status realtime di halaman checkout
- 🧪 **Mode Demo** untuk menguji seluruh alur tanpa akun Midtrans/SMTP

## Teknologi

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS
- Midtrans (QRIS) — pembayaran
- Nodemailer (SMTP) — pengiriman email

## Menjalankan Secara Lokal

```bash
# 1. Install dependency
npm install

# 2. (Opsional) salin konfigurasi
cp .env.example .env.local

# 3. Jalankan
npm run dev
```

Buka http://localhost:3000

Tanpa mengisi `.env.local`, aplikasi berjalan dalam **Mode Demo**:
- Checkout menampilkan QR placeholder + tombol **“Simulasi Bayar”**.
- Setelah “bayar”, email **di-log ke console** (lihat terminal), order ditandai lunas.

## Alur Pembayaran

```
Pembeli pilih produk
      │
      ▼
Masukkan email  ──►  POST /api/checkout  ──►  Midtrans buat transaksi QRIS
      │                                              │
      ▼                                              ▼
Tampilkan QRIS  ◄──────────────────────────  qr_string / qr_url
      │
      │  (pembeli scan & bayar)
      ▼
Midtrans  ──POST──►  /api/webhook/midtrans  ──►  verifikasi signature
                                                  │
                                                  ▼
                                         status = settlement?
                                                  │ ya
                                                  ▼
                                    Tandai LUNAS + kirim email link produk
      ▲                                           │
      │  (frontend polling /api/transaction/:id)  │
      └───────────────────────────────────────────┘
                  Halaman checkout → "Pembayaran Berhasil"
```

## Go-Live (Mode Produksi)

### 1. Konfigurasi Midtrans

1. Daftar di https://midtrans.com dan ambil **Server Key** dari
   *Settings → Access Keys*.
2. Isi di `.env.local`:
   ```
   MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxx
   MIDTRANS_IS_PRODUCTION=false   # true bila sudah production
   ```
3. Set **Payment Notification URL** di *Settings → Configuration*:
   ```
   https://domain-kamu.com/api/webhook/midtrans
   ```
   > Untuk tes lokal, gunakan tunnel seperti `ngrok` agar Midtrans bisa
   > menjangkau webhook-mu. Sebagai cadangan, halaman checkout juga melakukan
   > polling status langsung ke Midtrans.

### 2. Konfigurasi Email (SMTP)

Contoh dengan Gmail:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=emailkamu@gmail.com
SMTP_PASS=xxxxxxxxxxxxxxxx       # App Password 16 digit (bukan password akun)
MAIL_FROM="Digital Creatif <emailkamu@gmail.com>"
```

### 3. Link Produk

Set link download asli (mis. Google Drive/S3) di `.env.local`:
```
PRODUCT_LINK_LANDING_SAAS=https://...
PRODUCT_LINK_PORTFOLIO_MINIMAL=https://...
...
```

## ⚠️ Catatan Penting untuk Produksi

- **Penyimpanan order** saat ini berbasis file JSON (`/.data/orders.json`),
  cocok untuk dev tapi **tidak persisten di lingkungan serverless** (Vercel,
  dll). Ganti `lib/store.ts` dengan database sungguhan (Postgres/Supabase,
  PlanetScale, MongoDB). Bentuk fungsinya sudah async agar mudah ditukar.
- Gunakan **signed URL** untuk link produk agar tidak mudah dibagikan ulang.
- Pertimbangkan rate limiting pada endpoint checkout.

## Struktur Proyek

```
app/
  page.tsx                       Landing page
  checkout/[productId]/page.tsx  Halaman checkout
  api/
    checkout/route.ts            Buat order + transaksi QRIS
    transaction/[orderId]/route.ts  Cek status (polling)
    webhook/midtrans/route.ts    Webhook notifikasi pembayaran
    simulate-pay/route.ts        Simulasi bayar (mode demo)
components/
  ProductCard.tsx
  CheckoutClient.tsx
lib/
  products.ts                    Katalog produk + link download
  midtrans.ts                    Integrasi Midtrans QRIS
  email.ts                       Pengiriman email (Nodemailer)
  store.ts                       Penyimpanan order
  fulfillment.ts                 Tandai lunas + kirim email (idempotent)
```

## Menambah / Mengubah Produk

Edit array `PRODUCTS` di `lib/products.ts`. Tiap produk punya `downloadUrl`
yang dikirim ke pembeli setelah pembayaran sukses.
