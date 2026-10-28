"use client";

import { useState } from "react";
import Image from "next/image";
import { Tag } from "lucide-react";
import { cleanImageUrl } from "@/lib/utils/image";

type ProductGalleryProps = {
  images: string[];
  productName: string;
  category: string | null;
};

export default function ProductGallery({
  images,
  productName,
  category,
}: ProductGalleryProps) {
  // Membersihkan array gambar
  const cleanedImages = images
    .map((img) => cleanImageUrl(img))
    .filter(Boolean);

  const [selectedImage, setSelectedImage] = useState<string>(
    cleanedImages[0] || "/placeholder-product.png"
  );

  const validImages = cleanedImages.filter(
  (img): img is string =>
    typeof img === "string" && img.trim().length > 0
);

  return (
    <div className="space-y-4 font-sans">
      
      {/* =====================================================
          1. MAIN IMAGE DISPLAY (CARD DENGAN BORDER VEAL)
      ====================================================== */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-2.5 shadow-2xs sm:aspect-square">
        {selectedImage ? (
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-zinc-100">
            <Image
              src={selectedImage}
              alt={productName}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-zinc-100 text-xs font-semibold text-zinc-400">
            Tidak ada gambar tersedia
          </div>
        )}

        {/* Category Pill Badge (Envato Style) */}
        {category && (
          <div className="absolute left-6 top-6 z-10 inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/90 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-veal shadow-2xs backdrop-blur-md">
            <Tag className="h-3 w-3 text-veal shrink-0" />
            <span>{category}</span>
          </div>
        )}
      </div>

      {/* =====================================================
          2. GALLERY THUMBNAILS (EFEK HIGHLIGHT BORDER VEAL)
      ====================================================== */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {validImages.map((img, idx) => {
            const isSelected = selectedImage === img;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 p-0.5 shadow-2xs transition-all duration-300 ${
                  isSelected
                    ? "border-veal scale-105 shadow-md"
                    : "border-zinc-200/80 bg-white opacity-70 hover:opacity-100 hover:border-veal/50"
                }`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[12px] bg-zinc-100">
                  <Image
                    src={img}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}