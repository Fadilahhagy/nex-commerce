import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  ShoppingCart,
  ArrowLeft,
  Store,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CartItemControls from "./CartItemControls";
import ShippingAddressSelector from "./ShippingAddressSelector";

export default async function CartPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/cart");
  }

  const { data: items, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      product:products (
        id,
        name,
        slug,
        price,
        stock,
        status,
        image_url,
        store:stores (
          slug,
          store_name,
          status
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Gagal mengambil data cart.");
  }

  const { data: addresses, error: addressError } = await supabase
    .from("user_addresses")
    .select(`
      id,
      label,
      recipient_name,
      phone,
      address_line,
      subdistrict,
      city,
      province,
      postal_code,
      is_default
    `)
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (addressError) {
    throw new Error("Gagal mengambil data alamat.");
  }

  const availableItems = (items ?? []).filter((item) => {
    const product = Array.isArray(item.product)
      ? item.product[0]
      : item.product;

    if (!product || product.status !== "active") return false;

    const store = Array.isArray(product.store)
      ? product.store[0]
      : product.store;

    return store?.status === "active";
  });

  const total = availableItems.reduce((sum, item) => {
    const product = Array.isArray(item.product)
      ? item.product[0]
      : item.product;

    return sum + Number(product?.price ?? 0) * item.quantity;
  }, 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-veal-bg font-sans flex flex-col justify-between">

      {/* 2. KONTEN KERANJANG BELANJA */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Page Banner Header */}
          <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-veal/20 bg-veal/10 px-3.5 py-1 text-xs font-extrabold text-veal">
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>Keranjang Belanja</span>
                </div>

                <h1 className="text-2xl font-black tracking-tight text-veal-dark sm:text-3xl">
                  Shopping Cart
                </h1>

                <p className="mt-1.5 text-xs font-medium text-zinc-500 sm:text-sm">
                  Tinjau item pilihanmu dan pilih alamat pengiriman untuk melanjutkan checkout.
                </p>
              </div>

              {/* Cart Items Counter Badge */}
              <div className="inline-flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-3 sm:self-start">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-veal text-white shadow-md shadow-veal/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Total Item
                  </p>
                  <p className="text-xs font-black text-veal-dark">
                    {availableItems.length} {availableItems.length === 1 ? "Produk" : "Produk"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Main Content */}
          {availableItems.length === 0 ? (
            /* Empty Cart State */
            <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-2xs">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-veal/10 text-veal">
                <ShoppingBag className="h-7 w-7" />
              </div>

              <h2 className="mt-4 text-base font-black text-veal-dark">Keranjang kamu masih kosong</h2>
              <p className="mt-1 max-w-sm text-xs font-medium text-zinc-400">
                Temukan berbagai produk favoritmu di VEAL dan tambahkan ke keranjang belanja.
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
            /* Cart Grid & Summary */
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
              
              {/* Cart Items List */}
              <div className="space-y-4">
                {availableItems.map((item) => {
                  const product = Array.isArray(item.product)
                    ? item.product[0]
                    : item.product;

                  if (!product) return null;

                  const store = Array.isArray(product.store)
                    ? product.store[0]
                    : product.store;

                  const isExceedingStock = item.quantity > product.stock;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-2xs transition hover:shadow-md sm:flex-row sm:items-center"
                    >
                      {/* Product Image */}
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-zinc-400">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Product Meta & Controls */}
                      <div className="min-w-0 flex-1">
                        {/* Store Attribution */}
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-veal">
                          <Store className="h-3.5 w-3.5" />
                          <Link
                            href={`/store/${store?.slug}`}
                            className="hover:underline"
                          >
                            {store?.store_name}
                          </Link>
                        </div>

                        {/* Product Name */}
                        <h3 className="mt-1 truncate text-sm font-black text-veal-dark">
                          <Link
                            href={`/store/${store?.slug}/product/${product.slug}`}
                            className="transition hover:text-veal"
                          >
                            {product.name}
                          </Link>
                        </h3>

                        {/* Price */}
                        <p className="mt-1 text-sm font-black text-veal-dark">
                          {formatPrice(Number(product.price))}
                        </p>

                        {/* Controls */}
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3">
                          <CartItemControls
                            itemId={item.id}
                            initialQuantity={item.quantity}
                            stock={product.stock}
                          />

                          <span className="text-xs font-medium text-zinc-400">
                            Subtotal:{" "}
                            <span className="font-extrabold text-veal-dark">
                              {formatPrice(Number(product.price) * item.quantity)}
                            </span>
                          </span>
                        </div>

                        {/* Stock Exceeded Alert */}
                        {isExceedingStock && (
                          <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-bold text-rose-700">
                            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                            <span>
                              Stok terbatas ({product.stock} tersisa). Kurangi jumlah untuk checkout.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary Sidebar */}
              <aside className="sticky top-24 h-fit space-y-4">
                <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs">
                  <h2 className="text-sm font-black uppercase tracking-wider text-veal-dark">
                    Order Summary
                  </h2>

                  <div className="mt-4 space-y-3 border-b border-zinc-100 pb-4 text-xs font-medium text-zinc-600">
                    <div className="flex justify-between">
                      <span>Total Item</span>
                      <span className="font-bold text-veal-dark">{availableItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-veal-dark">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="my-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Est.</span>
                    <span className="text-xl font-black text-veal">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <p className="mb-5 text-[11px] font-medium leading-relaxed text-zinc-400">
                    Biaya pengiriman dan estimasi akhir akan disesuaikan dengan alamat tujuan pilihanmu.
                  </p>

                  {/* Shipping Address Selector Component */}
                  <ShippingAddressSelector addresses={addresses ?? []} />
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-200/80 bg-white p-3.5 text-center text-xs font-bold text-zinc-500 shadow-2xs">
                  <ShieldCheck className="h-4 w-4 text-veal shrink-0" />
                  <span>Encrypted & Secure Checkout</span>
                </div>
              </aside>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}