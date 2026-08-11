"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown, Grid, LayoutGrid, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/commerce/product-card";
import { products } from "@/data/mock/products";
import { categories } from "@/data/mock/categories";
import { comboConfigs } from "@/config/combo";
import { Product, ProductSize } from "@/types/product";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

import { Suspense } from "react";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state sync
  const genderFilter = searchParams.get("gender");
  const categoryFilter = searchParams.get("category");
  const sizeFilter = searchParams.get("size");
  const colorFilter = searchParams.get("color");
  const comboFilter = searchParams.get("combo");
  const searchFilter = searchParams.get("q");
  const sortOption = searchParams.get("sort") || "recommended";

  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  // Derived unique sizes
  const uniqueSizes = React.useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((p) => p.variants.forEach((v) => sizes.add(v.size)));
    return Array.from(sizes).sort();
  }, []);

  // Derived unique colors
  const uniqueColors = React.useMemo(() => {
    const colorNames = new Set<string>();
    products.forEach((p) => p.variants.forEach((v) => colorNames.add(v.color.name)));
    return Array.from(colorNames).sort();
  }, []);

  // Set URL parameter helper
  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push("/products");
  };

  // 1. Filter products
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      // Search
      if (searchFilter) {
        const query = searchFilter.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCode = product.productCode.toLowerCase().includes(query);
        const matchesCategory = product.subcategory.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesCategory) return false;
      }

      // Gender
      if (genderFilter && product.gender !== genderFilter && product.gender !== "unisex") {
        return false;
      }

      // Category
      if (categoryFilter && product.categoryId !== categoryFilter) {
        return false;
      }

      // Combo Tier
      if (comboFilter) {
        const targetComboId = `combo-${comboFilter}`;
        if (!product.comboTierIds || !product.comboTierIds.includes(targetComboId as any)) {
          return false;
        }
      }

      // Size / Color
      if (sizeFilter || colorFilter) {
        const hasMatchingVariant = product.variants.some((v) => {
          const matchesSize = !sizeFilter || v.size === sizeFilter;
          const matchesColor = !colorFilter || v.color.name === colorFilter;
          return matchesSize && matchesColor && v.enabled;
        });
        if (!hasMatchingVariant) return false;
      }

      return true;
    });
  }, [genderFilter, categoryFilter, comboFilter, sizeFilter, colorFilter, searchFilter]);

  // 2. Sort products
  const sortedProducts = React.useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortOption === "newest") {
      // Mock newest: sort by product code desc or newArrival flag
      sorted.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
    } else if (sortOption === "popular") {
      sorted.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    } else if (sortOption === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "name-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    return sorted;
  }, [filteredProducts, sortOption]);

  const activeFiltersCount = [genderFilter, categoryFilter, sizeFilter, colorFilter, comboFilter, searchFilter].filter(Boolean).length;

  const FiltersContent = () => (
    <div className="space-y-8 font-body">
      {/* Combo Tier Filter */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold font-ui uppercase text-text-muted tracking-widest">Combo Tier</h4>
        <div className="grid grid-cols-3 gap-2">
          {comboConfigs.map((config) => {
            const tierNum = config.itemLimit.toString();
            return (
              <button
                key={config.id}
                onClick={() => setParam("combo", comboFilter === tierNum ? null : tierNum)}
                className={cn(
                  "text-center text-xs py-2 rounded-full border transition-all duration-300 cursor-pointer font-bold font-ui",
                  comboFilter === tierNum
                    ? "border-black bg-black text-white shadow-sm"
                    : "border-border-medium/60 text-text-secondary hover:border-black/30 hover:text-text-primary"
                )}
              >
                {tierNum} Tier
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold font-ui uppercase text-text-muted tracking-widest">Gender</h4>
        <div className="flex flex-col gap-2">
          {["men", "women"].map((g) => (
            <button
              key={g}
              onClick={() => setParam("gender", genderFilter === g ? null : g)}
              className={cn(
                "text-left text-sm py-2.5 px-4 rounded-[var(--radius-control)] border transition-all duration-300 cursor-pointer font-ui flex items-center justify-between",
                genderFilter === g
                  ? "border-brand-primary bg-brand-primary text-white font-bold shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                  : "border-border-medium/60 text-text-secondary hover:border-border-medium hover:bg-bg-secondary"
              )}
            >
              <span>{g === "men" ? "Men's Collection" : "Women's Collection"}</span>
              {genderFilter === g && <div className="h-2 w-2 rounded-full bg-white shadow-sm" />}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold font-ui uppercase text-text-muted tracking-widest">Category</h4>
        <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-2 scrollbar-thin">
          {categories
            .filter((c) => !genderFilter || c.gender === genderFilter || c.gender === "unisex")
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => setParam("category", categoryFilter === cat.id ? null : cat.id)}
                className={cn(
                  "text-left text-xs py-2 px-3 rounded-md transition-all duration-200 cursor-pointer font-ui flex items-center gap-2 relative",
                  categoryFilter === cat.id
                    ? "text-brand-primary font-bold bg-brand-primary-soft/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
                )}
              >
                {categoryFilter === cat.id && (
                  <motion.div layoutId="activeCategory" className="absolute left-0 w-0.5 h-full bg-brand-primary rounded-r-full" />
                )}
                <span className={cn(categoryFilter === cat.id && "pl-2")}>{cat.name}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold font-ui uppercase text-text-muted tracking-widest">Size</h4>
        <div className="flex flex-wrap gap-2">
          {uniqueSizes.map((sz) => (
            <button
              key={sz}
              onClick={() => setParam("size", sizeFilter === sz ? null : sz)}
              className={cn(
                "min-w-[2.5rem] h-9 px-3 rounded-full border text-xs font-bold font-ui transition-all duration-300 cursor-pointer shadow-sm",
                sizeFilter === sz
                  ? "border-black bg-black text-white scale-105"
                  : "border-border-medium/60 bg-white text-text-secondary hover:text-text-primary hover:border-black/30 hover:scale-105"
              )}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold font-ui uppercase text-text-muted tracking-widest">Color</h4>
        <div className="flex flex-wrap gap-2.5">
          {uniqueColors.map((col) => (
            <button
              key={col}
              onClick={() => setParam("color", colorFilter === col ? null : col)}
              className={cn(
                "px-4 py-2 rounded-full border text-xs font-bold font-ui transition-all duration-300 cursor-pointer shadow-sm",
                colorFilter === col
                  ? "border-brand-primary bg-brand-primary text-white scale-105 shadow-md"
                  : "border-border-medium/60 bg-white text-text-secondary hover:text-text-primary hover:border-black/30 hover:scale-105"
              )}
            >
              {col}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 font-body min-h-[80vh]">
      {/* Header / Title controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 gap-4 border-b border-border-medium/40">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold font-heading text-text-primary tracking-tight">
            Explore Catalog
          </h1>
          <p className="text-sm font-ui text-text-secondary flex items-center gap-2">
            <span>Showing {sortedProducts.length} high-end styles</span>
            {searchFilter && <span className="px-2 py-0.5 bg-bg-secondary rounded-md border border-border-medium/60 text-text-primary font-medium">"{searchFilter}"</span>}
          </p>
        </div>

        {/* Sort & Grid settings */}
        <div className="flex items-center gap-4 self-end md:self-auto">
          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-11 px-5 gap-2 cursor-pointer rounded-full border-border-medium/60 shadow-sm font-ui font-bold">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters {activeFiltersCount > 0 && <span className="bg-brand-primary text-white px-1.5 py-0.5 rounded text-[10px] ml-1">{activeFiltersCount}</span>}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[340px] overflow-y-auto">
                <SheetHeader className="mb-8 border-b border-border-medium/40 pb-4">
                  <SheetTitle className="font-heading text-2xl font-black tracking-tight">Filter Styles</SheetTitle>
                </SheetHeader>
                <FiltersContent />
                <Button className="mt-8 w-full h-12 rounded-full font-ui font-bold tracking-widest uppercase shadow-md active:scale-95 transition-all" onClick={() => setMobileFilterOpen(false)}>
                  Show Results
                </Button>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-bold font-ui text-text-muted uppercase tracking-widest">Sort by</span>
            <Select value={sortOption} onValueChange={(val) => setParam("sort", val)}>
              <SelectTrigger className="w-[180px] h-11 rounded-full border-border-medium/60 bg-white/50 backdrop-blur-md shadow-sm font-ui font-semibold text-text-primary focus:ring-brand-primary/20">
                <SelectValue placeholder="Recommended" />
              </SelectTrigger>
              <SelectContent className="rounded-[var(--radius-card)] shadow-[var(--shadow-lg)] border-border-medium/40 p-1">
                <SelectItem value="recommended" className="rounded-md font-ui font-medium">✨ Recommended</SelectItem>
                <SelectItem value="newest" className="rounded-md font-ui font-medium">🔥 Newest Arrivals</SelectItem>
                <SelectItem value="popular" className="rounded-md font-ui font-medium">📈 Trending</SelectItem>
                <SelectItem value="rating" className="rounded-md font-ui font-medium">⭐ Highest Rating</SelectItem>
                <SelectItem value="name-asc" className="rounded-md font-ui font-medium">Alphabetical: A-Z</SelectItem>
                <SelectItem value="name-desc" className="rounded-md font-ui font-medium">Alphabetical: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Filter chips / Active filters summary */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="flex flex-wrap items-center gap-2 text-[11px] font-ui overflow-hidden"
          >
            <span className="font-bold text-text-muted uppercase tracking-widest mr-1">Active:</span>
            {[
              { key: "gender", label: "Gender", val: genderFilter },
              { key: "category", label: "Category", val: categoryFilter },
              { key: "combo", label: "Combo", val: comboFilter ? `${comboFilter} Tier` : null },
              { key: "size", label: "Size", val: sizeFilter },
              { key: "color", label: "Color", val: colorFilter },
              { key: "q", label: "Search", val: searchFilter ? `"${searchFilter}"` : null },
            ].map(f => f.val && (
              <motion.span 
                key={f.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-full shadow-sm"
              >
                <span className="font-medium opacity-70">{f.label}:</span>
                <span className="font-bold">{f.val}</span>
                <X className="h-3 w-3 ml-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={() => setParam(f.key, null)} />
              </motion.span>
            ))}
            <button 
              onClick={handleClearFilters} 
              className="text-text-secondary hover:text-red-500 font-bold uppercase tracking-widest cursor-pointer ml-2 transition-colors"
            >
              Clear All
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div className="grid md:grid-cols-[260px_1fr] gap-10 xl:gap-14">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block">
          <div className="sticky top-24 bg-white border border-border-medium/40 shadow-[var(--shadow-md)] rounded-[var(--radius-card)] p-6 space-y-8">
            <div className="flex items-center justify-between border-b border-border-medium/40 pb-4">
              <span className="font-heading font-black text-lg text-text-primary tracking-wide">FILTERS</span>
              {activeFiltersCount > 0 && (
                <button onClick={handleClearFilters} className="text-[10px] uppercase tracking-widest text-brand-primary hover:text-brand-primary-hover transition-colors font-bold cursor-pointer">
                  Reset
                </button>
              )}
            </div>
            <FiltersContent />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {sortedProducts.length > 0 ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-3"
              >
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            ) : (
              /* Premium Empty State */
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-[var(--radius-card)] bg-gradient-to-b from-bg-secondary to-white border border-dashed border-border-medium/60 p-16 text-center flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto mt-4 font-body shadow-sm"
              >
                <div className="h-20 w-20 rounded-full bg-white shadow-sm border border-border-medium/40 flex items-center justify-center text-3xl">
                  🔍
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-black text-2xl text-text-primary tracking-tight">No styles found</h3>
                  <p className="text-sm text-text-secondary font-ui max-w-sm mx-auto">
                    We couldn't find any items matching your exact filters. Try adjusting your selections to see more results.
                  </p>
                </div>
                <Button 
                  onClick={handleClearFilters}
                  size="lg"
                  className="rounded-full font-ui font-bold uppercase tracking-widest mt-4 shadow-md"
                >
                  Clear All Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
          <p className="font-ui font-bold text-xs uppercase tracking-widest text-text-muted">Loading Catalog...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
