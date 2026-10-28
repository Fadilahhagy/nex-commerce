import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Store as StoreIcon, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  BarChart3, 
  ExternalLink 
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function SellerPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Cek apakah user sudah punya toko
  const { data: store, error } = await supabase
    .from("stores")
    .select("id, store_name, slug, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error("Gagal memeriksa data toko.");
  }

  // JIKA USER SUDAH PUNYA TOKO -> TAMPILKAN CARD RINGKASAN & NAVIGASI KE DASHBOARD
  if (store) {
    return (
      <main className="min-h-screen bg-veal-bg px-4 py-16 font-sans sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm sm:p-10">
            
            {/* Header Badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-veal/20 bg-veal/10 px-3.5 py-1 text-xs font-extrabold text-veal">
              <Sparkles className="h-3.5 w-3.5" />
              <span>VEAL Merchant Account</span>
            </div>

            <h1 className="text-2xl font-black text-veal-dark sm:text-3xl">
              Welcome Back, Merchant!
            </h1>

            <p className="mt-2 text-xs font-medium text-zinc-500 sm:text-sm">
              Kamu telah terdaftar sebagai penjual resmi di platform VEAL.
            </p>

            {/* Store Information Box */}
            <div className="mt-8 rounded-2xl border border-zinc-200/90 bg-zinc-50/50 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-veal text-white font-black text-lg shadow-md shadow-veal/20">
                    <StoreIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-veal-dark">
                      {store.store_name}
                    </h2>
                    <p className="text-xs font-semibold text-zinc-400">
                      /store/{store.slug}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {store.status}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/seller/dashboard"
                className="group flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-veal px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-veal/25 transition-all duration-200 hover:bg-veal-hover hover:shadow-lg"
              >
                <span>Masuk Ke Seller Dashboard</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={`/store/${store.slug}`}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 text-xs font-bold text-zinc-700 shadow-2xs transition hover:bg-zinc-50 hover:text-veal-dark"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Lihat Toko Publik</span>
              </Link>
            </div>

          </div>
        </div>
      </main>
    );
  }

  // JIKA USER BELUM PUNYA TOKO -> LANDING PAGE ONBOARDING PENJUAL VEAL
  return (
    <main className="min-h-screen bg-veal-bg px-4 py-16 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        
        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm sm:p-12">
          
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-veal/20 bg-veal/10 px-3.5 py-1 text-xs font-extrabold text-veal">
            <Building2 className="h-3.5 w-3.5" />
            <span>VEAL Merchant Portal</span>
          </div>

          <h1 className="text-3xl font-black text-veal-dark sm:text-4xl">
            Start Your Own Urban Store
          </h1>

          <p className="mt-3 text-xs font-medium leading-relaxed text-zinc-500 sm:text-sm">
            Punya produk streetwear, sneakers, atau techwear berkualitas? Buat toko official kamu di VEAL dan mulailah menjangkau ribuan pembeli dalam satu platform ekosistem terpadu.
          </p>

          {/* Benefits Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-veal/10 text-veal">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-veal-dark">Seller Dashboard Modern</h3>
                <p className="mt-0.5 text-[11px] text-zinc-400">Kelola stok, harga, dan analitik toko dengan efisien.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-veal/10 text-veal">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-veal-dark">Integrasi Satu Akun</h3>
                <p className="mt-0.5 text-[11px] text-zinc-400">Jadi pembeli dan penjual langsung menggunakan akun yang sama.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-8">
            <Link
              href="/seller/create"
              className="group inline-flex items-center gap-2 rounded-2xl bg-veal px-7 py-3.5 text-xs font-bold text-white shadow-md shadow-veal/25 transition-all duration-200 hover:bg-veal-hover hover:shadow-lg active:scale-[0.98]"
            >
              <span>Create Your Store Now</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-6 py-3.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 hover:text-veal-dark"
            >
              Maybe Later
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}