"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  Store, 
  ExternalLink, 
  LogOut 
} from "lucide-react";

interface SidebarProps {
  storeName: string;
  storeSlug: string;
}

export default function Sidebar({ storeName, storeSlug }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/seller/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products Catalog",
      href: "/seller/dashboard/products", // atau sesuaikan rutenya
      icon: Package,
    },
    {
      name: "Store Settings",
      href: "/seller/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-zinc-200/80 bg-white font-sans sticky top-0 shrink-0">
      {/* Ganti 'fixed inset-y-0 left-0 z-30' menjadi 'sticky top-0 shrink-0' */}
      
      {/* Brand / Store Header */}
      <div className="flex h-16 items-center gap-3 border-b border-zinc-100 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-veal text-white font-black shadow-sm">
          V
        </div>
        <div className="overflow-hidden">
          <h2 className="text-xs font-black uppercase tracking-wider text-veal-dark truncate">
            {storeName}
          </h2>
          <span className="text-[10px] font-semibold text-zinc-400">Seller Center</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mb-3">
          Menu Utama
        </p>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-veal text-white shadow-md shadow-veal/20"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-veal-dark"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / External Links */}
      <div className="border-t border-zinc-100 p-4 space-y-2">
        <Link
          href={`/store/${storeSlug}`}
          target="_blank"
          className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs font-bold text-zinc-700 transition hover:border-veal hover:bg-white hover:text-veal-dark"
        >
          <span className="flex items-center gap-2">
            <Store className="h-4 w-4 text-veal" />
            <span>View Live Store</span>
          </span>
          <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
        </Link>

        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar Akun</span>
          </button>
        </form>
      </div>

    </aside>
  );
}