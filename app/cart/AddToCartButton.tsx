"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AddToCartButtonProps = {
  productId: string | number;
  stock?: number;
  variant?: "full" | "icon";
  className?: string;
};

export default function AddToCartButton({
  productId,
  stock = 99,
  variant = "full",
  className = "",
}: AddToCartButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (loading || stock <= 0) return;
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?next=/product/${productId}`);
      return;
    }

    // Cek apakah produk sudah ada di keranjang
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);

      if (!error) triggerSuccess();
    } else {
      const { error } = await supabase
        .from("cart_items")
        .insert({ user_id: user.id, product_id: productId, quantity: 1 });

      if (!error) triggerSuccess();
    }

    setLoading(false);
    router.refresh();
  }

  function triggerSuccess() {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1800);
  }

  // 1. TAMPILAN MODE ICON (Khusus untuk ProductCard / Grid Product)
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading || stock <= 0}
        aria-label="Tambah ke keranjang"
        className={
          className ||
          "flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-veal-dark shadow-2xs transition-all duration-200 hover:border-veal hover:bg-veal hover:text-white disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
        }
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : success ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <ShoppingBag className="h-4 w-4" />
        )}
      </button>
    );
  }

  // 2. TAMPILAN MODE FULL (Khusus untuk Halaman Detail Produk)
  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={loading || stock <= 0}
      className={
        className ||
        "inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-veal px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-veal/20 transition-all duration-200 hover:bg-veal-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Memasukkan ke Keranjang...</span>
        </>
      ) : success ? (
        <>
          <Check className="h-4 w-4 text-emerald-300" />
          <span>Berhasil Ditambahkan!</span>
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" />
          <span>{stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}</span>
        </>
      )}
    </button>
  );
}