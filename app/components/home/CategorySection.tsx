import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  ShoppingBag,
  Shirt,
  Gamepad2,
  Watch,
  Footprints,
  Package,
} from "lucide-react";

// Slug disesuaikan dengan nilai kategori di database Supabase (case-sensitive / huruf kapital awal)
const CATEGORIES = [
  {
    name: "Sneakers",
    count: "120+ Items",
    slug: "Sneakers",
    icon: Footprints,
  },
  {
    name: "Apparel",
    count: "85+ Items",
    slug: "Apparel",
    icon: Shirt,
  },
  {
    name: "Accessories",
    count: "64+ Items",
    slug: "Accessories",
    icon: Watch,
  },
  {
    name: "Electronics",
    count: "40+ Items",
    slug: "Electronics",
    icon: Headphones,
  },
  {
    name: "Bags",
    count: "30+ Items",
    slug: "Bags",
    icon: ShoppingBag,
  },
  {
    name: "Gaming",
    count: "50+ Items",
    slug: "Gaming",
    icon: Gamepad2,
  },
];

export default function CategorySection() {
  return (
    <section className="bg-veal-bg py-12 font-sans md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* =========================
            HEADER
        ========================== */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-veal">
              Eksplorasi Katalog
            </p>

            <h2 className="text-2xl font-black tracking-tight text-veal-dark sm:text-3xl">
              Kategori Pilihan
            </h2>

            <p className="mt-1.5 text-xs font-medium text-zinc-500 sm:text-sm">
              Temukan streetwear dan gear fungsional sesuai kebutuhanmu.
            </p>
          </div>

          <Link
            href="/catalog"
            className="group hidden items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-veal-dark shadow-xs transition-all hover:border-veal/40 hover:text-veal sm:flex cursor-pointer"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* =========================
            CATEGORY GRID
        ========================== */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.slug}
                // Diarahkan langsung ke halaman catalog dengan query parameter category
                href={`/catalog?category=${encodeURIComponent(category.slug)}`}
                className="group cursor-pointer"
              >
                <div className="relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-veal/50 hover:shadow-md">
                  
                  {/* Decorative Subtle Glow */}
                  <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-veal-light/60 blur-xl transition-all duration-500 group-hover:scale-150" />

                  {/* Icon Container */}
                  <div className="relative z-10 flex flex-1 items-center justify-center py-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-veal-light border border-veal/10 text-veal shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:bg-veal group-hover:text-white">
                      <Icon
                        className="h-7 w-7 transition-colors duration-300"
                        strokeWidth={1.8}
                      />
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="relative z-10 text-center">
                    <h3 className="text-xs font-extrabold text-veal-dark transition-colors duration-300 group-hover:text-veal">
                      {category.name}
                    </h3>

                    <p className="mt-0.5 text-[11px] font-semibold text-zinc-400">
                      {category.count}
                    </p>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <Link
          href="/catalog"
          className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 text-xs font-bold text-veal-dark shadow-2xs transition-all hover:bg-zinc-50 hover:text-veal sm:hidden cursor-pointer"
        >
          <span>Lihat Semua Kategori</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

      </div>
    </section>
  );
}