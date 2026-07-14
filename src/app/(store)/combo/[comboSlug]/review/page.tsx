"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useComboStore, useActiveComboDetails } from "@/stores/combo-store";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { PolicyNotice } from "@/components/commerce/policy-notice";
import { Trash2, AlertTriangle, ArrowLeft, ShoppingCart, Shield } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ComboReviewPage() {
  const params = useParams();
  const router = useRouter();
  const comboSlug = params.comboSlug as string;

  const { activeCombo, selectedCount, remainingCount, isComplete } = useActiveComboDetails();
  const removeItem = useComboStore((state) => state.removeItem);
  const resetCombo = useComboStore((state) => state.resetCombo);
  const addComboGroup = useCartStore((state) => state.addComboGroup);

  // Redirect to builder if no active combo
  React.useEffect(() => {
    if (!activeCombo) {
      router.push(`/combo/${comboSlug}`);
    }
  }, [activeCombo, comboSlug, router]);

  if (!activeCombo) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 font-body">
        <p className="text-sm text-text-secondary">Loading Combo details...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isComplete) {
      toast.error(`Please select ${remainingCount} more item${remainingCount > 1 ? "s" : ""} to complete your combo.`);
      return;
    }

    // Extract non-null items for snapshot
    const selectedItems = activeCombo.slots
      .map((s) => s.item)
      .filter((item): item is typeof item & object => item !== null);

    // Map items to CartComboItemSnapshot structure
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

    // Add to cart
    addComboGroup({
      comboId: activeCombo.comboId,
      comboSlug: activeCombo.comboSlug,
      comboName: activeCombo.comboName,
      itemLimit: activeCombo.itemLimit,
      basePriceMinor: activeCombo.basePriceMinor,
      items: cartItems,
    });

    toast.success("Added combo group to your shopping cart!");
    
    // Clear active combo builder so the customer can start another one if they want
    useComboStore.setState({ activeCombo: null });
    
    router.push("/cart");
  };

  const selectedItems = activeCombo.slots.filter((s) => s.item !== null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-body">
      {/* Title & Back Link */}
      <div className="flex items-center justify-between border-b border-border-light pb-4">
        <div className="flex items-center gap-3">
          <Link href={`/combo/${comboSlug}`} className="p-2 -ml-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
              REVIEW YOUR COMBO
            </h1>
            <p className="text-xs text-text-secondary">
              Review details below before committing to your shopping cart.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={resetCombo} className="cursor-pointer">
          Reset All
        </Button>
      </div>

      {/* Validation warning */}
      {!isComplete && (
        <div className="rounded-card border border-amber-200 bg-amber-50 p-4 flex gap-3 text-xs text-amber-900 leading-normal">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold font-heading text-amber-800">Combo is Incomplete</p>
            <p>Your {activeCombo.comboName} requires exactly **{activeCombo.itemLimit}** items. You have selected **{selectedCount}** items. Please click the back arrow to fill the remaining slots before checking out.</p>
          </div>
        </div>
      )}

      {/* Selected Items Detail list */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold font-heading uppercase text-text-primary tracking-wider">
          Selected Items ({selectedCount} of {activeCombo.itemLimit})
        </h3>
        
        <div className="divide-y divide-border-light border border-border-light rounded-promo bg-white overflow-hidden shadow-sm">
          {activeCombo.slots.map((slot) => (
            <div key={slot.slotId} className="p-4 flex items-center justify-between gap-4">
              {slot.item ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-12 rounded-card overflow-hidden bg-bg-secondary border border-border-light shrink-0">
                      <img src={slot.item.image} alt={slot.item.productName} className="object-cover w-full h-full" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading font-semibold text-sm text-text-primary">
                        {slot.item.productName}
                      </h4>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <span className="h-2.5 w-2.5 rounded-full border border-border-medium block" style={{ backgroundColor: slot.item.colorHex }} />
                          {slot.item.colorName}
                        </span>
                        <span>Size: <strong>{slot.item.size}</strong></span>
                        <span className="text-[10px] text-text-muted font-mono">SKU: {slot.item.sku}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(slot.slotId)}
                    className="text-text-muted hover:text-red-500 p-2 active:scale-90 transition-transform cursor-pointer shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-between w-full text-text-muted text-xs py-2 italic">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full border border-dashed border-border-medium bg-bg-secondary flex items-center justify-center font-heading font-bold not-italic">
                      {slot.position}
                    </span>
                    <span>Empty slot — no style selected</span>
                  </div>
                  <Link href={`/combo/${comboSlug}`} className="text-brand-primary font-bold hover:underline not-italic">
                    + Select Item
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pricing and checkout CTA */}
      <div className="rounded-promo bg-bg-secondary border border-border-light p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border-light pb-4">
          <div>
            <h4 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wide">Base Combo Price</h4>
            <p className="text-[10px] text-text-muted">Includes all selected clothes</p>
          </div>
          <span className="text-2xl font-extrabold font-heading text-brand-primary">₹999.00</span>
        </div>

        {/* Policies alert */}
        <PolicyNotice variant="alert" />

        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={!isComplete}
            className="w-full h-12 uppercase font-bold tracking-wider gap-2 cursor-pointer"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Add Combo to Cart</span>
          </Button>
          <p className="text-[10px] text-text-muted text-center">
            *Adding to cart locks your selections as an immutable snapshot. You can build another combo pack subsequently.
          </p>
        </div>
      </div>
    </div>
  );
}
