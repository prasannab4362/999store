import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 font-body">
      {/* Title & Back */}
      <div className="flex items-center gap-3 border-b border-border-light pb-4">
        <Link href="/" className="p-2 -ml-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-text-secondary">
            Read store guidelines, purchase bounds, and order terms.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        <div className="bg-brand-primary-soft/10 border border-brand-primary/20 rounded-promo p-5 space-y-2">
          <h3 className="font-heading font-extrabold text-base text-brand-primary flex items-center gap-2">
            <Scale className="h-5 w-5" />
            <span>Store Terms Agreement</span>
          </h3>
          <p>
            By using the 999 Combo Store application and placing orders, you explicitly agree to our terms of service, separate courier charges, Cash on Delivery commitment advances, and unboxing verification rules.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-sm uppercase tracking-wider">
            1. Pricing & Calculations
          </h3>
          <p>
            All prices listed on the storefront are flat combo subtotal rates of **₹999**. Financial amounts are calculated internally in minor units (paise) to prevent any floating-point mathematical rounding discrepancies. Courier charges are billed separately during checkout.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-sm uppercase tracking-wider">
            2. Customer Responsibilities
          </h3>
          <p>
            When utilizing Cash on Delivery, the client is responsible for paying the 20% commitment advance immediately. Orders will not be dispatched prior to advance authorization. The remaining 80% balance plus courier charges must be paid in full at delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
