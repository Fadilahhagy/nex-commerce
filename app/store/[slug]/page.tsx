import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Store,
  Sparkles,
  ShoppingBag,
  Package,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/app/components/ui/ProductCard";

type StorePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Ambil data toko berdasarkan slug
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id, store_name, slug, description, logo_url, status")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (storeError) {
    throw new Error("Gagal mengambil data toko.");
  }

  if (!store) {
    notFound();
  }

  // 2. Ambil produk aktif dari toko tersebut
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*, stores(store_name, slug)")
    .eq("store_id", store.id)
    .eq("status", "active")
    .gt("stock", 0)
    .order("created_at", { ascending: false });

  if (productsError) {
    throw new Error("Gagal mengambil produk toko.");
  }

  return (
    <div className="min-h-screen bg-veal-bg font-sans flex flex-col justify-between">

      {/* 2. KONTEN PROFIL TOKO */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Store Profile Banner Header */}
          <section className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                
                {/* Store Logo / Avatar Fallback */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50 shadow-2xs">
                  {store.logo_url ? (
                    <Image
                      src={store.logo_url}
                      alt={`${store.store_name} logo`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-veal text-2xl font-black text-white shadow-inner">
                      {store.store_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Store Details */}
                <div>
                  <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-veal/20 bg-veal/10 px-3 py-1 text-[11px] font-extrabold text-veal">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Official Merchant</span>
                  </div>

                  <h1 className="text-2xl font-black tracking-tight text-veal-dark sm:text-3xl">
                    {store.store_name}
                  </h1>

                  <p className="mt-1 text-xs font-semibold text-zinc-400">
                    veal.id/store/<span className="font-bold text-veal-dark">{store.slug}</span>
                  </p>
                </div>
              </div>

              {/* Total Products Badge */}
              <div className="inline-flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-3 sm:self-start">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-veal text-white shadow-md shadow-veal/20">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Katalog Aktif
                  </p>
                  <p className="text-xs font-black text-veal-dark">
                    {products.length} {products.length === 1 ? "Produk" : "Produk"}
                  </p>
                  
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-bold text-zinc-600 shadow-2xs transition hover:border-veal hover:text-veal"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Bagikan Toko</span>
                </button>
              </div>
              
            </div>

            {/* Description */}
            {store.description && (
              <div className="mt-6 border-t border-zinc-100 pt-5">
                <p className="max-w-3xl text-xs font-medium leading-relaxed text-zinc-600 sm:text-sm">
                  {store.description}
                </p>
              </div>
            )}
          </section>

          {/* Product Catalog Section */}
          <section className="mt-10">
            <div className="mb-6 flex items-center justify-between px-1">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-veal" />
                  <h2 className="text-lg font-black text-veal-dark">Store Collection</h2>
                </div>
                <p className="mt-0.5 text-xs font-medium text-zinc-500">
                  Jelajahi produk resmi yang tersedia dari {store.store_name}
                </p>
              </div>

              <span className="text-xs font-bold text-zinc-400">
                {products.length} item(s)
              </span>
            </div>

            {products.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-2xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-veal/10 text-veal">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-black text-veal-dark">Belum ada produk</h3>
                <p className="mt-1 max-w-sm text-xs font-medium text-zinc-400">
                  Toko ini belum memiliki produk aktif yang tersedia saat ini.
                </p>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

    </div>
  );
}