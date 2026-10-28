"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Address = {
  id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  subdistrict: string | null;
  city: string;
  province: string;
  postal_code: string | null;
  is_default: boolean;
};

export default function EditOrderAddress({
  orderId,
  currentAddressId,
  addresses,
  canEdit,
}: {
  orderId: string;
  currentAddressId: string | null;
  addresses: Address[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(
    currentAddressId ?? addresses.find((a) => a.is_default)?.id ?? addresses[0]?.id ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  async function handleUpdate() {
    if (!selectedId) {
      setMessage({ text: "Pilih alamat terlebih dahulu.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    const { error } = await supabase.rpc("update_order_shipping_address", {
      p_order_id: orderId,
      p_address_id: selectedId,
    });

    if (error) {
      setMessage({ text: error.message, type: "error" });
      setLoading(false);
      return;
    }

    setMessage({ text: "Alamat pengiriman berhasil diperbarui.", type: "success" });
    setLoading(false);
    router.refresh();
  }

  if (!canEdit) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-3.5 text-xs font-semibold text-amber-800">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
        <span>Alamat tidak dapat diubah karena pesanan sudah diproses / selesai.</span>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="mt-3 flex flex-col items-start gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50 p-4 text-xs font-medium text-zinc-600">
        <p>Belum ada alamat tersimpan di akun kamu.</p>
        <Link
          href="/account/addresses"
          className="inline-flex cursor-pointer items-center gap-1.5 font-bold text-veal hover:underline"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Tambah Alamat Baru</span>
        </Link>
      </div>
    );
  }

  const selectedAddress = addresses.find((a) => a.id === selectedId);

  return (
    <div className="mt-4 space-y-3.5 font-sans">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-veal-dark uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-veal" />
          <span>Ubah Alamat Pengiriman</span>
        </label>
      </div>

      {/* Select Dropdown Styled */}
      <div className="relative">
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setMessage(null);
          }}
          disabled={loading}
          className="w-full appearance-none cursor-pointer rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 pr-10 text-xs font-bold text-veal-dark shadow-2xs transition hover:border-veal focus:border-veal focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {addresses.map((address) => (
            <option key={address.id} value={address.id}>
              {address.label} - {address.recipient_name}, {address.city}
              {address.is_default ? " (Utama)" : ""}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      </div>

      {/* Preview Card Alamat Terpilih */}
      {selectedAddress && (
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 text-xs space-y-1 text-zinc-700">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-veal-dark">{selectedAddress.recipient_name}</span>
            <span className="text-[10px] font-semibold text-zinc-400">({selectedAddress.phone})</span>
          </div>
          <p className="font-semibold text-zinc-600">{selectedAddress.address_line}</p>
          <p className="text-zinc-500">
            {[selectedAddress.subdistrict, selectedAddress.city, selectedAddress.province, selectedAddress.postal_code]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}

      {/* Save Button */}
      <button
        type="button"
        onClick={handleUpdate}
        disabled={loading || !selectedId || selectedId === currentAddressId}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-veal px-5 py-3 text-xs font-bold text-white shadow-md shadow-veal/20 transition-all duration-200 hover:bg-veal-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Menyimpan Alamat...</span>
          </>
        ) : (
          <span>Simpan Alamat Pesanan</span>
        )}
      </button>

      {/* Alert Feedback Message */}
      {message && (
        <div
          role="status"
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
            message.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}