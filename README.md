# RAB Creatif — Landing Page Jual Template RAB/AHSP/RKK (QRIS Otomatis)

Landing page (tampilan mobile/aplikasi, cocok dipromosikan di Instagram) untuk
menjual template dokumen proyek konstruksi: **RAB + AHSP 2026, RKK (SMKK),
Kurva S, & laporan proyek** format Excel — untuk konsultan & kontraktor.
Pembeli membayar lewat **QRIS (Midtrans)**, dan begitu pembayaran terkonfirmasi,
**link download file dikirim otomatis ke email** pembeli.

> ✨ Bisa langsung dijalankan tanpa konfigurasi apa pun dalam **Mode Demo**
> (pembayaran & email disimulasikan), lalu tinggal isi kredensial untuk go-live.

## Fitur

- 🛍️ Landing page responsif + katalog produk
- 📱 Pembayaran **QRIS** via Midtrans Core API
- 🔔 **Webhook** menerima notifikasi pembayaran (dengan verifikasi signature)
- 📧 **Pengiriman email otomatis** berisi link produk setelah lunas — anti
  kirim ganda lewat klaim atomik (aman walau webhook & polling bersamaan)
- 🗄️ Penyimpanan order **Supabase/Postgres** (produksi) atau file JSON (dev)
- 🔁 Polling status realtime di halaman checkout
- 🧪 **Mode Demo** untuk menguji seluruh alur tanpa akun Midtrans/SMTP

## Teknologi

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS
- Midtrans (QRIS) — pembayaran
- Supabase (Postgres) — database order
- Nodemailer (SMTP) — pengiriman email
- Deploy: Vercel

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

### 1. Konfigurasi Database (Supabase)

1. Buat project gratis di https://supabase.com.
2. Buka **SQL Editor**, tempel & jalankan isi file [`supabase/schema.sql`](supabase/schema.sql)
   (membuat tabel `orders`).
3. Buka **Project Settings → API**, lalu salin:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** secret key → `SUPABASE_SERVICE_ROLE_KEY`
4. Isi di `.env.local` (atau Environment Variables di Vercel):
   ```
   SUPABASE_URL=https://xxxxxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   ```
   > Begitu kedua variabel ini terisi, aplikasi otomatis memakai Supabase
   > sebagai penyimpanan order (menggantikan file JSON lokal).
   > ⚠️ `service_role` key bersifat **rahasia** — hanya untuk server, jangan
   > pernah diekspos ke browser atau di-commit ke git.

### 2. Konfigurasi Midtrans

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

### 3. Konfigurasi Email (SMTP)

Contoh dengan Gmail:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=emailkamu@gmail.com
SMTP_PASS=xxxxxxxxxxxxxxxx       # App Password 16 digit (bukan password akun)
MAIL_FROM="Digital Creatif <emailkamu@gmail.com>"
```

### 4. Link Produk

Set link download asli (mis. Google Drive/S3) di `.env.local`:
```
PRODUCT_LINK_LANDING_SAAS=https://...
PRODUCT_LINK_PORTFOLIO_MINIMAL=https://...
...
```

## 🚀 Deploy ke Vercel

Aplikasi ini paling pas di-host di **Vercel** (dibuat untuk Next.js) dengan
**Supabase** sebagai database. Dua-duanya punya free tier.

1. **Push ke GitHub** (sudah otomatis bila kamu pakai repo ini).
2. Buka https://vercel.com → **Add New… → Project** → import repo ini.
   Vercel mendeteksi Next.js secara otomatis (tidak perlu konfigurasi build).
3. Di langkah import, buka **Environment Variables** dan isi semua nilai dari
   `.env.example` yang sudah kamu siapkan:
   ```
   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
   MIDTRANS_SERVER_KEY, MIDTRANS_IS_PRODUCTION
   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
   PRODUCT_LINK_*  (link download produk asli)
   ```
4. Klik **Deploy**. Setelah selesai kamu dapat URL `https://namaproyek.vercel.app`.
5. **Daftarkan webhook ke Midtrans**: di dashboard Midtrans
   *Settings → Configuration → Payment Notification URL*, isi:
   ```
   https://namaproyek.vercel.app/api/webhook/midtrans
   ```
6. (Opsional) **Custom domain**: di Vercel → *Settings → Domains*, tambahkan
   domain milikmu (mis. dari Niagahoster/Cloudflare) dan ikuti instruksi DNS-nya.

> Setiap `git push` ke branch utama akan otomatis men-deploy ulang.
> Ubah environment variable di *Vercel → Settings → Environment Variables*
> lalu **Redeploy** agar perubahan diterapkan.

### Checklist sebelum benar-benar jualan
- [ ] `MIDTRANS_IS_PRODUCTION=true` + pakai **Server Key production** (bukan sandbox)
- [ ] Tabel `orders` sudah dibuat di Supabase (jalankan `supabase/schema.sql`)
- [ ] SMTP sudah dites (lakukan 1 transaksi sungguhan, pastikan email masuk)
- [ ] `PRODUCT_LINK_*` mengarah ke file produk asli
- [ ] Webhook URL terdaftar di Midtrans

## ⚠️ Catatan Penting untuk Produksi

- **Penyimpanan order** otomatis memilih backend: **Supabase** bila
  `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` terisi, atau **file JSON**
  (`/.data/orders.json`) untuk dev lokal. Di serverless (Vercel) **wajib**
  pakai Supabase karena filesystem-nya ephemeral.
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
  store.ts                       Dispatcher penyimpanan order (pilih backend)
  store-types.ts                 Tipe & kontrak backend penyimpanan
  store-file.ts                  Backend file JSON (dev lokal)
  store-supabase.ts              Backend Supabase/Postgres (produksi)
  fulfillment.ts                 Tandai lunas + kirim email (idempotent)
supabase/
  schema.sql                     Skema tabel `orders` untuk Supabase
```

## Menambah / Mengubah Produk

Edit array `PRODUCTS` di `lib/products.ts`. Tiap produk punya `downloadUrl`
yang dikirim ke pembeli setelah pembayaran sukses.
