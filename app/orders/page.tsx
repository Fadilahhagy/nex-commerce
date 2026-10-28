import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import DeleteOrderButton from "./DeleteOrderButton";

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/orders");

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, status, total_amount, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Gagal mengambil riwayat order.");

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

  const renderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            <XCircle className="h-3.5 w-3.5 text-rose-600" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200/80 bg-purple-50 px-3 py-1 text-xs font-semibold text-[#7A28CB]">
            <Clock className="h-3.5 w-3.5 text-[#7A28CB]" />
            {status || "Pending"}
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Navigation Back */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Continue Shopping
          </Link>
        </div>

        {/* Page Banner Header */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#7A28CB]">
                <Package className="h-3.5 w-3.5" />
                <span>Order History</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                My Orders
              </h1>

              <p className="mt-1.5 text-sm text-slate-500">
                Track and manage your order history and purchases.
              </p>
            </div>

            {/* Total Orders Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 sm:self-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7A28CB] text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Total Orders
                </p>
                <p className="text-xs font-bold text-slate-800">
                  {orders.length} {orders.length === 1 ? "Record" : "Records"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List / Empty State */}
        {orders.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-[#7A28CB]">
              <ShoppingBag className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">No orders yet</h2>
            <p className="mt-1 max-w-sm text-xs font-medium text-slate-500">
              Pesanan yang kamu buat akan muncul di sini secara otomatis setelah checkout.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7A28CB] px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-[#7A28CB]/25 transition hover:bg-[#681FB0] active:scale-[0.98]"
            >
              <ShoppingBag className="h-4 w-4" />
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Order ID
                    </span>
                    <p className="mt-0.5 truncate font-mono text-xs font-bold text-slate-900">
                      {order.id}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {renderStatusBadge(order.status)}
                    <DeleteOrderButton orderId={order.id} />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Placed On
                    </span>
                    <p className="mt-0.5 text-xs font-medium text-slate-600">
                      {new Date(order.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Total Amount
                      </span>
                      <p className="mt-0.5 text-sm font-extrabold text-slate-900">
                        {formatPrice(Number(order.total_amount))}
                      </p>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-[#7A28CB]/40 hover:bg-purple-50 hover:text-[#7A28CB]"
                    >
                      Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}