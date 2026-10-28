import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function AuthUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>Not logged in</p>;
  }

  return (
    <div>
      <p>Logged in as:</p>

      <p>
        {user.user_metadata?.username}
      </p>

      <p>{user.email}</p>

      <LogoutButton />
    </div>
  );
}