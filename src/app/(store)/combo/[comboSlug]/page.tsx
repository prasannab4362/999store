"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useComboStore, useActiveComboDetails } from "@/stores/combo-store";
import { Product } from "@/types/product";
import { categories } from "@/data/mock/categories";
import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Trash2, ShoppingBag, Search, RefreshCw, ArrowRight, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { comboConfigs } from "@/config/combo";
import { motion, AnimatePresence } from "framer-motion";

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
  const [products, setProducts] = React.useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(true);

  // Fetch products from DB
  React.useEffect(() => {
    fetch("/api/products?limit=200")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.products ?? []);
      })
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, []);

  React.useEffect(() => {
    if (activeCombo?.selectedCategory && genderFilter === "all") {
      setGenderFilter(activeCombo.selectedCategory as "men" | "women");
    }
  }, [activeCombo?.selectedCategory]);

  React.useEffect(() => {
    if (!activeCombo) {
      const config = comboConfigs.find((c) => c.slug === comboSlug);
      if (config) {
        startCombo(config);
      }
    } else if (activeCombo.comboSlug !== comboSlug) {
      router.replace(`/combo/${activeCombo.comboSlug}`);
    }
  }, [comboSlug, activeCombo, router, startCombo]);

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
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
        <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <div className="h-4 w-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
          Loading Combo configuration...
        </div>
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

  const handleCancelEditing = () => {
    useComboStore.setState({ activeCombo: null });
    toast.info("Editing cancelled. Your original combo in the cart remains unchanged.");
    router.push("/cart");
  };

  const progressPct = Math.round((selectedCount / activeCombo.itemLimit) * 100);

  /* ─────────────────────────────────────────────
     Slots Summary (Sidebar / Sheet)
  ───────────────────────────────────────────── */
  const SlotsSummary = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex flex-col gap-4 font-body h-full w-full min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h3 className="font-heading font-black text-sm text-text-primary uppercase tracking-widest">
            {activeCombo?.editingGroupId ? "Editing Combo" : "Your Combo"}
          </h3>
          <p className="text-[10px] font-bold text-text-muted mt-0.5 tracking-wider">
            {activeCombo?.selectedCategory ? `${activeCombo.selectedCategory.toUpperCase()} ` : ""}{activeCombo?.comboName?.toUpperCase()}
          </p>
        </div>
        {activeCombo?.editingGroupId ? (
          <button
            onClick={handleCancelEditing}
            className="text-[10px] text-red-500 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer transition-colors uppercase tracking-widest bg-red-50 px-2 py-1 rounded-md"
          >
            <X className="h-3 w-3" />
            <span>Cancel</span>
          </button>
        ) : (
          <button
            onClick={resetCombo}
            className="text-[10px] text-text-muted hover:text-text-primary font-bold flex items-center gap-1 cursor-pointer transition-colors uppercase tracking-widest bg-bg-secondary px-2 py-1 rounded-md"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2 shrink-0">
        <div className="flex justify-between text-[10px] font-bold text-text-muted uppercase tracking-widest">
          <span>{selectedCount} of {activeCombo.itemLimit} selected</span>
          {isComplete && <span className="text-emerald-600">Complete ✓</span>}
        </div>
        <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-text-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Slots */}
      <div className={cn("flex-1 space-y-2 overflow-y-auto min-w-0 pr-1 scrollbar-thin", compact ? "max-h-[45vh]" : "max-h-[calc(100dvh-360px)]")}>
        <AnimatePresence>
          {activeCombo.slots.map((slot, index) => (
            <motion.div
              key={slot.slotId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className={cn(
                "p-3 rounded-xl border flex items-center gap-3 transition-all min-w-0 shadow-sm",
                slot.item
                  ? "border-[rgba(0,0,0,0.06)] bg-bg-secondary"
                  : "border-dashed border-border-medium/30 bg-white"
              )}
            >
              {slot.item ? (
                <div className="relative h-14 w-11 rounded-lg overflow-hidden bg-white shrink-0 border border-border-light shadow-sm">
                  <Image src={slot.item.image} alt={slot.item.productName} fill sizes="44px" className="object-cover" />
                  <span className="absolute top-1 left-1 bg-white text-text-primary font-heading font-black text-[8px] h-4 w-4 rounded-full flex items-center justify-center shadow-sm border border-border-light">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </div>
              ) : (
                <div className="h-14 w-11 rounded-lg border border-dashed border-border-medium/30 bg-bg-secondary flex items-center justify-center shrink-0 text-xs font-heading font-black text-text-muted">
                  {(index + 1).toString().padStart(2, "0")}
                </div>
              )}

              <div className="flex-1 min-w-0">
                {slot.item ? (
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-heading font-bold text-xs text-text-primary truncate">{slot.item.productName}</h4>
                    <p className="text-[10px] text-text-muted truncate">{slot.item.colorName} · {slot.item.size}</p>
                    <button
                      onClick={() => removeItem(slot.slotId)}
                      className="text-[9px] font-bold text-text-muted hover:text-red-500 uppercase tracking-wider transition-colors cursor-pointer mt-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <h4 className="font-heading font-bold text-xs text-text-muted uppercase tracking-wider">Empty Pick</h4>
                    <p className="text-[10px] text-text-muted/60 leading-tight">Choose one more style</p>
                  </div>
                )}
              </div>

              {slot.item && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-auto" />}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-[rgba(0,0,0,0.06)] pt-4 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Combo Price</span>
          <span className="font-heading font-black text-text-primary text-2xl">₹999</span>
        </div>
        <p className="text-[9px] text-text-muted uppercase tracking-wider">*Courier charges extra</p>
        <Button
          onClick={handleReviewRedirect}
          className={cn(
            "w-full h-11 uppercase font-bold tracking-widest text-xs cursor-pointer transition-all",
            isComplete
              ? "bg-[#1D1D1F] text-white hover:bg-[#2C2C2E] shadow-sm hover:-translate-y-[2px]"
              : "bg-bg-secondary text-text-muted cursor-not-allowed border border-[rgba(0,0,0,0.06)]"
          )}
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
    <main className="w-full min-w-0 bg-[#FAFAF9] min-h-screen">
      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-6 lg:px-8 py-4 sm:py-6 font-body pb-[180px] xl:pb-10">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[24px] bg-bg-secondary border border-[rgba(0,0,0,0.06)] p-5 sm:p-6 mb-5 sm:mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em] font-ui">
                  Building Your {activeCombo.itemLimit}-Pick Combo
                </span>
                <span className="bg-white border border-[rgba(0,0,0,0.06)] text-text-primary px-2.5 py-0.5 rounded-full text-[10px] font-black font-heading tracking-widest">
                  ₹999 FLAT
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border-medium/30 shrink-0">
              <div className="text-left sm:text-right">
                <p className="text-xs font-black text-text-primary uppercase tracking-widest">
                  {selectedCount} / {activeCombo.itemLimit} Picked
                </p>
                <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-0.5", isComplete ? "text-emerald-600" : "text-text-muted")}>
                  {isComplete ? "Combo Ready ✓" : `${remainingCount} Picks Left`}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 h-1.5 bg-white rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-text-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_320px] items-start">

          <div className="min-w-0 space-y-4">

            <div className="grid gap-3 sm:flex sm:items-center sm:justify-between bg-white p-3 rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm">
              <div className="flex gap-1 bg-bg-secondary p-1 rounded-xl border border-[rgba(0,0,0,0.06)] shrink-0">
                {(["all", "men", "women"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={cn(
                      "flex-1 sm:flex-none text-xs font-black font-heading px-4 py-1.5 rounded-lg capitalize cursor-pointer transition-all",
                      genderFilter === g
                        ? "bg-text-primary text-white shadow-sm"
                        : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {g === "all" ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 sm:max-w-md min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search styles or codes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-[rgba(0,0,0,0.06)] bg-bg-secondary text-xs font-body focus:outline-none focus:ring-2 focus:ring-text-primary/10 text-text-primary placeholder:text-text-muted transition-all"
                />
              </div>
            </div>

            <div className="w-full min-w-0 overflow-hidden relative">
              <div className="flex gap-2 overflow-x-auto pb-1 px-0.5 scrollbar-none overscroll-x-contain select-none">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "h-8 px-3.5 rounded-full border text-[11px] font-black font-heading shrink-0 transition-all cursor-pointer whitespace-nowrap",
                    selectedCategory === "all"
                      ? "border-text-primary bg-text-primary text-white"
                      : "border-[rgba(0,0,0,0.06)] bg-white text-text-secondary hover:border-text-primary/50"
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
                        "h-8 px-3.5 rounded-full border text-[11px] font-black font-heading shrink-0 transition-all cursor-pointer whitespace-nowrap",
                        selectedCategory === cat.id
                          ? "border-text-primary bg-text-primary text-white"
                          : "border-[rgba(0,0,0,0.06)] bg-white text-text-secondary hover:border-text-primary/50"
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
              </div>
            </div>

            {productsLoading ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-[#F5F5F7] animate-pulse" style={{ height: 300 }} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-border-medium/30 p-12 text-center max-w-sm mx-auto font-body space-y-3">
                <span className="text-3xl block">🔍</span>
                <h3 className="font-heading font-black text-sm text-text-primary uppercase tracking-wide">No matching styles</h3>
                <p className="text-[10px] text-text-secondary leading-relaxed">Try modifying your filters or clearing the search query.</p>
              </div>
            )}
          </div>

          <aside className="hidden xl:block min-w-0">
            <div className="sticky top-20 w-full bg-white p-5 rounded-[24px] border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
              <SlotsSummary />
            </div>
          </aside>
        </div>

        <AnimatePresence>
          {selectedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="xl:hidden fixed bottom-16 left-3 right-3 z-40 bg-white rounded-2xl shadow-xl px-4 py-3.5 border border-[rgba(0,0,0,0.06)] flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-text-primary uppercase tracking-widest">
                    {selectedCount}/{activeCombo.itemLimit} Selected
                  </span>
                </div>
                <span className="font-heading font-black text-text-primary text-lg">₹999</span>
              </div>

              <div className="h-1 bg-bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-text-primary rounded-full"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div className="flex gap-2">
                <Sheet open={mobileSummaryOpen} onOpenChange={setMobileSummaryOpen}>
                  <SheetTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-10 font-black uppercase tracking-widest text-[10px] gap-1.5 cursor-pointer rounded-xl border-[rgba(0,0,0,0.06)] text-text-primary bg-bg-secondary"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>View Combo</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-[24px] max-h-[85dvh] flex flex-col p-0 bg-white border-[rgba(0,0,0,0.06)] shadow-xl">
                    <SheetHeader className="p-4 border-b border-border-medium/30 text-left bg-bg-secondary shrink-0">
                      <SheetTitle className="text-sm font-black font-heading uppercase text-text-primary tracking-widest">
                        Selected Items ({selectedCount}/{activeCombo.itemLimit})
                      </SheetTitle>
                    </SheetHeader>
                    <div className="p-4 overflow-y-auto space-y-3 font-body bg-white">
                      {activeCombo.slots.map((slot, idx) => (
                        <div key={slot.slotId} className={cn("p-3 rounded-xl border flex items-center gap-3", slot.item ? "bg-bg-secondary border-border-medium/30" : "bg-white border-dashed border-border-medium/30")}>
                          {slot.item ? (
                            <>
                              <div className="relative h-12 w-10 rounded-lg overflow-hidden shrink-0 border border-border-light shadow-sm bg-white">
                                <Image src={slot.item.image} alt={slot.item.productName} fill sizes="40px" className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black font-heading text-text-primary truncate">{slot.item.productName}</p>
                                <p className="text-[10px] text-text-muted font-ui truncate mt-0.5">{slot.item.size} • {slot.item.colorName}</p>
                              </div>
                              <button onClick={() => removeItem(slot.slotId)} className="text-text-muted hover:text-red-500 p-2 rounded-md hover:bg-red-50 transition-colors">
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="h-10 w-10 rounded-full border border-dashed border-border-medium/30 flex items-center justify-center bg-bg-secondary shrink-0">
                                <span className="text-xs font-black text-text-muted font-heading">{idx + 1}</span>
                              </div>
                              <span className="text-[11px] font-ui text-text-muted">Empty Slot</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>

                <Button
                  onClick={handleReviewRedirect}
                  disabled={!isComplete}
                  size="sm"
                  className={cn(
                    "flex-1 h-10 font-black uppercase tracking-widest text-[10px] gap-1 shrink-0 rounded-xl cursor-pointer",
                    isComplete
                      ? "bg-text-primary text-white"
                      : "bg-bg-secondary text-text-muted"
                  )}
                >
                  <span>Review</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
