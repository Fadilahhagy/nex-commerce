import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Store, Sparkles, FileEdit } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import EditProductForm from "./EditProductForm";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Verifikasi toko milik seller
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id, store_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (storeError || !store) redirect("/seller");

  // 2. Ambil data produk berdasarkan ID & Store ID
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      "id, name, slug, description, price, stock, category, image_url, image_urls, status"
    )
    .eq("id", id)
    .eq("store_id", store.id)
    .maybeSingle();

  if (productError || !product) notFound();

  return (
    <div className="min-h-screen bg-veal-bg font-sans flex flex-col justify-between">
      
      {/* KONTEN UTAMA */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          
          {/* Navigation / Back Button */}
          <div>
            <Link
              href="/seller/dashboard"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-4 py-2 text-xs font-bold text-zinc-600 shadow-2xs transition hover:bg-zinc-50 hover:text-veal-dark"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Dashboard Seller</span>
            </Link>
          </div>

          {/* Header Banner */}
          <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-veal/20 bg-veal/10 px-3 py-1 text-xs font-extrabold text-veal">
                  <FileEdit className="h-3.5 w-3.5" />
                  <span>KATALOG EDITOR</span>
                </div>

                <h1 className="text-2xl font-black tracking-tight text-veal-dark sm:text-3xl">
                  Edit Produk
                </h1>

                <p className="mt-1.5 text-xs font-medium text-zinc-500 sm:text-sm">
                  Perbarui detail spesifikasi, harga, stok, dan galeri foto produk kamu.
                </p>
              </div>

              {/* Store Badge */}
              <div className="inline-flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 sm:self-start">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-veal text-white shadow-xs">
                  <Store className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Target Toko
                  </p>
                  <p className="text-xs font-extrabold text-veal-dark">
                    {store.store_name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Client Component */}
          <EditProductForm storeId={store.id} product={product} />

        </div>
      </main>
    </div>
  );
}