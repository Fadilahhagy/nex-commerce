"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  X,
  Loader2,
  Package,
  DollarSign,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ProductData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  image_url: string | null;
  image_urls: string[] | null;
  status: string;
};

type EditProductFormProps = {
  storeId: string;
  product: ProductData;
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function EditProductForm({
  storeId,
  product,
}: EditProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [description, setDescription] = useState(product.description || "");
  
  // State harga (Disimpan sebagai angka murni & tampilan terformat)
  const formatNumberWithDots = (value: string) => {
    const rawNumber = value.replace(/\D/g, "");
    if (!rawNumber) return "";
    return new Intl.NumberFormat("id-ID").format(Number(rawNumber));
  };

  const [price, setPrice] = useState(product.price.toString());
  const [displayPrice, setDisplayPrice] = useState(
    formatNumberWithDots(product.price.toString())
  );

  const [stock, setStock] = useState(product.stock.toString());
  const [category, setCategory] = useState(product.category || "");
  const [status, setStatus] = useState(product.status || "draft");

  // State untuk foto tersimpan di Supabase Storage
  const [existingImages, setExistingImages] = useState<string[]>(
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls
      : product.image_url
      ? [product.image_url]
      : []
  );

  // State untuk file foto baru yang diunggah
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const totalImagesCount = existingImages.length + newImageFiles.length;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanNumber = inputValue.replace(/\D/g, "");

    setPrice(cleanNumber);
    setDisplayPrice(formatNumberWithDots(cleanNumber));
  };

  function handleNewImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setMessage({ text: "Semua file yang diunggah harus berupa gambar.", type: "error" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: "Setiap ukuran gambar maksimal 5MB.", type: "error" });
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (totalImagesCount + validFiles.length > 5) {
      setMessage({ text: "Maksimal 5 foto per produk.", type: "error" });
      return;
    }

    setNewImageFiles((prev) => [...prev, ...validFiles]);
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    setMessage(null);
  }

  function handleRemoveExistingImage(indexToRemove: number) {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  function handleRemoveNewImage(indexToRemove: number) {
    URL.revokeObjectURL(newImagePreviews[indexToRemove]);
    setNewImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setNewImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage(null);

    const normalizedName = name.trim();
    const normalizedSlug = generateSlug(slug);
    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (
      !normalizedName ||
      !normalizedSlug ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0 ||
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      setMessage({ text: "Periksa kembali nama, slug, harga, dan stok produk.", type: "error" });
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // 1. Unggah foto-foto baru ke Supabase Storage (jika ada)
    const newlyUploadedUrls: string[] = [];

    if (newImageFiles.length > 0) {
      setUploadingImage(true);

      for (const file of newImageFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${storeId}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          setMessage({ text: `Gagal mengunggah gambar: ${uploadError.message}`, type: "error" });
          setUploadingImage(false);
          setLoading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        newlyUploadedUrls.push(publicUrlData.publicUrl);
      }

      setUploadingImage(false);
    }

    // Gabungkan foto tersimpan dengan foto baru
    const finalImageUrls = [...existingImages, ...newlyUploadedUrls];
    const primaryImageUrl = finalImageUrls.length > 0 ? finalImageUrls[0] : null;

    // 2. Update record produk di Supabase Database
    const { error } = await supabase
      .from("products")
      .update({
        name: normalizedName,
        slug: normalizedSlug,
        description: description.trim() || null,
        price: numericPrice,
        stock: numericStock,
        category: category.trim() || null,
        image_url: primaryImageUrl,
        image_urls: finalImageUrls,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id)
      .eq("store_id", storeId);

    if (error) {
      if (error.code === "23505") {
        setMessage({ text: "Slug produk sudah digunakan di tokomu.", type: "error" });
      } else {
        setMessage({ text: `Gagal memperbarui produk: ${error.message}`, type: "error" });
      }
      setLoading(false);
      return;
    }

    router.replace("/seller/dashboard");
    router.refresh();
  }

  const inputClass =
    "mt-2 w-full rounded-2xl border border-zinc-200/80 bg-zinc-50/50 px-4 py-3 text-xs font-bold text-veal-dark placeholder-zinc-400 transition hover:bg-white focus:border-veal focus:bg-white focus:outline-none focus:ring-4 focus:ring-veal/10";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      
      {/* CARD 1: GENERAL INFORMATION */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-2xs transition duration-200 hover:shadow-md">
        <div className="border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-veal/10 text-veal">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-veal-dark">Informasi Umum</h2>
              <p className="text-[11px] font-medium text-zinc-500">Ubah nama produk, permalink, dan deskripsi</p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <div>
            <label htmlFor="name" className="text-xs font-extrabold text-veal-dark uppercase tracking-wider">
              Nama Produk <span className="text-rose-500">*</span>
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(generateSlug(e.target.value));
              }}
              required
              maxLength={120}
              placeholder="e.g. Cyberpunk Oversized Hoodie"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="slug" className="text-xs font-extrabold text-veal-dark uppercase tracking-wider">
              Permalink / Slug <span className="text-rose-500">*</span>
            </label>
            <input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              maxLength={150}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              placeholder="cyberpunk-oversized-hoodie"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="description" className="text-xs font-extrabold text-veal-dark uppercase tracking-wider">
              Deskripsi Produk
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              rows={4}
              placeholder="Jelaskan spesifikasi dan keunggulan produk secara rinci..."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* CARD 2: GALLERY MANAGER */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-2xs transition duration-200 hover:shadow-md">
        <div className="border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-veal/10 text-veal">
                <ImageIcon className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-veal-dark">Galeri Produk</h2>
                <p className="text-[11px] font-medium text-zinc-500">Kelola foto produk (Foto pertama menjadi cover utama)</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-bold text-zinc-700">
              <Sparkles className="h-3 w-3 text-veal" /> {totalImagesCount}/5 Total
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            
            {/* Display Saved Images */}
            {existingImages.map((imgUrl, index) => (
              <div
                key={`existing-${index}`}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50 shadow-2xs"
              >
                <Image
                  src={imgUrl}
                  alt={`Saved photo ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {index === 0 && (
                  <span className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-lg bg-veal px-2.5 py-1 text-[10px] font-extrabold text-white shadow-xs">
                    <Star className="h-3 w-3 fill-white" /> Cover
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(index)}
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl bg-zinc-900/80 text-white backdrop-blur-md transition hover:bg-rose-600"
                  title="Hapus foto"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {/* Display New Previews */}
            {newImagePreviews.map((preview, index) => (
              <div
                key={`new-${index}`}
                className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-veal/50 bg-purple-50/20 shadow-2xs"
              >
                <Image
                  src={preview}
                  alt={`New upload preview ${index + 1}`}
                  fill
                  className="object-cover"
                />

                <span className="absolute left-2 top-2 z-10 rounded-lg bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  Baru
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(index)}
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl bg-zinc-900/80 text-white backdrop-blur-md transition hover:bg-rose-600"
                  title="Hapus foto"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {/* Upload Box */}
            {totalImagesCount < 5 && (
              <label
                htmlFor="edit-images-upload"
                className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-4 text-center transition hover:border-veal hover:bg-purple-50/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs ring-1 ring-zinc-200/60 text-veal">
                  <Upload className="h-4 w-4" />
                </div>
                <span className="mt-2 text-xs font-bold text-veal">
                  + Tambah Foto
                </span>

                <input
                  id="edit-images-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewImagesChange}
                  className="hidden"
                />
              </label>
            )}

          </div>
        </div>
      </div>

      {/* CARD 3: PRICING & INVENTORY */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-2xs transition duration-200 hover:shadow-md">
        <div className="border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-veal/10 text-veal">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-veal-dark">Harga & Inventaris</h2>
              <p className="text-[11px] font-medium text-zinc-500">Harga jual, stok, dan kategori produk</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <label htmlFor="price" className="text-xs font-extrabold text-veal-dark uppercase tracking-wider">
              Harga (IDR) <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-2 flex items-center">
              <span className="absolute left-4 text-xs font-bold text-zinc-400">
                Rp
              </span>
              <input
                id="price"
                type="text"
                inputMode="numeric"
                value={displayPrice}
                onChange={handlePriceChange}
                required
                placeholder="150.000"
                className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50/50 py-3 pl-11 pr-4 text-xs font-bold text-veal-dark placeholder-zinc-400 transition hover:bg-white focus:border-veal focus:bg-white focus:outline-none focus:ring-4 focus:ring-veal/10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="stock" className="text-xs font-extrabold text-veal-dark uppercase tracking-wider">
              Jumlah Stok <span className="text-rose-500">*</span>
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="category" className="text-xs font-extrabold text-veal-dark uppercase tracking-wider">
              Kategori Produk
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">Pilih kategori produk</option>
              <option value="Sneakers">Sneakers</option>
              <option value="Apparel">Apparel</option>
              <option value="Accessories">Accessories</option>
              <option value="Electronics">Electronics</option>
              <option value="Bags">Bags</option>
              <option value="Gaming">Gaming</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* CARD 4: STATUS & SUBMIT */}
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-veal-dark">Status Produk</p>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-bold text-veal-dark outline-none focus:border-veal focus:ring-2 focus:ring-veal/10"
            >
              <option value="draft">Draft — Sembunyikan dari toko</option>
              <option value="active">Active — Tampilkan di toko</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-veal px-6 py-4 text-xs font-extrabold text-white shadow-md shadow-veal/20 transition-all duration-200 hover:bg-veal-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{uploadingImage ? "Mengunggah Gambar..." : "Menyimpan Perubahan..."}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Perbarui Produk</span>
            </>
          )}
        </button>
      </div>

      {/* ALERT MESSAGE */}
      {message && (
        <div
          className={`flex items-center gap-2.5 rounded-2xl p-4 text-xs font-bold ${
            message.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

    </form>
  );
}