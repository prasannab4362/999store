"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useComboStore, useActiveComboDetails } from "@/stores/combo-store";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { PolicyNotice } from "@/components/commerce/policy-notice";
import { Trash2, AlertTriangle, ArrowLeft, ShoppingCart, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export default function ComboReviewPage() {
  const params = useParams();
  const router = useRouter();
  const comboSlug = params.comboSlug as string;

  const { activeCombo, selectedCount, remainingCount, isComplete } = useActiveComboDetails();
  const removeItem = useComboStore((state) => state.removeItem);
  const resetCombo = useComboStore((state) => state.resetCombo);
  const addComboGroup = useCartStore((state) => state.addComboGroup);
  const replaceComboGroup = useCartStore((state) => state.replaceComboGroup);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!activeCombo) {
      router.push(`/combo/${comboSlug}`);
    }
  }, [activeCombo, comboSlug, router]);

  if (!activeCombo) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 font-body">
        <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <div className="h-4 w-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
          Loading Combo details...
        </div>
      </div>
    );
  }

  const handleCancelEditing = () => {
    useComboStore.setState({ activeCombo: null });
    toast.info("Editing cancelled. Your original combo in the cart remains unchanged.");
    router.push("/cart");
  };

  const handleAddToCart = () => {
    if (!isComplete || isSubmitting) {
      if (!isComplete) {
        toast.error(`Please select ${remainingCount} more item${remainingCount > 1 ? "s" : ""} to complete your combo.`);
      }
      return;
    }

    setIsSubmitting(true);

    const selectedItems = activeCombo.slots
      .map((s) => s.item)
      .filter((item): item is typeof item & object => item !== null);

    const cartItems = selectedItems.map((item) => ({
      lineId: item.lineId,
      productId: item.productId,
      productSlug: item.productSlug,
      productName: item.productName,
      productCode: item.productCode,
      variantId: item.variantId,
      sku: item.sku,
      colorName: item.colorName,
      colorHex: item.colorHex,
      size: item.size,
      image: item.image,
    }));

    const comboData = {
      comboId: activeCombo.comboId,
      comboSlug: activeCombo.comboSlug,
      comboName: activeCombo.comboName,
      itemLimit: activeCombo.itemLimit,
      basePriceMinor: activeCombo.basePriceMinor,
      items: cartItems,
    };

    const result = activeCombo.editingGroupId
      ? replaceComboGroup(activeCombo.editingGroupId, comboData)
      : addComboGroup(comboData);

    if (result.success) {
      toast.success(
        activeCombo.editingGroupId
          ? "Updated combo in your shopping cart!"
          : "Added combo group to your shopping cart!"
      );
      useComboStore.setState({ activeCombo: null });
      router.push("/cart");
    } else {
      toast.error(result.error || "Failed to save combo to cart.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 font-body min-h-[80vh]">

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[24px] bg-white border border-[rgba(0,0,0,0.06)] p-6 sm:p-8 mb-8 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/combo/${comboSlug}`}
              className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-all active:scale-95 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] font-ui mb-2">Combo Review</p>
              <h1 className="text-3xl sm:text-4xl font-semibold font-heading text-text-primary tracking-tight uppercase">
                {activeCombo.editingGroupId ? "Edit Combo Selections" : "Review Your Combo"}
              </h1>
              <p className="text-sm font-ui text-text-secondary mt-1">
                {activeCombo.editingGroupId
                  ? "Modify selections before saving back to cart."
                  : "Check all details below before adding to cart."}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            {activeCombo.editingGroupId ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEditing}
                className="cursor-pointer text-[10px] font-black uppercase tracking-widest border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400"
              >
                Cancel Editing
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={resetCombo}
                className="cursor-pointer text-[10px] font-black uppercase tracking-widest"
              >
                Reset All
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            <span>{selectedCount} of {activeCombo.itemLimit} items selected</span>
            {isComplete && <span className="text-emerald-600">All slots filled ✓</span>}
          </div>
          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((selectedCount / activeCombo.itemLimit) * 100)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Validation Warning */}
      <AnimatePresence>
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border border-amber-300/40 bg-amber-50 p-4 flex gap-3 text-xs text-amber-900 mb-6"
          >
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <p className="font-black font-heading text-amber-800 text-sm mb-0.5">Combo Incomplete</p>
              <p className="leading-relaxed">
                Your {activeCombo.comboName} requires exactly {activeCombo.itemLimit} items.
                You have selected {selectedCount}. Go back to fill the remaining {remainingCount} slot{remainingCount > 1 ? "s" : ""}.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="space-y-4 mb-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold font-heading text-text-primary">Order Summary</h2>
        </div>

        <div className="space-y-3">
          {activeCombo.slots.map((slot, idx) => (
            <motion.div
              key={slot.slotId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.05, duration: 0.3 }}
              className={cn(
                "p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all",
                slot.item
                  ? "bg-white border-neutral-100 shadow-sm"
                  : "bg-neutral-50 border-dashed border-neutral-200"
              )}
            >
              {slot.item ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-12 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 shadow-sm">
                      <Image src={slot.item.image} alt={slot.item.productName} fill sizes="48px" className="object-cover" />
                      <span className="absolute top-1 left-1 bg-black/60 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-heading font-black text-sm text-text-primary leading-snug">{slot.item.productName}</h4>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-text-secondary font-ui">
                        <span className="flex items-center gap-1.5">
                          <span className="h-3 w-3 rounded-full border border-neutral-200 shadow-sm block shrink-0" style={{ backgroundColor: slot.item.colorHex }} />
                          {slot.item.colorName}
                        </span>
                        <span className="bg-neutral-100 px-1.5 py-0.5 rounded-md border border-neutral-200">
                          Size: <strong className="text-text-primary">{slot.item.size}</strong>
                        </span>
                        <span className="text-text-muted font-mono text-[9px]">SKU: {slot.item.sku}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(slot.slotId)}
                    className="text-text-muted hover:text-red-500 p-2.5 rounded-xl hover:bg-red-50 border border-transparent active:scale-90 transition-all cursor-pointer shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-between w-full text-text-muted text-xs py-1">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full border-2 border-dashed border-neutral-200 bg-white flex items-center justify-center font-heading font-black text-[10px] text-text-muted">
                      {idx + 1}
                    </span>
                    <span className="text-text-muted font-ui">Empty slot — no style selected</span>
                  </div>
                  <Link href={`/combo/${comboSlug}`} className="text-brand-primary font-black hover:underline text-[10px] uppercase tracking-widest">
                    + Select Item
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pricing & Add to Cart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="rounded-[24px] bg-white border border-[rgba(0,0,0,0.06)] p-6 sm:p-8 space-y-6 shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Price Row */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
          <div>
            <h4 className="font-heading font-black text-sm text-text-primary uppercase tracking-widest">Base Combo Price</h4>
            <p className="text-[10px] text-text-secondary mt-1 font-ui">Includes all {activeCombo.itemLimit} selected pieces</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted mb-1 font-ui">Base Price</span>
            <span className="text-3xl sm:text-4xl font-heading font-semibold text-text-primary tracking-tight">₹999</span>
          </div>
        </div>

        {/* Policy Notice */}
        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4">
          <PolicyNotice variant="alert" />
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={!isComplete || isSubmitting}
            className={cn(
              "w-full h-14 rounded-full font-semibold uppercase tracking-widest text-[15px] transition-all duration-300",
              isComplete && !isSubmitting
                ? "bg-[#1D1D1F] text-white hover:-translate-y-[2px] active:scale-95 shadow-sm hover:shadow-md"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Adding to Cart...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                <span>
                  {isComplete ? (activeCombo.editingGroupId ? "Save Combo Changes" : "Confirm & Add to Cart") : `${remainingCount} Picks Remaining`}
                </span>
              </>
            )}
          </Button>
          <p className="text-[10px] text-white/30 text-center font-ui leading-relaxed">
            *Adding to cart locks your selections as an immutable snapshot. You can build another combo pack subsequently.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
