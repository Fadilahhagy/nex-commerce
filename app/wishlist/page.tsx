import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "../components/ui/ProductCard";

export default async function WishlistPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/wishlist");

  const { data: items, error } = await supabase
    .from("wishlist_items")
    .select(`
      id,
      created_at,
      product:products (
        id,
        name,
        slug,
        price,
        image_url,
        category,
        status,
        stores:stores (
          slug,
          store_name,
          status
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Gagal mengambil data wishlist.");

  // Flatten & validasi produk aktif beserta tokonya
  const products = (items ?? []).flatMap((item) => {
    const product = Array.isArray(item.product)
      ? item.product[0]
      : item.product;

    if (!product || product.status !== "active") return [];

    const store = Array.isArray(product.stores)
      ? product.stores[0]
      : product.stores;

    if (!store || store.status !== "active") return [];

    return [{ itemId: item.id, ...product, stores: store }];
  });

  return (
    <div className="min-h-screen bg-veal-bg font-sans flex flex-col justify-between">

      {/* 2. KONTEN UTAMA WISHLIST */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Page Banner Header */}
          <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-extrabold text-rose-600">
                  <Heart className="h-3.5 w-3.5 fill-rose-600" />
                  <span>Favorit Kamu</span>
                </div>

                <h1 className="text-2xl font-black tracking-tight text-veal-dark sm:text-3xl">
                  Wishlist Saya
                </h1>

                <p className="mt-1.5 text-xs font-medium text-zinc-500 sm:text-sm">
                  Daftar produk yang telah kamu simpan. Akses kapan saja atau masukkan ke keranjang.
                </p>
              </div>

              {/* Saved Count Badge */}
              <div className="inline-flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-3 sm:self-start">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-veal text-white shadow-md shadow-veal/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Total Tersimpan
                  </p>
                  <p className="text-xs font-black text-veal-dark">
                    {products.length} {products.length === 1 ? "Item" : "Items"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Wishlist Content */}
          {products.length === 0 ? (
            /* Empty State */
            <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-2xs">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 border border-rose-100">
                <Heart className="h-7 w-7" />
              </div>
              
              <h3 className="mt-4 text-base font-black text-veal-dark">Wishlist kamu masih kosong</h3>
              <p className="mt-1 max-w-sm text-xs font-medium text-zinc-400">
                Simpan produk favoritmu dengan menekan ikon hati supaya mudah ditemukan kembali saat belanja di VEAL.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-veal px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-veal/25 transition hover:bg-veal-hover active:scale-[0.98]"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Jelajahi Produk</span>
              </Link>
            </div>
          ) : (
            /* Wishlist Product Grid */
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.itemId} product={product} />
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}