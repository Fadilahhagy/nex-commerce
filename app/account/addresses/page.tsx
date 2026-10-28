import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AddressManager from "./AddressManager";

export default async function AddressesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account/addresses");
  }

  const { data: addresses, error } = await supabase
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
      is_default,
      created_at
    `)
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Gagal mengambil data alamat.");
  }

  return (
    <div className="min-h-screen bg-veal-bg font-sans flex flex-col justify-between">

      {/* 2. KONTEN UTAMA KELOLA ALAMAT */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Header Banner Card */}
          <div className="mb-8 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-veal/20 bg-veal/10 px-3.5 py-1 text-xs font-extrabold text-veal w-fit">
                <MapPin className="h-3.5 w-3.5" />
                <span>MY ACCOUNT</span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-veal-dark sm:text-3xl">
                Alamat Saya
              </h1>

              <p className="text-xs font-medium text-zinc-500 sm:text-sm">
                Kelola alamat pengiriman resmi untuk mempermudah proses transaksi di VEAL.
              </p>
            </div>
          </div>

          {/* Address Manager Component */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
            <AddressManager initialAddresses={addresses ?? []} />
          </div>

        </div>
      </main>
    </div>
  );
}