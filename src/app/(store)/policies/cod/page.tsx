import Link from "next/link";
import { Info, HelpCircle, ShieldAlert, ArrowLeft } from "lucide-react";

export default function CodPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 font-body">
      {/* Title & Back */}
      <div className="flex items-center gap-3 border-b border-border-light pb-4">
        <Link href="/" className="p-2 -ml-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
            COD & Advance Payment Policy
          </h1>
          <p className="text-xs text-text-secondary">
            Understand how our 20% COD advance payment scheme works.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
        {/* Why this policy? */}
        <div className="bg-brand-primary-soft/10 border border-brand-primary/20 rounded-promo p-5 space-y-3">
          <h3 className="font-heading font-extrabold text-base text-brand-primary flex items-center gap-2">
            <Info className="h-5 w-5" />
            <span>Why is there a 20% Advance Payment?</span>
          </h3>
          <p>
            To prevent fraudulent orders, fake COD purchases, and delivery refusal (which results in heavy returns costs), we require a **20% advance payment** for Cash on Delivery. This helps us ensure that only serious buyers place orders.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-sm uppercase tracking-wider">
            1. How is the 20% calculated?
          </h3>
          <p>
            The 20% advance payment is computed strictly on:
          </p>
          <div className="bg-bg-secondary p-3 rounded-card border border-border-light font-mono text-xs text-center text-text-primary my-2">
            COD Advance = 20% × (Combo Subtotal - Coupon Discount)
          </div>
          <p>
            Note that **shipping/courier charges are excluded** from the 20% calculation basis.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-heading font-bold text-text-primary text-sm uppercase tracking-wider">
            2. Payment Flow
          </h3>
          <ul className="list-decimal pl-5 space-y-1">
            <li>Choose **COD** payment option on checkout page.</li>
            <li>Pay the 20% advance amount immediately via UPI or online cards.</li>
            <li>We confirm and dispatch the package.</li>
            <li>Pay the remaining 80% balance + courier charges in cash at delivery.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
