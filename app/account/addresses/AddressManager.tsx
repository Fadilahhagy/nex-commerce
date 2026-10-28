"use client";

import { useState } from "react";
import { 
  MapPin, 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Building2, 
  Phone, 
  User 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Address = {
  id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  subdistrict: string | null;
  city: string;
  province: string;
  postal_code: string | null;
  is_default: boolean;
  created_at?: string;
};

type AddressForm = {
  label: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  subdistrict: string;
  city: string;
  province: string;
  postal_code: string;
};

const emptyForm: AddressForm = {
  label: "",
  recipient_name: "",
  phone: "",
  address_line: "",
  subdistrict: "",
  city: "",
  province: "",
  postal_code: "",
};

const fields: {
  name: keyof AddressForm;
  label: string;
  required?: boolean;
  full?: boolean;
  placeholder?: string;
}[] = [
  { name: "label", label: "Label Alamat", required: true, placeholder: "Contoh: Rumah, Kantor" },
  { name: "recipient_name", label: "Nama Penerima", required: true, placeholder: "Nama lengkap penerima" },
  { name: "phone", label: "Nomor Telepon", required: true, placeholder: "0812xxxxxxx" },
  {
    name: "address_line",
    label: "Alamat Lengkap",
    required: true,
    full: true,
    placeholder: "Nama jalan, nomor rumah, RT/RW, patokan",
  },
  { name: "subdistrict", label: "Kecamatan / Kelurahan", placeholder: "Kecamatan" },
  { name: "city", label: "Kota / Kabupaten", required: true, placeholder: "Kota" },
  { name: "province", label: "Provinsi", required: true, placeholder: "Provinsi" },
  { name: "postal_code", label: "Kode Pos", placeholder: "40xxx" },
];

export default function AddressManager({
  initialAddresses,
}: {
  initialAddresses: Address[];
}) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [makeDefault, setMakeDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const supabase = createClient();

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setMakeDefault(addresses.length === 0);
    setMessage("");
    setShowForm(true);
  }

  function startEdit(address: Address) {
    setEditingId(address.id);
    setForm({
      label: address.label,
      recipient_name: address.recipient_name,
      phone: address.phone,
      address_line: address.address_line,
      subdistrict: address.subdistrict ?? "",
      city: address.city,
      province: address.province,
      postal_code: address.postal_code ?? "",
    });
    setMakeDefault(address.is_default);
    setMessage("");
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Silakan login kembali.");
      }

      const payload = {
        label: form.label.trim(),
        recipient_name: form.recipient_name.trim(),
        phone: form.phone.trim(),
        address_line: form.address_line.trim(),
        subdistrict: form.subdistrict.trim() || null,
        city: form.city.trim(),
        province: form.province.trim(),
        postal_code: form.postal_code.trim() || null,
      };

      if (
        !payload.label ||
        !payload.recipient_name ||
        !payload.phone ||
        !payload.address_line ||
        !payload.city ||
        !payload.province
      ) {
        throw new Error("Lengkapi semua field yang wajib diisi.");
      }

      if (makeDefault) {
        const { error } = await supabase
          .from("user_addresses")
          .update({ is_default: false })
          .eq("user_id", user.id)
          .eq("is_default", true);

        if (error) throw error;
      }

      if (editingId) {
        const { error } = await supabase
          .from("user_addresses")
          .update({
            ...payload,
            is_default: makeDefault,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_addresses")
          .insert({
            ...payload,
            user_id: user.id,
            is_default: makeDefault || addresses.length === 0,
          });

        if (error) throw error;
      }

      const { data, error: fetchError } = await supabase
        .from("user_addresses")
        .select(
          "id, label, recipient_name, phone, address_line, subdistrict, city, province, postal_code, is_default, created_at"
        )
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setAddresses((data ?? []) as Address[]);
      cancelForm();
      setMessageType("success");
      setMessage(
        editingId
          ? "Alamat berhasil diperbarui."
          : "Alamat berhasil ditambahkan."
      );
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error ? error.message : "Gagal menyimpan alamat."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(address: Address) {
    if (!window.confirm(`Hapus alamat "${address.label}"?`)) return;

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase
        .from("user_addresses")
        .delete()
        .eq("id", address.id);

      if (error) throw error;

      let remaining = addresses.filter((item) => item.id !== address.id);

      if (address.is_default && remaining.length > 0) {
        const nextDefault = remaining[0];

        const { error: defaultError } = await supabase
          .from("user_addresses")
          .update({ is_default: true })
          .eq("id", nextDefault.id);

        if (defaultError) throw defaultError;

        remaining = remaining.map((item) => ({
          ...item,
          is_default: item.id === nextDefault.id,
        }));
      }

      setAddresses(remaining);
      setMessageType("success");
      setMessage("Alamat berhasil dihapus.");
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error ? error.message : "Gagal menghapus alamat."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSetDefault(address: Address) {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Silakan login kembali.");

      const { error: clearError } = await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .eq("is_default", true);

      if (clearError) throw clearError;

      const { error: updateError } = await supabase
        .from("user_addresses")
        .update({ is_default: true })
        .eq("id", address.id)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setAddresses((current) =>
        current.map((item) => ({
          ...item,
          is_default: item.id === address.id,
        }))
      );
      setMessageType("success");
      setMessage("Alamat default berhasil diperbarui.");
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error ? error.message : "Gagal mengubah alamat default."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-veal" />
            <h2 className="text-xl font-black text-veal-dark">Buku Alamat</h2>
          </div>
          <p className="mt-1 text-xs font-medium text-zinc-500">
            Kelola alamat pengiriman untuk mempermudah proses checkout pesananmu.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={startAdd}
            disabled={loading}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-veal px-5 py-3 text-xs font-bold text-white shadow-md shadow-veal/20 transition-all duration-200 hover:bg-veal-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Alamat Baru</span>
          </button>
        )}
      </div>

      {/* Notification Banner */}
      {message && (
        <div
          className={`flex items-center gap-2.5 rounded-2xl p-4 text-xs font-bold shadow-2xs ${
            messageType === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Form Tambah / Edit Alamat */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="overflow-hidden rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-4">
            <h3 className="text-base font-black text-veal-dark">
              {editingId ? "Edit Alamat Pengiriman" : "Tambah Alamat Pengiriman Baru"}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              * Wajib diisi
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <label
                key={field.name}
                className={`block ${field.full ? "sm:col-span-2" : ""}`}
              >
                <span className="mb-1.5 block text-xs font-bold text-veal-dark">
                  {field.label}
                  {field.required && <span className="ml-1 text-rose-500">*</span>}
                </span>

                {field.name === "address_line" ? (
                  <textarea
                    required={field.required}
                    value={form[field.name]}
                    placeholder={field.placeholder}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        [field.name]: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-xs font-semibold text-veal-dark placeholder:text-zinc-400 outline-none transition focus:border-veal focus:bg-white focus:ring-2 focus:ring-veal/10"
                  />
                ) : (
                  <input
                    required={field.required}
                    value={form[field.name]}
                    placeholder={field.placeholder}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        [field.name]: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-xs font-semibold text-veal-dark placeholder:text-zinc-400 outline-none transition focus:border-veal focus:bg-white focus:ring-2 focus:ring-veal/10"
                  />
                )}
              </label>
            ))}
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-5 cursor-pointer">
            <label className="inline-flex cursor-pointer items-center gap-2.5 text-xs font-bold text-veal-dark">
              <input
                type="checkbox"
                checked={makeDefault}
                onChange={(e) => setMakeDefault(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded-md border-zinc-300 text-veal accent-veal focus:ring-veal"
              />
              <span>Jadikan Alamat Utama (Default)</span>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-veal px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-veal/20 transition hover:bg-veal-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{loading ? "Menyimpan..." : "Simpan Alamat"}</span>
            </button>

            <button
              type="button"
              onClick={cancelForm}
              disabled={loading}
              className="cursor-pointer rounded-2xl border border-zinc-200 bg-white px-6 py-3.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-50 hover:text-veal-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Empty State */}
      {addresses.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-veal/10 text-veal">
            <Building2 className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-black text-veal-dark">Belum ada alamat tersimpan</h3>
          <p className="mt-1 max-w-sm text-xs font-medium text-zinc-400">
            Tambahkan alamat pengiriman sekarang untuk mempercepat dan mempermudah proses belanja kamu.
          </p>
          <button
            type="button"
            onClick={startAdd}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-veal px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-veal/20 transition hover:bg-veal-hover"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Alamat Pertama</span>
          </button>
        </div>
      )}

      {/* Daftar Kartu Alamat */}
      <div className="grid gap-4">
        {addresses.map((address) => (
          <article
            key={address.id}
            className={`relative overflow-hidden rounded-3xl border p-6 transition-all duration-200 shadow-2xs ${
              address.is_default
                ? "border-veal/40 bg-white ring-1 ring-veal/20"
                : "border-zinc-200/80 bg-white hover:border-zinc-300"
            }`}
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-veal-dark">
                    <Building2 className="h-3.5 w-3.5 text-veal" />
                    {address.label}
                  </span>

                  {address.is_default && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-veal/30 bg-veal/10 px-3 py-1 text-[11px] font-extrabold text-veal">
                      <CheckCircle2 className="h-3 w-3" />
                      Alamat Utama
                    </span>
                  )}
                </div>

                <div className="pt-1">
                  <p className="flex items-center gap-2 text-sm font-black text-veal-dark">
                    <User className="h-3.5 w-3.5 text-zinc-400" />
                    {address.recipient_name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs font-medium text-zinc-500">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                    {address.phone}
                  </p>
                </div>

                <p className="text-xs font-medium leading-relaxed text-zinc-600 pt-1">
                  {address.address_line}
                </p>

                <p className="text-xs font-bold text-zinc-400">
                  {[address.subdistrict, address.city, address.province, address.postal_code]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => startEdit(address)}
                disabled={loading}
                className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-veal transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>

              {!address.is_default && (
                <button
                  type="button"
                  onClick={() => handleSetDefault(address)}
                  disabled={loading}
                  className="cursor-pointer text-xs font-bold text-zinc-600 transition hover:text-veal-dark hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Jadikan Utama
                </button>
              )}

              <button
                type="button"
                onClick={() => handleDelete(address)}
                disabled={loading}
                className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-rose-600 transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}