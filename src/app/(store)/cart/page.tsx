"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingBag, ArrowRight, Tag, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cart-store";
import { calculateOrderTotals, formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const { comboGroups, coupon, removeComboGroup, applyCoupon, removeCoupon, clearCart, isHydrated } = useCartStore();

  const [couponInput, setCouponInput] = React.useState("");

  // Calculate totals
  const totals = React.useMemo(() => {
    return calculateOrderTotals({
      comboGroups,
      coupon: coupon || undefined,
      shippingMinor: siteConfig.policies.defaultShippingChargeMinor, // ₹120 standard
      paymentMethod: "online", // default placeholder for cart view
    });
  }, [comboGroups, coupon]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();

    if (!code) return;

    if (code === "WELCOME50") {
      applyCoupon({ code, discountAmountMinor: 5000 }); // ₹50 off
      toast.success("Coupon WELCOME50 applied! ₹50.00 discount.");
      setCouponInput("");
    } else if (code === "COMBO99") {
      applyCoupon({ code, discountAmountMinor: 9900 }); // ₹99 off
      toast.success("Coupon COMBO99 applied! ₹99.00 discount.");
      setCouponInput("");
    } else {
      toast.error("Invalid coupon code. Try WELCOME50 or COMBO99.");
    }
  };

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 font-body">
        <p className="text-sm text-text-secondary">Loading your shopping cart...</p>
      </div>
    );
  }

  if (comboGroups.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4 space-y-6 font-body">
        <div className="text-5xl">🛍️</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
            Your Cart Is Empty
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            You don't have any fashion combo packs in your cart yet. Build your first combo to get items at flat ₹999 base price!
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full uppercase font-bold tracking-wide" onClick={() => router.push("/combo")}>
            Build Your Combo
          </Button>
          <Button size="lg" variant="outline" className="w-full" onClick={() => router.push("/products")}>
            Explore Styles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-body">
      <div className="flex items-center justify-between border-b border-border-light pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
            SHOPPING CART
          </h1>
          <p className="text-xs text-text-secondary">
            Manage your combo packs and proceed to checkout.
          </p>
        </div>
        <button onClick={clearCart} className="text-xs text-text-muted hover:text-red-500 font-semibold cursor-pointer">
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Left Column: Combo groups list */}
        <div className="space-y-6">
          {comboGroups.map((group) => (
            <div key={group.id} className="rounded-promo border border-border-light bg-white p-6 shadow-sm space-y-6 relative group/card">
              <div className="flex items-start justify-between border-b border-border-light pb-4">
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-text-primary uppercase">
                    {group.comboName}
                  </h3>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {group.itemLimit} items | Created {new Date(group.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-heading font-extrabold text-brand-primary text-lg">
                    {formatCurrency(group.basePriceMinor)}
                  </span>
                  <button
                    onClick={() => {
                      removeComboGroup(group.id);
                      toast.success("Combo group removed from cart.");
                    }}
                    className="text-text-muted hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 cursor-pointer"
                    aria-label="Remove Combo Group"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              {/* Items grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {group.items.map((item, idx) => (
                  <div key={item.lineId} className="flex gap-3 bg-bg-secondary/40 p-3 rounded-card border border-border-light/50">
                    <div className="relative h-14 w-10 rounded-sm overflow-hidden bg-bg-secondary shrink-0 border border-border-light">
                      <img src={item.image} alt={item.productName} className="object-cover w-full h-full" />
                    </div>
                    <div className="text-[11px] space-y-0.5 min-w-0">
                      <span className="text-[9px] uppercase font-bold text-brand-primary tracking-wide">Item {idx + 1}</span>
                      <h4 className="font-heading font-semibold text-text-primary truncate">{item.productName}</h4>
                      <div className="text-text-secondary flex flex-wrap gap-x-2">
                        <span>Sz: <strong>{item.size}</strong></span>
                        <span>Col: <strong>{item.colorName}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Add Another Combo Pack Trigger */}
          <Link href="/combo" className="flex items-center justify-center gap-2 border border-dashed border-border-medium rounded-promo py-6 text-sm font-semibold font-heading text-brand-primary hover:bg-brand-primary-soft/30 hover:border-brand-primary transition-all cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>Build Another Combo Pack</span>
          </Link>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-bg-secondary p-6 rounded-card border border-border-light shadow-sm space-y-6">
          <h3 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs text-text-secondary">
            <div className="flex justify-between">
              <span>Combo Subtotal:</span>
              <span className="font-semibold text-text-primary">{formatCurrency(totals.subtotalMinor)}</span>
            </div>
            {totals.discountMinor > 0 && (
              <div className="flex justify-between text-brand-primary font-semibold">
                <span className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  Discount ({coupon?.code}):
                </span>
                <span>-{formatCurrency(totals.discountMinor)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Courier Charges:</span>
              <span className="font-semibold text-text-primary">{formatCurrency(totals.shippingMinor)}</span>
            </div>
            <div className="border-t border-border-light pt-3 flex justify-between font-heading font-extrabold text-sm text-text-primary">
              <span>Estimated Total:</span>
              <span className="text-brand-primary text-base">{formatCurrency(totals.grandTotalMinor)}</span>
            </div>
          </div>

          {/* Coupon Entry */}
          <form onSubmit={handleApplyCoupon} className="space-y-2 border-t border-border-light pt-4 font-body">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-primary block">
              Apply Coupon Code
            </label>
            {coupon ? (
              <div className="flex items-center justify-between bg-brand-primary-soft text-brand-primary text-xs font-semibold px-3 py-2 rounded-control">
                <span className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  {coupon.code} Applied
                </span>
                <button type="button" onClick={removeCoupon} className="p-1 hover:text-brand-primary-hover cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="WELCOME50 or COMBO99"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="h-9 bg-white"
                />
                <Button type="submit" size="sm" className="h-9 px-4 cursor-pointer">
                  Apply
                </Button>
              </div>
            )}
          </form>

          {/* Checkout CTA */}
          <Button
            size="lg"
            className="w-full h-11 uppercase font-bold tracking-wider gap-2 cursor-pointer mt-4"
            onClick={() => router.push("/checkout")}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="text-[10px] text-text-muted leading-relaxed text-center">
            *Final delivery addresses and advance cash collection policies will be requested on the checkout page.
          </div>
        </div>
      </div>
    </div>
  );
}
