"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

type PayButtonProps = {
  orderId: string;
};

export default function PayButton({ orderId }: PayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePayment() {
    setLoading(true);
    setError("");

    try {
      // Minta server membuat transaksi Midtrans
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat pembayaran.");
      }

      if (data.redirectUrl) {
        // Buka halaman pembayaran Snap
        window.location.href = data.redirectUrl;
        return;
      }

      throw new Error("URL pembayaran tidak ditemukan.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat membuat pembayaran."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-veal px-6 py-3.5 text-xs font-extrabold text-white shadow-md shadow-veal/20 transition-all duration-200 hover:bg-veal-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Menyiapkan Pembayaran...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            <span>Bayar Sekarang</span>
          </>
        )}
      </button>

      {error && (
        <p className="mt-3 text-center text-xs font-bold text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}