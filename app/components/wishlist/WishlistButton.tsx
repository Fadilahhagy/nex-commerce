"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type WishlistButtonProps = {
  productId: string;
  variant?: "icon" | "full"; // "icon" untuk ProductCard, "full" untuk Detail Page
};

export default function WishlistButton({
  productId,
  variant = "icon",
}: WishlistButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkWishlist() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("wishlist_items")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (!cancelled) {
        if (!error) setSaved(Boolean(data));
        setLoading(false);
      }
    }

    checkWishlist();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function toggleWishlist(e: React.MouseEvent) {
    // Mencegah link ke halaman detail terklik saat menekan tombol wishlist
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?next=/product/${productId}`);
      return;
    }

    // Optimistic UI Update (responsif secara instan)
    const nextState = !saved;
    setSaved(nextState);

    if (saved) {
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) setSaved(true); // Revert jika gagal
    } else {
      const { error } = await supabase.from("wishlist_items").insert({
        user_id: user.id,
        product_id: productId,
      });

      if (error && error.code !== "23505") setSaved(false); // Revert jika gagal
    }

    setLoading(false);
    router.refresh();
  }

  // -------------------------------------------------------------
  // TAMPILAN 1: VARIANT "ICON" (Untuk ProductCard / Grid Product)
  // -------------------------------------------------------------
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggleWishlist}
        disabled={loading}
        title={saved ? "Hapus dari wishlist" : "Tambah ke wishlist"}
        className={`cursor-pointer flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 shadow-2xs backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 ${
          saved
            ? "text-rose-500 border-rose-200/60 bg-rose-50/90"
            : "text-zinc-400 hover:text-rose-500 hover:border-rose-200"
        }`}
      >
        <Heart
          className={`h-4 w-4 transition-transform duration-200 ${
            saved
              ? "fill-rose-500 stroke-rose-500 scale-110"
              : "stroke-current"
          }`}
        />
      </button>
    );
  }

  // -------------------------------------------------------------
  // TAMPILAN 2: VARIANT "FULL" (Untuk Halaman Detail Produk)
  // -------------------------------------------------------------
  return (
    <button
      type="button"
      onClick={toggleWishlist}
      disabled={loading}
      className={`cursor-pointer flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-xs font-bold transition-all duration-200 active:scale-[0.99] disabled:opacity-50 ${
        saved
          ? "border-rose-200 bg-rose-50/80 text-rose-600 shadow-2xs"
          : "border-zinc-200/90 bg-white text-zinc-700 shadow-2xs hover:border-veal hover:bg-zinc-50 hover:text-veal-dark"
      }`}
    >
      <Heart
        className={`h-4 w-4 transition-transform duration-200 ${
          saved ? "fill-rose-500 stroke-rose-500 scale-105" : "stroke-current"
        }`}
      />
      <span>{saved ? "Remove from Wishlist" : "Add to Wishlist"}</span>
    </button>
  );
}