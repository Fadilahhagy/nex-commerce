"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="
        rounded-full
        bg-[#7A28CB]
        px-5
        py-2
        text-sm
        font-bold
        text-white
      "
    >
      Logout
    </button>
  );
}