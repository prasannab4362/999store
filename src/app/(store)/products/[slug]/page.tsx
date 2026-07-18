"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Heart, Plus, Video, Play, ShieldAlert, BadgeCheck, HelpCircle, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { products } from "@/data/mock/products";
import { isVariantAvailable } from "@/types/product";
import { useComboStore, useActiveComboDetails } from "@/stores/combo-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";
import { SizeGuideDialog } from "@/components/commerce/size-guide-dialog";
import { PolicyNotice } from "@/components/commerce/policy-notice";
import { ProductCard } from "@/components/commerce/product-card";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { comboConfigs } from "@/config/combo";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const product = React.useMemo(() => products.find((p) => p.slug === slug), [slug]);

  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [activeMediaId, setActiveMediaId] = React.useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = React.useState(false);
  const [comboSelectOpen, setComboSelectOpen] = React.useState(false);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  // Stores
  const { activeCombo } = useActiveComboDetails();
  const startCombo = useComboStore((state) => state.startCombo);
  const addItem = useComboStore((state) => state.addItem);
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addRecentlyViewed);

  const isWishlisted = useWishlistStore((state) =>
    state.isHydrated ? state.items.includes(slug) : false
  );
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  // Track recently viewed
  React.useEffect(() => {
    if (product) {
      addRecentlyViewed(product.slug);
    }
  }, [product, addRecentlyViewed]);

  // Set default color/media when product changes
  React.useEffect(() => {
    if (product) {
      const colors = Array.from(new Set(product.variants.map((v) => v.color.name)));
      if (colors.length > 0) {
        setSelectedColor(colors[0]);
      }
      if (product.media.length > 0) {
        setActiveMediaId(product.media[0].id);
      }
      setSelectedSize(null);
    }
  }, [product]);

  // Colors list
  const colors = React.useMemo(() => {
    if (!product) return [];
    const unique: Record<string, string> = {};
    product.variants.forEach((v) => {
      unique[v.color.name] = v.color.hex;
    });
    return Object.entries(unique).map(([name, hex]) => ({ name, hex }));
  }, [product]);

  // Available sizes for selected color
  const availableSizes = React.useMemo(() => {
    if (!product || !selectedColor) return [];
    return product.variants
      .filter((v) => v.color.name === selectedColor && v.enabled)
      .map((v) => v.size);
  }, [product, selectedColor]);

  // Selected variant
  const selectedVariant = React.useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return null;
    return product.variants.find(
      (v) => v.color.name === selectedColor && v.size === selectedSize
    );
  }, [product, selectedColor, selectedSize]);

  // Recommendations
  const recommendedProducts = React.useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.gender === product.gender))
      .slice(0, 4);
  }, [product]);

  // Media references
  if (!product) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4 space-y-4 font-body">
        <h1 className="text-3xl font-extrabold font-heading text-text-primary">Product Not Found</h1>
        <p className="text-sm text-text-secondary">
          The style details you are looking for may have moved or are out of stock.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/products")}>Explore Catalog</Button>
          <Button variant="ghost" onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  // Media references
  const activeMedia = product.media.find((m) => m.id === activeMediaId) || product.media[0];

  const handleAddAction = () => {
    if (!activeCombo) {
      setComboSelectOpen(true);
      return;
    }

    if (!selectedColor || !selectedSize) {
      toast.error("Please select a color and size.");
      return;
    }

    if (!selectedVariant) {
      toast.error("Variant not found.");
      return;
    }

    if (!isVariantAvailable(selectedVariant)) {
      toast.error("Out of stock.");
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
      image: product.media.find((m) => m.viewType === "front")?.url || product.media[0].url,
    });

    if (result.success) {
      toast.success(`Added ${product.shortName} (${selectedSize} / ${selectedColor}) to your combo!`);
      setSelectedSize(null);
    } else {
      if (result.error === "COMBO_FULL") {
        toast.error("Your combo is already full! Please review it in the builder.");
      } else {
        toast.error(`Could not add item: ${result.error}`);
      }
    }
  };

  const handleSelectComboTier = (config: any) => {
    startCombo(config);
    setComboSelectOpen(false);
    toast.success(`Started building your ${config.name}!`);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-16 font-body">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1.5 text-xs text-text-secondary select-none">
        <Link href="/" className="hover:text-brand-primary">Home</Link>
        <ChevronRight className="h-3 w-3 text-text-muted" />
        <Link href="/products" className="hover:text-brand-primary">Catalog</Link>
        <ChevronRight className="h-3 w-3 text-text-muted" />
        <span className="text-text-primary font-semibold line-clamp-1">{product.name}</span>
      </nav>

      {/* Grid Layout: Left Media Gallery, Right Product Info */}
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left Column: Media Gallery */}
        <div className="space-y-4">
          <div
            className="relative aspect-[3/4] bg-bg-secondary rounded-promo overflow-hidden border border-border-light cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
          >
            {activeMedia.type === "video" ? (
              <video
                src={activeMedia.url}
                muted
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={activeMedia.url}
                alt={activeMedia.alt}
                fill
                priority
                className="object-cover"
                unoptimized
              />
            )}
            {activeMedia.type === "video" && (
              <div className="absolute bottom-4 right-4 bg-black/60 text-white rounded-full p-2">
                <Video className="h-5 w-5" />
              </div>
            )}
          </div>

          {/* Thumbnails grid */}
          <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin select-none">
            {product.media.map((med) => (
              <button
                key={med.id}
                onClick={() => setActiveMediaId(med.id)}
                className={cn(
                  "relative h-20 w-16 shrink-0 rounded-card overflow-hidden border bg-bg-secondary cursor-pointer",
                  activeMediaId === med.id ? "border-brand-primary ring-1 ring-brand-primary" : "border-border-light hover:opacity-90"
                )}
              >
                {med.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Video className="h-5 w-5 text-text-secondary" />
                  </div>
                ) : (
                  <Image src={med.url} alt="thumbnail" fill className="object-cover" unoptimized />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Sticky Product Info */}
        <div className="space-y-6 md:sticky md:top-24">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-text-muted tracking-wider">
                {product.subcategory}
              </span>
              <span className="text-xs text-text-secondary flex items-center gap-0.5 font-semibold">
                ★ {product.rating} ({product.reviewCount} verified reviews)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <Badge variant="success" className="text-xs py-1 px-3">
                COMBO ELIGIBLE
              </Badge>
              <span className="text-xs text-text-secondary font-mono">
                Code: {product.productCode}
              </span>
            </div>

            <div className="flex items-baseline gap-2 border-y border-border-light py-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted">Flat Combo Base Price</span>
                <span className="text-3xl font-extrabold font-heading text-brand-primary">₹999</span>
              </div>
              <span className="text-sm text-text-muted line-through">₹2,499</span>
              <span className="text-xs text-brand-accent font-semibold font-heading bg-brand-accent-soft px-2.5 py-0.5 rounded-full ml-1">
                60% OFF
              </span>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Sizing & Colors Selectors */}
          <div className="space-y-5">
            {/* Colors Select */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                Color: {selectedColor}
              </span>
              <div className="flex gap-2">
                {colors.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => {
                      setSelectedColor(col.name);
                      setSelectedSize(null);
                    }}
                    className={cn(
                      "p-1 rounded-full border border-border-light transition-all cursor-pointer",
                      selectedColor === col.name ? "ring-2 ring-brand-primary" : "hover:scale-105"
                    )}
                  >
                    <span className="block h-7 w-7 rounded-full shadow-sm" style={{ backgroundColor: col.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Select */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Size: {selectedSize || "Select size"}
                </span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-brand-primary hover:underline font-semibold font-heading cursor-pointer flex items-center gap-1"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>
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
                        "h-11 px-5 rounded-control border text-xs font-bold font-heading transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none",
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

            {/* Variant stock alert */}
            {selectedVariant && (
              <div className="text-xs font-semibold">
                {isVariantAvailable(selectedVariant) ? (
                  <span className="text-emerald-700">✓ Item Available (In Stock)</span>
                ) : (
                  <span className="text-red-600">✗ Selected combination is out of stock</span>
                )}
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              size="lg"
              className="flex-1 gap-2 h-12 text-xs font-bold tracking-wider uppercase cursor-pointer bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg border-transparent transition-smooth active:scale-98"
              onClick={handleAddAction}
              disabled={!!activeCombo && (!selectedColor || !selectedSize || !selectedVariant || !isVariantAvailable(selectedVariant))}
            >
              <Plus className="h-4.5 w-4.5" />
              <span>{activeCombo ? `Add to ${activeCombo.comboName}` : "Choose Combo to Begin"}</span>
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-12 p-0 cursor-pointer rounded-lg border-border-light hover:bg-bg-secondary transition-smooth active:scale-95"
                onClick={() => {
                  toggleWishlist(slug);
                  toast.success(isWishlisted ? "Removed from wishlist." : "Added to wishlist.");
                }}
                aria-label="Toggle Wishlist"
              >
                <Heart className={cn("h-5 w-5", isWishlisted ? "text-red-500 fill-current" : "text-text-secondary")} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-12 p-0 cursor-pointer rounded-lg border-border-light hover:bg-bg-secondary transition-smooth active:scale-95"
                onClick={handleShare}
                aria-label="Share Link"
              >
                <Share2 className="h-5 w-5 text-text-secondary" />
              </Button>
            </div>
          </div>

          {/* Sticky Progress Dock for Products Detail Page (Swiggy inspired) */}
          {activeCombo && activeCombo.slots.filter(s => s.item).length > 0 && (
            <div className="fixed bottom-16 left-4 right-4 z-40 bg-black/90 text-white backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.24)] px-4 py-3 pb-3.5 border border-white/10 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
              <div className="flex flex-col gap-1 text-[11px]">
                <span className="font-bold uppercase tracking-wider text-white">
                  {activeCombo.slots.filter(s => s.item).length} OF {activeCombo.itemLimit} SELECTED
                </span>
                <span className="text-[9px] text-gray-300">
                  {activeCombo.slots.filter(s => s.item).length === activeCombo.itemLimit 
                    ? "COMBO READY ✓" 
                    : `${activeCombo.itemLimit - activeCombo.slots.filter(s => s.item).length} PICKS LEFT`}
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => router.push(`/combo/${activeCombo.comboSlug}`)}
                  className="h-9 px-4 font-bold uppercase tracking-wider text-[10px] bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent"
                >
                  View Picks
                </Button>
              </div>
            </div>
          )}

          {/* Policies & Accordions */}
          <div className="space-y-4 border-t border-border-light pt-6">
            <PolicyNotice variant="alert" />

            <Accordion type="single" collapsible className="w-full font-body">
              <AccordionItem value="fabric-details">
                <AccordionTrigger>Fabric & Styling Details</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <div><strong>Fabric Composition:</strong> {product.fabric}</div>
                  <div><strong>Fit Style:</strong> {product.fit}</div>
                  <div><strong>Pattern Style:</strong> {product.pattern}</div>
                  {product.sleeve && <div><strong>Sleeve:</strong> {product.sleeve}</div>}
                  {product.neck && <div><strong>Neckline:</strong> {product.neck}</div>}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="wash-care">
                <AccordionTrigger>Wash & Care Instructions</AccordionTrigger>
                <AccordionContent>
                  <p>{product.washCare || "Gentle hand wash inside out. Warm iron on reverse."}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping-policy">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>• Courier charges are computed and added separately at checkout.</p>
                  <p>• Cash on Delivery (COD) requires a mandatory 20% advance payment.</p>
                  <p>• Since items are part of discounted combo sets, we do not accept regular style/color exchanges.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Recommended items grid */}
      {recommendedProducts.length > 0 && (
        <section className="space-y-8 border-t border-border-light pt-12">
          <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-text-primary tracking-tight text-center">
            YOU MAY ALSO LIKE
          </h2>
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ====================================================
          1. MODAL: COMBO TIER SELECTION
          ==================================================== */}
      <Dialog open={comboSelectOpen} onOpenChange={setComboSelectOpen}>
        <DialogContent className="max-w-md font-body">
          <DialogHeader>
            <DialogTitle>Choose Your Combo Size</DialogTitle>
            <DialogDescription>
              To add products, you first need to choose a combo size. Any combo tier currently costs a flat base price of **₹999**.
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
          2. DIALOG: SIZE GUIDE
          ==================================================== */}
      <SizeGuideDialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} category={product.categoryId} />

      {/* ====================================================
          3. DIALOG: FULL SCREEN MEDIA LIGHTBOX
          ==================================================== */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-3xl p-1 bg-black/90 border-transparent overflow-hidden">
          <div className="relative aspect-[3/4] max-h-[85vh] w-full flex items-center justify-center bg-black">
            {activeMedia.type === "video" ? (
              <video src={activeMedia.url} controls autoPlay className="max-h-[80vh] object-contain" />
            ) : (
              <Image src={activeMedia.url} alt={activeMedia.alt} fill className="object-contain" unoptimized />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
