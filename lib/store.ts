import type { StoreBackend } from "./store-types";
import { fileStore } from "./store-file";
import { supabaseStore } from "./store-supabase";

// =============================================================================
// Dispatcher penyimpanan order.
//
// Memilih backend secara otomatis:
//   - Jika SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY terisi  -> Supabase (produksi)
//   - Jika tidak                                            -> file JSON (dev/lokal)
//
// Kode pemanggil (API route, fulfillment) cukup import dari "@/lib/store"
// tanpa peduli backend mana yang dipakai.
// =============================================================================

export type { Order, OrderStatus, NewOrder } from "./store-types";

export const USING_SUPABASE =
  !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

const backend: StoreBackend = USING_SUPABASE ? supabaseStore : fileStore;

export const createOrder: StoreBackend["createOrder"] = (order) =>
  backend.createOrder(order);

export const getOrder: StoreBackend["getOrder"] = (orderId) =>
  backend.getOrder(orderId);

export const updateOrder: StoreBackend["updateOrder"] = (orderId, patch) =>
  backend.updateOrder(orderId, patch);

export const claimEmailDelivery: StoreBackend["claimEmailDelivery"] = (
  orderId
) => backend.claimEmailDelivery(orderId);
