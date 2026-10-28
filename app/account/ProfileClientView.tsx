"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  UserCheck,
  Sparkles,
  ArrowRight,
  Package,
  Store,
  Camera,
  Edit3,
  X,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type ProfileClientViewProps = {
  userEmail: string;
  initialProfile: {
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
  defaultAddressPhone: string | null;
  formattedAddress: string | null;
  store: {
    id: string;
    store_name: string;
    slug: string | null;
  } | null;
};

export default function ProfileClientView({
  userEmail,
  initialProfile,
  defaultAddressPhone,
  formattedAddress,
  store,
}: ProfileClientViewProps) {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState(initialProfile.username || "");
  const [fullName, setFullName] = useState(initialProfile.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatar_url || "");

  // State Modals / Inline Edit
  const [activeModal, setActiveModal] = useState<"username" | "fullname" | "avatar" | null>(null);
  
  // Temp Edit States
  const [tempUsername, setTempUsername] = useState(username);
  const [tempFullName, setTempFullName] = useState(fullName);
  
  // Avatar Upload State
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Handle Save Username / Full Name
  async function handleSaveProfileField(field: "username" | "fullname") {
    setLoading(true);
    setMessage(null);

    const updateData =
      field === "username"
        ? { username: tempUsername.trim() }
        : { full_name: tempFullName.trim() };

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage({ text: "Sesi telah berakhir.", type: "error" });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) {
      setMessage({ text: error.message, type: "error" });
      setLoading(false);
      return;
    }

    if (field === "username") setUsername(tempUsername.trim());
    if (field === "fullname") setFullName(tempFullName.trim());

    setMessage({ text: "Profil berhasil diperbarui!", type: "success" });
    setLoading(false);
    setActiveModal(null);
    router.refresh();
  }

    // Handle Directly Upload Avatar
    async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
        setMessage({ text: "File harus berupa gambar (JPG, PNG, WebP).", type: "error" });
        return;
        }
        if (file.size > 2 * 1024 * 1024) {
        setMessage({ text: "Ukuran gambar maksimal 2MB.", type: "error" });
        return;
        }

        setUploadingAvatar(true);
        setMessage(null);

        try {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            setMessage({ text: "Sesi telah berakhir. Silakan login kembali.", type: "error" });
            setUploadingAvatar(false);
            return;
        }

        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

        // Upload file ke bucket avatars
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            setMessage({
            text: `Gagal unggah foto: ${uploadError.message}. Pastikan bucket 'avatars' sudah diset Public & RLS Policy aktif.`,
            type: "error",
            });
            setUploadingAvatar(false);
            return;
        }

        // Ambil Public URL
        const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

        const newUrl = publicUrlData.publicUrl;

        // Update URL ke record database profiles
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ avatar_url: newUrl, updated_at: new Date().toISOString() })
            .eq("id", user.id);

        if (updateError) {
            console.error("Profile update error:", updateError);
            setMessage({ text: `Gagal memperbarui database: ${updateError.message}`, type: "error" });
            setUploadingAvatar(false);
            return;
        }

        setAvatarUrl(newUrl);
        setMessage({ text: "Foto profil berhasil diperbarui!", type: "success" });
        router.refresh();
        } catch (err) {
        console.error("Unexpected error:", err);
        setMessage({ text: "Terjadi kesalahan tidak terduga saat mengunggah foto.", type: "error" });
        } finally {
        setUploadingAvatar(false);
        }
    }

  return (
    <div className="space-y-6 font-sans">
      {/* Alert Feedback Message */}
      {message && (
        <div
          className={`flex items-center justify-between gap-2.5 rounded-2xl p-4 text-xs font-bold ${
            message.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="cursor-pointer p-1 text-zinc-400 hover:text-zinc-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-veal/20 bg-veal/10 px-3 py-1 text-xs font-extrabold text-veal">
              <UserCheck className="h-3.5 w-3.5" />
              <span>PUSAT AKUN VEAL</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-veal-dark sm:text-3xl">
              Profil Saya
            </h1>

            <p className="mt-1.5 text-xs font-medium text-zinc-500 sm:text-sm">
              Kelola identitas data diri, akses toko, serta kontak pengiriman milikmu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:self-start">
            <Link
              href="/orders"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-2.5 text-xs font-bold text-zinc-700 transition hover:border-veal/40 hover:bg-veal/10 hover:text-veal"
            >
              <Package className="h-4 w-4 text-veal" />
              <span>Pesanan Saya</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Card Main */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xs sm:p-8">
        
        {/* Profile Header Block */}
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-veal text-2xl font-black text-white shadow-md shadow-veal/20">
              {uploadingAvatar ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={username}
                  className="h-full w-full object-cover"
                />
              ) : (
                (username || "U").charAt(0).toUpperCase()
              )}
            </div>

            {/* Quick Upload Avatar Button */}
            <label
              htmlFor="avatar-upload-input"
              title="Ubah Foto Profil Langsung"
              className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-veal-dark text-white shadow-xs transition hover:bg-veal active:scale-95"
            >
              <Camera className="h-3.5 w-3.5" />
              <input
                id="avatar-upload-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </label>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-xl font-black text-veal-dark sm:text-2xl">
                {username}
              </h2>
              {store && (
                <span className="rounded-full border border-veal/20 bg-veal/10 px-2.5 py-0.5 text-[10px] font-extrabold text-veal">
                  Seller
                </span>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
              <Mail className="h-3.5 w-3.5 text-zinc-400" />
              <span className="truncate">{userEmail}</span>
            </p>
          </div>
        </div>

        {/* Information Grid */}
        <div className="mt-8 grid gap-6 border-t border-zinc-100 pt-8 sm:grid-cols-2">
          
          {/* USERNAME FIELD (INLINE EDIT) */}
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition hover:border-veal/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                <User className="h-3.5 w-3.5 text-veal" />
                <span>Username</span>
              </div>
              {activeModal !== "username" && (
                <button
                  type="button"
                  onClick={() => {
                    setTempUsername(username);
                    setActiveModal("username");
                  }}
                  className="inline-flex cursor-pointer items-center gap-1 text-[10px] font-bold text-veal hover:underline"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Ubah</span>
                </button>
              )}
            </div>

            {activeModal === "username" ? (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-bold text-veal-dark focus:border-veal focus:outline-none"
                  placeholder="Username baru..."
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveProfileField("username")}
                    disabled={loading || !tempUsername.trim()}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-veal px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-veal-hover disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                    <span>Simpan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-bold text-zinc-600 hover:bg-zinc-50"
                  >
                    <X className="h-3 w-3" />
                    <span>Batal</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs font-extrabold text-veal-dark">
                {username || "-"}
              </p>
            )}
          </div>

          {/* FULL NAME FIELD (INLINE EDIT) */}
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 transition hover:border-veal/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                <Sparkles className="h-3.5 w-3.5 text-veal" />
                <span>Nama Lengkap</span>
              </div>
              {activeModal !== "fullname" && (
                <button
                  type="button"
                  onClick={() => {
                    setTempFullName(fullName);
                    setActiveModal("fullname");
                  }}
                  className="inline-flex cursor-pointer items-center gap-1 text-[10px] font-bold text-veal hover:underline"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>Ubah</span>
                </button>
              )}
            </div>

            {activeModal === "fullname" ? (
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={tempFullName}
                  onChange={(e) => setTempFullName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-bold text-veal-dark focus:border-veal focus:outline-none"
                  placeholder="Nama lengkap baru..."
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveProfileField("fullname")}
                    disabled={loading || !tempFullName.trim()}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-veal px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-veal-hover disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                    <span>Simpan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-bold text-zinc-600 hover:bg-zinc-50"
                  >
                    <X className="h-3 w-3" />
                    <span>Batal</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs font-extrabold text-veal-dark">
                {fullName || "-"}
              </p>
            )}
          </div>

          {/* EMAIL FIELD */}
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
              <Mail className="h-3.5 w-3.5 text-veal" />
              <span>Email</span>
            </div>
            <p className="mt-2 truncate text-xs font-extrabold text-veal-dark">
              {userEmail}
            </p>
          </div>

          {/* TELEPHONE FIELD */}
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                <Phone className="h-3.5 w-3.5 text-veal" />
                <span>Nomor Telepon</span>
              </div>
              <Link
                href="/account/addresses"
                className="inline-flex cursor-pointer items-center gap-1 text-[10px] font-bold text-veal hover:underline"
              >
                <span>Ubah di Alamat</span>
              </Link>
            </div>
            <p className="mt-2 text-xs font-extrabold text-veal-dark">
              {defaultAddressPhone || "-"}
            </p>
          </div>

          {/* ADDRESS FIELD */}
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4 sm:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                <MapPin className="h-3.5 w-3.5 text-veal" />
                <span>Alamat Utama Pengiriman</span>
              </div>
              <Link
                href="/account/addresses"
                className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-extrabold text-veal hover:underline"
              >
                <span>Kelola Alamat</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <p className="mt-2 text-xs font-bold leading-relaxed text-veal-dark">
              {formattedAddress || "Belum ada alamat utama tersimpan."}
            </p>
          </div>

        </div>

        {/* STATUS AKUN & TOKO */}
        <div className="mt-6 rounded-3xl border border-zinc-200/80 bg-linear-to-br from-zinc-900 to-zinc-950 p-6 text-white shadow-md">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-veal/20 text-veal backdrop-blur-md">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">Ekosistem VEAL Member</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Aktif
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  {store
                    ? `Kamu terdaftar sebagai Pembeli & Pemilik Toko (${store.store_name}).`
                    : "Kamu terdaftar sebagai Pembeli Terverifikasi VEAL."}
                </p>
              </div>
            </div>

            {store ? (
              <Link
                href="/seller/dashboard"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-veal px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-veal-hover active:scale-[0.98]"
              >
                <Store className="h-4 w-4" />
                <span>Dashboard Seller</span>
              </Link>
            ) : (
              <Link
                href="/seller/register"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-extrabold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-[0.98]"
              >
                <Store className="h-4 w-4" />
                <span>Buka Toko Gratis</span>
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}