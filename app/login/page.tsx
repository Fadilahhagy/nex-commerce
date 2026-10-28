"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  // ==========================================================
  // STATE
  // ==========================================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================================
  // SUPABASE + ROUTER
  // ==========================================================
  const supabase = createClient();
  const router = useRouter();

  // ==========================================================
  // LOGIN HANDLER
  // ==========================================================
  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen bg-veal-bg font-sans">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center p-4 sm:p-6 lg:p-8">
        
        {/* DRIBBBLE-STYLE CONTAINER CARD */}
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xl lg:grid-cols-12">
          
          {/* ==========================================================
              LEFT SIDE: FORM SECTION (7 COLS)
          ========================================================== */}
          <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-7 lg:p-12">
            
            {/* Top Brand Logo */}
            <div>
              <Link href="/" className="inline-block group">
                <span className="text-2xl font-black tracking-tight text-veal-dark transition-colors group-hover:text-veal">
                  VEAL<span className="text-veal">.</span>
                </span>
              </Link>
            </div>

            {/* Form Header */}
            <div className="my-8 max-w-md">
              <h1 className="text-2xl font-black tracking-tight text-veal-dark sm:text-3xl">
                Selamat Datang Kembali
              </h1>
              <p className="mt-2 text-xs font-medium text-zinc-500 sm:text-sm">
                Masukan email dan kata sandi kamu untuk mengakses akun VEAL.
              </p>

              {/* ERROR MESSAGE BOX */}
              {errorMessage && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600 animate-in fade-in duration-200">
                  {errorMessage}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                
                {/* EMAIL INPUT */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-bold text-veal-dark"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pl-10 pr-4 text-xs font-medium text-veal-dark outline-none transition-all placeholder:text-zinc-400 focus:border-veal focus:bg-white focus:ring-2 focus:ring-veal/10"
                    />
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>

                {/* PASSWORD INPUT */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-xs font-bold text-veal-dark"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-bold text-veal transition hover:underline"
                    >
                      Lupa password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pl-10 pr-10 text-xs font-medium text-veal-dark outline-none transition-all placeholder:text-zinc-400 focus:border-veal focus:bg-white focus:ring-2 focus:ring-veal/10"
                    />
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    
                    {/* Toggle Show/Hide Password */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-veal-dark"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-veal py-3.5 text-xs font-bold text-white shadow-md shadow-veal/20 transition-all hover:bg-veal-hover hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memproses Login...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Akun</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Register Redirect */}
            <div className="border-t border-zinc-100 pt-6">
              <p className="text-xs font-medium text-zinc-500">
                Belum punya akun VEAL?{" "}
                <Link
                  href="/register"
                  className="font-bold text-veal transition hover:underline"
                >
                  Daftar sekarang
                </Link>
              </p>
            </div>

          </div>

          {/* ==========================================================
              RIGHT SIDE: VISUAL BRAND PANEL (5 COLS - DESKTOP ONLY)
          ========================================================== */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-veal-dark p-10 text-white lg:col-span-5 lg:flex">
            
            {/* Background Decorative Grid & Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-veal/30 blur-3xl" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Top Tagline Badge */}
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-veal/30 bg-veal/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-veal-light backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-veal" />
                Urban Techwear & Streetwear
              </span>
            </div>

            {/* Middle Feature Quote Card */}
            <div className="relative z-10 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <p className="text-sm font-medium leading-relaxed text-zinc-300">
                "VEAL hadir untuk mendefinisikan kembali cara berbusana urban secara fungsional, bersih, dan berani."
              </p>
              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-veal font-black text-xs text-white">
                  V
                </div>
                <div>
                  <p className="text-xs font-bold text-white">VEAL Official Store</p>
                  <p className="text-[10px] text-zinc-400">Curated Streetwear Catalog</p>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="relative z-10 text-[11px] font-semibold text-zinc-500">
              © {new Date().getFullYear()} VEAL Inc. All rights reserved.
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}