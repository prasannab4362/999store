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
import { Trash2, ShoppingBag, Search, RefreshCw, ArrowRight, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { comboConfigs } from "@/config/combo";

export default function ComboBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const comboSlug = params.comboSlug as string;

  const { activeCombo, selectedCount, remainingCount, isComplete, validation } = useActiveComboDetails();
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
      // Must match currently active combo tier ID
      if (activeCombo && p.comboTierIds && !p.comboTierIds.includes(activeCombo.comboId as any)) return false;
      if (genderFilter !== "all" && p.gender !== genderFilter && p.gender !== "unisex") return false;
      if (selectedCategory !== "all" && p.categoryId !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(query) && !p.productCode.toLowerCase().includes(query)) return false;
      }
      return true;
    });
  }, [activeCombo, genderFilter, selectedCategory, searchQuery]);

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
     Desktop Sidebar Slots Content
  ───────────────────────────────────────────── */
  const SlotsSummary = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex flex-col gap-4 font-body h-full w-full min-w-0">
      {/* Header row */}
      <div className="flex items-center justify-between border-b border-border-light pb-3 shrink-0">
        <div>
          <h3 className="font-heading font-extrabold text-sm text-text-primary uppercase tracking-wider">Your Combo</h3>
          <p className="text-[10px] font-bold text-text-muted mt-0.5">{activeCombo.comboName.toUpperCase()}</p>
        </div>
        <button
          onClick={resetCombo}
          className="text-xs text-brand-primary hover:text-brand-primary-hover font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          <span>RESET</span>
        </button>
      </div>

      {/* Progress Info */}
      <div className="space-y-1.5 shrink-0">
        <div className="flex justify-between text-xs font-bold text-text-primary uppercase tracking-wider">
          <span>{selectedCount} OF {activeCombo.itemLimit} SELECTED</span>
          {isComplete && <span className="text-brand-primary">COMPLETE</span>}
        </div>
        <Progress value={selectedCount} max={activeCombo.itemLimit} className="h-2" />
      </div>

      {/* Slots list */}
      <div className={cn("flex-1 space-y-2.5 overflow-y-auto min-w-0 pr-1", compact ? "max-h-[45vh]" : "max-h-[calc(100dvh-340px)]")}>
        {activeCombo.slots.map((slot, index) => (
          <div
            key={slot.slotId}
            className={cn(
              "p-3 rounded-xl border flex items-center gap-3 transition-colors min-w-0",
              slot.item
                ? "border-brand-primary/20 bg-brand-primary-soft/10"
                : "border-dashed border-border-medium bg-bg-secondary/40"
            )}
          >
            {/* Slot index circle / image */}
            {slot.item ? (
              <div className="relative h-14 w-11 rounded-lg overflow-hidden bg-bg-secondary shrink-0 border border-border-light">
                <img src={slot.item.image} alt={slot.item.productName} className="object-cover w-full h-full" />
                <span className="absolute top-1 left-1 bg-black/60 text-white font-heading font-extrabold text-[8px] h-4 w-4 rounded-full flex items-center justify-center">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
              </div>
            ) : (
              <div className="h-14 w-11 rounded-lg border-2 border-dashed border-border-medium bg-white flex items-center justify-center shrink-0 text-xs font-heading font-extrabold text-text-muted">
                {(index + 1).toString().padStart(2, "0")}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              {slot.item ? (
                <div className="space-y-0.5 min-w-0">
                  <h4 className="font-heading font-bold text-xs text-text-primary truncate">
                    {slot.item.productName}
                  </h4>
                  <p className="text-[10px] text-text-secondary truncate">
                    {slot.item.colorName} &nbsp;·&nbsp; {slot.item.size}
                  </p>
                  <div className="flex gap-2.5 pt-1 shrink-0">
                    <button
                      onClick={() => removeItem(slot.slotId)}
                      className="text-[9px] font-bold text-text-muted hover:text-red-500 uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <h4 className="font-heading font-bold text-xs text-text-muted uppercase tracking-wider">Empty Pick</h4>
                  <p className="text-[10px] text-text-secondary leading-tight">Choose one more style</p>
                </div>
              )}
            </div>

            {/* Filled Indicator */}
            {slot.item && (
              <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0 ml-auto" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border-light pt-4 space-y-3 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-text-secondary uppercase tracking-wider">Combo Price</span>
          <span className="font-heading font-extrabold text-text-primary text-xl">₹999</span>
        </div>
        <p className="text-[9px] text-text-muted uppercase tracking-wider leading-relaxed">
          *Courier charges extra
        </p>
        <Button
          onClick={handleReviewRedirect}
          className="w-full h-11 uppercase font-bold tracking-wider text-xs"
          disabled={!isComplete}
        >
          {isComplete ? (
            <>
              <span>Review My Combo</span>
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </>
          ) : (
            <span>{remainingCount} picks left to complete</span>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <main className="w-full min-w-0 bg-white min-h-screen">
      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-6 lg:px-8 py-4 sm:py-6 font-body pb-[160px] xl:pb-8">

        {/* ── 1. Progress Header (Compact) ───────────────────── */}
        <div className="rounded-xl bg-white border border-border-light p-4 shadow-sm mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold bg-brand-primary-soft text-brand-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Building
                </span>
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  {activeCombo.comboName}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Mix Men's + Women's styles. Complete all {activeCombo.itemLimit} picks.
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-border-light shrink-0">
              <div className="text-left sm:text-right">
                <p className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  {selectedCount} / {activeCombo.itemLimit} Selected
                </p>
                <p className="text-[10px] font-bold text-brand-accent uppercase tracking-wider mt-0.5">
                  {isComplete ? "Combo Complete!" : `${remainingCount} Picks Left`}
                </p>
              </div>
            </div>
          </div>
          <Progress value={selectedCount} max={activeCombo.itemLimit} className="h-1.5 mt-3.5" />
        </div>

        {/* ── 2. Two Column Responsive Grid ──────────────────── */}
        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_340px] items-start">
          
          {/* Left Column: Product Discovery */}
          <div className="min-w-0 space-y-4">
            
            {/* Filter toolbar: Gender tabs + Search */}
            <div className="grid gap-3 sm:flex sm:items-center sm:justify-between bg-bg-secondary p-3 rounded-xl border border-border-light">
              {/* Gender selection */}
              <div className="flex gap-1 bg-white p-1 rounded-lg border border-border-light shrink-0">
                {(["all", "men", "women"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={cn(
                      "flex-1 sm:flex-none text-xs font-bold font-heading px-4.5 py-1.5 rounded-md capitalize cursor-pointer transition-all",
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
              <div className="relative flex-1 sm:max-w-md min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search styles/codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-4 rounded-lg border border-border-light bg-white text-xs font-body focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-text-primary placeholder:text-text-muted"
                />
              </div>
            </div>

            {/* Category horizontal scroll rail */}
            <div className="w-full min-w-0 overflow-hidden relative">
              <div className="flex gap-2 overflow-x-auto pb-1 px-0.5 scrollbar-none overscroll-x-contain select-none">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "h-8 px-3.5 rounded-full border text-xs font-semibold font-heading shrink-0 transition-colors cursor-pointer whitespace-nowrap",
                    selectedCategory === "all"
                      ? "border-brand-primary bg-brand-primary text-white"
                      : "border-border-light bg-white text-text-secondary hover:border-brand-primary/40"
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
                          : "border-border-light bg-white text-text-secondary hover:border-brand-primary/40"
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border-medium p-12 text-center max-w-sm mx-auto font-body space-y-2">
                <span className="text-2xl block">🔍</span>
                <h3 className="font-heading font-bold text-xs text-text-primary">No matching styles found</h3>
                <p className="text-[10px] text-text-secondary">Try modifying your filters or clearing search keys.</p>
              </div>
            )}
          </div>

          {/* Right Column: Desktop Sticky Sidebar (Visible >= 1280px / xl) */}
          <aside className="hidden xl:block min-w-0">
            <div className="sticky top-20 w-full bg-white p-5 rounded-xl border border-border-light shadow-sm overflow-hidden">
              <SlotsSummary />
            </div>
          </aside>
        </div>

        {/* ── 3. Mobile/Tablet Sticky Combo Progress Dock (Visible < 1280px) ── */}
        <div className="xl:hidden fixed bottom-16 left-0 right-0 z-30 bg-white border-t border-border-light shadow-[0_-8px_20px_rgba(0,0,0,0.06)] px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] flex flex-col gap-2.5">
          {/* Top row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-text-primary uppercase tracking-wider">
              <span>{selectedCount} / {activeCombo.itemLimit} PICKS</span>
              {isComplete ? (
                <span className="text-[9px] bg-brand-primary-soft text-brand-primary px-2 py-0.5 rounded-full">COMPLETE</span>
              ) : (
                <span className="text-[9px] text-brand-accent bg-amber-50 px-2 py-0.5 rounded-full">{remainingCount} LEFT</span>
              )}
            </div>
            <span className="font-heading font-extrabold text-brand-primary text-base">₹999</span>
          </div>

          {/* Progress bar */}
          <Progress value={selectedCount} max={activeCombo.itemLimit} className="h-1.5" />

          {/* Actions */}
          <div className="flex gap-2">
            <Sheet open={mobileSummaryOpen} onOpenChange={setMobileSummaryOpen}>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1 h-10 font-bold uppercase tracking-wider text-[10px] gap-1.5 cursor-pointer rounded-lg border-brand-primary/20 text-brand-primary bg-brand-primary-soft/10">
                  <ShoppingBag className="h-4 w-4" />
                  <span>View Combo</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl max-h-[85dvh] flex flex-col p-0">
                <SheetHeader className="px-5 pt-5 pb-3 border-b border-border-light shrink-0">
                  <SheetTitle className="font-heading text-base">Your Combo Summary</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4">
                  <SlotsSummary compact />
                </div>
              </SheetContent>
            </Sheet>

            <Button
              onClick={handleReviewRedirect}
              disabled={!isComplete}
              size="sm"
              className="flex-1 h-10 font-bold uppercase tracking-wider text-[10px] gap-1 shrink-0 rounded-lg"
            >
              <span>Review Combo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}
