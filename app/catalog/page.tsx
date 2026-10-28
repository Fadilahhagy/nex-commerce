import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ShoppingBag, Search, Sparkles, X, SearchX } from "lucide-react";
import Footer from "@/app/components/layout/Footer";
import ProductCard from "../components/ui/ProductCard";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const searchQuery = params.q || "";
  const selectedCategory = params.category || "all";

  // Query Supabase
let query = supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      image_url,
      category,
      stores (
        store_name,
        slug
      )
    `)
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.ilike("name", `%${searchQuery}%`);
  }

  if (selectedCategory && selectedCategory !== "all") {
    query = query.ilike("category", selectedCategory);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Error fetching products details:", JSON.stringify(error, null, 2));
  }

  return (
    <div className="min-h-screen bg-veal-bg font-sans flex flex-col justify-between">
      
      {/* KONTEN UTAMA KATALOG */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">

          {/* Header Banner Katalog */}
          <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-veal/20 bg-veal/10 px-3.5 py-1 text-xs font-extrabold text-veal">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>KATALOG EKSKLUSIF VEAL</span>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-veal-dark sm:text-4xl">
                  Temukan Produk Terbaikmu
                </h1>

                <p className="mt-2 text-sm font-medium text-zinc-500 max-w-xl">
                  Jelajahi koleksi streetwear, hoodie, dan produk pilihan dari berbagai merchant terpercaya dalam ekosistem VEAL.
                </p>
              </div>

              {/* Search Bar Cepat di Header */}
              <form method="GET" className="flex items-center gap-2 w-full md:w-80">
                {selectedCategory !== "all" && (
                  <input type="hidden" name="category" value={selectedCategory} />
                )}
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="q"
                    defaultValue={searchQuery}
                    placeholder="Cari produk..."
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 pl-11 text-xs font-bold text-veal-dark placeholder:text-zinc-400 focus:border-veal focus:bg-white focus:outline-none"
                  />
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                </div>
                <button
                  type="submit"
                  className="rounded-2xl bg-veal px-5 py-3 text-xs font-extrabold text-white transition hover:bg-veal-hover cursor-pointer shadow-md shadow-veal/20"
                >
                  Cari
                </button>
              </form>
            </div>
          </div>

          {/* Filter Kategori & Info Hasil */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              
              {/* Tombol Semua Kategori */}
              <Link
                href={searchQuery ? `/catalog?q=${encodeURIComponent(searchQuery)}` : "/catalog"}
                className={`rounded-2xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer shrink-0 ${
                  selectedCategory === "all"
                    ? "bg-veal text-white shadow-md shadow-veal/20"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-veal/40 hover:text-veal"
                }`}
              >
                Semua Produk
              </Link>

              {/* Kategori: Sneakers */}
              <Link
                href={`/catalog?category=sneakers${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`rounded-2xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer shrink-0 ${
                  selectedCategory === "sneakers"
                    ? "bg-veal text-white shadow-md shadow-veal/20"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-veal/40 hover:text-veal"
                }`}
              >
                Sneakers
              </Link>

              {/* Kategori: Apparel */}
              <Link
                href={`/catalog?category=apparel${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`rounded-2xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer shrink-0 ${
                  selectedCategory === "apparel"
                    ? "bg-veal text-white shadow-md shadow-veal/20"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-veal/40 hover:text-veal"
                }`}
              >
                Apparel
              </Link>

              {/* Kategori: Accessories */}
              <Link
                href={`/catalog?category=accessories${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`rounded-2xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer shrink-0 ${
                  selectedCategory === "accessories"
                    ? "bg-veal text-white shadow-md shadow-veal/20"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-veal/40 hover:text-veal"
                }`}
              >
                Accessories
              </Link>

              {/* Kategori: Electronics */}
              <Link
                href={`/catalog?category=electronics${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`rounded-2xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer shrink-0 ${
                  selectedCategory === "electronics"
                    ? "bg-veal text-white shadow-md shadow-veal/20"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-veal/40 hover:text-veal"
                }`}
              >
                Electronics
              </Link>

              {/* Kategori: Bags */}
              <Link
                href={`/catalog?category=bags${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`rounded-2xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer shrink-0 ${
                  selectedCategory === "bags"
                    ? "bg-veal text-white shadow-md shadow-veal/20"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-veal/40 hover:text-veal"
                }`}
              >
                Bags
              </Link>

              {/* Kategori: Gaming */}
              <Link
                href={`/catalog?category=gaming${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`rounded-2xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer shrink-0 ${
                  selectedCategory === "gaming"
                    ? "bg-veal text-white shadow-md shadow-veal/20"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-veal/40 hover:text-veal"
                }`}
              >
                Gaming
              </Link>

              {/* Kategori: Other */}
              <Link
                href={`/catalog?category=other${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`rounded-2xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer shrink-0 ${
                  selectedCategory === "other"
                    ? "bg-veal text-white shadow-md shadow-veal/20"
                    : "border border-zinc-200 bg-white text-zinc-600 hover:border-veal/40 hover:text-veal"
                }`}
              >
                Other
              </Link>

            </div>

            <p className="text-xs font-bold text-zinc-400">
              Menampilkan <span className="text-veal-dark font-extrabold">{products?.length || 0}</span> produk
            </p>
          </div>

          {/* INFORMASI TENTANG HASIL PENCARIAN (SEARCH INFO BANNER) */}
          {searchQuery && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-veal/20 bg-veal/5 px-5 py-3.5 text-xs font-semibold text-veal-dark">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-veal" />
                <span>
                  Menampilkan hasil pencarian untuk kata kunci{" "}
                  <strong className="font-black text-veal">"{searchQuery}"</strong>
                  {selectedCategory !== "all" && (
                    <> pada kategori <strong className="font-black capitalize">{selectedCategory}</strong></>
                  )}
                </span>
              </div>

              {/* Tombol Reset Search */}
              <Link
                href={selectedCategory !== "all" ? `/catalog?category=${selectedCategory}` : "/catalog"}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-extrabold text-zinc-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 cursor-pointer shadow-2xs"
              >
                <X className="h-3.5 w-3.5" />
                Hapus Pencarian
              </Link>
            </div>
          )}

          {/* Grid Produk Menggunakan Komponen ProductCard */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Jika Produk Kosong */
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                {searchQuery ? <SearchX className="h-8 w-8 text-rose-500" /> : <ShoppingBag className="h-8 w-8" />}
              </div>
              <h3 className="mt-4 text-base font-extrabold text-veal-dark">
                {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Produk Tidak Ditemukan"}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                {searchQuery
                  ? "Coba gunakan kata kunci lain atau periksa kembali ejaan pencarianmu."
                  : "Belum ada produk yang tersedia untuk kategori ini."}
              </p>
              <Link
                href="/catalog"
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-veal px-5 py-3 text-xs font-bold text-white shadow-md shadow-veal/20 transition hover:bg-veal-hover"
              >
                Lihat Semua Produk
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}