"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Type data profile yang sesuai dengan tabel Supabase
type Profile = {
username: string | null;
full_name: string | null;
};

type EditProfileFormProps = {
profile: Profile;
};

export default function EditProfileForm({
profile,
}: EditProfileFormProps) {
// State untuk menampung input form
const [username, setUsername] = useState(profile.username || "");
const [fullName, setFullName] = useState(profile.full_name || "");

const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

const router = useRouter();

async function handleSubmit(
event: React.FormEvent<HTMLFormElement>
) {
event.preventDefault();

setLoading(true);
setMessage("");

const supabase = createClient();

// Ambil user yang sedang login
const {
  data: { user },
  error: userError,
} = await supabase.auth.getUser();

if (userError || !user) {
  setMessage("User tidak ditemukan. Silakan login kembali.");
  setLoading(false);
  return;
}

// Update profile di database
const { error } = await supabase
  .from("profiles")
  .update({
    username: username.trim(),
    full_name: fullName.trim() || null,
    updated_at: new Date().toISOString(),
  })
  .eq("id", user.id);

if (error) {
  setMessage(
    error.code === "23505"
      ? "Username sudah digunakan. Pilih username lain."
      : error.message
  );
  setLoading(false);
  return;
}

// Kembali ke halaman account setelah berhasil
router.push("/account");
router.refresh();


}

return ( 
<form onSubmit={handleSubmit} className="mt-8 space-y-6">
{/* Username */} <div> <label
       htmlFor="username"
       className="text-sm font-bold text-[#494368]"
     >
Username </label>


    <input
      id="username"
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
      minLength={3}
      maxLength={30}
      className="mt-2 w-full rounded-xl border border-[#494368]/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7A28CB]"
      placeholder="Username"
    />
  </div>

  {/* Full Name */}
  <div>
    <label
      htmlFor="fullName"
      className="text-sm font-bold text-[#494368]"
    >
      Full Name
    </label>

    <input
      id="fullName"
      type="text"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      maxLength={100}
      className="mt-2 w-full rounded-xl border border-[#494368]/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7A28CB]"
      placeholder="Nama lengkap"
    />
  </div>

  {/* Error message */}
  {message && (
    <p
      role="alert"
      className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
    >
      {message}
    </p>
  )}

  {/* Save */}
  <button
    type="submit"
    disabled={loading}
    className="rounded-full bg-[#7A28CB] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#681FB0] disabled:cursor-not-allowed disabled:opacity-50"
  >
    {loading ? "Saving..." : "Save Changes"}
  </button>
</form>


);
}
