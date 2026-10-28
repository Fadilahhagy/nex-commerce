import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "./Sidebar";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil data toko berdasarkan user yang login
  const { data: store } = await supabase
    .from("stores")
    .select("store_name, slug")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!store) {
    redirect("/seller");
  }

  return (
    <div className="flex min-h-screen bg-veal-bg font-sans">
      {/* Sidebar Tetap di Kiri */}
      <Sidebar storeName={store.store_name} storeSlug={store.slug} />

      {/* Area Konten Utama di Kanan (diberi margin-left seluas lebar sidebar) */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10">
          {children}
        </div>
      </main>
    </div>
  );
}