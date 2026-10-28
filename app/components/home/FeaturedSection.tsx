"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard, { Product } from "@/app/components/ui/ProductCard";
import { Loader2, ChevronDown, ArrowRight } from "lucide-react";

interface FeaturedSectionProps {
  initialProducts?: Product[];
  index?: number;
}

export default function FeaturedSection({ initialProducts = [] }: FeaturedSectionProps) {
  const INITIAL_LIMIT = 12; // Initial 12 produk
  const MAX_LIMIT = 20;     // Maksimal 20 produk di home
  
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);
  const [loading, setLoading] = useState(false);

  const safeProducts = Array.isArray(initialProducts) ? initialProducts : [];
  
  // Ambil produk sesuai limit yang ditentukan
  const visibleProducts = safeProducts.slice(0, visibleCount);
  
  // Cek apakah masih bisa melakukan Load More (belum sampai 20 & masih ada sisa data)
  const canLoadMore = visibleCount < MAX_LIMIT && visibleCount < safeProducts.length;
  
  // Cek apakah sudah mencapai batas 20 produk (atau data habis) untuk menampilkan "Explore More Products"
  const showExploreMore = visibleCount >= MAX_LIMIT || (visibleCount >= safeProducts.length && safeProducts.length > 0);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      // Tambah produk (maksimal mentok di 20)
      setVisibleCount((prev) => Math.min(prev + 4, MAX_LIMIT));
      setLoading(false);
    }, 400);
  };

  return (
    <section className="relative bg-veal-bg py-12 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-veal">
              Every Type Of Gear, For Any Streetwear Style
            </span>
            <h2 className="text-2xl font-black text-veal-dark sm:text-3xl">
              Featured Products
            </h2>
          </div>
          <span className="text-xs font-semibold text-zinc-500">
            Menampilkan {visibleProducts.length} dari {safeProducts.length} Produk
          </span>
        </div>

        {/* CONTAINER GRID */}
        <div className="relative">
          
          {/* Product Grid */}
          {safeProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                  style={{ animationDelay: `${(index % 4) * 60}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center text-xs font-semibold text-zinc-400">
              Belum ada produk untuk ditampilkan.
            </div>
          )}

          {/* DYNAMIC BUTTON AREA */}
          <div className="mt-12 flex justify-center">
            
            {/* 1. Tombol Load More */}
            {canLoadMore && (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="group relative inline-flex items-center gap-2.5 rounded-full border border-veal/20 bg-white px-8 py-3.5 text-xs font-bold text-veal-dark shadow-md transition-all duration-300 hover:border-veal hover:bg-veal hover:text-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-veal group-hover:text-white" />
                    <span>Memuat Produk...</span>
                  </>
                ) : (
                  <>
                    <span>Muat Lebih Banyak ({Math.min(MAX_LIMIT, safeProducts.length) - visibleCount})</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                  </>
                )}
              </button>
            )}

            {/* 2. Tombol "Explore More Products" (Diubah ke /catalog agar sesuai dengan halaman utama kita) */}
            {showExploreMore && (
              <Link
                href="/catalog" 
                className="group inline-flex items-center gap-2.5 rounded-full bg-veal-dark px-9 py-4 text-xs font-black uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:bg-veal hover:shadow-2xl hover:scale-105 cursor-pointer"
              >
                <span>Explore More Products</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}