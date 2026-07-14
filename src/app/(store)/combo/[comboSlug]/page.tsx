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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, ShoppingBag, SlidersHorizontal, Search, RefreshCw, X, ArrowRight } from "lucide-react";
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
      if (!p.comboEligible) return false;

      // Gender
      if (genderFilter !== "all" && p.gender !== genderFilter && p.gender !== "unisex") {
        return false;
      }

      // Category
      if (selectedCategory !== "all" && p.categoryId !== selectedCategory) {
        return false;
      }

      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCode = p.productCode.toLowerCase().includes(query);
        if (!matchesName && !matchesCode) return false;
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

  const SlotsSummary = () => (
    <div className="space-y-4 font-body">
      <div className="flex items-center justify-between border-b border-border-light pb-2">
        <h3 className="font-heading font-bold text-sm text-text-primary">Combo Configuration</h3>
        <button onClick={resetCombo} className="text-xs text-brand-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer">
          <RefreshCw className="h-3 w-3" />
          <span>Reset All</span>
        </button>
      </div>
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
        {activeCombo.slots.map((slot) => (
          <div
            key={slot.slotId}
            className={cn(
              "p-3 rounded-card border flex items-center justify-between gap-3 transition-colors",
              slot.item ? "border-brand-primary/20 bg-brand-primary-soft/30" : "border-dashed border-border-medium bg-bg-secondary/40"
            )}
          >
            {slot.item ? (
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-9 rounded-sm overflow-hidden bg-bg-secondary shrink-0">
                  <img src={slot.item.image} alt={slot.item.productName} className="object-cover w-full h-full" />
                </div>
                <div className="text-xs space-y-0.5">
                  <h4 className="font-heading font-semibold text-text-primary line-clamp-1">{slot.item.productName}</h4>
                  <p className="text-[10px] text-text-secondary">Size: {slot.item.size} | Color: {slot.item.colorName}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-text-muted">
                <div className="h-12 w-9 rounded-sm border border-dashed border-border-medium bg-white flex items-center justify-center shrink-0 text-xs">
                  {slot.position}
                </div>
                <span className="text-xs italic">Empty slot</span>
              </div>
            )}

            {slot.item && (
              <button
                onClick={() => removeItem(slot.slotId)}
                className="text-text-muted hover:text-red-500 p-1.5 active:scale-90 transition-transform cursor-pointer"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-border-light pt-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Subtotal base price:</span>
          <span className="font-heading font-bold text-text-primary text-sm">₹999.00</span>
        </div>
        <div className="text-[10px] text-text-muted">
          *Courier charges are calculated during checkout.
        </div>
        <Button onClick={handleReviewRedirect} className="w-full h-11 uppercase font-bold tracking-wider" disabled={!isComplete}>
          <span>Review Combo</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-body">
      {/* 1. Header & Progress */}
      <div className="rounded-promo bg-white border border-border-light p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
              BUILDING: {activeCombo.comboName}
            </h1>
            <p className="text-xs text-text-secondary">
              Mix and match clothes below. Base price: <span className="font-bold text-brand-primary">₹999.00</span>
            </p>
          </div>
          <div className="text-right sm:text-left flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Progress: {selectedCount} of {activeCombo.itemLimit} Selected
            </span>
            {isComplete ? (
              <span className="text-xs font-bold text-brand-primary bg-brand-primary-soft px-2.5 py-0.5 rounded-full">
                Combo Completed!
              </span>
            ) : (
              <span className="text-xs font-semibold text-text-muted">
                {remainingCount} slot{remainingCount > 1 ? "s" : ""} remaining
              </span>
            )}
          </div>
        </div>

        <Progress value={selectedCount} max={activeCombo.itemLimit} className="h-2.5" />
      </div>

      {/* 2. Main Builder Interface */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Left Column: Filter panel & Product Grid */}
        <div className="space-y-6">
          {/* Controls bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-bg-secondary p-4 rounded-card border border-border-light">
            {/* Gender tabs */}
            <div className="flex gap-1.5 w-full md:w-auto bg-white p-1 rounded-control border border-border-light">
              {(["all", "men", "women"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={cn(
                    "flex-1 md:flex-none text-xs font-bold font-heading px-4 py-2 rounded-control capitalize cursor-pointer",
                    genderFilter === g
                      ? "bg-brand-primary text-white"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search styles/codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-control border border-border-light bg-white text-xs font-body focus:outline-none focus:ring-1 focus:ring-brand-primary text-text-primary"
              />
            </div>
          </div>

          {/* Category Quick Scroll (Horizontal) */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin select-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "h-8 px-4 rounded-full border text-xs font-semibold font-heading shrink-0 transition-colors cursor-pointer",
                selectedCategory === "all"
                  ? "border-brand-primary bg-brand-primary-soft text-brand-primary"
                  : "border-border-light bg-white text-text-secondary hover:bg-bg-secondary"
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
                    "h-8 px-4 rounded-full border text-xs font-semibold font-heading shrink-0 transition-colors cursor-pointer",
                    selectedCategory === cat.id
                      ? "border-brand-primary bg-brand-primary-soft text-brand-primary"
                      : "border-border-light bg-white text-text-secondary hover:bg-bg-secondary"
                  )}
                >
                  {cat.name}
                </button>
              ))}
          </div>

          {/* Builder Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-promo border border-dashed border-border-medium p-12 text-center max-w-sm mx-auto font-body space-y-3">
              <span className="text-3xl block">🔍</span>
              <h3 className="font-heading font-bold text-sm text-text-primary">No matching styles found</h3>
              <p className="text-xs text-text-secondary">
                Try modifying your category filters or clearing search keys.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Summary Panel (Desktop) */}
        <aside className="hidden lg:block bg-white p-6 rounded-card border border-border-light shadow-sm sticky top-24 self-start">
          <SlotsSummary />
        </aside>
      </div>

      {/* Floating Action Bar (Mobile View) */}
      <div className="lg:hidden fixed bottom-18 left-4 right-4 z-30">
        <Sheet open={mobileSummaryOpen} onOpenChange={setMobileSummaryOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="w-full justify-between shadow-lg h-12 uppercase font-bold tracking-wide font-heading cursor-pointer">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4.5 w-4.5" />
                <span>View Combo slots</span>
              </div>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                {selectedCount}/{activeCombo.itemLimit}
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Your Combo Summary</SheetTitle>
            </SheetHeader>
            <SlotsSummary />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
