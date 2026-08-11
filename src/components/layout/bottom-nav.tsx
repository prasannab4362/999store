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
    { href: "/combo", label: "Build", icon: PlusCircle, highlight: true },
    { href: "/wishlist", label: "Wishlist", icon: Heart, badge: wishlistCount },
    { href: "/account", label: "Account", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-2xl saturate-[180%] border-t border-[#D2D2D7]/40 h-[72px] flex items-center justify-around px-2 font-ui pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

        if (item.highlight) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative -top-3 flex flex-col items-center justify-center cursor-pointer select-none"
            >
              <div className="h-11 w-11 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center shadow-[var(--shadow-md)] active:scale-90 transition-all duration-150">
                <Icon className="h-5 w-5 stroke-[2]" />
              </div>
              <span className="text-[10px] font-medium mt-1 text-text-primary">
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
              "flex flex-col items-center justify-center w-14 py-1 relative cursor-pointer select-none active:scale-95 duration-100",
              isActive ? "text-text-primary" : "text-text-muted"
            )}
          >
            <Icon className="h-[22px] w-[22px]" />
            <span className="text-[10px] font-normal mt-1">{item.label}</span>
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-text-primary" />
            )}
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute top-0 right-2 h-3.5 w-3.5 rounded-full bg-brand-accent text-white text-[8px] flex items-center justify-center font-semibold font-ui">
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
