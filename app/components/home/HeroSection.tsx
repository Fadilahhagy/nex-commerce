"use client";

import Link from "next/link";
import { ArrowUpRight, Tag, Percent, Sparkles, ShoppingBag } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-offgrid-bg pb-8 pt-6 font-sans md:pb-12 md:pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          
          {/* BANNER UTAMA (MAIN PROMO) */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-10 lg:col-span-8">
            {/* Soft Background Accent */}
            <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-veal-light/60 blur-3xl pointer-events-none" />
            
            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-veal/20 bg-veal-light px-3.5 py-1 text-xs font-semibold text-veal">
                <Sparkles className="h-3.5 w-3.5" />
                <span>SEASON SALE</span>
              </div>
              <span className="text-xs font-mono font-semibold tracking-wider text-zinc-400">
                LIMITED TIME ONLY
              </span>
            </div>

            {/* Main Content */}
            <div className="relative z-10 my-8 sm:my-12">
              <h1 className="max-w-xl text-3xl font-black tracking-tight text-veal-dark sm:text-5xl lg:text-6xl">
                MID-SEASON <br />
                <span className="text-veal">STREETWEAR DROP.</span>
              </h1>

              <p className="mt-4 max-w-md text-xs font-medium leading-relaxed text-zinc-500 sm:text-sm">
                Diskon hingga <span className="font-bold text-veal-dark">50% OFF</span> untuk koleksi hoodie, t-shirt, dan outerwear pilihan. Gunakan kode promo saat checkout.
              </p>
            </div>

            {/* Bottom Actions & Discount Tag */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-6">
              <div className="flex items-center gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-xl bg-veal px-6 py-3 text-xs font-bold text-white transition-all hover:bg-veal-hover hover:shadow-sm sm:text-sm"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Belanja Promo
                </Link>

                <div className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-xs font-mono font-bold text-zinc-700">
                  <Tag className="h-3.5 w-3.5 text-veal" />
                  KODE: <span className="text-veal-dark">VEAL50</span>
                </div>
              </div>

              <span className="text-2xl font-black text-veal-dark sm:text-3xl">
                UP TO 50%
              </span>
            </div>
          </div>

          {/* SIDE CARDS (MINI PROMO BANNERS) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            
            {/* Mini Banner 1 - Free Shipping */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-900 p-6 text-white shadow-sm transition hover:border-zinc-700">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur">
                  <Percent className="h-4 w-4" />
                </span>
                <span className="text-[11px] font-semibold text-zinc-400">PROMO MEI</span>
              </div>

              <div className="my-6">
                <h3 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                  Gratis Ongkir Seluruh Indo
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Tanpa minimal pembelian khusus pengguna baru.
                </p>
              </div>

              <Link
                href="/shop?promo=free-shipping"
                className="inline-flex items-center gap-1 text-xs font-bold text-veal-light hover:underline"
              >
                Klaim Voucher <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Mini Banner 2 - New Drop */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm transition hover:border-veal/40">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-veal-light text-veal">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="text-[11px] font-semibold text-veal">NEW ARRIVAL</span>
              </div>

              <div className="my-6">
                <h3 className="text-lg font-extrabold tracking-tight text-veal-dark sm:text-xl">
                  Techwear & Footwear 2026
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Siluet fungsional terbaru untuk style urban.
                </p>
              </div>

              <Link
                href="/category/new"
                className="inline-flex items-center gap-1 text-xs font-bold text-veal hover:underline"
              >
                Lihat Katalog <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}