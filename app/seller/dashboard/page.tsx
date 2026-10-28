import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Store,
  Plus,
  ExternalLink,
  Package,
  CheckCircle2,
  FileEdit,
  Sparkles,
  ShoppingBag,
  Pencil,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import DeleteProductButton from "./DeleteProductButton";

export default async function SellerDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id, store_name, slug, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (storeError) {
    throw new Error("Gagal mengambil data toko.");
  }

  if (!store) {
    redirect("/seller");
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, stock, status, created_at")
    .eq("store_id", store.id)
    .order("created_at", { ascending: false });

  if (productsError) {
    throw new Error("Gagal mengambil data produk.");
  }

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const draftProducts = products.filter((p) => p.status === "draft").length;

  return (
    <main className="min-h-screen bg-veal-bg px-4 py-10 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        


        {/* Header Banner */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-veal/20 bg-veal/10 px-3 py-1 text-xs font-extrabold text-veal">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Seller Dashboard</span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-veal-dark sm:text-3xl">
                {store.store_name}
              </h1>

              <p className="mt-1.5 text-xs font-medium text-zinc-500 sm:text-sm">
                Kelola katalog produk, harga, dan ketersediaan stok tokomu.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/store/${store.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 shadow-2xs transition hover:bg-zinc-50 hover:text-veal-dark"
              >
                <ExternalLink className="h-4 w-4" />
                View Store
              </Link>

              <Link
                href="/seller/products/new"
                className="inline-flex items-center gap-2 rounded-xl bg-veal px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-veal/25 transition hover:bg-veal-hover active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            </div>
          </div>
        </div>

        {/* Analytics / Stats Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Products</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-veal-dark">
              {totalProducts}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Products</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-veal-dark">
              {activeProducts}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-2xs transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Draft Products</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <FileEdit className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-veal-dark">
              {draftProducts}
            </p>
          </div>
        </div>

        {/* Product Catalog Table Section */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="text-sm font-black uppercase tracking-wider text-veal-dark">Your Products</h2>
            <span className="text-xs font-semibold text-zinc-400">{totalProducts} item(s) listed</span>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-2xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-veal/10 text-veal">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-black text-veal-dark">Toko kamu masih kosong</h3>
              <p className="mt-1 text-xs font-medium text-zinc-500 max-w-sm">
                Tambahkan produk pertamamu untuk mulai membangun katalog toko dan melakukan penjualan di VEAL.
              </p>
              <Link
                href="/seller/products/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-veal px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-veal/25 transition hover:bg-veal-hover"
              >
                <Plus className="h-4 w-4" />
                Create First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-100 bg-zinc-50/50 text-zinc-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="transition hover:bg-zinc-50/60"
                      >
                        <td className="px-6 py-4 font-bold text-veal-dark">
                          {product.name}
                        </td>

                        <td className="px-6 py-4 font-extrabold text-veal-dark">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(Number(product.price))}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center font-bold ${
                              product.stock > 0
                                ? "text-zinc-700"
                                : "text-rose-600"
                            }`}
                          >
                            {product.stock > 0 ? product.stock : "Out of stock"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {product.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/60 bg-zinc-100 px-2.5 py-1 text-[11px] font-bold text-zinc-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                              Draft
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              href={`/seller/products/${product.id}/edit`}
                              title="Edit Product"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 shadow-2xs transition hover:border-veal/40 hover:bg-veal/10 hover:text-veal"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>

                            <DeleteProductButton
                              productId={product.id}
                              productName={product.name}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}