
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CreateStoreForm() {
  const [storeName, setStoreName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  // Mengubah nama toko menjadi URL-friendly slug
  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleStoreNameChange(value: string) {
    setStoreName(value);
    setSlug(generateSlug(value));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Sesi login tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      return;
    }

    const cleanName = storeName.trim();
    const cleanSlug = generateSlug(slug);

    if (!cleanName || !cleanSlug) {
      setMessage("Nama toko dan slug wajib diisi.");
      setLoading(false);
      return;
    }

    // Cek apakah user sudah punya toko
    const { data: existingStore, error: checkError } = await supabase
      .from("stores")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      setMessage("Gagal memeriksa toko. Coba lagi.");
      setLoading(false);
      return;
    }

    if (existingStore) {
      router.replace("/seller");
      router.refresh();
      return;
    }

    // Simpan toko ke Supabase
    const { error } = await supabase.from("stores").insert({
      user_id: user.id,
      store_name: cleanName,
      slug: cleanSlug,
      description: description.trim() || null,
    });

    if (error) {
      if (error.code === "23505") {
        setMessage(
          "Nama toko atau URL ini sudah digunakan. Coba slug lain."
        );
      } else {
        setMessage(error.message);
      }

      setLoading(false);
      return;
    }

    router.replace("/seller");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label
          htmlFor="storeName"
          className="text-sm font-bold text-[#494368]"
        >
          Store Name
        </label>

        <input
          id="storeName"
          value={storeName}
          onChange={(e) => handleStoreNameChange(e.target.value)}
          required
          minLength={2}
          maxLength={60}
          placeholder="Contoh: Pixel Supply"
          className="mt-2 w-full rounded-xl border border-[#494368]/15 px-4 py-3 text-sm outline-none focus:border-[#7A28CB]"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="text-sm font-bold text-[#494368]"
        >
          Store URL
        </label>

        <div className="mt-2 flex items-center overflow-hidden rounded-xl border border-[#494368]/15 focus-within:border-[#7A28CB]">
          <span className="bg-[#F7F7F2] px-3 py-3 text-sm text-[#494368]/50">
            nexus.com/
          </span>

          <input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            required
            minLength={2}
            maxLength={60}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            placeholder="pixel-supply"
            className="min-w-0 flex-1 px-3 py-3 text-sm outline-none"
          />
        </div>

        <p className="mt-2 text-xs text-[#494368]/50">
          Gunakan huruf kecil, angka, dan tanda hubung.
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="text-sm font-bold text-[#494368]"
        >
          Store Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Ceritakan sedikit tentang tokomu..."
          className="mt-2 w-full resize-none rounded-xl border border-[#494368]/15 px-4 py-3 text-sm outline-none focus:border-[#7A28CB]"
        />
      </div>

      {message && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#7A28CB] px-6 py-3 font-bold text-white transition hover:bg-[#681FB0] disabled:opacity-50"
      >
        {loading ? "Creating Store..." : "Create Store"}
      </button>
    </form>
  );
}