"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-veal-dark text-white pt-16 pb-8 border-t border-zinc-800 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* TOP SECTION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-800">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-4">
            <Link href="/" className="inline-block group">
              <span className="text-2xl font-black tracking-tight text-white transition-colors group-hover:text-veal">
                VEAL<span className="text-veal">.</span>
              </span>
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Platform e-commerce streetwear & techwear masa kini. Menghadirkan apparel berkualitas, sneakers eksklusif, dan gear urban fungsional.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition hover:border-veal hover:bg-veal hover:text-white"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition hover:border-veal hover:bg-veal hover:text-white"
                aria-label="Twitter"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition hover:border-veal hover:bg-veal hover:text-white"
                aria-label="Discord"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition hover:border-veal hover:bg-veal hover:text-white"
                aria-label="Github"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links (Navigasi) */}
          <div className="space-y-3.5 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="/catalog" className="hover:text-veal transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Sneakers" className="hover:text-veal transition-colors">
                  Sneakers
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Apparel" className="hover:text-veal transition-colors">
                  Apparel
                </Link>
              </li>
              <li>
                <span className="text-zinc-600 cursor-not-allowed select-none flex items-center justify-between">
                  <span>Promo Spesial</span>
                  <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Soon</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Help & Support (Bantuan) */}
          <div className="space-y-3.5 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Bantuan
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <span className="text-zinc-600 cursor-not-allowed select-none flex items-center justify-between">
                  <span>FAQ</span>
                  <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Soon</span>
                </span>
              </li>
              <li>
                <span className="text-zinc-600 cursor-not-allowed select-none flex items-center justify-between">
                  <span>Pengiriman</span>
                  <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Soon</span>
                </span>
              </li>
              <li>
                <span className="text-zinc-600 cursor-not-allowed select-none flex items-center justify-between">
                  <span>Kebijakan Retur</span>
                  <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Soon</span>
                </span>
              </li>
              <li>
                <span className="text-zinc-600 cursor-not-allowed select-none flex items-center justify-between">
                  <span>Hubungi Kami</span>
                  <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">Soon</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3.5 md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Dapatkan Update
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Berlangganan newsletter untuk mendapatkan informasi drop edisi terbatas dan promo eksklusif VEAL.
            </p>
            
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Masukkan email kamu..."
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-veal focus:ring-2 focus:ring-veal/20 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-veal hover:bg-veal-hover text-white font-bold text-xs rounded-xl transition-all shadow-sm shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Kirim</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} VEAL Store. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-zinc-600 cursor-not-allowed select-none">Privacy Policy</span>
            <span className="text-zinc-600 cursor-not-allowed select-none">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}