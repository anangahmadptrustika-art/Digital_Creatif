import { NextRequest, NextResponse } from "next/server";
import {
  verifySignature,
  mapTransactionStatus,
} from "@/lib/midtrans";
import { getOrder, updateOrder } from "@/lib/store";
import { fulfillPaidOrder } from "@/lib/fulfillment";

export const dynamic = "force-dynamic";

// =============================================================================
// Webhook notifikasi pembayaran dari Midtrans.
//
// Daftarkan URL ini di Dashboard Midtrans:
//   Settings -> Configuration -> Payment Notification URL
//   https://domain-kamu.com/api/webhook/midtrans
//
// Midtrans akan POST ke sini setiap status transaksi berubah. Setelah signature
// diverifikasi dan status = settlement/capture, kita panggil fulfillPaidOrder()
// yang mengirim email link produk ke pembeli secara OTOMATIS.
// =============================================================================

export async function POST(req: NextRequest) {
  let payload: {
    order_id?: string;
    status_code?: string;
    gross_amount?: string;
    signature_key?: string;
    transaction_status?: string;
    fraud_status?: string;
  };

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status,
  } = payload;

  if (!order_id || !status_code || !gross_amount || !signature_key) {
    return NextResponse.json(
      { error: "Field notifikasi tidak lengkap" },
      { status: 400 }
    );
  }

  // 1. Verifikasi keaslian notifikasi (anti pemalsuan).
  const valid = verifySignature({
    order_id,
    status_code,
    gross_amount,
    signature_key,
  });
  if (!valid) {
    console.warn(`[webhook] signature tidak valid untuk order ${order_id}`);
    return NextResponse.json(
      { error: "Signature tidak valid" },
      { status: 403 }
    );
  }

  // 2. Pastikan order ada di sistem kita.
  const order = await getOrder(order_id);
  if (!order) {
    console.warn(`[webhook] order tidak dikenal: ${order_id}`);
    // 200 agar Midtrans tidak retry terus untuk order yang memang tidak ada.
    return NextResponse.json({ received: true });
  }

  // 3. Petakan status & lakukan fulfillment bila lunas.
  const mapped = mapTransactionStatus(
    transaction_status || "",
    fraud_status
  );

  if (mapped === "paid") {
    await fulfillPaidOrder(order_id);
  } else if (mapped === "failed" || mapped === "expired") {
    await updateOrder(order_id, { status: mapped });
  }

  return NextResponse.json({ received: true });
}
