"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { comboConfigs, ComboConfig } from "@/config/combo";
import { useComboStore } from "@/stores/combo-store";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

import { useCartStore } from "@/stores/cart-store";

interface CategoryEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetCategory: "men" | "women";
}

export function CategoryEntryDialog({
  open,
  onOpenChange,
  targetCategory,
}: CategoryEntryDialogProps) {
  const router = useRouter();
  const activeCombo = useComboStore((state) => state.activeCombo);
  const startCombo = useComboStore((state) => state.startCombo);
  const resetCombo = useComboStore((state) => state.resetCombo);
  const addComboGroup = useCartStore((state) => state.addComboGroup);

  const activeCategory = activeCombo?.selectedCategory;
  const isOppositeCategory = activeCombo && activeCategory && activeCategory !== targetCategory;

  const filledItems = React.useMemo(() => {
    if (!activeCombo) return [];
    return activeCombo.slots.map((s) => s.item).filter((item): item is NonNullable<typeof item> => item !== null);
  }, [activeCombo]);

  const selectedCount = filledItems.length;
  const isComplete = activeCombo ? selectedCount === activeCombo.itemLimit : false;

  const [confirmSwitchOpen, setConfirmSwitchOpen] = React.useState(false);
  const [selectTierOpen, setSelectTierOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setConfirmSwitchOpen(false);
      setSelectTierOpen(false);
      return;
    }

    if (activeCombo) {
      // Prompt user about active combo (whether same or opposite category)
      setConfirmSwitchOpen(true);
      setSelectTierOpen(false);
    } else {
      setSelectTierOpen(true);
      setConfirmSwitchOpen(false);
    }
  }, [open, activeCombo, onOpenChange]);

  const handleContinueCurrentCombo = () => {
    onOpenChange(false);
    setConfirmSwitchOpen(false);

    if (activeCombo) {
      useComboStore.setState({
        activeCombo: {
          ...activeCombo,
          selectedCategory: targetCategory,
        },
      });
    }

    if (activeCombo) {
      router.push(`/combo/${activeCombo.comboSlug}?gender=${targetCategory}`);
    } else {
      router.push(`/products?gender=${targetCategory}`);
    }
  };

  const handleStartNewComboPrompt = () => {
    if (!activeCombo) {
      setConfirmSwitchOpen(false);
      setSelectTierOpen(true);
      return;
    }

    // 1. If active combo is completed: Save it permanently to Cart!
    if (isComplete) {
      const result = addComboGroup({
        comboId: activeCombo.comboId,
        comboSlug: activeCombo.comboSlug,
        comboName: activeCombo.comboName,
        itemLimit: activeCombo.itemLimit,
        basePriceMinor: activeCombo.basePriceMinor,
        items: filledItems,
      });

      if (result.success) {
        toast.success(`Saved your completed ${activeCombo.comboName} to Cart!`);
      }
      resetCombo();
      setConfirmSwitchOpen(false);
      setSelectTierOpen(true);
      return;
    }

    // 2. If active combo is incomplete: User explicitly confirmed to start new combo
    resetCombo();
    setConfirmSwitchOpen(false);
    setSelectTierOpen(true);
  };

  const handleCancelPrompt = () => {
    setConfirmSwitchOpen(false);
    onOpenChange(false);
  };

  const handleSelectTier = (config: ComboConfig) => {
    // Activate combo with selected category intent
    startCombo(config, targetCategory);
    onOpenChange(false);
    setSelectTierOpen(false);
    toast.success(`Activated ${config.name}! Opening ${targetCategory.toUpperCase()}'S catalog...`);

    // Automatically transition to combo builder with target category
    router.push(`/combo/${config.slug}?gender=${targetCategory}`);
  };

  return (
    <>
      {/* 1. CONFIRMATION DIALOG: Start a New Combo / Active Combo in Progress */}
      <Dialog open={confirmSwitchOpen} onOpenChange={(val) => { setConfirmSwitchOpen(val); if (!val) onOpenChange(false); }}>
        <DialogContent className="max-w-md font-body">
          <DialogHeader>
            <DialogTitle className="font-heading font-semibold text-xl text-text-primary tracking-tight">
              Start a New Combo?
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary pt-1 leading-relaxed font-ui">
              {isComplete ? (
                <>
                  Your current <strong className="text-text-primary">{activeCombo?.comboName}</strong> is complete! Starting a new combo will automatically save your completed combo to your Cart.
                </>
              ) : selectedCount > 0 ? (
                <>
                  You have an unfinished combo (<strong className="text-text-primary">{selectedCount}/{activeCombo?.itemLimit} items selected</strong>). Starting a new combo will discard your current progress. Do you want to continue?
                </>
              ) : (
                <>
                  You have an active combo (<strong className="text-text-primary">{activeCombo?.comboName}</strong>). Starting a new combo will replace it.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2.5">
            <Button
              className="w-full h-12 font-semibold text-xs tracking-wide cursor-pointer rounded-xl bg-[#1D1D1F] text-white hover:bg-[#2C2C2E] transition-all"
              onClick={handleContinueCurrentCombo}
            >
              Continue Current Combo ({activeCategory?.toUpperCase() || targetCategory.toUpperCase()})
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 font-semibold text-xs tracking-wide border-border-medium text-text-primary hover:bg-bg-secondary cursor-pointer rounded-xl transition-all"
              onClick={handleStartNewComboPrompt}
            >
              Start New Combo
            </Button>
            <Button
              variant="ghost"
              className="w-full h-10 font-medium text-xs text-text-muted hover:text-text-primary cursor-pointer transition-all"
              onClick={handleCancelPrompt}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. MANDATORY COMBO SELECTION DIALOG */}
      <Dialog open={selectTierOpen} onOpenChange={(val) => { setSelectTierOpen(val); if (!val) onOpenChange(false); }}>
        <DialogContent className="max-w-md font-body">
          <DialogHeader>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[11px] font-semibold tracking-wider uppercase mb-1 w-fit">
              Step 1 of 2
            </div>
            <DialogTitle className="font-heading font-semibold text-xl text-text-primary tracking-tight">
              Please select your combo first to continue.
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary pt-1 leading-relaxed font-ui">
              Select a tier size for <strong className="text-text-primary">{targetCategory.toUpperCase()}'S</strong> collection. All tiers feature a flat <strong className="text-[#D4AF37]">₹999</strong> base price.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2.5 py-4">
            {comboConfigs.map((config) => (
              <button
                key={config.id}
                onClick={() => handleSelectTier(config)}
                className="w-full text-left flex items-center justify-between p-4 border border-border-medium/60 hover:border-[#D4AF37]/60 hover:bg-[#FAF7F0] rounded-[var(--radius-card)] transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-heading font-semibold text-sm text-text-primary group-hover:text-black">
                      {config.name}
                    </h4>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-bg-secondary text-text-muted border border-border-light">
                      {config.badge}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary font-ui">{config.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <span className="font-heading font-semibold text-[#D4AF37] text-base tabular-nums">₹999</span>
                  <ArrowRight className="h-4 w-4 text-[#D4AF37] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
