import Link from "next/link";
import { BrandLogo } from "../commerce/brand-logo";
import { siteConfig } from "@/config/site";
import { Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#F5F5F7] border-t border-border-light font-body mt-auto text-text-primary">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-12">
        {/* Apple-style Policy Feature Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 border-b border-border-light/80">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 border border-white/80 shadow-xs">
            <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary shrink-0">
              <span className="font-heading font-extrabold text-sm">20%</span>
            </div>
            <div className="space-y-0.5">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wide">COD 20% Advance</h4>
              <p className="text-[11px] text-text-secondary leading-snug">Pay 20% upfront to confirm COD orders. Remaining paid upon delivery.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 border border-white/80 shadow-xs">
            <div className="p-2.5 rounded-xl bg-brand-accent/10 text-brand-accent shrink-0">
              <span className="font-heading font-extrabold text-sm">📹</span>
            </div>
            <div className="space-y-0.5">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wide">Unboxing Video Required</h4>
              <p className="text-[11px] text-text-secondary leading-snug">Continuous unboxing video mandatory for damage claims or wrong items.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 border border-white/80 shadow-xs">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
              <span className="font-heading font-extrabold text-sm">₹999</span>
            </div>
            <div className="space-y-0.5">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wide">Flat ₹999 Base Price</h4>
              <p className="text-[11px] text-text-secondary leading-snug">Mix any styles in 2, 3, 5, 8 or 10 picks. Courier charges billed separately.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4">
            <BrandLogo size="sm" />
            <p className="text-xs text-text-secondary leading-relaxed font-ui">
              India's first dedicated Mix & Match fashion combo store. Create your customized fashion combo with men's and women's collections, all for a flat ₹999 base price.
            </p>
            <div className="flex space-x-4 text-text-muted">
              <Link href={siteConfig.socialLinks.facebook} className="hover:text-brand-primary transition-colors">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </Link>
              <Link href={siteConfig.socialLinks.instagram} className="hover:text-brand-primary transition-colors">
                <svg className="h-4.5 w-4.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Link>
              <Link href={siteConfig.socialLinks.twitter} className="hover:text-brand-primary transition-colors">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider mb-4">
              Shop Collections
            </h3>
            <ul className="space-y-2.5 text-xs text-text-secondary font-ui">
              <li>
                <Link href="/men" className="hover:text-text-primary transition-colors">Men's Catalog</Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-text-primary transition-colors">Women's Catalog</Link>
              </li>
              <li>
                <Link href="/combo" className="hover:text-brand-primary font-bold text-brand-primary transition-colors">Combo Builder →</Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="hover:text-text-primary transition-colors">New Arrivals</Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-text-primary transition-colors">Special Offers</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-xs text-text-secondary font-ui">
              <li>
                <Link href="/track-order" className="hover:text-text-primary font-semibold transition-colors">Track Order</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-text-primary transition-colors">FAQ & Help</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-text-primary transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-text-primary transition-colors">About Our Concept</Link>
              </li>
            </ul>
          </div>

          {/* Policies & Safety */}
          <div>
            <h3 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider mb-4">
              Store Policies
            </h3>
            <ul className="space-y-2.5 text-xs text-text-secondary font-ui">
              <li>
                <Link href="/policies/shipping" className="hover:text-text-primary transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/policies/cod" className="hover:text-text-primary transition-colors">COD & 20% Advance</Link>
              </li>
              <li>
                <Link href="/policies/damage-return" className="hover:text-red-600 font-semibold text-red-500 transition-colors">Damage Claims (Unboxing Video)</Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-text-primary transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border-light/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-ui">
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-current" /> in India. &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-text-muted select-none font-mono">
            <span className="border border-border-light bg-white px-2 py-0.5 rounded-md text-[10px] shadow-2xs">UPI</span>
            <span className="border border-border-light bg-white px-2 py-0.5 rounded-md text-[10px] shadow-2xs">CARDS</span>
            <span className="border border-border-light bg-white px-2 py-0.5 rounded-md text-[10px] shadow-2xs">COD (20% ADVANCE)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default SiteFooter;
