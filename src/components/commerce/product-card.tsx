"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Sparkles, Flame, Eye, Video, Check } from "lucide-react";
import { Product, ProductVariant, isVariantAvailable } from "@/types/product";
import { cn } from "@/lib/utils/cn";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useComboStore, useActiveComboDetails } from "@/stores/combo-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import { comboConfigs } from "@/config/combo";
import { formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine current page/category context (Men or Women) from route or searchParams
  const currentCategory = React.useMemo(() => {
    const genderParam = searchParams ? searchParams.get("gender") : null;
    if (genderParam === "men" || genderParam === "women") {
      return genderParam;
    }
    if (pathname?.includes("/men")) return "men";
    if (pathname?.includes("/women")) return "women";
    return undefined;
  }, [pathname, searchParams]);

  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [quickViewOpen, setQuickViewOpen] = React.useState(false);
  const [variantModalOpen, setVariantModalOpen] = React.useState(false);
  const [comboSelectOpen, setComboSelectOpen] = React.useState(false);

  // Stores
  const { activeCombo, isComplete } = useActiveComboDetails();
  const startCombo = useComboStore((state) => state.startCombo);
  const addItem = useComboStore((state) => state.addItem);

  const isWishlisted = useWishlistStore((state) =>
    state.isHydrated ? state.items.includes(product.slug) : false
  );
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  // Colors list
  const colors = React.useMemo(() => {
    const unique: Record<string, string> = {};
    product.variants.forEach((v) => {
      unique[v.color.name] = v.color.hex;
    });
    return Object.entries(unique).map(([name, hex]) => ({ name, hex }));
  }, [product.variants]);

  // Set default color
  React.useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0].name);
    }
  }, [colors, selectedColor]);

  // Sizes for selected color
  const availableSizes = React.useMemo(() => {
    if (!selectedColor) return [];
    return product.variants
      .filter((v) => v.color.name === selectedColor && v.enabled)
      .map((v) => v.size);
  }, [product.variants, selectedColor]);

  // Selected variant details
  const selectedVariant = React.useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return product.variants.find(
      (v) => v.color.name === selectedColor && v.size === selectedSize
    );
  }, [product.variants, selectedColor, selectedSize]);

  // Front & Back Images
  const frontImage = product.media.find((m) => m.viewType === "front")?.url || product.media[0]?.url;
  const backImage = product.media.find((m) => m.viewType === "back")?.url || frontImage;
  const hasVideo = product.media.some((m) => m.viewType === "video");

  // Fallback state — if local asset 404s, revert to SVG placeholder
  const [frontError, setFrontError] = React.useState(false);
  const [backError, setBackError] = React.useState(false);

  const displayFront = frontError
    ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="100%" height="100%" fill="%23FFF9F4"/><text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="%236D28D9" text-anchor="middle" dominant-baseline="middle">${product.shortName}</text></svg>`
    : frontImage;
  const displayBack = backError
    ? displayFront
    : backImage;

  const handleAddAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isComplete) {
      toast.error("Your combo is already full! Please review it in the combo builder.");
      return;
    }

    if (!activeCombo) {
      // 1. Open combo selection modal
      setComboSelectOpen(true);
      return;
    }

    // 2. Open variant selection modal
    setVariantModalOpen(true);
  };

  const handleSelectComboTier = (config: any) => {
    startCombo(config, currentCategory);
    setComboSelectOpen(false);
    toast.success(`Started building your ${config.name}!`);
    if (pathname?.startsWith("/combo/")) {
      router.push(`/combo/${config.slug}`);
    }
    // Then open variant selector for user confirmation
    setVariantModalOpen(true);
  };

  const handleConfirmAdd = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select a color and size.");
      return;
    }

    if (!selectedVariant) {
      toast.error("Variant not found.");
      return;
    }

    if (!isVariantAvailable(selectedVariant)) {
      toast.error("Selected size/color combination is out of stock.");
      return;
    }

    const result = addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productCode: product.productCode,
      variantId: selectedVariant.id,
      sku: selectedVariant.sku,
      colorName: selectedColor,
      colorHex: selectedVariant.color.hex,
      size: selectedSize as any,
      image: frontImage,
    });

    if (result.success) {
      toast.success(`Added ${product.shortName} (${selectedSize} / ${selectedColor}) to your combo!`);
      setVariantModalOpen(false);
      setSelectedSize(null);
    } else {
      if (result.error === "COMBO_FULL") {
        toast.error("Your combo is already full! Please review it in the builder.");
      } else {
        toast.error(`Could not add item: ${result.error}`);
      }
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.slug);
    toast.success(
      isWishlisted
        ? `Removed ${product.shortName} from wishlist.`
        : `Added ${product.shortName} to wishlist.`
    );
  };

  return (
    <div className={cn("group flex flex-col justify-between rounded-[24px] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-[4px] h-full min-w-0 w-full", className)}>
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] bg-bg-secondary overflow-hidden shrink-0 rounded-t-[24px]">
        
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex flex-col gap-1.5">
          {product.newArrival && (
            <Badge className="bg-[#1D1D1F]/80 backdrop-blur-xl text-white border-transparent text-[9px] px-2 py-0.5 font-medium tracking-wide">
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              New
            </Badge>
          )}
          {product.trending && (
            <Badge variant="accent" className="bg-[#D4AF37] text-[#1D1D1F] border-transparent text-[9px] px-2 py-0.5 font-medium tracking-wide hidden sm:inline-flex">
              <Flame className="h-2.5 w-2.5 mr-1" />
              Trending
            </Badge>
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 p-2 sm:p-2.5 rounded-full bg-white/80 backdrop-blur-xl hover:bg-white active:scale-95 transition-premium cursor-pointer shadow-[var(--shadow-sm)]",
            isWishlisted ? "text-red-500" : "text-text-muted hover:text-red-500"
          )}
          aria-label="Toggle Wishlist"
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* Front image */}
        <Image
          src={displayFront}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 group-hover:opacity-0"
          onError={() => setFrontError(true)}
          unoptimized={frontImage?.startsWith("data:") || false}
        />
        {/* Back image */}
        <Image
          src={displayBack}
          alt={`${product.name} alternate view`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover absolute inset-0 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 group-hover:opacity-100"
          onError={() => setBackError(true)}
          unoptimized={backImage?.startsWith("data:") || false}
        />

        {/* Video indicator */}
        {hasVideo && (
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/50 backdrop-blur-md text-white rounded-full p-1.5 sm:p-2 flex items-center justify-center pointer-events-none shadow-[var(--shadow-sm)]">
            <Video className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </div>
        )}
      </Link>

      {/* Info & CTA details */}
      <div className="p-3.5 sm:p-5 flex flex-col justify-between flex-1 min-w-0 w-full bg-white z-10">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-normal font-ui text-text-muted truncate max-w-[70%]">
              {product.brandName || "999 Edit"}
            </span>
            <span className="text-text-muted flex items-center gap-0.5 text-[11px] shrink-0">
              ★ {product.rating}
            </span>
          </div>
          <Link href={`/products/${product.slug}`} className="block hover:text-text-secondary transition-colors">
            <h3 className="font-ui font-semibold text-[17px] text-text-primary line-clamp-2 min-h-[2.5rem] sm:min-h-0 sm:truncate tracking-[-0.015em] leading-[1.5] antialiased">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Colors & Sizes count */}
        <div className="hidden sm:flex items-center justify-between text-xs text-text-secondary mt-3 font-ui">
          <div className="flex gap-1.5 items-center">
            {colors.slice(0, 3).map((col) => (
              <span
                key={col.name}
                className={cn("h-4 w-4 rounded-full border block cursor-pointer transition-transform hover:scale-110", {
                  "ring-1 ring-text-primary ring-offset-1 border-transparent": selectedColor === col.name,
                  "border-border-medium": selectedColor !== col.name
                })}
                style={{ backgroundColor: col.hex }}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(col.name);
                }}
                title={col.name}
              />
            ))}
            {colors.length > 3 && (
              <span className="text-[10px] text-text-muted font-normal ml-1">+{colors.length - 3}</span>
            )}
          </div>
          <span className="text-[11px] font-ui font-medium text-text-muted shrink-0">
            {availableSizes.length} Sizes
          </span>
        </div>

        {/* Mobile size/color line */}
        <div className="sm:hidden text-[10px] text-text-muted mt-2 leading-tight font-ui font-medium">
          {availableSizes.length} Sizes · {colors.length} Colors
        </div>

        {/* Pricing / Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 mt-3 border-t border-border-medium/40 gap-3 shrink-0">
          <div className="flex flex-col">
            <span className="text-xs font-semibold font-ui text-[#D4AF37] bg-[#FAF7F0] px-2 py-0.5 rounded-md border border-[#D4AF37]/30 w-fit">
              Combo Item
            </span>
            <span className="text-[10px] text-text-muted mt-1 leading-none font-normal">
              Tier {product.comboTierIds?.map(t => t.replace("combo-", "")).join(", ") || "All"}
            </span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button size="sm" variant="outline" className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg border-border-medium/60 text-text-muted hover:text-text-primary hover:bg-bg-secondary cursor-pointer flex-1 sm:flex-none justify-center transition-premium group/eye" onClick={() => setQuickViewOpen(true)}>
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover/eye:scale-105 transition-transform" />
            </Button>
            <Button
              size="sm"
              disabled={isComplete}
              className={cn(
                "h-9 sm:h-10 px-5 sm:px-6 gap-1.5 font-semibold font-ui text-[14px] rounded-full flex-grow sm:flex-none justify-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group/add hover:-translate-y-[2px] hover:scale-[1.02]",
                isComplete
                  ? "bg-bg-secondary text-text-muted cursor-not-allowed"
                  : "bg-[#1D1D1F] text-white hover:bg-[#2C2C2E] shadow-sm cursor-pointer"
              )}
              onClick={handleAddAction}
            >
              {isComplete ? (
                <span>Full</span>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 group-hover/add:rotate-90 transition-transform duration-300" />
                  <span>Add</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

    {/* ====================================================
          1. MODAL: COMBO TIER SELECTION (If no active combo)
          ==================================================== */}
      <Dialog open={comboSelectOpen} onOpenChange={setComboSelectOpen}>
        <DialogContent className="max-w-md font-body">
          <DialogHeader>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[11px] font-semibold tracking-wider uppercase mb-1 w-fit">
              Step 1 of 2
            </div>
            <DialogTitle className="font-heading font-semibold text-xl text-text-primary tracking-tight">Please select your combo first to continue.</DialogTitle>
            <DialogDescription className="text-sm text-text-secondary pt-1 leading-relaxed font-ui">
              To add products, please select a combo first. All tiers share a flat base price of <strong>₹999</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            {comboConfigs.map((config) => (
              <button
                key={config.id}
                onClick={() => handleSelectComboTier(config)}
                className="w-full text-left flex items-center justify-between p-4 bg-bg-secondary hover:bg-bg-tertiary rounded-xl transition-all cursor-pointer group"
              >
                <div>
                  <h4 className="font-heading font-semibold text-sm text-text-primary">{config.name}</h4>
                  <p className="text-[13px] text-text-secondary mt-0.5">{config.description}</p>
                </div>
                <span className="font-heading font-semibold text-[#D4AF37] text-base">₹999</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ====================================================
          2. MODAL: VARIANT SELECTION (If combo is active)
          ==================================================== */}
      <Dialog open={variantModalOpen} onOpenChange={setVariantModalOpen}>
        <DialogContent className="max-w-md font-body">
          <DialogHeader>
            <DialogTitle className="font-heading font-semibold text-lg text-text-primary tracking-tight">Select Style & Size</DialogTitle>
            <DialogDescription className="text-sm text-text-secondary pt-1 leading-relaxed">
              Choose a color and size before adding <strong>{product.shortName}</strong> to your {activeCombo?.comboName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            {/* Color Select */}
            <div className="space-y-2.5">
              <label className="text-xs font-medium text-text-primary block">
                Color: <span className="text-text-secondary">{selectedColor}</span>
              </label>
              <div className="flex gap-2">
                {colors.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => {
                      setSelectedColor(col.name);
                      setSelectedSize(null);
                    }}
                    className={cn(
                      "p-1 rounded-full border transition-all cursor-pointer",
                      selectedColor === col.name ? "ring-2 ring-[#D4AF37] ring-offset-1 border-[#D4AF37]/50" : "border-[#E8E0D0] hover:scale-105"
                    )}
                  >
                    <span className="block h-6 w-6 rounded-full" style={{ backgroundColor: col.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Select */}
            <div className="space-y-2.5">
              <label className="text-xs font-medium text-text-primary block">
                Size: <span className="text-text-secondary">{selectedSize || "Select size"}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((sz) => {
                  const variant = product.variants.find(
                    (v) => v.color.name === selectedColor && v.size === sz
                  );
                  const isAvailable = variant ? isVariantAvailable(variant) : false;

                  return (
                    <button
                      key={sz}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSize(sz)}
                      className={cn(
                        "h-10 px-4 rounded-lg border text-xs font-medium font-ui transition-premium cursor-pointer disabled:opacity-40 disabled:pointer-events-none",
                        selectedSize === sz
                          ? "border-text-primary bg-text-primary text-white"
                          : "border-border-medium bg-transparent hover:bg-bg-secondary text-text-secondary"
                      )}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In Stock Badge */}
            {selectedVariant && (
              <div className="text-xs font-medium">
                {isVariantAvailable(selectedVariant) ? (
                  <span className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" /> In Stock ({selectedVariant.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">✗ Out of Stock</span>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 border-t border-border-medium/40 pt-4">
            <DialogClose asChild>
              <Button variant="ghost" className="font-medium text-sm text-text-secondary hover:text-text-primary">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleConfirmAdd}
              disabled={!selectedSize || !selectedVariant || !isVariantAvailable(selectedVariant)}
              className="bg-[#1D1D1F] text-white hover:bg-[#2C2C2E] font-medium text-sm shadow-[var(--shadow-sm)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Combo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ====================================================
          3. MODAL: QUICK VIEW DIALOG
          ==================================================== */}
      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent className="max-w-2xl font-body">
          <DialogHeader>
            <DialogTitle className="font-heading font-semibold text-lg text-text-primary tracking-tight">{product.name}</DialogTitle>
            <DialogDescription className="text-sm text-text-secondary">Code: {product.productCode} · {product.subcategory}</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="relative aspect-[3/4] bg-bg-secondary rounded-xl overflow-hidden">
              <Image src={frontImage} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[11px] text-[#D4AF37] font-medium bg-bg-secondary px-2.5 py-1 rounded-full inline-block">
                  Combo Eligible
                </span>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {product.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm border-y border-border-medium/40 py-3 text-text-secondary">
                  <div><strong className="text-text-primary font-medium">Fabric:</strong> {product.fabric}</div>
                  <div><strong className="text-text-primary font-medium">Fit:</strong> {product.fit}</div>
                  <div><strong className="text-text-primary font-medium">Pattern:</strong> {product.pattern}</div>
                  {product.sleeve && <div><strong className="text-text-primary font-medium">Sleeve:</strong> {product.sleeve}</div>}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs text-text-muted font-normal">Pricing</span>
                  <span className="text-sm font-semibold font-ui text-[#D4AF37]">Included in Combo Package</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 cursor-pointer bg-[#1D1D1F] text-white hover:bg-[#2C2C2E] font-medium text-sm shadow-[var(--shadow-sm)] transition-all"
                    onClick={(e) => { setQuickViewOpen(false); handleAddAction(e); }}
                  >
                    Add to Combo
                  </Button>
                  <Button
                    variant="outline"
                    className="cursor-pointer border-border-medium/60 hover:bg-bg-secondary font-medium text-sm transition-all"
                    onClick={() => { setQuickViewOpen(false); router.push(`/products/${product.slug}`); }}
                  >
                    Full Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
