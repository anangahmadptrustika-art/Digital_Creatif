// Tipe & kontrak penyimpanan order yang dipakai bersama oleh semua backend
// (file lokal & Supabase). Memisahkan tipe di sini menghindari import melingkar.

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

export type NewOrder = Omit<Order, "deliveryEmailSent">;

export interface StoreBackend {
  createOrder(order: NewOrder): Promise<Order>;
  getOrder(orderId: string): Promise<Order | undefined>;
  updateOrder(orderId: string, patch: Partial<Order>): Promise<Order | undefined>;
  /**
   * Klaim pengiriman email secara ATOMIK: menandai deliveryEmailSent = true
   * HANYA jika sebelumnya masih false. Mengembalikan true bila pemanggil ini
   * yang berhasil mengklaim (boleh kirim email), false bila sudah diklaim
   * pihak lain. Ini mencegah email ganda saat webhook & polling berjalan
   * bersamaan di lingkungan serverless.
   */
  claimEmailDelivery(orderId: string): Promise<boolean>;
}
