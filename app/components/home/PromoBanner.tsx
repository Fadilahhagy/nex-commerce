import Link from "next/link";
import { Tag, Sparkles, ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="bg-veal-bg py-10 font-sans md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Clean Minimalist Banner Card */}
        <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm sm:p-10 md:flex-row">
          
          {/* Soft Background Glow Accent (Opsional & Sangat Tipis) */}
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-veal-light blur-2xl pointer-events-none" />

          {/* Left Content */}
          <div className="relative z-10 space-y-2.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-veal/20 bg-veal-light px-3 py-1 text-[11px] font-bold text-veal">
              <Sparkles className="h-3 w-3" />
              <span>SPECIAL VOUCHER</span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-veal-dark sm:text-3xl lg:text-4xl">
              Potongan Extra <span className="text-veal">Rp 100.000</span>
            </h2>

            <p className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-medium text-zinc-500 sm:text-sm md:justify-start">
              <span>Gunakan kode:</span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-xs font-bold text-veal-dark">
                <Tag className="h-3 w-3 text-veal" />
                VEAL2026
              </span>
              <span>saat checkout pesananmu.</span>
            </p>
          </div>

          {/* Right Action Button */}
          <Link
            href="/shop"
            className="group relative z-10 inline-flex shrink-0 items-center gap-2 rounded-xl bg-veal px-6 py-3.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-veal-hover sm:text-sm"
          >
            <span>Klaim Voucher</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

        </div>

      </div>
    </section>
  );
}