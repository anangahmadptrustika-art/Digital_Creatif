import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/store";
import {
  getTransactionStatus,
  mapTransactionStatus,
  MIDTRANS_DEMO_MODE,
} from "@/lib/midtrans";
import { fulfillPaidOrder } from "@/lib/fulfillment";

export const dynamic = "force-dynamic";

// Endpoint polling status order dari frontend (halaman checkout).
// Sebagai jaring pengaman, di mode non-demo kita juga cek status langsung ke
// Midtrans — supaya status tetap update walau webhook belum/ gagal masuk
// (mis. saat development di localhost tanpa tunnel).
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json(
      { error: "Order tidak ditemukan" },
      { status: 404 }
    );
  }

  // Order belum lunas & bukan demo → sinkronkan dengan Midtrans.
  if (order.status === "pending" && !MIDTRANS_DEMO_MODE) {
    try {
      const status = await getTransactionStatus(order.orderId);
      const mapped = mapTransactionStatus(
        status.transactionStatus,
        status.fraudStatus
      );
      if (mapped === "paid") {
        await fulfillPaidOrder(order.orderId);
      }
    } catch (err) {
      console.error("[transaction] gagal sinkron status:", err);
    }
  }

  const latest = await getOrder(orderId);
  return NextResponse.json({
    orderId: latest!.orderId,
    status: latest!.status,
    productName: latest!.productName,
    amount: latest!.amount,
    emailSent: latest!.deliveryEmailSent,
  });
}
