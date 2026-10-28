
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CreateStoreForm from "./CreateStoreForm";

export default async function CreateStorePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: existingStore, error } = await supabase
    .from("stores")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error("Gagal memeriksa toko.");
  }

  if (existingStore) {
    redirect("/seller");
  }

  return (
    <main className="min-h-screen bg-[#F7F7F2] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/seller"
          className="text-sm font-bold text-[#7A28CB] hover:underline"
        >
          ← Back to Seller
        </Link>

        <div className="mt-6 rounded-3xl border border-[#494368]/10 bg-white p-8 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FC60A8]">
            NEXUS Seller
          </p>

          <h1 className="mt-3 text-3xl font-black text-[#494368]">
            Create Your Store
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#494368]/60">
            Isi informasi dasar tokomu. Kamu bisa mengembangkan
            detail toko nanti.
          </p>

          <CreateStoreForm />
        </div>
      </div>
    </main>
  );
}