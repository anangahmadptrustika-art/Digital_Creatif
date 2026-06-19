import { getOrder, updateOrder, claimEmailDelivery } from "./store";
import { getProductById } from "./products";
import { sendProductEmail } from "./email";

// =============================================================================
// Logika "fulfillment": dipanggil ketika sebuah order sudah LUNAS.
// Menandai order sebagai paid dan mengirim email link produk SATU KALI saja.
//
// Aman dipanggil berulang & bersamaan (idempotent): pengiriman email diklaim
// secara ATOMIK lewat claimEmailDelivery(), sehingga walau webhook & polling
// memicu fulfillment di waktu yang sama, email hanya terkirim sekali.
// =============================================================================

export async function fulfillPaidOrder(orderId: string): Promise<void> {
  const order = await getOrder(orderId);
  if (!order) {
    console.warn(`[fulfillment] Order tidak ditemukan: ${orderId}`);
    return;
  }

  const product = getProductById(order.productId);
  if (!product) {
    console.warn(`[fulfillment] Produk tidak ditemukan: ${order.productId}`);
    return;
  }

  // Tandai lunas (idempotent — aman walau sudah paid).
  if (order.status !== "paid") {
    await updateOrder(orderId, {
      status: "paid",
      paidAt: order.paidAt || new Date().toISOString(),
    });
  }

  // Klaim hak kirim email secara atomik. Jika gagal klaim, berarti sudah/
  // sedang dikirim pihak lain -> berhenti tanpa kirim ulang.
  const claimed = await claimEmailDelivery(orderId);
  if (!claimed) return;

  try {
    await sendProductEmail({
      to: order.email,
      productName: product.name,
      downloadUrl: product.downloadUrl,
      orderId: order.orderId,
      amount: order.amount,
    });
  } catch (err) {
    // Gagal kirim: lepaskan klaim agar bisa di-retry pada pemicu berikutnya.
    await updateOrder(orderId, { deliveryEmailSent: false });
    console.error(`[fulfillment] Gagal kirim email untuk ${orderId}:`, err);
    throw err;
  }
}
