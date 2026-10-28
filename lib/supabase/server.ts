import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";


// ============================================================
// SUPABASE SERVER CLIENT
// ============================================================
//
// File ini digunakan ketika kode kita berjalan di SERVER.
//
// Contoh:
// Server Component
// Server Action
// Route Handler
//
// Session Supabase disimpan menggunakan cookies.
//

export async function createClient() {

  // Ambil cookie dari request user

  const cookieStore = await cookies();


  // Buat Supabase Server Client

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,

    {
      cookies: {

        // ====================================================
        // GET ALL COOKIES
        // ====================================================

        getAll() {
          return cookieStore.getAll();
        },


        // ====================================================
        // SET ALL COOKIES
        // ====================================================

        setAll(cookiesToSet) {

          try {

            cookiesToSet.forEach(
              ({ name, value, options }) => {

                cookieStore.set(
                  name,
                  value,
                  options
                );

              }
            );

          } catch {
            // Bisa terjadi ketika dipanggil
            // dari Server Component.
            //
            // Proxy/middleware nantinya akan menangani
            // refresh session.
          }

        },

      },
    }
  );
}