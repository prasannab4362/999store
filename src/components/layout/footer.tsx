"use client";

import Link from "next/link";
import { BrandLogo } from "../commerce/brand-logo";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="bg-[#F5F5F7] font-body mt-auto relative">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/5 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-14 lg:gap-10">

          {/* Brand Column */}
          <div className="md:col-span-4 space-y-5">
            <BrandLogo size="md" />
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm font-ui">
              India's first dedicated Mix & Match fashion combo store. Build your customized fashion combo for a flat ₹999 base price.
            </p>
            {/* Social links */}
            <div className="flex space-x-3 pt-2">
              <Link href={siteConfig.socialLinks.facebook} className="h-9 w-9 flex items-center justify-center rounded-full bg-black/5 text-text-secondary hover:bg-black/10 hover:text-text-primary transition-all duration-300">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </Link>
              <Link href={siteConfig.socialLinks.instagram} className="h-9 w-9 flex items-center justify-center rounded-full bg-black/5 text-text-secondary hover:bg-black/10 hover:text-text-primary transition-all duration-300">
                <svg className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Link>
              <Link href={siteConfig.socialLinks.twitter} className="h-9 w-9 flex items-center justify-center rounded-full bg-black/5 text-text-secondary hover:bg-black/10 hover:text-text-primary transition-all duration-300">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Nav Columns */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10">

            {/* Shop Links */}
            <div>
              <h3 className="text-xs font-semibold font-ui uppercase text-text-muted tracking-[0.12em] mb-6 antialiased">
                Shop Collections
              </h3>
              <ul className="space-y-3.5 text-[13px] font-ui text-text-secondary tracking-[-0.011em]">
                {[
                  { href: "/men", label: "Men's Catalog" },
                  { href: "/women", label: "Women's Catalog" },
                  { href: "/combo", label: "Combo Builder" },
                  { href: "/new-arrivals", label: "New Arrivals" },
                  { href: "/offers", label: "Special Offers" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-text-primary transition-colors duration-200 antialiased"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="text-xs font-semibold font-ui uppercase text-text-muted tracking-[0.12em] mb-6 antialiased">
                Customer Care
              </h3>
              <ul className="space-y-3.5 text-[13px] font-ui text-text-secondary tracking-[-0.011em]">
                {[
                  { href: "/track-order", label: "Track Order" },
                  { href: "/faq", label: "FAQ & Help" },
                  { href: "/contact", label: "Contact Us" },
                  { href: "/about", label: "About Our Concept" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-text-primary transition-colors duration-200 antialiased"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-xs font-semibold font-ui uppercase text-text-muted tracking-[0.12em] mb-6 antialiased">
                Store Policies
              </h3>
              <ul className="space-y-3.5 text-sm font-ui text-text-secondary">
                {[
                  { href: "/policies/shipping", label: "Shipping Policy" },
                  { href: "/policies/cod", label: "COD & Advance" },
                  { href: "/policies/damage-return", label: "Damage Claims" },
                  { href: "/policies/privacy", label: "Privacy Policy" },
                  { href: "/policies/terms", label: "Terms & Conditions" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-text-muted font-ui">
          <div className="flex flex-col sm:flex-row items-center gap-4 order-2 md:order-1">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.clear();
                  window.location.href = "/";
                }
              }}
              className="text-[10px] font-medium uppercase tracking-widest text-red-400 hover:text-red-500 hover:underline cursor-pointer transition-colors"
              title="Clear all stored demo cart, active combos, and session data"
            >
              Reset Data
            </button>
          </div>
          <div className="flex items-center gap-4 order-1 md:order-2 text-text-secondary text-[12px]">
            <span>UPI</span>
            <span className="text-black/10">·</span>
            <span>Cards</span>
            <span className="text-black/10">·</span>
            <span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default SiteFooter;
