import Link from "next/link";
import { BrandLogo } from "../commerce/brand-logo";
import { siteConfig } from "@/config/site";
import { Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-border-light font-body mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4">
            <BrandLogo size="sm" />
            <p className="text-xs text-text-secondary leading-relaxed">
              India's first dedicated Mix & Match fashion combo store. Create your customized fashion combo with men's and women's collections, all for a flat ₹999 base price.
            </p>
            <div className="flex space-x-4 text-text-secondary">
              <Link href={siteConfig.socialLinks.facebook} className="hover:text-brand-primary">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </Link>
              <Link href={siteConfig.socialLinks.instagram} className="hover:text-brand-primary">
                <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Link>
              <Link href={siteConfig.socialLinks.twitter} className="hover:text-brand-primary">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
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
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/men" className="hover:text-brand-primary">Men's Catalog</Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-brand-primary">Women's Catalog</Link>
              </li>
              <li>
                <Link href="/combo" className="hover:text-brand-primary font-semibold text-brand-primary">Combo Builder</Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="hover:text-brand-primary">New Arrivals</Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-brand-primary">Special Offers</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/track-order" className="hover:text-brand-primary font-semibold">Track Order</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-primary">FAQ & Help</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-primary">Contact Us</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-primary">About Our Concept</Link>
              </li>
            </ul>
          </div>

          {/* Policies & Safety */}
          <div>
            <h3 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider mb-4">
              Store Policies
            </h3>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/policies/shipping" className="hover:text-brand-primary">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/policies/cod" className="hover:text-brand-primary">COD & Advance Policy</Link>
              </li>
              <li>
                <Link href="/policies/damage-return" className="hover:text-brand-primary font-semibold text-red-600">Damage Claims (Unboxing Required)</Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-brand-primary">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-brand-primary">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-current" /> in India. &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center space-x-3 text-text-muted select-none">
            <span className="border border-border-light px-1.5 py-0.5 rounded text-[10px]">UPI</span>
            <span className="border border-border-light px-1.5 py-0.5 rounded text-[10px]">CARDS</span>
            <span className="border border-border-light px-1.5 py-0.5 rounded text-[10px]">COD (20% Advance)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default SiteFooter;
