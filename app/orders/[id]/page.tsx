import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import EditOrderAddress from "./EditOrderAddress";
import PayButton from "./PayButton";
import DeleteOrderButton from "./DeleteOrderButton";
import Footer from "@/app/components/layout/Footer";

type ShippingAddress = {
  label: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  subdistrict: string | null;
  city: string;
  province: string;
  postal_code: string | null;
};

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/orders/${id}`);
  }

  // Ambil order beserta snapshot alamat pengiriman
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total_amount,
      payment_status,
      created_at,
      shipping_address,
      order_items (
        id,
        product_name,
        unit_price,
        quantity,
        subtotal
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error("Gagal mengambil order.");
  if (!order) notFound();

  const address = order.shipping_address as ShippingAddress | null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

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
    throw new Error("Gagal mengambil alamat pengguna.");
  }

  const currentAddressId =
    typeof order.shipping_address === "object" &&
    order.shipping_address !== null &&
    "address_id" in order.shipping_address &&
    typeof order.shipping_address.address_id === "string"
      ? order.shipping_address.address_id
      : null;

  const renderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Selesai</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
            <XCircle className="h-3.5 w-3.5 text-rose-600" />
            <span>Dibatalkan</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-veal/20 bg-veal/10 px-3 py-1 text-xs font-bold text-veal">
            <Clock className="h-3.5 w-3.5 text-veal" />
            <span className="capitalize">{status || "Pending"}</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-veal-bg font-sans flex flex-col justify-between">
      
      {/* KONTEN UTAMA */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">

          {/* Banner Header Rincian Pesanan */}
          <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-veal/20 bg-veal/10 px-3 py-1 text-xs font-extrabold text-veal">
                  <PackageCheck className="h-3.5 w-3.5" />
                  <span>ORDER CONFIRMATION</span>
                </div>

                <h1 className="text-2xl font-black tracking-tight text-veal-dark sm:text-3xl">
                  Detail Pesanan
                </h1>

                <p className="mt-1.5 text-xs font-medium text-zinc-500 sm:text-sm">
                  Informasi rinci mengenai item, pengiriman, dan status pembayaran pesanan kamu.
                </p>
              </div>

              {/* Status Badge Top Right */}
              <div className="self-start sm:self-center">
                {renderStatusBadge(order.status)}
              </div>
            </div>
          </div>

          {/* Grid Informasi Utama: Ringkasan Order & Alamat */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Box 1: Ringkasan ID & Waktu */}
            <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-veal font-bold text-xs uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Ringkasan Transaksi</span>
              </div>

              <div className="space-y-3 pt-2 border-t border-zinc-100">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    ID Pesanan
                  </p>
                  <p className="mt-0.5 font-mono text-xs font-bold text-veal-dark break-all">
                    {order.id}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Waktu Transaksi
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-zinc-700">
                      {new Date(order.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-right">
                      Status Pembayaran
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-veal text-right capitalize">
                      {order.payment_status || "Unpaid"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Box 2: Alamat Pengiriman */}
            <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-veal font-bold text-xs uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                <span>Alamat Pengiriman</span>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                {address ? (
                  <div className="space-y-1 text-xs text-zinc-700">
                    <p className="font-extrabold text-veal-dark text-sm">{address.label}</p>
                    <p className="font-bold">{address.recipient_name} ({address.phone})</p>
                    <p className="text-zinc-600 leading-relaxed">{address.address_line}</p>
                    {address.subdistrict && <p className="text-zinc-600">{address.subdistrict}</p>}
                    <p className="text-zinc-600">
                      {address.city}, {address.province}
                      {address.postal_code ? `, ${address.postal_code}` : ""}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs font-medium text-zinc-400">
                    Snapshot alamat tidak tersedia untuk order ini.
                  </p>
                )}
              </div>

              {/* Ubah Alamat Form Component */}
              {order.status === "pending" && (
                <div className="border-t border-zinc-100 pt-3">
                  <EditOrderAddress
                    orderId={order.id}
                    currentAddressId={currentAddressId}
                    addresses={addresses ?? []}
                    canEdit={order.status === "pending"}
                  />
                </div>
              )}
            </section>

          </div>

          {/* Section: Daftar Produk (Order Items) */}
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs">
            <h2 className="text-sm font-extrabold text-veal-dark uppercase tracking-wider mb-4">
              Item Dipesan
            </h2>

            <div className="divide-y divide-zinc-100">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs sm:text-sm text-veal-dark truncate">
                      {item.product_name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-zinc-400">
                      {formatPrice(Number(item.unit_price))} × {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 font-extrabold text-xs sm:text-sm text-veal-dark">
                    {formatPrice(Number(item.subtotal))}
                  </p>
                </div>
              ))}
            </div>

            {/* Total Pembayaran & Tombol Bayar */}
            <div className="mt-4 border-t border-zinc-200/80 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">
                  Total Pembayaran
                </p>
                <p className="text-lg sm:text-xl font-black text-veal-dark">
                  {formatPrice(Number(order.total_amount))}
                </p>
              </div>

              {order.status === "pending" &&
                ["unpaid", "pending"].includes(order.payment_status) && (
                  <div className="pt-2">
                    <PayButton orderId={order.id} />
                  </div>
                )}
            </div>
          </section>

          {/* Action Links & Delete Option */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/orders"
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-xs font-bold text-zinc-700 shadow-2xs transition hover:bg-zinc-50 hover:text-veal-dark active:scale-[0.98]"
              >
                <span>Lihat Semua Pesanan</span>
              </Link>

              <Link
                href="/"
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-veal px-5 py-3 text-xs font-bold text-white shadow-md shadow-veal/20 transition hover:bg-veal-hover active:scale-[0.98]"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Lanjut Berbelanja</span>
              </Link>
            </div>

            {order.status === "pending" &&
              ["unpaid", "pending", "expired", "failed"].includes(
                order.payment_status
              ) && (
                <DeleteOrderButton orderId={order.id} />
              )}
          </div>

        </div>
      </main>

      {/* FOOTER GLOBAL */}
      <Footer />

    </div>
  );
}