-- ============================================================================
-- Skema tabel `orders` untuk Digital Creatif.
--
-- Cara pakai:
--   1. Buka project Supabase kamu -> menu "SQL Editor"
--   2. Tempel & jalankan seluruh isi file ini.
--
-- Aplikasi mengakses tabel ini lewat SERVICE ROLE KEY (server-side), sehingga
-- Row Level Security tetap diaktifkan TANPA policy publik — artinya tabel ini
-- tidak bisa dibaca/ditulis oleh anon/public key dari browser. Aman.
-- ============================================================================

create table if not exists public.orders (
  order_id            text primary key,
  product_id          text        not null,
  product_name        text        not null,
  email               text        not null,
  amount              integer     not null,
  status              text        not null default 'pending',
  qr_string           text,
  qr_url              text,
  delivery_email_sent boolean     not null default false,
  created_at          timestamptz not null default now(),
  paid_at             timestamptz
);

-- Index bantu untuk query status / tanggal (mis. dashboard admin nanti).
create index if not exists orders_status_idx     on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- Aktifkan RLS. Tanpa policy apa pun, hanya service_role (server) yang boleh
-- mengakses. Jangan tambahkan policy untuk anon kecuali memang diperlukan.
alter table public.orders enable row level security;
