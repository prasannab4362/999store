"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, PlusCircle, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useWishlistStore } from "@/stores/wishlist-store";

export function MobileBottomNavigation() {
  const pathname = usePathname();
  const wishlistCount = useWishlistStore((state) => (state.isHydrated ? state.items.length : 0));

  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Shop", icon: Grid },
    { href: "/combo", label: "Build Combo", icon: PlusCircle, highlight: true },
    { href: "/wishlist", label: "Wishlist", icon: Heart, badge: wishlistCount },
    { href: "/account", label: "Account", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border-light shadow-[0_-4px_12px_rgba(0,0,0,0.05)] h-16 flex items-center justify-around px-2 font-heading">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

        if (item.highlight) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative -top-4 flex flex-col items-center justify-center cursor-pointer select-none"
            >
              <div className="h-12 w-12 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg active:scale-90 hover:bg-brand-primary-hover transition-all duration-100">
                <Icon className="h-6 w-6 stroke-[2.5]" />
              </div>
              <span className="text-[9px] font-bold mt-1 text-brand-primary uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-14 py-1 relative cursor-pointer select-none text-text-secondary active:scale-95 duration-100",
              isActive ? "text-brand-primary font-bold" : "hover:text-text-primary"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] mt-1 tracking-wide">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute top-0 right-2 h-4 w-4 rounded-full bg-brand-accent text-white text-[8px] flex items-center justify-center font-bold font-heading shadow-sm">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
export default MobileBottomNavigation;
