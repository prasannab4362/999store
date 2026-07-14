"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useComboStore, useActiveComboDetails } from "@/stores/combo-store";
import { products } from "@/data/mock/products";
import { categories } from "@/data/mock/categories";
import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Trash2, ShoppingBag, Search, RefreshCw, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { comboConfigs } from "@/config/combo";

export default function ComboBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const comboSlug = params.comboSlug as string;

  const { activeCombo, selectedCount, remainingCount, isComplete } = useActiveComboDetails();
  const removeItem = useComboStore((state) => state.removeItem);
  const resetCombo = useComboStore((state) => state.resetCombo);
  const startCombo = useComboStore((state) => state.startCombo);

  const [genderFilter, setGenderFilter] = React.useState<"all" | "men" | "women">("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [mobileSummaryOpen, setMobileSummaryOpen] = React.useState(false);

  // Initialize combo if none active or doesn't match slug
  React.useEffect(() => {
    if (!activeCombo || activeCombo.comboSlug !== comboSlug) {
      const config = comboConfigs.find((c) => c.slug === comboSlug);
      if (config) {
        startCombo(config);
      }
    }
  }, [comboSlug, activeCombo, startCombo]);

  // Filter products for combo builder
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      if (!p.comboEligible) return false;
      if (genderFilter !== "all" && p.gender !== genderFilter && p.gender !== "unisex") return false;
      if (selectedCategory !== "all" && p.categoryId !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(query) && !p.productCode.toLowerCase().includes(query)) return false;
      }
      return true;
    });
  }, [genderFilter, selectedCategory, searchQuery]);

  if (!activeCombo) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 font-body">
        <p className="text-sm text-text-secondary">Loading Combo configuration...</p>
      </div>
    );
  }

  const handleReviewRedirect = () => {
    if (!isComplete) {
      toast.error(`Please select ${remainingCount} more item${remainingCount > 1 ? "s" : ""} to complete your combo.`);
      return;
    }
    router.push(`/combo/${comboSlug}/review`);
  };

  /* ─────────────────────────────────────────────
     Shared Slots Panel (used desktop + mobile sheet)
  ───────────────────────────────────────────── */
  const SlotsSummary = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex flex-col gap-4 font-body h-full">
      {/* Header row */}
      <div className="flex items-center justify-between border-b border-border-light pb-3">
        <h3 className="font-heading font-bold text-sm text-text-primary">Combo Configuration</h3>
        <button
          onClick={resetCombo}
          className="text-xs text-brand-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Slots list */}
      <div className={cn("flex-1 space-y-2.5 overflow-y-auto", compact ? "max-h-[40vh]" : "max-h-[calc(100vh-360px)]")}>
        {activeCombo.slots.map((slot) => (
          <div
            key={slot.slotId}
            className={cn(
              "p-3 rounded-xl border flex items-center gap-3 transition-colors",
              slot.item
                ? "border-brand-primary/30 bg-brand-primary-soft/20"
                : "border-dashed border-border-medium bg-bg-secondary/40"
            )}
          >
            {/* Slot number / thumbnail */}
            <div className="relative h-11 w-8 rounded-md overflow-hidden bg-bg-secondary shrink-0 border border-border-light flex items-center justify-center text-xs text-text-muted font-bold">
              {slot.item ? (
                <img src={slot.item.image} alt={slot.item.productName} className="object-cover w-full h-full" />
              ) : (
                <span>{slot.position}</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {slot.item ? (
                <div className="text-xs space-y-0.5">
                  <h4 className="font-heading font-semibold text-text-primary truncate leading-tight">
                    {slot.item.productName}
                  </h4>
                  <p className="text-[10px] text-text-secondary">
                    {slot.item.size} &nbsp;·&nbsp; {slot.item.colorName}
                  </p>
                </div>
              ) : (
                <span className="text-xs text-text-muted italic">Empty slot</span>
              )}
            </div>

            {/* Remove button */}
            {slot.item && (
              <button
                onClick={() => removeItem(slot.slotId)}
                className="text-text-muted hover:text-red-500 p-1.5 active:scale-90 transition-transform cursor-pointer shrink-0"
                aria-label="Remove item"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Filled indicator */}
            {slot.item && (
              <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border-light pt-4 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Base price</span>
          <span className="font-heading font-bold text-text-primary text-base">₹999.00</span>
        </div>
        <p className="text-[10px] text-text-muted leading-relaxed">
          *Courier charges are calculated during checkout based on your location.
        </p>
        <Button
          onClick={handleReviewRedirect}
          className="w-full h-11 uppercase font-bold tracking-wider text-sm"
          disabled={!isComplete}
        >
          <span>Review Combo</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-8 font-body pb-28 lg:pb-8">

      {/* ── 1. Progress Header ─────────────────────────────── */}
      <div className="rounded-2xl bg-white border border-border-light px-4 py-4 sm:px-6 sm:py-5 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-extrabold font-heading text-text-primary tracking-tight leading-tight">
              BUILDING: {activeCombo.comboName}
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Mix and match clothes below. Base price:{" "}
              <span className="font-bold text-brand-primary">₹999.00</span>
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-bold text-text-primary uppercase tracking-wider whitespace-nowrap">
              {selectedCount} / {activeCombo.itemLimit} Selected
            </p>
            {isComplete ? (
              <span className="inline-block mt-1 text-[10px] font-bold text-brand-primary bg-brand-primary-soft px-2 py-0.5 rounded-full">
                Combo Complete!
              </span>
            ) : (
              <span className="inline-block mt-1 text-[10px] font-semibold text-text-muted">
                {remainingCount} slot{remainingCount > 1 ? "s" : ""} remaining
              </span>
            )}
          </div>
        </div>
        <Progress value={selectedCount} max={activeCombo.itemLimit} className="h-2 mt-3" />
      </div>

      {/* ── 2. Main Builder Layout ─────────────────────────── */}
      <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6 items-start">

        {/* Left Column: Filters + Product Grid */}
        <div className="space-y-4">

          {/* Controls bar: Gender tabs + Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-bg-secondary p-3 rounded-xl border border-border-light">
            {/* Gender tabs */}
            <div className="flex gap-1 bg-white p-1 rounded-lg border border-border-light w-full sm:w-auto">
              {(["all", "men", "women"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={cn(
                    "flex-1 sm:flex-none text-xs font-bold font-heading px-4 py-1.5 rounded-md capitalize cursor-pointer transition-colors",
                    genderFilter === g
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {g === "all" ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search styles/codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-border-light bg-white text-xs font-body focus:outline-none focus:ring-2 focus:ring-brand-primary/30 text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>

          {/* Category horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none select-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "h-8 px-3.5 rounded-full border text-xs font-semibold font-heading shrink-0 transition-colors cursor-pointer whitespace-nowrap",
                selectedCategory === "all"
                  ? "border-brand-primary bg-brand-primary text-white"
                  : "border-border-light bg-white text-text-secondary hover:border-brand-primary/40 hover:text-text-primary"
              )}
            >
              All Items
            </button>
            {categories
              .filter((c) => genderFilter === "all" || c.gender === genderFilter || c.gender === "unisex")
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "h-8 px-3.5 rounded-full border text-xs font-semibold font-heading shrink-0 transition-colors cursor-pointer whitespace-nowrap",
                    selectedCategory === cat.id
                      ? "border-brand-primary bg-brand-primary text-white"
                      : "border-border-light bg-white text-text-secondary hover:border-brand-primary/40 hover:text-text-primary"
                  )}
                >
                  {cat.name}
                </button>
              ))}
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-medium p-12 text-center max-w-sm mx-auto font-body space-y-3">
              <span className="text-3xl block">🔍</span>
              <h3 className="font-heading font-bold text-sm text-text-primary">No matching styles found</h3>
              <p className="text-xs text-text-secondary">Try modifying your category filters or clearing search.</p>
            </div>
          )}
        </div>

        {/* ── Right Column: Desktop Sticky Sidebar ─────────── */}
        <aside className="hidden lg:flex flex-col bg-white rounded-2xl border border-border-light shadow-sm sticky top-24 self-start overflow-hidden w-full lg:w-[300px] xl:w-[320px]">
          <div className="p-5 flex-1">
            <SlotsSummary />
          </div>
        </aside>
      </div>

      {/* ── Mobile Sticky Bottom Bar ───────────────────────── */}
      {/* Sits above the bottom nav (h-16 = 64px) + 8px gap = bottom-20 */}
      <div className="lg:hidden fixed bottom-20 left-3 right-3 z-30">
        <Sheet open={mobileSummaryOpen} onOpenChange={setMobileSummaryOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="w-full justify-between shadow-xl h-12 uppercase font-bold tracking-wide font-heading cursor-pointer rounded-xl"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>View Combo Slots</span>
              </div>
              <span className="bg-white/25 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {selectedCount}/{activeCombo.itemLimit}
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[88vh] flex flex-col p-0">
            <SheetHeader className="px-5 pt-5 pb-3 border-b border-border-light shrink-0">
              <SheetTitle className="font-heading text-base">Your Combo Summary</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
              <SlotsSummary compact />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
