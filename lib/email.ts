import nodemailer from "nodemailer";
import { formatRupiah } from "./products";

// =============================================================================
// Pengiriman email link produk via SMTP (Nodemailer).
//
// Konfigurasi lewat environment variable:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
//
// Contoh untuk Gmail (gunakan "App Password", bukan password akun):
//   SMTP_HOST=smtp.gmail.com
//   SMTP_PORT=465
//   SMTP_USER=emailkamu@gmail.com
//   SMTP_PASS=xxxx xxxx xxxx xxxx   (App Password 16 digit)
//   MAIL_FROM="Digital Creatif <emailkamu@gmail.com>"
//
// Jika SMTP belum dikonfigurasi, email akan di-LOG ke console (mode dev)
// sehingga alur tetap berjalan tanpa kredensial.
// =============================================================================

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const MAIL_FROM =
  process.env.MAIL_FROM || "Digital Creatif <no-reply@digitalcreatif.id>";

export const EMAIL_CONFIGURED = SMTP_HOST !== "" && SMTP_USER !== "";

export async function sendProductEmail(params: {
  to: string;
  productName: string;
  downloadUrl: string;
  orderId: string;
  amount: number;
}): Promise<void> {
  const html = buildEmailHtml(params);
  const subject = `✅ Produk kamu siap diunduh — ${params.productName}`;

  if (!EMAIL_CONFIGURED) {
    // Mode dev: tidak ada SMTP, cukup log.
    console.log("=".repeat(70));
    console.log("[EMAIL - MODE DEV] SMTP belum dikonfigurasi, email di-log saja:");
    console.log(`  To      : ${params.to}`);
    console.log(`  Subject : ${subject}`);
    console.log(`  Produk  : ${params.productName}`);
    console.log(`  Link    : ${params.downloadUrl}`);
    console.log(`  Order   : ${params.orderId}`);
    console.log("=".repeat(70));
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: MAIL_FROM,
    to: params.to,
    subject,
    html,
  });
}

function buildEmailHtml(params: {
  productName: string;
  downloadUrl: string;
  orderId: string;
  amount: number;
}): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">
      <div style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:32px 28px;color:#ffffff">
        <h1 style="margin:0;font-size:22px">Terima kasih atas pembelianmu! 🎉</h1>
        <p style="margin:8px 0 0;opacity:0.9">Pembayaran berhasil dikonfirmasi.</p>
      </div>
      <div style="padding:28px">
        <p style="font-size:15px;color:#374151;margin-top:0">
          Hai, berikut detail pesananmu:
        </p>
        <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse">
          <tr>
            <td style="padding:8px 0;color:#6b7280">Produk</td>
            <td style="padding:8px 0;text-align:right;font-weight:600">${params.productName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280">Order ID</td>
            <td style="padding:8px 0;text-align:right;font-family:monospace">${params.orderId}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280">Total</td>
            <td style="padding:8px 0;text-align:right;font-weight:600">${formatRupiah(params.amount)}</td>
          </tr>
        </table>
        <div style="text-align:center;margin:28px 0">
          <a href="${params.downloadUrl}"
             style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px">
            ⬇️ Download Produk
          </a>
        </div>
        <p style="font-size:13px;color:#6b7280">
          Atau salin link berikut ke browser:<br>
          <a href="${params.downloadUrl}" style="color:#4f46e5;word-break:break-all">${params.downloadUrl}</a>
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
        <p style="font-size:12px;color:#9ca3af;margin:0">
          Simpan email ini sebagai bukti pembelian. Jika ada kendala,
          balas email ini dan tim kami akan membantu.
        </p>
      </div>
    </div>
    <p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:16px">
      © ${new Date().getFullYear()} Digital Creatif
    </p>
  </div>`;
}
