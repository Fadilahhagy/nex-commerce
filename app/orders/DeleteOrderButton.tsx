"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

type DeleteOrderButtonProps = {
  orderId: string;
};

export default function DeleteOrderButton({ orderId }: DeleteOrderButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus pesanan ini?"
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      // Memanggil Route Handler API /api/orders/[id]
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Gagal menghapus order.");
        setLoading(false);
        return;
      }

      setLoading(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      title="Hapus Order"
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
    </button>
  );
}