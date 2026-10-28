import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import EditProfileForm from "../EditProfileForm";

export default async function EditAccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }


const { data: profile, error } = await supabase
  .from("profiles")
  .select("username, full_name")
  .eq("id", user.id)
  .maybeSingle();

if (error) {
  console.error("Profile query error:", error);
  throw new Error("Gagal mengambil data profile.");
}

if (!profile) {
  return (
    <main className="min-h-screen bg-[#F7F7F2] p-8">
      <h1 className="text-2xl font-bold text-[#494368]">
        Profile belum ditemukan
      </h1>
      <p className="mt-2 text-[#494368]/70">
        Akun ini belum memiliki data di tabel profiles.
      </p>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-[#F7F7F2] px-4 py-12">
      <div className="mx-auto max-w-3xl">

        <Link
          href="/account"
          className="text-sm font-bold text-[#7A28CB] hover:underline"
        >
          ← Back to Account
        </Link>

        <div className="mt-6 rounded-3xl border border-[#494368]/10 bg-white p-8">
          <h1 className="text-3xl font-black text-[#494368]">
            Edit Profile
          </h1>

          <p className="mt-2 text-sm text-[#494368]/60">
            Update your personal information.
          </p>

          <EditProfileForm profile={profile} />
        </div>

      </div>
    </main>
  );
}