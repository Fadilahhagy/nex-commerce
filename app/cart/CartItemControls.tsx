"use client";

import { useState } from "react";
import { Plus, Minus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type CartItemControlsProps = {
  itemId: string;
  initialQuantity: number;
  stock: number;
};

export default function CartItemControls({
  itemId,
  initialQuantity,
  stock,
}: CartItemControlsProps) {
  const supabase = createClient();

  const [quantity, setQuantity] = useState(initialQuantity);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function updateQuantity(nextQuantity: number) {
    if (loading || nextQuantity < 1 || nextQuantity > stock) return;

    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please sign in to update cart.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity: nextQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .eq("user_id", user.id);

    if (error) {
      setMessage("Failed to update quantity.");
      setLoading(false);
      return;
    }

    setQuantity(nextQuantity);
    setLoading(false);
    window.location.reload();
  }

  async function removeItem() {
    if (loading) return;

    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please sign in to remove item.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId)
      .eq("user_id", user.id);

    if (error) {
      setMessage("Failed to remove item.");
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {/* Quantity Stepper */}
        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50/50 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => updateQuantity(quantity - 1)}
            disabled={loading || quantity <= 1}
            aria-label="Decrease quantity"
            className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          <span className="min-w-8 text-center text-xs font-bold text-slate-800">
            {loading ? <Loader2 className="mx-auto h-3 w-3 animate-spin text-[#7A28CB]" /> : quantity}
          </span>

          <button
            type="button"
            onClick={() => updateQuantity(quantity + 1)}
            disabled={loading || quantity >= stock}
            aria-label="Increase quantity"
            className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={removeItem}
          disabled={loading}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>

      {stock === 0 && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          Item is out of stock. Please remove it to proceed.
        </p>
      )}

      {message && (
        <p role="alert" className="text-xs font-semibold text-rose-600">
          {message}
        </p>
      )}
    </div>
  );
}