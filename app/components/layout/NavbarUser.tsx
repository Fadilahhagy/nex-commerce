"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  User,
  LogOut,
  Store,
  Package,
  Settings,
  ChevronDown,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type UserData = {
  id?: string;
  email?: string;
  username?: string;
};

export default function NavbarUser() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [profile, setProfile] = useState<{ username?: string; avatar_url?: string | null } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let isCancelled = false;

    async function fetchUserDataAndCart() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isCancelled) return;

      if (user) {
              // 1. Ambil profile (username & avatar_url) dari tabel profiles
              const { data: profileData } = await supabase
                .from("profiles")
                .select("username, avatar_url")
                .eq("id", user.id)
                .single();

              if (!isCancelled && profileData) {
                setProfile(profileData); // <-- Pastikan ini ada agar datanya masuk ke state!
              }

              // 2. Ambil jumlah item keranjang awal
              fetchCartCount(user.id);
            } else {
              setUser(null);
              setProfile(null); // <-- Reset profile juga saat logout
              setCartCount(0);
            }
    }

    fetchUserDataAndCart();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isCancelled) return;

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          username: session.user.user_metadata?.username,
        });
        fetchCartCount(session.user.id);
      } else {
        setUser(null);
        setCartCount(0);
      }
    });

    return () => {
      isCancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  // Fungsi untuk mengambil total kuantiti item di cart_items
  async function fetchCartCount(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("user_id", userId);

    if (!error && data) {
      // Jumlahkan total kuantiti dari seluruh item di keranjang
      const totalItems = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(totalItems);
    }
  }

// Realtime Listener untuk tabel cart_items agar badge otomatis update
useEffect(() => {
  if (!user?.id) return;

  const supabase = createClient();
  const channelName = `navbar-cart-${user.id}`;

  // 1. Paksa hapus channel lama jika ada di memori Realtime client
  const existingChannel = supabase.channel(channelName);
  supabase.removeChannel(existingChannel);

  // 2. Buat channel baru & daftarkan listener secara sinkron
  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "cart_items",
        filter: `user_id=eq.${user.id}`,
      },
      () => {
        fetchCartCount(user.id!);
      }
    );

  // 3. Panggil subscribe() setelah callback terdaftar penuh
  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      // Sinkronkan ulang data saat koneksi realtime terhubung
      fetchCartCount(user.id!);
    }
  });

  // 4. Cleanup saat komponen unmount atau user id berubah
  return () => {
    supabase.removeChannel(channel);
  };
}, [user?.id]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();

    setUser(null);
    setIsOpen(false);
    setCartCount(0);

    window.location.href = "/";
  }

  // =========================
  // GUEST / BELUM LOGIN
  // =========================
  if (!user) {
    return (
      <div className="flex items-center gap-2.5 font-sans">
        <Link
          href="/login"
          className="hidden px-3 py-2 text-xs font-bold text-zinc-700 transition-colors hover:text-veal sm:block"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="rounded-xl bg-veal px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-veal-hover hover:shadow"
        >
          Register
        </Link>
      </div>
    );
  }

  // =========================
  // USER / SUDAH LOGIN
  // =========================
  const username = user.username || "User";
  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 font-sans">
      
      {/* Wishlist Icon */}
      <Link
        href="/wishlist"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-zinc-700 transition-colors hover:bg-zinc-200/60 hover:text-veal"
        aria-label="Wishlist"
      >
        <Heart className="h-4 w-4" />
      </Link>

      {/* Cart Icon dengan Live Badge Fungsional */}
      <Link
        href="/cart"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-zinc-700 transition-colors hover:bg-zinc-200/60 hover:text-veal"
        aria-label="Keranjang"
      >
        <ShoppingBag className="h-4 w-4" />

        {/* Cart Count Badge - Hanya tampil jika jumlah > 0 */}
        {cartCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-veal text-[9px] font-black text-white ring-2 ring-white shadow-sm animate-in zoom-in-50 duration-150">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </Link>

      {/* Account Menu Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-2 py-1.5 shadow-sm transition hover:border-veal hover:bg-zinc-50 cursor-pointer"
        >
          {/* Avatar Circle - Jelas & Tajam */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-veal text-xs font-black text-white shadow-xs">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile?.username || "Avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              (profile?.username || "U").charAt(0).toUpperCase()
            )}
          </div>

          {/* Username Text */}
          <span className="hidden max-w-28 truncate text-xs font-bold text-zinc-900 lg:block">
            {username}
          </span>

          <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
        </button>

        {/* Account Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
            
            {/* User Details Box */}
            <div className="border-b border-zinc-100 px-3 py-2.5 bg-zinc-50/50 rounded-xl mb-1">
              <p className="text-xs font-extrabold text-zinc-900">
                {username}
              </p>
              <p className="mt-0.5 truncate text-[11px] font-medium text-zinc-500">
                {user.email}
              </p>
            </div>

            {/* Menu Links */}
            <div className="space-y-0.5">
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                <User className="h-3.5 w-3.5 text-zinc-500" />
                My Account
              </Link>

              <Link
                href="/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                <Package className="h-3.5 w-3.5 text-zinc-500" />
                My Orders
              </Link>

              <Link
                href="/seller"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                <Store className="h-3.5 w-3.5 text-zinc-500" />
                Store
              </Link>

              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                <Settings className="h-3.5 w-3.5 text-zinc-500" />
                Settings
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}