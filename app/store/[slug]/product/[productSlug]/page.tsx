import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Store,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Share2,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AddToCartButton from "@/app/cart/AddToCartButton";
import WishlistButton from "@/app/components/wishlist/WishlistButton";
import ProductGallery from "./ProductGallery";

type ProductPageProps = {
  params: Promise<{
    slug: string;
    productSlug: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductPageProps) {
  const { slug, productSlug } = await params;
  const supabase = await createClient();

  // 1. Fetch store by slug
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id, store_name, slug")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (storeError) throw new Error("Failed to load store details.");
  if (!store) notFound();

  // 2. Fetch active product by slug and store ID
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, price, stock, category, image_url, image_urls, status"
    )
    .eq("store_id", store.id)
    .eq("slug", productSlug)
    .eq("status", "active")
    .maybeSingle();

  if (productError) throw new Error("Failed to load product details.");
  if (!product) notFound();

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(product.price));

  const isAvailable = product.stock > 0;

  // Combine cover image and additional gallery images without duplicates
  const allImages: string[] = Array.from(
    new Set([
      ...(product.image_url ? [product.image_url] : []),
      ...(product.image_urls || []),
    ])
  );

  return (
    <div className="min-h-screen bg-veal-bg font-sans flex flex-col justify-between">

      {/* 2. KONTEN DETAIL PRODUK */}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* TOP SUB-HEADER: Breadcrumb (Kiri) & Icon Actions (Kanan) */}
          <div className="mb-6 flex items-center justify-between pb-2">
            <nav className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
              <Link href="/" className="transition hover:text-veal-dark">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-zinc-300" />
              <Link href={`/store/${store.slug}`} className="transition hover:text-veal-dark">
                {store.store_name}
              </Link>
              <ChevronRight className="h-3 w-3 text-zinc-300" />
              <span className="truncate max-w-[180px] sm:max-w-xs font-bold text-veal-dark">
                {product.name}
              </span>
            </nav>

            {/* Top Action Icons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Bagikan Produk"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-2xs transition hover:border-veal hover:bg-veal hover:text-white"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Product Layout Grid */}
          <div className="grid gap-8 lg:grid-cols-12">
            
            {/* Left Column: Interactive Product Gallery */}
            <div className="lg:col-span-7">
              <ProductGallery
                images={allImages}
                productName={product.name}
                category={product.category}
              />
            </div>

            {/* Right Column: Product Info & Purchase Actions */}
            <div className="flex flex-col justify-between lg:col-span-5">
              <div className="space-y-6">
                
                {/* Product Title & Store Inline Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-widest text-veal">
                      {product.category || "Streetwear"}
                    </span>

                    {/* Stock Status Badge */}
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Stok Tersedia ({product.stock})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200/60">
                        <XCircle className="h-3 w-3 text-rose-600" />
                        Stok Habis
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl font-black tracking-tight text-veal-dark sm:text-3xl leading-snug">
                    {product.name}
                  </h1>

                  {/* SUB-TITLE TOKO (Menyatu Secara Natural di Bawah Judul) */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-xs font-medium text-zinc-400">Dijual oleh:</span>
                    <Link
                      href={`/store/${store.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-black text-veal-dark hover:text-veal transition-colors group"
                    >
                      <Store className="h-3.5 w-3.5 text-veal" />
                      <span className="underline underline-offset-4 decoration-zinc-300 group-hover:decoration-veal">
                        {store.store_name}
                      </span>
                      <BadgeCheck className="h-3.5 w-3.5 text-veal fill-veal/10" />
                    </Link>
                  </div>
                </div>

                {/* Price Display Card */}
                <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                      Harga Resmi
                    </span>
                    <span className="text-2xl font-black text-veal-dark sm:text-3xl">
                      {formattedPrice}
                    </span>
                  </div>
                </div>

                {/* Description Box */}
                <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs">
                  <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">
                    Deskripsi Produk
                  </h2>
                  <p className="mt-3 whitespace-pre-line text-xs font-medium leading-relaxed text-zinc-600 sm:text-sm">
                    {product.description || "Tidak ada deskripsi khusus untuk produk ini."}
                  </p>
                </div>

                {/* Action Buttons Container */}
                <div className="space-y-3 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs">
                  <AddToCartButton
                    productId={product.id}
                    stock={product.stock}
                  />

                  <WishlistButton productId={product.id} variant="full" />
                </div>

                {/* Guarantee Features */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs">
                    <Truck className="mx-auto h-4 w-4 text-veal" />
                    <p className="mt-1.5 text-[11px] font-bold text-veal-dark">Fast Delivery</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs">
                    <ShieldCheck className="mx-auto h-4 w-4 text-veal" />
                    <p className="mt-1.5 text-[11px] font-bold text-veal-dark">100% Original</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-2xs">
                    <RotateCcw className="mx-auto h-4 w-4 text-veal" />
                    <p className="mt-1.5 text-[11px] font-bold text-veal-dark">Verified Seller</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}