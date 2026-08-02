"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { BrandLogo } from "../commerce/brand-logo";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/men", label: "Men" },
  { href: "/women", label: "Women" },
  { href: "/combo", label: "Combo Builder" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/offers", label: "Offers" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Zustand counts
  const cartGroupsCount = useCartStore((state) => (state.isHydrated ? state.comboGroups.length : 0));
  const wishlistCount = useWishlistStore((state) => (state.isHydrated ? state.items.length : 0));

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 shadow-xs py-2.5"
          : "bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-border-light/60 py-3.5"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Mobile Hamburger (radix-sheet) */}
        <div className="flex md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 -ml-2 text-text-primary hover:opacity-70 active:scale-95 transition-apple cursor-pointer rounded-full"
                aria-label="Open Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[310px] p-0 flex flex-col apple-glass border-r border-border-light">
              <div className="p-6 border-b border-border-light/60 flex items-center justify-between">
                <BrandLogo size="sm" />
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-semibold font-ui transition-apple",
                      pathname === link.href
                        ? "bg-brand-primary/10 text-brand-primary font-bold"
                        : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-border-light/60 space-y-4">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-ui font-semibold text-text-secondary hover:text-text-primary rounded-xl hover:bg-bg-secondary transition-apple"
                >
                  <User className="h-4.5 w-4.5 text-brand-primary" />
                  <span>My Account</span>
                </Link>
                <Link
                  href="/policies/damage-return"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  Damage & Return Policy
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Brand Logo */}
        <div className="flex-1 flex justify-center md:justify-start md:flex-initial">
          <BrandLogo size="sm" />
        </div>

        {/* Desktop Navigation - Apple Minimalist */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isCombo = link.href === "/combo";
            const isActive = pathname === link.href;

            if (isCombo) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-brand-primary text-white font-ui font-bold text-xs px-4 py-2 rounded-full hover:bg-brand-primary-hover shadow-sm hover:shadow-md active:scale-95 transition-apple flex items-center gap-1.5 ml-2 cursor-pointer"
                >
                  <span>{link.label}</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono font-normal">₹999</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-semibold font-ui transition-apple px-3 py-1.5 rounded-full cursor-pointer tracking-tight",
                  isActive
                    ? "text-text-primary bg-bg-secondary font-bold"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary/60"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Triggers - Apple Icon Pills */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Link
            href="/search"
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full active:scale-95 transition-apple cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>

          <Link
            href="/wishlist"
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full active:scale-95 transition-apple relative cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart className="h-4.5 w-4.5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-brand-accent text-white text-[9px] flex items-center justify-center font-bold font-ui shadow-xs animate-pulse">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/account"
            className="hidden sm:inline-flex p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full active:scale-95 transition-apple cursor-pointer"
            aria-label="Account"
          >
            <User className="h-4.5 w-4.5" />
          </Link>

          <Link
            href="/cart"
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full active:scale-95 transition-apple relative cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {cartGroupsCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-brand-primary text-white text-[9px] flex items-center justify-center font-bold font-ui shadow-xs">
                {cartGroupsCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
export default SiteHeader;
