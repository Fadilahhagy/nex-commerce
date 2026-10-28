import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Gratis Ongkir",
    description:
      "Bebas ongkir untuk pembelian minimal Rp 200.000 ke seluruh Indonesia.",
  },
  {
    icon: ShieldCheck,
    title: "100% Original",
    description:
      "Jaminan produk asli langsung dari brand VEAL dan official supplier.",
  },
  {
    icon: RotateCcw,
    title: "Garansi Retur 7 Hari",
    description:
      "Ukuran tidak pas atau produk cacat? Kembalikan barang dengan mudah.",
  },
  {
    icon: Headphones,
    title: "Layanan CS 24/7",
    description:
      "Tim customer service siap membantu kendala kamu kapan saja.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="relative overflow-hidden bg-veal py-12 font-sans md:py-16">
      {/* Decorative Golden Ratio / Geometry Overlay */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full border border-white/10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group relative flex items-start gap-4 rounded-2xl border border-white/20 bg-white p-5 shadow-lg shadow-veal-accent/20 transition-all duration-300 hover:-translate-y-1 hover:border-white hover:shadow-xl"
              >
                {/* Icon Container */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-veal-light text-veal transition-colors duration-300 group-hover:bg-veal group-hover:text-white">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </div>

                {/* Feature Content */}
                <div>
                  <h4 className="text-xs font-black text-veal-dark sm:text-sm">
                    {feature.title}
                  </h4>
                  <p className="mt-1 text-[11px] font-medium leading-relaxed text-zinc-500 sm:text-xs">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}