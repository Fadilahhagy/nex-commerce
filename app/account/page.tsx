import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClientView from "./ProfileClientView";

export default async function AccountPage() {
  const supabase = await createClient();

  // 1. Ambil user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 2. Ambil profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  // 3. Ambil alamat default & nomor telepon
  const { data: defaultAddress } = await supabase
    .from("user_addresses")
    .select("phone, address_line, subdistrict, city, province, postal_code")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // 4. Ambil data store
  const { data: store } = await supabase
    .from("stores")
    .select("id, store_name, slug")
    .eq("user_id", user.id)
    .maybeSingle();

  const formattedAddress = defaultAddress
    ? [
        defaultAddress.address_line,
        defaultAddress.subdistrict,
        defaultAddress.city,
        defaultAddress.province,
        defaultAddress.postal_code,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <div className="min-h-screen bg-veal-bg font-sans flex flex-col justify-between">
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <ProfileClientView
            userEmail={user.email || ""}
            initialProfile={{
              username: profile?.username || "",
              full_name: profile?.full_name || "",
              avatar_url: profile?.avatar_url || null,
            }}
            defaultAddressPhone={defaultAddress?.phone || null}
            formattedAddress={formattedAddress}
            store={store}
          />
        </div>
      </main>
    </div>
  );
}