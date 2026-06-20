import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Order, NewOrder, StoreBackend } from "./store-types";

// =============================================================================
// Backend penyimpanan order berbasis Supabase (Postgres) — UNTUK PRODUKSI.
//
// Membutuhkan environment variable:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY   (service role — hanya dipakai di server,
//                                JANGAN diekspos ke client / browser)
//
// Jalankan dulu skrip SQL di supabase/schema.sql untuk membuat tabel `orders`.
// =============================================================================

const TABLE = "orders";

let client: SupabaseClient | null = null;

function db(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return client;
}

// ---- Pemetaan kolom snake_case (DB) <-> camelCase (TypeScript) -------------

type Row = {
  order_id: string;
  product_id: string;
  product_name: string;
  email: string;
  amount: number;
  status: Order["status"];
  qr_string: string | null;
  qr_url: string | null;
  delivery_email_sent: boolean;
  created_at: string;
  paid_at: string | null;
};

function rowToOrder(row: Row): Order {
  return {
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name,
    email: row.email,
    amount: row.amount,
    status: row.status,
    qrString: row.qr_string ?? undefined,
    qrUrl: row.qr_url ?? undefined,
    deliveryEmailSent: row.delivery_email_sent,
    createdAt: row.created_at,
    paidAt: row.paid_at ?? undefined,
  };
}

function patchToRow(patch: Partial<Order>): Partial<Row> {
  const row: Partial<Row> = {};
  if (patch.orderId !== undefined) row.order_id = patch.orderId;
  if (patch.productId !== undefined) row.product_id = patch.productId;
  if (patch.productName !== undefined) row.product_name = patch.productName;
  if (patch.email !== undefined) row.email = patch.email;
  if (patch.amount !== undefined) row.amount = patch.amount;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.qrString !== undefined) row.qr_string = patch.qrString ?? null;
  if (patch.qrUrl !== undefined) row.qr_url = patch.qrUrl ?? null;
  if (patch.deliveryEmailSent !== undefined)
    row.delivery_email_sent = patch.deliveryEmailSent;
  if (patch.createdAt !== undefined) row.created_at = patch.createdAt;
  if (patch.paidAt !== undefined) row.paid_at = patch.paidAt ?? null;
  return row;
}

// ---- Implementasi backend --------------------------------------------------

async function createOrder(order: NewOrder): Promise<Order> {
  const full: Order = { ...order, deliveryEmailSent: false };
  const { error } = await db().from(TABLE).insert(patchToRow(full));
  if (error) throw new Error(`Supabase insert gagal: ${error.message}`);
  return full;
}

async function getOrder(orderId: string): Promise<Order | undefined> {
  const { data, error } = await db()
    .from(TABLE)
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();
  if (error) throw new Error(`Supabase select gagal: ${error.message}`);
  return data ? rowToOrder(data as Row) : undefined;
}

async function updateOrder(
  orderId: string,
  patch: Partial<Order>
): Promise<Order | undefined> {
  const { data, error } = await db()
    .from(TABLE)
    .update(patchToRow(patch))
    .eq("order_id", orderId)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`Supabase update gagal: ${error.message}`);
  return data ? rowToOrder(data as Row) : undefined;
}

async function claimEmailDelivery(orderId: string): Promise<boolean> {
  // Update bersyarat & atomik di level DB: hanya berhasil bila masih false.
  const { data, error } = await db()
    .from(TABLE)
    .update({ delivery_email_sent: true })
    .eq("order_id", orderId)
    .eq("delivery_email_sent", false)
    .select("order_id");
  if (error) throw new Error(`Supabase claim gagal: ${error.message}`);
  return (data?.length ?? 0) > 0;
}

export const supabaseStore: StoreBackend = {
  createOrder,
  getOrder,
  updateOrder,
  claimEmailDelivery,
};
