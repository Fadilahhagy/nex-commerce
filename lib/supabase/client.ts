import { createBrowserClient } from "@supabase/ssr";


// ============================================================
// SUPABASE BROWSER CLIENT
// ============================================================
//
// File ini digunakan oleh:
// Client Components
//
// Contoh:
// Login form
// Register form
// Logout button
//
// createBrowserClient akan membuat koneksi Supabase
// yang bisa digunakan dari browser.
//

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}