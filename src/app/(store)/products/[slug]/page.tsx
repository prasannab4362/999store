"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
import dynamic from "next/dynamic";
import { PolicyNotice } from "@/components/commerce/policy-notice";
const SizeGuideDialog = dynamic(() => import("@/components/commerce/size-guide-dialog").then(mod => mod.SizeGuideDialog), { ssr: false });
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.media.map(m => `https://999combostore.com${m.url}`),
    description: product.shortDescription,
    sku: product.productCode,
    offers: {
      "@type": "Offer",
      url: `https://999combostore.com/products/${product.slug}`,
      priceCurrency: "INR",
      price: "999",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 space-y-16 font-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div
            className="relative aspect-[3/4] bg-bg-secondary rounded-[24px] overflow-hidden border border-[rgba(0,0,0,0.06)] shadow-sm cursor-zoom-in group"
            onClick={() => setLightboxOpen(true)}
          >
            {activeMedia.type === "video" ? (
              <video
                src={activeMedia.url}
                muted
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 ease-[var(--ease-apple)] group-hover:scale-102"
              />
            ) : (
              <Image
                src={activeMedia.url}
                alt={activeMedia.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-apple)] group-hover:scale-102"
              />
            )}
            {activeMedia.type === "video" && (
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white rounded-full p-2.5 shadow-lg">
                <Video className="h-5 w-5" />
              </div>
            )}
          </div>

          {/* Thumbnails grid */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none select-none">
            {product.media.map((med) => (
              <button
                key={med.id}
                onClick={() => setActiveMediaId(med.id)}
                className={cn(
                  "relative h-20 w-16 shrink-0 rounded-[12px] overflow-hidden border bg-bg-secondary cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  activeMediaId === med.id 
                    ? "border-text-primary ring-1 ring-text-primary shadow-sm opacity-100" 
                    : "border-transparent hover:border-border-medium hover:opacity-100 opacity-70"
                )}
              >
                {med.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100/50">
                    <Video className="h-5 w-5 text-text-secondary" />
                  </div>
                ) : (
                  <Image src={med.url} alt="thumbnail" fill sizes="64px" className="object-cover" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Sticky Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 md:sticky md:top-24"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold font-ui text-brand-primary tracking-widest">
                {product.subcategory}
              </span>
              <span className="text-[10px] text-amber-500 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-sm flex items-center gap-1 font-bold">
                ★ {product.rating} ({product.reviewCount} verified)
              </span>
            </div>

            <h1 className="apple-section-title text-text-primary">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <Badge variant="success" className="text-[10px] py-1 px-3 bg-brand-primary-soft text-brand-primary border-transparent tracking-widest font-bold">
                COMBO ELIGIBLE
              </Badge>
              <span className="text-xs text-text-muted font-ui uppercase tracking-wider font-semibold">
                SKU: {product.productCode}
              </span>
            </div>

            <div className="flex items-center gap-4 py-4 border-y border-border-medium/30">
              <div className="flex flex-col">
                <span className="text-[12px] font-semibold font-ui text-text-muted tracking-wide">Combo Base Price</span>
                <span className="text-[32px] font-semibold font-heading text-text-primary tracking-tight">₹999</span>
              </div>
              <div className="h-10 w-[1px] bg-border-medium/30 mx-2"></div>
              <div className="flex flex-col justify-center">
                <span className="text-sm text-text-muted line-through font-ui font-medium">MRP: ₹2,499</span>
                <span className="text-[13px] text-brand-accent font-semibold font-ui">
                  Save 60% with Combo
                </span>
              </div>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed font-ui">
              {product.shortDescription}
            </p>
          </div>

          {/* Sizing & Colors Selectors */}
          <div className="space-y-6 pt-2">
            {/* Colors Select */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold font-ui text-text-muted uppercase tracking-widest block">
                Selected Color: <span className="text-text-primary">{selectedColor}</span>
              </span>
              <div className="flex gap-2.5">
                {colors.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => {
                      setSelectedColor(col.name);
                      setSelectedSize(null);
                    }}
                    className={cn(
                      "p-0.5 rounded-full border transition-all duration-200 cursor-pointer ease-out shadow-sm",
                      selectedColor === col.name 
                        ? "border-brand-primary ring-2 ring-brand-primary/20 scale-105" 
                        : "border-border-medium/60 hover:scale-105 hover:shadow-md"
                    )}
                  >
                    <span 
                      className="block h-8 w-8 rounded-full shadow-inner border border-black/5" 
                      style={{ backgroundColor: col.hex }} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Select */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-ui text-text-muted uppercase tracking-widest block">
                  Selected Size: <span className="text-text-primary">{selectedSize || "None"}</span>
                </span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-[10px] text-text-secondary hover:text-brand-primary uppercase tracking-widest font-bold font-ui cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
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
                        "h-11 min-w-[3rem] px-5 rounded-full border text-xs font-bold font-ui transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:pointer-events-none shadow-sm",
                        selectedSize === sz
                          ? "border-black bg-black text-white scale-105 shadow-md"
                          : "border-border-medium/60 bg-white hover:bg-bg-secondary text-text-secondary hover:text-text-primary hover:border-border-medium hover:scale-105"
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
              <div className="text-[10px] font-bold font-ui uppercase tracking-widest">
                {isVariantAvailable(selectedVariant) ? (
                  <span className="text-emerald-600 flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5"/> In Stock - Ready to Ship</span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1.5"><ShieldAlert className="h-3.5 w-3.5"/> Out of Stock</span>
                )}
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border-medium/40">
            <Button
              size="lg"
              className="flex-1 gap-2 cursor-pointer bg-[#1D1D1F] text-white shadow-sm transition-all group"
              onClick={handleAddAction}
              disabled={!!activeCombo && (!selectedColor || !selectedSize || !selectedVariant || !isVariantAvailable(selectedVariant))}
            >
              <Plus className="h-4.5 w-4.5 group-hover:rotate-90 transition-transform duration-300" />
              <span>{activeCombo ? `Add to ${activeCombo.comboName}` : "Choose Combo to Begin"}</span>
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-14 w-14 cursor-pointer shadow-sm rounded-full",
                  isWishlisted && "border-red-200 bg-red-50 hover:bg-red-50"
                )}
                onClick={() => {
                  toggleWishlist(slug);
                  toast.success(isWishlisted ? "Removed from wishlist." : "Added to wishlist.");
                }}
                aria-label="Toggle Wishlist"
              >
                <Heart className={cn("h-5 w-5 transition-transform group-hover:scale-110", isWishlisted ? "text-red-500 fill-red-500" : "text-text-secondary")} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14 cursor-pointer shadow-sm rounded-full"
                onClick={handleShare}
                aria-label="Share Link"
              >
                <Share2 className="h-5 w-5 text-text-secondary" />
              </Button>
            </div>
          </div>

          {/* Sticky Progress Dock for Products Detail Page (Swiggy inspired) */}
          {activeCombo && activeCombo.slots.filter(s => s.item).length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-40 bg-black/85 backdrop-blur-xl text-white rounded-[var(--radius-card)] shadow-[0_12px_40px_rgba(0,0,0,0.3)] px-5 py-4 border border-white/10 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-[var(--ease-apple)]">
              <div className="flex flex-col gap-0.5 text-[11px] font-ui">
                <span className="font-extrabold uppercase tracking-widest text-white">
                  {activeCombo.slots.filter(s => s.item).length} OF {activeCombo.itemLimit} SELECTED
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {activeCombo.slots.filter(s => s.item).length === activeCombo.itemLimit 
                    ? "COMBO READY TO CHECKOUT" 
                    : `${activeCombo.itemLimit - activeCombo.slots.filter(s => s.item).length} MORE PICKS LEFT`}
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => router.push(`/combo/${activeCombo.comboSlug}`)}
                  className="h-10 px-5 font-bold font-ui uppercase tracking-widest text-[10px] rounded-full bg-white text-black hover:bg-gray-100 border-transparent shadow-md transition-all active:scale-95"
                >
                  View Picks
                </Button>
              </div>
            </div>
          )}

          {/* Policies & Accordions */}
          <div className="space-y-6 pt-8">
            <PolicyNotice variant="alert" />

            <Accordion type="single" collapsible className="w-full font-body border border-border-medium/60 rounded-[var(--radius-card)] bg-white overflow-hidden shadow-sm">
              <AccordionItem value="fabric-details" className="border-b border-border-medium/60 px-4">
                <AccordionTrigger className="text-xs font-bold font-ui uppercase tracking-wider hover:no-underline hover:text-brand-primary">Fabric & Styling Details</AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm text-text-secondary pb-4">
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="font-medium text-text-primary">Fabric</span><span>{product.fabric}</span>
                    <span className="font-medium text-text-primary">Fit</span><span>{product.fit}</span>
                    <span className="font-medium text-text-primary">Pattern</span><span>{product.pattern}</span>
                    {product.sleeve && <><span className="font-medium text-text-primary">Sleeve</span><span>{product.sleeve}</span></>}
                    {product.neck && <><span className="font-medium text-text-primary">Neckline</span><span>{product.neck}</span></>}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="wash-care" className="border-b border-border-medium/60 px-4">
                <AccordionTrigger className="text-xs font-bold font-ui uppercase tracking-wider hover:no-underline hover:text-brand-primary">Wash & Care Instructions</AccordionTrigger>
                <AccordionContent className="text-sm text-text-secondary pb-4 leading-relaxed">
                  <p>{product.washCare || "Gentle hand wash inside out. Warm iron on reverse. Do not bleach."}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping-policy" className="border-none px-4">
                <AccordionTrigger className="text-xs font-bold font-ui uppercase tracking-wider hover:no-underline hover:text-brand-primary">Shipping & Returns</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm text-text-secondary pb-4 leading-relaxed">
                  <p>• Courier charges are computed and added separately at checkout.</p>
                  <p>• Cash on Delivery (COD) requires a mandatory 20% advance payment.</p>
                  <p>• Since items are part of discounted combo sets, we do not accept regular style/color exchanges.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </motion.div>
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
              <Image src={activeMedia.url} alt={activeMedia.alt} fill sizes="100vw" className="object-contain" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
