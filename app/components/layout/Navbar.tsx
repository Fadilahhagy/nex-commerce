"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Layers,
  Shirt,
  ShoppingBag,
  Watch,
  Headphones,
  Gamepad2,
  Footprints,
  PackageCheck,
} from "lucide-react";

import NavbarUser from "./NavbarUser";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Deteksi posisi scroll layar untuk efek floating navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup dropdown jika klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Daftar kategori produk yang disesuaikan dengan database Supabase
  const categories = [
    { name: "Semua Kategori", href: "/catalog", icon: Layers, desc: "Jelajahi seluruh produk" },
    { name: "Sneakers", href: "/catalog?category=Sneakers", icon: Footprints, desc: "Alas kaki & sepatu pilihan" },
    { name: "Apparel", href: "/catalog?category=Apparel", icon: Shirt, desc: "Pakaian urban & casual" },
    { name: "Accessories", href: "/catalog?category=Accessories", icon: Watch, desc: "Aksesoris pelengkap gaya" },
    { name: "Electronics", href: "/catalog?category=Electronics", icon: Headphones, desc: "Perangkat elektronik" },
    { name: "Bags", href: "/catalog?category=Bags", icon: ShoppingBag, desc: "Tas stylish daily outfit" },
    { name: "Gaming", href: "/catalog?category=Gaming", icon: Gamepad2, desc: "Gear & merch gaming" },
    { name: "Other", href: "/catalog?category=Other", icon: PackageCheck, desc: "Kategori menarik lainnya" },
  ];

  const isCategoryActive = pathname.startsWith("/catalog") && pathname.includes("category=");

  return (
    <header
      className={`sticky top-0 z-50 flex w-full justify-center transition-all duration-300 font-sans ${
        isScrolled ? "px-4 pt-3 sm:px-6 lg:px-8" : "px-0 pt-0"
      }`}
    >
<nav
        className={`w-full transition-all duration-300 ${ // <-- overflow-hidden dihapus dari sini!
          isScrolled
            ? "mx-auto max-w-6xl rounded-full border border-zinc-200/80 bg-white/85 px-6 py-3 shadow-lg backdrop-blur-md"
            : "border-b border-zinc-200/80 bg-white/90 px-4 py-4 sm:px-6 lg:px-8 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          
          {/* ========================= */}
          {/* LOGO (VEAL BRAND) */}
          {/* ========================= */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-veal-dark transition-colors group-hover:text-veal">
              VEAL
              <span className="text-veal">.</span>
            </span>
          </Link>

          {/* ========================= */}
          {/* DESKTOP NAVIGATION */}
          {/* ========================= */}
          <div className="hidden items-center gap-1.5 rounded-full bg-zinc-100/80 p-1.5 md:flex backdrop-blur-xs">
            
            {/* Beranda */}
            <Link
              href="/"
              className={`relative rounded-full px-4 py-2 text-xs font-black transition-all duration-300 cursor-pointer ${
                pathname === "/"
                  ? "bg-veal text-white shadow-md shadow-veal/25"
                  : "text-zinc-600 hover:bg-zinc-200/50 hover:text-veal-dark"
              }`}
            >
              <span>Beranda</span>
              {pathname === "/" && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-veal-light opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              )}
            </Link>

            {/* Katalog */}
            <Link
              href="/catalog"
              className={`relative rounded-full px-4 py-2 text-xs font-black transition-all duration-300 cursor-pointer ${
                pathname === "/catalog" && !pathname.includes("category=")
                  ? "bg-veal text-white shadow-md shadow-veal/25"
                  : "text-zinc-600 hover:bg-zinc-200/50 hover:text-veal-dark"
              }`}
            >
              <span>Katalog</span>
            </Link>

            {/* DROPDOWN KATEGORI 2 KOLOM */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black transition-all duration-300 cursor-pointer ${
                  isCategoryActive || isCategoryOpen
                    ? "bg-veal text-white shadow-md shadow-veal/25"
                    : "text-zinc-600 hover:bg-zinc-200/50 hover:text-veal-dark"
                }`}
              >
                <span>Kategori</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Box Dropdown Menu (Diperlebar & 2 Kolom) */}
              {isCategoryOpen && (
                <div className="absolute left-0 mt-3 w-[480px] rounded-3xl border border-zinc-200/80 bg-white p-4 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-2 pb-2.5 mb-2 border-b border-zinc-100 flex items-center justify-between">
                    <p className="text-[10px] font-extrabold tracking-wider uppercase text-zinc-400">Pilih Kategori Produk</p>
                    <span className="text-[10px] font-bold text-veal bg-veal/10 px-2 py-0.5 rounded-full">{categories.length} Kategori</span>
                  </div>

                  {/* Grid 2 Kolom */}
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => {
                      const IconComponent = cat.icon;
                      return (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          onClick={() => setIsCategoryOpen(false)}
                          className="group flex items-start gap-2.5 rounded-2xl p-2 transition hover:bg-veal/10 cursor-pointer"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 group-hover:bg-veal group-hover:text-white transition">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-veal-dark group-hover:text-veal transition truncate">
                              {cat.name}
                            </p>
                            <p className="text-[10px] font-medium text-zinc-400 truncate">
                              {cat.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Menu Promo (Disabled) */}
            <button
              disabled
              title="Promo event belum tersedia saat ini"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-xs font-extrabold text-zinc-400 opacity-60 cursor-not-allowed select-none"
            >
              <Sparkles className="h-3 w-3 text-zinc-400" />
              <span>Promo</span>
              <span className="text-[9px] font-semibold bg-zinc-200 px-1.5 py-0.5 rounded-full text-zinc-500">Soon</span>
            </button>
          </div>

          {/* ========================= */}
          {/* RIGHT SIDE (SEARCH & USER) */}
          {/* ========================= */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Input Desktop */}
            <div className="relative hidden w-48 sm:block lg:w-64">
              <input
                type="text"
                placeholder="Cari streetwear, hoodie..."
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 pl-11 text-sm font-semibold text-veal-dark placeholder:text-zinc-400 focus:border-veal focus:bg-white focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            </div>

            {/* AUTH / USER ACTIONS */}
            <NavbarUser />

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 md:hidden cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* ========================= */}
        {/* MOBILE NAVIGATION MENU */}
        {/* ========================= */}
        {isMobileMenuOpen && (
          <div className="border-t border-zinc-200/80 py-4 text-xs font-bold text-zinc-700 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Mobile Search Box */}
            <div className="relative mb-4 sm:hidden">
              <input
                type="text"
                placeholder="Cari streetwear, hoodie..."
                className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-xs font-medium text-veal-dark transition-all placeholder:text-zinc-400 focus:border-veal focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            </div>

            <div className="space-y-1 rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-sm">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block rounded-xl px-3 py-2.5 transition ${
                  pathname === "/" ? "bg-veal text-white font-black" : "hover:bg-zinc-50 hover:text-veal"
                }`}
              >
                Beranda
              </Link>

              <Link
                href="/catalog"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block rounded-xl px-3 py-2.5 transition ${
                  pathname === "/catalog" ? "bg-veal text-white font-black" : "hover:bg-zinc-50 hover:text-veal"
                }`}
              >
                Katalog
              </Link>

              {/* Sub-menu Kategori di Mobile */}
              <div className="px-3 py-2 text-[10px] font-extrabold tracking-wider uppercase text-zinc-400">
                Kategori Pilihan
              </div>
              <div className="grid grid-cols-2 gap-1 px-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 transition hover:bg-zinc-50 hover:text-veal text-zinc-600 truncate"
                  >
                    - {cat.name}
                  </Link>
                ))}
              </div>

              {/* Promo Event Mobile Disabled */}
              <div className="mt-2 flex items-center justify-between rounded-xl bg-zinc-100 px-3 py-2.5 font-extrabold text-zinc-400 opacity-60">
                <span>Promo Event (Soon)</span>
                <Sparkles className="h-4 w-4 text-zinc-400" />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}