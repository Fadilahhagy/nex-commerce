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

type CreateProductFormProps = {
  storeId: string;
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

export default function CreateProductForm({ storeId }: CreateProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  
  const [price, setPrice] = useState<string>("");
  const [displayPrice, setDisplayPrice] = useState<string>("");

  const [stock, setStock] = useState("0");
  const [category, setCategory] = useState("");

  // Multiple File Upload State
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Helper untuk format angka dengan titik pemisah ribuan
  const formatNumberWithDots = (value: string) => {
    const rawNumber = value.replace(/\D/g, "");
    if (!rawNumber) return "";
    return new Intl.NumberFormat("id-ID").format(Number(rawNumber));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanNumber = inputValue.replace(/\D/g, "");

    setPrice(cleanNumber);
    setDisplayPrice(formatNumberWithDots(cleanNumber));
  };

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setMessage({ text: "Semua file harus berupa gambar.", type: "error" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: "Setiap gambar maksimal berukuran 5MB.", type: "error" });
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (imageFiles.length + validFiles.length > 5) {
      setMessage({ text: "Maksimal 5 foto per produk.", type: "error" });
      return;
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setMessage(null);
  }

  function handleRemoveImage(indexToRemove: number) {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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
      setMessage({ text: "Mohon periksa kembali nama, slug, harga, dan stok produk.", type: "error" });
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage({ text: "Sesi berakhir. Silakan login kembali.", type: "error" });
      setLoading(false);
      return;
    }

    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id")
      .eq("id", storeId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (storeError || !store) {
      setMessage({ text: "Toko tidak ditemukan atau akses ditolak.", type: "error" });
      setLoading(false);
      return;
    }

    const uploadedUrls: string[] = [];

    if (imageFiles.length > 0) {
      setUploadingImage(true);

      for (const file of imageFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${store.id}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          setMessage({ text: `Gagal mengunggah ${file.name}: ${uploadError.message}`, type: "error" });
          setUploadingImage(false);
          setLoading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      setUploadingImage(false);
    }

    const primaryImageUrl = uploadedUrls.length > 0 ? uploadedUrls[0] : null;

    const { error } = await supabase.from("products").insert({
      store_id: store.id,
      name: normalizedName,
      slug: normalizedSlug,
      description: description.trim() || null,
      price: numericPrice,
      stock: numericStock,
      category: category.trim() || null,
      image_url: primaryImageUrl,
      image_urls: uploadedUrls,
      status,
    });

    if (error) {
      if (error.code === "23505") {
        setMessage({ text: "Slug produk sudah digunakan di tokomu.", type: "error" });
      } else {
        setMessage({ text: `Gagal menyimpan produk: ${error.message}`, type: "error" });
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
              <p className="text-[11px] font-medium text-zinc-500">Nama produk, deskripsi, dan permalink</p>
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
              placeholder="Deskripsikan spesifikasi dan fitur produk secara rinci..."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* CARD 2: PRODUCT GALLERY */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-2xs transition duration-200 hover:shadow-md">
        <div className="border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-veal/10 text-veal">
                <ImageIcon className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-veal-dark">Galeri Produk</h2>
                <p className="text-[11px] font-medium text-zinc-500">Unggah hingga 5 foto (Foto pertama menjadi cover)</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-bold text-zinc-700">
              <Sparkles className="h-3 w-3 text-veal" /> {imagePreviews.length}/5 Diunggah
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50 shadow-2xs"
              >
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
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
                  onClick={() => handleRemoveImage(index)}
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl bg-zinc-900/80 text-white backdrop-blur-md transition hover:bg-rose-600"
                  title="Hapus gambar"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {imagePreviews.length < 5 && (
              <label
                htmlFor="images-upload"
                className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-4 text-center transition hover:border-veal hover:bg-purple-50/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs ring-1 ring-zinc-200/60 text-veal">
                  <Upload className="h-4 w-4" />
                </div>
                <span className="mt-2 text-xs font-bold text-veal">
                  + Tambah Foto
                </span>
                <input
                  id="images-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
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
              <p className="text-[11px] font-medium text-zinc-500">Atur nominal harga jual dan ketersediaan stok</p>
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
              <option value="draft">Draft - Sembunyikan dari toko</option>
              <option value="active">Active - Publikasikan ke toko</option>
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
              <span>{uploadingImage ? "Mengunggah Foto..." : "Menyimpan Produk..."}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Simpan Produk</span>
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