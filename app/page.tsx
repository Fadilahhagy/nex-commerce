import HeroSection from "@/app/components/home/HeroSection";
import CategorySection from "@/app/components/home/CategorySection";
import FeaturedSection from "@/app/components/home/FeaturedSection";
import PromoBanner from "@/app/components/home/PromoBanner";
import FeaturesGrid from "@/app/components/home/FeaturesGrid";
import Navbar from "./components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";

// Tambahkan keyword 'async' di deklarasi fungsi
export default async function HomePage() {
  const supabase = await createClient();

  // Query mengambil produk beserta relasi toko
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      stores (
        store_name,
        slug
      )
    `)
    .eq("status", "active");

  return (
    <div className="bg-veal-bg min-h-screen text-veal-dark font-sans">
      <HeroSection />
      <CategorySection />
      <FeaturedSection initialProducts={products || []} />
      <PromoBanner />
      <FeaturesGrid />
    </div>
  );
}