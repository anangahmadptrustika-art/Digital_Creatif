import { promises as fs } from "fs";
import path from "path";

// =============================================================================
// Penyimpanan order sederhana berbasis file JSON.
//
// ⚠️  PENTING UNTUK PRODUKSI:
// Penyimpanan berbasis file TIDAK cocok untuk lingkungan serverless (Vercel,
// Netlify) karena filesystem-nya ephemeral / tidak persisten antar request.
// Untuk produksi, ganti implementasi di file ini dengan database sungguhan
// (Postgres/Supabase, MySQL/PlanetScale, MongoDB, dll). Bentuk fungsinya
// sudah dibuat async agar mudah ditukar tanpa mengubah kode pemanggil.
// =============================================================================

export type OrderStatus = "pending" | "paid" | "failed" | "expired";

export type Order = {
  orderId: string;
  productId: string;
  productName: string;
  email: string;
  amount: number;
  status: OrderStatus;
  /** String QRIS mentah dari Midtrans (untuk di-render jadi QR). */
  qrString?: string;
  /** URL gambar QR dari Midtrans (jika tersedia). */
  qrUrl?: string;
  /** Penanda apakah email produk sudah dikirim (mencegah kirim ganda). */
  deliveryEmailSent: boolean;
  createdAt: string;
  paidAt?: string;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "orders.json");

async function readAll(): Promise<Record<string, Order>> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Record<string, Order>;
  } catch {
    return {};
  }
}

async function writeAll(orders: Record<string, Order>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export async function createOrder(
  order: Omit<Order, "deliveryEmailSent">
): Promise<Order> {
  const orders = await readAll();
  const full: Order = { ...order, deliveryEmailSent: false };
  orders[order.orderId] = full;
  await writeAll(orders);
  return full;
}

export async function getOrder(orderId: string): Promise<Order | undefined> {
  const orders = await readAll();
  return orders[orderId];
}

export async function updateOrder(
  orderId: string,
  patch: Partial<Order>
): Promise<Order | undefined> {
  const orders = await readAll();
  const existing = orders[orderId];
  if (!existing) return undefined;
  const updated = { ...existing, ...patch };
  orders[orderId] = updated;
  await writeAll(orders);
  return updated;
}
