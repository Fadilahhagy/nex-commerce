"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Plus, ExternalLink } from "lucide-react";
import CheckoutButton from "./CheckoutButton";

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

export default function ShippingAddressSelector({
  addresses,
}: {
  addresses: Address[];
}) {
  const defaultAddress =
    addresses.find((address) => address.is_default) ?? addresses[0];

  const [selectedId, setSelectedId] = useState(
    defaultAddress?.id ?? ""
  );

  const selectedAddress = addresses.find(
    (address) => address.id === selectedId
  );

  return (
    <section className="mt-5 border-t border-zinc-100 pt-5 font-sans">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-veal-dark">
          <MapPin className="h-4 w-4 text-veal" />
          <span>Alamat Pengiriman</span>
        </h3>

        {addresses.length > 0 && (
          <Link
            href="/account/addresses"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-veal transition hover:underline"
          >
            <span>Kelola Alamat</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="mt-3.5 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 text-center">
          <p className="text-xs font-semibold text-amber-800">
            Kamu belum menyimpan alamat pengiriman.
          </p>

          <Link
            href="/account/addresses"
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-amber-100/80 px-3.5 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-200"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Alamat Baru</span>
          </Link>
        </div>
      ) : (
        <div className="mt-3.5 space-y-3">
          <select
            id="shipping-address"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 p-3 text-xs font-bold text-veal-dark outline-none transition focus:border-veal focus:bg-white focus:ring-2 focus:ring-veal/10"
          >
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.label}
                {address.is_default ? " (Utama)" : ""} - {address.city}
              </option>
            ))}
          </select>

          {selectedAddress && (
            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 text-xs">
              <div className="flex items-center justify-between">
                <p className="font-extrabold text-veal-dark">
                  {selectedAddress.recipient_name}
                </p>
                <span className="text-[10px] font-semibold text-zinc-400">
                  {selectedAddress.phone}
                </span>
              </div>

              <p className="mt-1.5 leading-relaxed text-zinc-500 font-medium">
                {selectedAddress.address_line}
                {selectedAddress.subdistrict && `, ${selectedAddress.subdistrict}`}
                {`, ${selectedAddress.city}, ${selectedAddress.province}`}
                {selectedAddress.postal_code && ` ${selectedAddress.postal_code}`}
              </p>
            </div>
          )}

          <div className="pt-2">
            <CheckoutButton addressId={selectedId} />
          </div>
        </div>
      )}
    </section>
  );
}