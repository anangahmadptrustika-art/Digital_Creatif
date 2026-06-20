import { promises as fs } from "fs";
import path from "path";
import type { Order, NewOrder, StoreBackend } from "./store-types";

// =============================================================================
// Backend penyimpanan order berbasis file JSON — UNTUK DEVELOPMENT LOKAL.
//
// ⚠️  Tidak cocok untuk serverless (Vercel) karena filesystem ephemeral.
// Di produksi gunakan backend Supabase (lihat store-supabase.ts). Dispatcher
// di store.ts otomatis memilih Supabase bila environment-nya terisi.
// =============================================================================

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

async function createOrder(order: NewOrder): Promise<Order> {
  const orders = await readAll();
  const full: Order = { ...order, deliveryEmailSent: false };
  orders[order.orderId] = full;
  await writeAll(orders);
  return full;
}

async function getOrder(orderId: string): Promise<Order | undefined> {
  const orders = await readAll();
  return orders[orderId];
}

async function updateOrder(
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

async function claimEmailDelivery(orderId: string): Promise<boolean> {
  // Proses tunggal (dev) — cukup baca lalu set. Tidak ada race antar proses.
  const orders = await readAll();
  const existing = orders[orderId];
  if (!existing || existing.deliveryEmailSent) return false;
  existing.deliveryEmailSent = true;
  orders[orderId] = existing;
  await writeAll(orders);
  return true;
}

export const fileStore: StoreBackend = {
  createOrder,
  getOrder,
  updateOrder,
  claimEmailDelivery,
};
