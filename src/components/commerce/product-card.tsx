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
import { useRouter } from "next/navigation";

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [quickViewOpen, setQuickViewOpen] = React.useState(false);
  const [variantModalOpen, setVariantModalOpen] = React.useState(false);
  const [comboSelectOpen, setComboSelectOpen] = React.useState(false);

  // Stores
  const { activeCombo } = useActiveComboDetails();
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

    if (!activeCombo) {
      // 1. Open combo selection modal
      setComboSelectOpen(true);
      return;
    }

    // 2. Open variant selection modal
    setVariantModalOpen(true);
  };

  const handleSelectComboTier = (config: any) => {
    startCombo(config);
    setComboSelectOpen(false);
    toast.success(`Started building your ${config.name}!`);
    // Then open variant selector for the item
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
    <div className={cn("group flex flex-col justify-between rounded-card border border-border-light bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full min-w-0 w-full", className)}>
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5] bg-bg-secondary overflow-hidden shrink-0">
        {/* Badges - Hidden/Simplified on Mobile */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1">
          {product.newArrival && (
            <Badge className="bg-brand-primary border-transparent text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2">
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 fill-current" />
              NEW
            </Badge>
          )}
          {product.trending && (
            <Badge variant="accent" className="text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 hidden sm:inline-flex">
              <Flame className="h-3 w-3 mr-1 fill-current" />
              TRENDING
            </Badge>
          )}
          {product.comboEligible && (
            <Badge variant="success" className="text-[8px] sm:text-[10px] py-0.5 px-1.5 sm:px-2 hidden md:inline-flex">
              COMBO ELIGIBLE
            </Badge>
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full shadow-sm bg-white/80 hover:bg-white active:scale-90 transition-all cursor-pointer border border-border-light",
            isWishlisted ? "text-red-500 fill-current" : "text-text-secondary hover:text-red-500"
          )}
          aria-label="Toggle Wishlist"
        >
          <Heart className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
        </button>

        {/* Front image */}
        <Image
          src={displayFront}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          onError={() => setFrontError(true)}
          unoptimized={frontImage?.startsWith("data:") || false}
        />
        {/* Back image */}
        <Image
          src={displayBack}
          alt={`${product.name} alternate view`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          onError={() => setBackError(true)}
          unoptimized={backImage?.startsWith("data:") || false}
        />

        {/* Video indicator */}
        {hasVideo && (
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/60 text-white rounded-full p-1 sm:p-1.5 flex items-center justify-center pointer-events-none">
            <Video className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </div>
        )}
      </Link>

      {/* Info & CTA details */}
      <div className="p-2 sm:p-4 flex flex-col justify-between flex-1 min-w-0 w-full">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center justify-between text-[9px] sm:text-xs">
            <span className="uppercase font-bold text-text-muted tracking-wider truncate max-w-[70%] hidden sm:inline-block">
              {product.subcategory}
            </span>
            <span className="text-text-secondary flex items-center gap-0.5 font-semibold sm:ml-auto shrink-0">
              ★ {product.rating}
            </span>
          </div>
          <Link href={`/products/${product.slug}`} className="block hover:text-brand-primary">
            <h3 className="font-heading font-semibold text-xs sm:text-sm text-text-primary line-clamp-2 min-h-[2rem] sm:min-h-0 sm:truncate">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Colors & Sizes count - Hidden/Simplified on Mobile */}
        <div className="hidden sm:flex items-center justify-between text-xs text-text-secondary mt-1">
          <div className="flex gap-1.5 items-center">
            {colors.slice(0, 3).map((col) => (
              <span
                key={col.name}
                className={cn("h-3 w-3 rounded-full border border-border-medium block cursor-pointer", {
                  "ring-1 ring-brand-primary": selectedColor === col.name,
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
              <span className="text-[9px] text-text-muted font-bold">+{colors.length - 3}</span>
            )}
          </div>
          <span className="text-[10px] text-text-muted shrink-0">
            {availableSizes.length} sizes available
          </span>
        </div>

        {/* Mobile size/color line */}
        <div className="sm:hidden text-[10px] text-text-muted mt-1 leading-tight font-medium">
          {availableSizes.length} sizes · {colors.length} colors
        </div>

        {/* Pricing / Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 mt-2 border-t border-border-light gap-2 shrink-0">
          <div className="flex flex-col hidden sm:flex">
            <span className="text-[9px] font-extrabold text-brand-primary uppercase tracking-wider leading-none">
              ₹999 COMBO
            </span>
            <span className="text-[8px] uppercase font-bold text-text-muted mt-1 leading-none">
              Eligible Style
            </span>
          </div>
          <div className="flex gap-1.5 w-full sm:w-auto">
            <Button size="sm" variant="outline" className="h-7 sm:h-8 px-2 cursor-pointer flex-1 sm:flex-none justify-center" onClick={() => setQuickViewOpen(true)}>
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" className="h-7 sm:h-8 px-3 gap-1 cursor-pointer font-bold uppercase tracking-wider text-[10px] flex-grow sm:flex-none justify-center" onClick={handleAddAction}>
              <Plus className="h-3 w-3" />
              <span>Add</span>
            </Button>
          </div>
        </div>
      </div>

    {/* ====================================================
          1. MODAL: COMBO TIER SELECTION (If no active combo)
          ==================================================== */}
      <Dialog open={comboSelectOpen} onOpenChange={setComboSelectOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Your Combo Size</DialogTitle>
            <DialogDescription>
              To add products, you first need to choose a combo size. Any combo tier currently costs a base price of **₹999**.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {comboConfigs.map((config) => (
              <button
                key={config.id}
                onClick={() => handleSelectComboTier(config)}
                className="w-full text-left flex items-center justify-between p-4 border border-border-light hover:border-brand-primary rounded-card hover:bg-brand-primary-soft transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="font-heading font-bold text-sm text-text-primary">{config.name}</h4>
                  <p className="text-xs text-text-secondary">{config.description}</p>
                </div>
                <span className="font-heading font-bold text-brand-primary">₹999</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ====================================================
          2. MODAL: VARIANT SELECTION (If combo is active)
          ==================================================== */}
      <Dialog open={variantModalOpen} onOpenChange={setVariantModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Style & Size</DialogTitle>
            <DialogDescription>
              Choose a color and size before adding **{product.shortName}** to your {activeCombo?.comboName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Color Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                Color: {selectedColor}
              </label>
              <div className="flex gap-2">
                {colors.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => {
                      setSelectedColor(col.name);
                      setSelectedSize(null); // Reset size on color change
                    }}
                    className={cn(
                      "p-1 rounded-full border border-border-light transition-all cursor-pointer",
                      selectedColor === col.name ? "ring-2 ring-brand-primary" : "hover:scale-105"
                    )}
                  >
                    <span className="block h-6 w-6 rounded-full" style={{ backgroundColor: col.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                Size: {selectedSize || "Select size"}
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
                        "h-10 px-4 rounded-control border text-xs font-semibold font-heading transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none",
                        selectedSize === sz
                          ? "border-brand-primary bg-brand-primary-soft text-brand-primary"
                          : "border-border-light bg-transparent hover:bg-bg-secondary text-text-secondary"
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
              <div className="text-xs font-semibold">
                {isVariantAvailable(selectedVariant) ? (
                  <span className="text-emerald-700">✓ In Stock ({selectedVariant.stock} available)</span>
                ) : (
                  <span className="text-red-600">✗ Out of Stock</span>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 border-t border-border-light pt-4">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={handleConfirmAdd} disabled={!selectedSize || !selectedVariant || !isVariantAvailable(selectedVariant)}>
              Add to Combo
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ====================================================
          3. MODAL: QUICK VIEW DIALOG
          ==================================================== */}
      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogDescription>Code: {product.productCode} | Brand: {product.subcategory}</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="relative aspect-[3/4] bg-bg-secondary rounded-card overflow-hidden">
              <Image src={frontImage} alt={product.name} fill className="object-cover" unoptimized />
            </div>
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs text-brand-primary font-bold font-heading bg-brand-primary-soft px-2.5 py-0.5 rounded-full">
                  Combo Eligible
                </span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {product.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs border-y border-border-light py-3 text-text-secondary">
                  <div><strong>Fabric:</strong> {product.fabric}</div>
                  <div><strong>Fit:</strong> {product.fit}</div>
                  <div><strong>Pattern:</strong> {product.pattern}</div>
                  {product.sleeve && <div><strong>Sleeve:</strong> {product.sleeve}</div>}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted">Combo Price</span>
                  <span className="text-xl font-bold font-heading text-brand-primary">₹999</span>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 cursor-pointer" onClick={(e) => { setQuickViewOpen(false); handleAddAction(e); }}>
                    Add to Combo
                  </Button>
                  <Button variant="outline" className="cursor-pointer" onClick={() => { setQuickViewOpen(false); router.push(`/products/${product.slug}`); }}>
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
