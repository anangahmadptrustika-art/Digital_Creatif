import crypto from "crypto";

// =============================================================================
// Integrasi Midtrans Core API untuk pembayaran QRIS.
// Dokumentasi: https://docs.midtrans.com/reference/qris
//
// Jika MIDTRANS_SERVER_KEY tidak diisi, library berjalan dalam MODE DEMO:
// QRIS palsu di-generate sehingga seluruh alur (checkout -> tampil QR ->
// simulasi bayar -> kirim email) bisa dites tanpa akun Midtrans.
// =============================================================================

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const MIDTRANS_DEMO_MODE = SERVER_KEY === "";

const BASE_URL = IS_PRODUCTION
  ? "https://api.midtrans.com"
  : "https://api.sandbox.midtrans.com";

function authHeader(): string {
  // Basic auth: base64(ServerKey + ":")
  return "Basic " + Buffer.from(SERVER_KEY + ":").toString("base64");
}

export type QrisChargeResult = {
  orderId: string;
  qrString?: string;
  qrUrl?: string;
  transactionStatus: string;
  raw: unknown;
};

/**
 * Membuat transaksi QRIS baru di Midtrans.
 * Mengembalikan qr_string dan/atau url gambar QR untuk ditampilkan ke pembeli.
 */
export async function createQrisCharge(params: {
  orderId: string;
  grossAmount: number;
  customerEmail: string;
  itemName: string;
}): Promise<QrisChargeResult> {
  if (MIDTRANS_DEMO_MODE) {
    // Mode demo: tidak memanggil Midtrans sungguhan.
    return {
      orderId: params.orderId,
      qrString: `DEMO-QRIS|${params.orderId}|${params.grossAmount}`,
      qrUrl: undefined,
      transactionStatus: "pending",
      raw: { demo: true },
    };
  }

  const body = {
    payment_type: "qris",
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    qris: {
      acquirer: "gopay",
    },
    item_details: [
      {
        id: params.orderId,
        price: params.grossAmount,
        quantity: 1,
        name: params.itemName.slice(0, 50),
      },
    ],
    customer_details: {
      email: params.customerEmail,
    },
  };

  const res = await fetch(`${BASE_URL}/v2/charge`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as {
    status_code?: string;
    status_message?: string;
    transaction_status?: string;
    qr_string?: string;
    actions?: { name: string; url: string }[];
  };

  if (!res.ok || (data.status_code && Number(data.status_code) >= 400)) {
    throw new Error(
      `Midtrans charge gagal: ${data.status_message || res.statusText}`
    );
  }

  const qrAction = data.actions?.find((a) => a.name === "generate-qr-code");

  return {
    orderId: params.orderId,
    qrString: data.qr_string,
    qrUrl: qrAction?.url,
    transactionStatus: data.transaction_status || "pending",
    raw: data,
  };
}

/** Mengecek status transaksi langsung ke Midtrans. */
export async function getTransactionStatus(
  orderId: string
): Promise<{ transactionStatus: string; fraudStatus?: string; raw: unknown }> {
  if (MIDTRANS_DEMO_MODE) {
    return { transactionStatus: "pending", raw: { demo: true } };
  }

  const res = await fetch(`${BASE_URL}/v2/${orderId}/status`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: authHeader(),
    },
  });

  const data = (await res.json()) as {
    transaction_status?: string;
    fraud_status?: string;
  };

  return {
    transactionStatus: data.transaction_status || "unknown",
    fraudStatus: data.fraud_status,
    raw: data,
  };
}

/**
 * Verifikasi signature key dari webhook notifikasi Midtrans.
 * signature = sha512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifySignature(payload: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}): boolean {
  if (MIDTRANS_DEMO_MODE) return true; // demo: lewati verifikasi
  const expected = crypto
    .createHash("sha512")
    .update(
      payload.order_id +
        payload.status_code +
        payload.gross_amount +
        SERVER_KEY
    )
    .digest("hex");
  return expected === payload.signature_key;
}

/**
 * Menerjemahkan transaction_status + fraud_status Midtrans menjadi status
 * order internal kita.
 */
export function mapTransactionStatus(
  transactionStatus: string,
  fraudStatus?: string
): "paid" | "pending" | "failed" | "expired" {
  if (transactionStatus === "capture") {
    return fraudStatus === "challenge" ? "pending" : "paid";
  }
  if (transactionStatus === "settlement") return "paid";
  if (transactionStatus === "pending") return "pending";
  if (transactionStatus === "deny") return "failed";
  if (transactionStatus === "cancel") return "failed";
  if (transactionStatus === "expire") return "expired";
  if (transactionStatus === "failure") return "failed";
  return "pending";
}
