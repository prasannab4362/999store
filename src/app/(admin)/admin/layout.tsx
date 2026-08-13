"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Store,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { BrandLogo } from "@/components/commerce/brand-logo";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders & Fulfillment", icon: ShoppingBag },
  { href: "/admin/products", label: "Inventory & Dresses", icon: Package },
  { href: "/admin/combos", label: "Combo Packages", icon: Layers },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white flex flex-col font-body">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-white/10 bg-[#161618] px-4 sm:px-8 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <BrandLogo background="dark" size="sm" />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3 w-3" /> Admin Control Portal
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="h-9 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Store className="h-4 w-4" />
            <span>Store Front</span>
          </Link>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-[#161618] p-4 hidden md:flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Store Control Center
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group cursor-pointer",
                      isActive
                        ? "bg-gradient-to-r from-amber-400 to-[#D4AF37] text-slate-950 shadow-md shadow-amber-500/20"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs">
              <Sparkles className="h-4 w-4" /> 999 Flat Rate Pricing
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed font-ui">
              All active combo packages are locked at flat ₹999 base price across 10, 8, 5, 3, and 2 item tiers.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
