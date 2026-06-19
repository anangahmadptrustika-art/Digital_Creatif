import { NextRequest, NextResponse } from "next/server";
import { MIDTRANS_DEMO_MODE } from "@/lib/midtrans";
import { getOrder } from "@/lib/store";
import { fulfillPaidOrder } from "@/lib/fulfillment";

export const dynamic = "force-dynamic";

// =============================================================================
// Endpoint SIMULASI pembayaran — HANYA aktif di mode demo (tanpa Midtrans key).
// Berguna untuk menguji alur lengkap: bayar -> order lunas -> email terkirim.
// Di produksi (dengan MIDTRANS_SERVER_KEY terisi), endpoint ini dinonaktifkan.
// =============================================================================

export async function POST(req: NextRequest) {
  if (!MIDTRANS_DEMO_MODE) {
    return NextResponse.json(
      { error: "Simulasi hanya tersedia di mode demo" },
      { status: 403 }
    );
  }

  let body: { orderId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  if (!body.orderId) {
    return NextResponse.json({ error: "orderId wajib diisi" }, { status: 400 });
  }

  const order = await getOrder(body.orderId);
  if (!order) {
    return NextResponse.json(
      { error: "Order tidak ditemukan" },
      { status: 404 }
    );
  }

  await fulfillPaidOrder(body.orderId);

  return NextResponse.json({ ok: true, status: "paid" });
}
