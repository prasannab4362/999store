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
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border-light py-2"
          : "bg-white border-b border-border-light py-4"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Mobile Hamburger (radix-sheet) */}
        <div className="flex md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 -ml-2 text-text-primary hover:opacity-80 active:scale-95 cursor-pointer"
                aria-label="Open Menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
              <div className="p-6 border-b border-border-light">
                <BrandLogo size="sm" />
              </div>
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-control text-sm font-semibold font-heading transition-colors",
                      pathname === link.href
                        ? "bg-brand-primary-soft text-brand-primary"
                        : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-border-light space-y-4">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm font-heading font-semibold text-text-secondary hover:text-text-primary"
                >
                  <User className="h-5 w-5 text-brand-primary" />
                  <span>My Account</span>
                </Link>
                <Link
                  href="/policies/damage-return"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center text-xs text-text-muted hover:underline"
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navLinks.map((link) => {
            const isCombo = link.href === "/combo";
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-semibold font-heading transition-all duration-200 py-1.5 cursor-pointer",
                  isCombo
                    ? "bg-brand-primary text-white px-3.5 py-1.5 rounded-full hover:bg-brand-primary-hover shadow-sm active:scale-95 flex items-center gap-1"
                    : pathname === link.href
                    ? "text-brand-primary"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                <span>{link.label}</span>
                {!isCombo && pathname === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Triggers */}
        <div className="flex items-center space-x-3">
          <Link
            href="/search"
            className="p-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>

          <Link
            href="/wishlist"
            className="p-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform relative cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 h-4.5 w-4.5 rounded-full bg-brand-accent text-white text-[9px] flex items-center justify-center font-bold font-heading shadow-sm animate-pulse">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/account"
            className="hidden sm:inline-flex p-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform cursor-pointer"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            className="p-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform relative cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartGroupsCount > 0 && (
              <span className="absolute top-0 right-0 h-4.5 w-4.5 rounded-full bg-brand-primary text-white text-[9px] flex items-center justify-center font-bold font-heading shadow-sm">
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
