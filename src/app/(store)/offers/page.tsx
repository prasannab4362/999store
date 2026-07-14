"use client";

import { Tag, Copy, Check } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const offers = [
    {
      code: "WELCOME50",
      title: "WELCOME PACK DISCOUNT",
      description: "Get flat ₹50.00 off on your first order. Applicable on all combo tiers.",
      terms: "Valid once per customer session. Subtotal must exceed ₹999.",
    },
    {
      code: "COMBO99",
      title: "PREMIUM TIER DISCOUNT",
      description: "Get flat ₹99.00 off when you build combos. Applies instantly during checkout.",
      terms: "Can not be combined with other offers.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 font-body">
      <div className="text-center max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
          Exclusive Offers
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Use coupon codes at checkout to save extra on your fashion combo packs. Click to copy and save!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {offers.map((offer) => (
          <div
            key={offer.code}
            className="rounded-promo border border-dashed border-brand-primary/40 bg-brand-primary-soft/10 p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold font-heading bg-brand-primary text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                  <Tag className="h-3 w-3 fill-current" />
                  COUPON CODE
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-lg text-text-primary uppercase tracking-wide">
                  {offer.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">{offer.description}</p>
              </div>
              <p className="text-[10px] text-text-muted italic">{offer.terms}</p>
            </div>

            {/* Code container */}
            <div className="flex items-center justify-between bg-white border border-border-light rounded-control p-3 gap-4">
              <span className="font-mono font-bold text-brand-primary text-base tracking-widest">{offer.code}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(offer.code)}
                className="h-8 gap-1.5 font-heading font-bold text-xs uppercase"
              >
                {copiedCode === offer.code ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
