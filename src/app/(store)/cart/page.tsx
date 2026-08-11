"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingBag, ArrowRight, Tag, X, Plus, ShieldCheck, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cart-store";
import { useComboStore } from "@/stores/combo-store";
import { calculateOrderTotals, formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const router = useRouter();
  const { comboGroups, coupon, removeComboGroup, applyCoupon, removeCoupon, clearCart, isHydrated } = useCartStore();

  const [couponInput, setCouponInput] = React.useState("");

  const totals = React.useMemo(() => {
    return calculateOrderTotals({
      comboGroups,
      coupon: coupon || undefined,
      shippingMinor: siteConfig.policies.defaultShippingChargeMinor,
      paymentMethod: "online",
    });
  }, [comboGroups, coupon]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === "WELCOME50") {
      applyCoupon({ code, discountAmountMinor: 5000 });
      toast.success("Coupon WELCOME50 applied! ₹50.00 discount.");
      setCouponInput("");
    } else if (code === "COMBO99") {
      applyCoupon({ code, discountAmountMinor: 9900 });
      toast.success("Coupon COMBO99 applied! ₹99.00 discount.");
      setCouponInput("");
    } else {
      toast.error("Invalid coupon code. Try WELCOME50 or COMBO99.");
    }
  };

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 font-body">
        <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <div className="h-4 w-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
          Loading your shopping cart...
        </div>
      </div>
    );
  }

  if (comboGroups.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] font-body">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[24px] bg-white border border-[rgba(0,0,0,0.06)] shadow-sm p-12 md:p-16 text-center space-y-8 max-w-2xl w-full"
        >
          <div className="h-24 w-24 mx-auto rounded-full bg-bg-secondary flex items-center justify-center text-5xl">
            🛍️
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-semibold font-heading text-text-primary tracking-tight uppercase">
              Your Cart Is Empty
            </h1>
            <p className="text-sm font-ui text-text-secondary leading-relaxed max-w-md mx-auto">
              You haven't added any luxury fashion combos yet. Start building your first personalized set to unlock flat ₹999 pricing!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="h-14 px-8 rounded-full font-semibold uppercase tracking-widest bg-brand-primary text-white hover:-translate-y-[2px] hover:shadow-md transition-all duration-300 active:scale-95"
              onClick={() => router.push("/combo")}
            >
              Build Your Combo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-full font-semibold uppercase tracking-widest text-text-primary hover:bg-bg-secondary transition-all active:scale-95"
              onClick={() => router.push("/products")}
            >
              Explore Styles
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 font-body min-h-[80vh]">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 gap-4">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] font-ui">Your Selection</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold font-heading text-text-primary tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm font-ui text-text-secondary flex items-center gap-2">
            Review your combo selections before securely checking out.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-[10px] text-text-muted hover:text-red-500 font-black uppercase tracking-widest font-ui cursor-pointer transition-colors self-start md:self-auto border border-transparent hover:border-red-100 hover:bg-red-50 px-3 py-2 rounded-lg"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-10 xl:gap-14 items-start">

        {/* Left: Combo Groups */}
        <div className="space-y-6 min-w-0">
          <AnimatePresence mode="popLayout">
            {comboGroups.map((group) => (
              <motion.div
                key={group.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[24px] border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-sm hover:shadow-md transition-all duration-[400ms] group/card relative overflow-hidden"
              >

                {/* Combo header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-[#E8E0D0] pb-5 mb-5 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-black text-xl text-text-primary uppercase tracking-wide">
                        {group.comboName}
                      </h3>
                      <span className="text-[10px] font-black font-ui bg-[#F5F0E8] border border-[#E8E0D0] text-text-secondary px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {group.itemLimit} items
                      </span>
                    </div>
                    <p className="text-[11px] font-ui text-text-muted">
                      Created {new Date(group.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                    <span className="font-heading font-black text-[#D4AF37] text-2xl tracking-tight">
                      {formatCurrency(group.basePriceMinor)}
                    </span>
                    <button
                      onClick={() => {
                        useComboStore.getState().loadComboForEditing(group);
                        toast.info(`Editing ${group.comboName}. Your original cart combo remains locked until saved.`);
                        router.push(`/combo/${group.comboSlug}`);
                      }}
                      className="inline-flex items-center gap-1.5 text-[10px] font-black font-ui text-text-secondary bg-bg-secondary hover:bg-border-light hover:text-text-primary px-3 py-2 rounded-full border border-transparent cursor-pointer transition-all"
                      title="Edit Combo"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        removeComboGroup(group.id);
                        toast.success("Combo removed from cart.");
                      }}
                      className="text-text-muted hover:text-red-500 p-2.5 rounded-xl border border-transparent hover:border-red-100 hover:bg-red-50 cursor-pointer transition-all hover:rotate-12"
                      aria-label="Remove Combo Group"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* Items grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {group.items.map((item, idx) => (
                    <div key={item.lineId} className="flex gap-3.5 bg-[#FAFAF9] p-3.5 rounded-xl border border-[#E8E0D0] hover:border-[#D4AF37]/30 hover:shadow-sm transition-all">
                      <div className="relative h-16 w-12 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E8E0D0] shadow-sm">
                        <Image src={item.image} alt={item.productName} fill sizes="48px" className="object-cover" />
                        <span className="absolute top-0.5 left-0.5 bg-black/60 text-white font-black text-[7px] h-4 w-4 rounded-full flex items-center justify-center">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="space-y-1 min-w-0 flex-1 flex flex-col justify-center">
                        <h4 className="font-heading font-black text-sm text-text-primary truncate">{item.productName}</h4>
                        <div className="text-[10px] font-ui text-text-secondary flex flex-wrap gap-2">
                          <span className="bg-white border border-[#E8E0D0] px-1.5 py-0.5 rounded-md">
                            Size: <strong className="text-text-primary">{item.size}</strong>
                          </span>
                          <span className="bg-white border border-[#E8E0D0] px-1.5 py-0.5 rounded-md">
                            Color: <strong className="text-text-primary">{item.colorName}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Another Combo */}
          <Link
            href="/combo"
            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[#D4AF37]/30 bg-[#FAFAF9] rounded-2xl py-10 text-sm font-black font-ui text-text-muted hover:bg-[#FBF8F0] hover:border-[#D4AF37]/60 hover:text-[#D4AF37] transition-all cursor-pointer group"
          >
            <div className="h-12 w-12 rounded-full bg-white border border-[#E8E0D0] shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:border-[#D4AF37]/40 transition-all">
              <Plus className="h-5 w-5" />
            </div>
            <span className="uppercase tracking-widest text-[11px]">Build Another Combo</span>
          </Link>
        </div>

        {/* Right: Order Summary */}
        <div className="sticky top-24">
          <div className="rounded-[24px] bg-white border border-[rgba(0,0,0,0.06)] p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 space-y-8">

            <div className="space-y-1">
              <h3 className="font-heading font-black text-xl text-text-primary uppercase tracking-widest">
                Order Summary
              </h3>
              <p className="text-[10px] font-black font-ui text-emerald-600 flex items-center gap-1.5 uppercase tracking-widest">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure Checkout
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-4 text-sm font-ui">
              <div className="flex justify-between items-center text-text-secondary">
                <span className="font-medium">Combo Subtotal</span>
                <span className="font-black text-text-primary font-heading text-base">{formatCurrency(totals.subtotalMinor)}</span>
              </div>

              {totals.discountMinor > 0 && (
                <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                  <span className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider">
                    <Tag className="h-4 w-4" />
                    {coupon?.code}
                  </span>
                  <span className="font-black font-heading text-base">-{formatCurrency(totals.discountMinor)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-text-secondary">
                <span className="font-medium">Standard Courier</span>
                <span className="font-black text-text-primary font-heading text-base">{formatCurrency(totals.shippingMinor)}</span>
              </div>

              <div className="border-t border-border-medium/30 pt-5 mt-2 flex justify-between items-end">
                <span className="font-heading font-black text-text-primary uppercase tracking-widest text-sm">Estimated Total</span>
                <span className="font-heading font-black text-text-primary text-3xl tracking-tight">{formatCurrency(totals.grandTotalMinor)}</span>
              </div>
            </div>

            {/* Coupon */}
            <form onSubmit={handleApplyCoupon} className="space-y-3 pt-2 border-t border-border-medium/30 font-ui">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block">
                Promo Code
              </label>
              {coupon ? (
                <div className="flex items-center justify-between bg-bg-secondary border border-transparent text-text-primary text-xs font-black px-4 py-3 rounded-xl">
                  <span className="flex items-center gap-2 tracking-wider uppercase">
                    <Tag className="h-4 w-4 opacity-70" />
                    {coupon.code} Applied
                  </span>
                  <button type="button" onClick={removeCoupon} className="p-1 hover:text-red-500 cursor-pointer transition-colors">
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
                    className="h-11 bg-bg-secondary border-transparent text-text-primary font-ui font-medium rounded-xl px-4 focus-visible:ring-black/5"
                  />
                  <Button type="submit" className="h-11 px-4 rounded-xl font-black uppercase tracking-widest cursor-pointer bg-bg-secondary hover:bg-border-light text-text-primary border-transparent transition-all active:scale-95 shadow-none hover:shadow-sm">
                    Apply
                  </Button>
                </div>
              )}
            </form>

            {/* Checkout CTA */}
            <div className="pt-2">
              <Button
                size="lg"
                className="w-full h-14 uppercase font-semibold text-[17px] font-ui rounded-full shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 active:scale-95 group flex items-center justify-center gap-3 cursor-pointer bg-brand-primary text-white"
                onClick={() => router.push("/checkout")}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Button>
              <p className="text-[10px] font-ui text-text-muted leading-relaxed text-center mt-4 max-w-[280px] mx-auto">
                *Delivery address & payment details will be collected on the next secure page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
