import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import { createOrder } from "@/lib/store";
import { createQrisCharge, MIDTRANS_DEMO_MODE } from "@/lib/midtrans";

export const dynamic = "force-dynamic";

function generateOrderId(productId: string): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `DC-${productId.slice(0, 6).toUpperCase()}-${ts}-${rand}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: { productId?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const { productId, email } = body;

  if (!productId || !email) {
    return NextResponse.json(
      { error: "productId dan email wajib diisi" },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Format email tidak valid" },
      { status: 400 }
    );
  }

  const product = getProductById(productId);
  if (!product) {
    return NextResponse.json(
      { error: "Produk tidak ditemukan" },
      { status: 404 }
    );
  }

  const orderId = generateOrderId(productId);

  try {
    const charge = await createQrisCharge({
      orderId,
      grossAmount: product.price,
      customerEmail: email,
      itemName: product.name,
    });

    await createOrder({
      orderId,
      productId: product.id,
      productName: product.name,
      email,
      amount: product.price,
      status: "pending",
      qrString: charge.qrString,
      qrUrl: charge.qrUrl,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      orderId,
      productName: product.name,
      amount: product.price,
      qrString: charge.qrString,
      qrUrl: charge.qrUrl,
      demoMode: MIDTRANS_DEMO_MODE,
    });
  } catch (err) {
    console.error("[checkout] gagal membuat transaksi:", err);
    return NextResponse.json(
      { error: "Gagal membuat transaksi pembayaran. Coba lagi." },
      { status: 502 }
    );
  }
}
