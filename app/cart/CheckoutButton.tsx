"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type CheckoutButtonProps = {
  addressId: string;
};

export default function CheckoutButton({
  addressId,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleCheckout() {
    if (!addressId) {
      setMessage("Silakan pilih alamat pengiriman terlebih dahulu.");
      return;
    }

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { data, error } = await supabase.rpc("checkout_cart", {
      p_address_id: addressId,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setMessage("Gagal membuat pesanan. Silakan coba beberapa saat lagi.");
      setLoading(false);
      return;
    }

    router.push(`/orders/${data}`);
    router.refresh();
  }

  return (
    <div className="w-full font-sans">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || !addressId}
        className="cursor-pointer group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-veal px-5 py-3.5 text-xs font-bold text-white shadow-md shadow-veal/25 transition-all duration-200 hover:bg-veal-hover hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-white" />
            <span>Memproses Pesanan...</span>
          </>
        ) : (
          <>
            <span>Buat Pesanan Sekarang</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </>
        )}
      </button>

      {message && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs font-bold text-rose-700 shadow-2xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}