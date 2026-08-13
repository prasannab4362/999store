"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { BrandLogo } from "../commerce/brand-logo";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useActiveComboDetails } from "@/stores/combo-store";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { CategoryEntryDialog } from "../commerce/category-entry-dialog";

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

  const [entryDialogOpen, setEntryDialogOpen] = React.useState(false);
  const [targetCategory, setTargetCategory] = React.useState<"men" | "women">("men");

  // Zustand counts
  const cartGroupsCount = useCartStore((state) => (state.isHydrated ? state.comboGroups.length : 0));
  const wishlistCount = useWishlistStore((state) => (state.isHydrated ? state.items.length : 0));
  const { activeCombo, selectedCount, remainingCount, isComplete } = useActiveComboDetails();

  const handleCategoryNavClick = (e: React.MouseEvent, category: "men" | "women") => {
    // If activeCombo exists and target category is opposite of active combo's category
    if (activeCombo && activeCombo.selectedCategory && activeCombo.selectedCategory !== category) {
      e.preventDefault();
      setTargetCategory(category);
      setEntryDialogOpen(true);
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    // Trigger once on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-500 ease-[var(--ease-apple)]">
      <div
        className={cn(
          "mx-auto transition-all duration-500 ease-[var(--ease-apple)]",
          isScrolled ? "max-w-7xl px-3 sm:px-6 lg:px-8 py-2" : "w-full"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] mx-auto bg-[rgba(255,255,255,0.78)] backdrop-blur-[18px] border-b border-[rgba(0,0,0,0.06)]",
            isScrolled
              ? "shadow-sm rounded-full px-5 sm:px-6 py-2 scale-[0.98]"
              : "px-5 sm:px-6 lg:px-10 py-3.5 max-w-[1280px]"
          )}
        >
          {/* Mobile Hamburger (radix-sheet) */}
          <div className="flex md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2.5 -ml-2 text-text-primary hover:opacity-60 rounded-full active:scale-95 transition-premium cursor-pointer"
                  aria-label="Open Menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
                <div className="p-6 border-b border-border-medium/40">
                  <BrandLogo size="sm" />
                </div>
                <nav className="flex-1 px-5 py-8 space-y-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "block px-4 py-3.5 rounded-xl text-[15px] font-medium font-ui transition-premium",
                          isActive
                            ? "bg-bg-secondary text-text-primary"
                            : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="p-6 border-t border-border-medium/40 space-y-4">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-ui font-medium text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-premium"
                  >
                    <User className="h-5 w-5 text-text-muted" />
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
          <nav className="hidden md:flex items-center space-x-1 relative">
            {navLinks.map((link) => {
              const isCombo = link.href === "/combo";
              const isActive = pathname === link.href;

              if (isCombo) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative z-10 ml-3 text-brand-accent hover:text-brand-accent-hover px-4 py-2 text-[13px] font-semibold font-ui transition-premium flex items-center"
                  >
                    {link.label}
                  </Link>
                );
              }

              const isMen = link.href === "/men";
              const isWomen = link.href === "/women";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (isMen) handleCategoryNavClick(e, "men");
                    if (isWomen) handleCategoryNavClick(e, "women");
                  }}
                  className={cn(
                    "relative z-10 px-4 py-2 text-[12px] font-medium font-ui tracking-[-0.011em] transition-all duration-300 rounded-full antialiased normal-case hover:bg-[rgba(0,0,0,0.04)]",
                    isActive ? "text-text-primary font-semibold" : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="header-active-underline"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-brand-accent rounded-full"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Triggers */}
          <div className="flex items-center space-x-0.5 sm:space-x-1">
            {activeCombo ? (
              <Link
                href={`/combo/${activeCombo.comboSlug}`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-secondary border border-border-medium/50 text-xs font-ui font-medium text-text-primary hover:bg-border-light transition-premium mr-1"
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", isComplete ? "bg-emerald-500" : "bg-brand-accent animate-pulse")} />
                <span>Combo: {selectedCount}/{activeCombo.itemLimit}</span>
                {isComplete ? (
                  <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold tracking-wider ml-0.5">Full</span>
                ) : (
                  <span className="text-[10px] text-text-muted font-normal ml-0.5">({remainingCount} left)</span>
                )}
              </Link>
            ) : (
              <Link
                href="/combo"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1D1D1F] text-white text-xs font-ui font-semibold hover:bg-[#2C2C2E] transition-premium mr-1 border border-[#D4AF37]/40 shadow-xs"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span>Select Package</span>
              </Link>
            )}

            <Link
              href="/search"
              className="p-2.5 text-text-secondary hover:text-text-primary rounded-full active:scale-95 transition-premium group"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px] transition-transform duration-300" />
            </Link>

            <Link
              href="/wishlist"
              className="p-2.5 text-text-secondary hover:text-text-primary rounded-full active:scale-95 transition-premium group relative"
              aria-label="Wishlist"
            >
              <Heart className="h-[18px] w-[18px] transition-transform duration-300" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 h-4 w-4 rounded-full bg-brand-accent text-white text-[9px] flex items-center justify-center font-semibold font-ui"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            <Link
              href="/account"
              className="hidden sm:inline-flex p-2.5 text-text-secondary hover:text-text-primary rounded-full active:scale-95 transition-premium group"
              aria-label="Account"
            >
              <User className="h-[18px] w-[18px] transition-transform duration-300" />
            </Link>

            <Link
              href="/admin"
              className="hidden lg:inline-flex p-2 text-[#D4AF37] hover:text-amber-500 rounded-full active:scale-95 transition-premium group"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <ShieldCheck className="h-[18px] w-[18px] transition-transform duration-300" />
            </Link>

            <Link
              href="/cart"
              className="p-2.5 text-text-secondary hover:text-text-primary rounded-full active:scale-95 transition-premium group relative"
              aria-label="Cart"
            >
              <ShoppingBag className="h-[18px] w-[18px] transition-transform duration-300" />
              {cartGroupsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 h-4 w-4 rounded-full bg-text-primary text-white text-[9px] flex items-center justify-center font-semibold font-ui"
                >
                  {cartGroupsCount}
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </div>
      <CategoryEntryDialog
        open={entryDialogOpen}
        onOpenChange={setEntryDialogOpen}
        targetCategory={targetCategory}
      />
    </header>
  );
}
export default SiteHeader;
