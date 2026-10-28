import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Store } from "lucide-react";
import WishlistButton from "../wishlist/WishlistButton";
import { cleanImageUrl } from "@/lib/utils/image";
import AddToCartButton from "@/app/cart/AddToCartButton";

export interface Product {
  id: string | number;
  name: string;
  slug?: string;
  price: number;
  oldPrice?: number;
  category?: string;
  image_url?: string;
  image?: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  stock?: number;
  store_id?: string;
  store_name?: string; // Jika di-flatten langsung
  stores?: {          // Jika diambil lewat relasi query Supabase
    store_name?: string;
    slug?: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // 1. Ekstrak slug toko (store slug) secara aman
  const storeSlug = product.stores?.slug || "official";
  
  // 2. Ekstrak slug produk (fallback jika slug produk kosong menggunakan id)
  const productSlug = product.slug || String(product.id);

  // Safe Image URL Handling
  const imageUrl = product.image_url || product.image;
  const hasValidImage = Boolean(imageUrl && imageUrl.trim() !== "");
  const safeImageUrl = cleanImageUrl(imageUrl);

  // Ambil Nama Toko dari relasi Supabase atau properti direct
  const storeName = product.stores?.store_name || product.store_name || "Official Store";

  // Rating Fallback
  const rating = product.rating ?? 5.0;
  const reviews = product.reviews ?? 12;

  // Format Price
  const formatPrice = (amount: number) => {
    if (amount >= 1000) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return `$${amount}`;
  };

  type ProductPageProps = {
  params: Promise<{
    slug: string;
    productSlug: string;
  }>;
};

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white font-sans shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-veal/40 hover:shadow-md">
      
      {/* PRODUCT IMAGE CONTAINER */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-100">
        
        {/* Badge Hot / Promo */}
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-lg bg-veal px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-2xs">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <div className="absolute right-3 top-3 z-10 transition-transform duration-200 hover:scale-110">
          <WishlistButton productId={String(product.id)} />
        </div>

        {/* Image Link */}
        <Link href={`/store/${storeSlug}/product/${productSlug}`} className="relative block h-full w-full">
          {hasValidImage ? (
            <Image
              src={safeImageUrl || "/placeholder-product.png"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-400">
              No Preview
            </div>
          )}
        </Link>
      </div>

      {/* PRODUCT INFO & DETAILS */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* Row 1: Category & Rating */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-zinc-400 truncate">
              {product.category || "Streetwear"}
            </span>

            <div className="flex items-center gap-1 shrink-0">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-extrabold text-veal-dark">
                {rating}
              </span>
              <span className="text-[10px] text-zinc-400">
                ({reviews})
              </span>
            </div>
          </div>

          {/* Product Name */}
          <Link 
            key={product.id}
            href={`/store/${storeSlug}/product/${productSlug}`}
          className="block mt-1">
            <h3 className="line-clamp-2 text-xs font-bold text-veal-dark transition-colors duration-200 group-hover:text-veal sm:text-sm">
              {product.name}
            </h3>
          </Link>

          {/* Row 2: Store Name Badge (Envato Style) */}
          <div className="mt-2 flex items-center gap-1.5 text-zinc-500">
            <Store className="h-3 w-3 text-veal shrink-0" />
            <span className="text-[11px] font-medium truncate hover:text-veal-dark transition-colors">
              {storeName}
            </span>
          </div>
        </div>

        {/* Price & Action Button Footer */}
        <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-zinc-100 pt-3">
          {/* Price Box */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-veal-dark sm:text-base">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[11px] font-medium text-zinc-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Quick Add To Cart Button */}
          <AddToCartButton
            productId={product.id}
            stock={product.stock}
            variant="icon"
          />
        </div>

      </div>

    </article>
  );
}