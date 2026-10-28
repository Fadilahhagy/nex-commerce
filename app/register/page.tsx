"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Mail, User, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  // ==========================================================
  // STATE
  // ==========================================================
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Supabase Client
  const supabase = createClient();

  // Password strength calculation
  const strengthInfo = getPasswordStrengthInfo(password);

  // ==========================================================
  // REGISTER FUNCTION
  // ==========================================================
  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    if (strengthInfo.label !== "Strong" && strengthInfo.label !== "Very Strong") {
      setMessage("Password harus berkategori Strong atau Very Strong.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Password dan konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    // Sign Up Request
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setIsSuccess(true);
    setMessage("Akun berhasil dibuat. Silakan cek email kamu untuk verifikasi.");
    setLoading(false);
  }

  // Helper Password Strength
  function getPasswordStrengthInfo(pass: string) {
    if (!pass) return { score: 0, label: "", color: "bg-zinc-200", textColor: "text-zinc-400" };

    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 1, label: "Weak", color: "bg-red-500", textColor: "text-red-500" };
    if (score === 3) return { score: 2, label: "Medium", color: "bg-amber-500", textColor: "text-amber-500" };
    if (score === 4) return { score: 3, label: "Strong", color: "bg-veal", textColor: "text-veal" };
    return { score: 4, label: "Very Strong", color: "bg-emerald-500", textColor: "text-emerald-600" };
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
            <div className="my-6 max-w-md">
              <h1 className="text-2xl font-black tracking-tight text-veal-dark sm:text-3xl">
                Buat Akun Baru
              </h1>
              <p className="mt-2 text-xs font-medium text-zinc-500 sm:text-sm">
                Bergabunglah dengan komunitas streetwear & techwear VEAL sekarang.
              </p>

              {/* ALERT MESSAGE BOX */}
              {message && (
                <div
                  className={`mt-4 flex items-start gap-2.5 rounded-xl border p-3.5 text-xs font-semibold animate-in fade-in duration-200 ${
                    isSuccess
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  {isSuccess ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  )}
                  <span>{message}</span>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleRegister} className="mt-6 space-y-4">
                
                {/* EMAIL INPUT */}
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-veal-dark">
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

                {/* USERNAME INPUT */}
                <div>
                  <label htmlFor="username" className="mb-1.5 block text-xs font-bold text-veal-dark">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      type="text"
                      placeholder="Nama kamu"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pl-10 pr-4 text-xs font-medium text-veal-dark outline-none transition-all placeholder:text-zinc-400 focus:border-veal focus:bg-white focus:ring-2 focus:ring-veal/10"
                    />
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>

                {/* PASSWORD INPUT */}
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-xs font-bold text-veal-dark">
                    Password
                  </label>
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
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-veal-dark"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* VISUAL PASSWORD STRENGTH INDICATOR */}
                  {password && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className={`h-full transition-all duration-300 ${strengthInfo.color}`}
                          style={{ width: `${(strengthInfo.score / 4) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] font-semibold text-zinc-500">
                        Kekuatan Password:{" "}
                        <span className={`font-bold ${strengthInfo.textColor}`}>
                          {strengthInfo.label}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* CONFIRM PASSWORD INPUT */}
                <div>
                  <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-bold text-veal-dark">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pl-10 pr-4 text-xs font-medium text-veal-dark outline-none transition-all placeholder:text-zinc-400 focus:border-veal focus:bg-white focus:ring-2 focus:ring-veal/10"
                    />
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  </div>

                  {/* PASSWORD MATCH STATUS */}
                  {confirmPassword && (
                    <p
                      className={`mt-1.5 text-[11px] font-semibold ${
                        password === confirmPassword ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {password === confirmPassword
                        ? "✓ Password cocok."
                        : "✕ Password belum cocok."}
                    </p>
                  )}
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-veal py-3.5 text-xs font-bold text-white shadow-md shadow-veal/20 transition-all hover:bg-veal-hover hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Membuat Akun...</span>
                    </>
                  ) : (
                    <>
                      <span>Daftar Akun</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Login Redirect */}
            <div className="border-t border-zinc-100 pt-5">
              <p className="text-xs font-medium text-zinc-500">
                Sudah memiliki akun VEAL?{" "}
                <Link href="/login" className="font-bold text-veal transition hover:underline">
                  Login di sini
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
                Bergabung Bersama VEAL
              </span>
            </div>

            {/* Middle Feature Perks Card */}
            <div className="relative z-10 space-y-3.5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white">Keuntungan Akun VEAL:</h3>
              <ul className="space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-veal" />
                  <span>Klaim voucher diskon eksklusif member.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-veal" />
                  <span>Akses prioritas ke drop item edisi terbatas.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-veal" />
                  <span>Lacak riwayat pengiriman pesanan secara langsung.</span>
                </li>
              </ul>
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