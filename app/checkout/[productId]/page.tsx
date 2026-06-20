import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById, formatRupiah } from "@/lib/products";
import CheckoutClient from "@/components/CheckoutClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const product = getProductById(productId);
  return {
    title: product
      ? `Checkout — ${product.name} | RAB Creatif`
      : "Checkout | RAB Creatif",
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = getProductById(productId);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-slate-50">
      <CheckoutClient
        productId={product.id}
        productName={product.name}
        tagline={product.tagline}
        emoji={product.emoji}
        price={product.price}
        priceLabel={formatRupiah(product.price)}
        previews={product.previews}
        previewTabs={product.previewTabs}
        previewFile={product.previewFile}
      />
    </main>
  );
}
