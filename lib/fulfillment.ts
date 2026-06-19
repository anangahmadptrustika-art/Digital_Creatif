import { getOrder, updateOrder } from "./store";
import { getProductById } from "./products";
import { sendProductEmail } from "./email";

// =============================================================================
// Logika "fulfillment": dipanggil ketika sebuah order sudah LUNAS.
// Menandai order sebagai paid dan mengirim email link produk SATU KALI saja.
// Aman dipanggil berulang (idempotent) — email tidak akan dikirim dua kali.
// =============================================================================

export async function fulfillPaidOrder(orderId: string): Promise<void> {
  const order = await getOrder(orderId);
  if (!order) {
    console.warn(`[fulfillment] Order tidak ditemukan: ${orderId}`);
    return;
  }

  // Jika email sudah pernah dikirim, jangan kirim lagi.
  if (order.status === "paid" && order.deliveryEmailSent) {
    return;
  }

  const product = getProductById(order.productId);
  if (!product) {
    console.warn(`[fulfillment] Produk tidak ditemukan: ${order.productId}`);
    return;
  }

  await updateOrder(orderId, {
    status: "paid",
    paidAt: order.paidAt || new Date().toISOString(),
  });

  try {
    await sendProductEmail({
      to: order.email,
      productName: product.name,
      downloadUrl: product.downloadUrl,
      orderId: order.orderId,
      amount: order.amount,
    });
    await updateOrder(orderId, { deliveryEmailSent: true });
  } catch (err) {
    // Jangan menandai email terkirim bila gagal, agar bisa di-retry.
    console.error(`[fulfillment] Gagal kirim email untuk ${orderId}:`, err);
    throw err;
  }
}
