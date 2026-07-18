"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown, Grid, LayoutGrid, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/commerce/product-card";
import { products } from "@/data/mock/products";
import { categories } from "@/data/mock/categories";
import { Product, ProductSize } from "@/types/product";
import { cn } from "@/lib/utils/cn";

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
    <div className="space-y-6 font-body">
      {/* Combo Tier Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider">Combo Tier</h4>
        <div className="grid grid-cols-3 gap-1.5">
          {["2", "3", "5", "8", "10"].map((tierNum) => (
            <button
              key={tierNum}
              onClick={() => setParam("combo", comboFilter === tierNum ? null : tierNum)}
              className={cn(
                "text-center text-xs py-1.5 rounded-control border transition-colors cursor-pointer font-bold",
                comboFilter === tierNum
                  ? "border-brand-primary bg-brand-primary-soft text-brand-primary"
                  : "border-border-light text-text-secondary hover:bg-bg-secondary"
              )}
            >
              {tierNum} Tier
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider">Gender</h4>
        <div className="flex flex-col gap-2">
          {["men", "women"].map((g) => (
            <button
              key={g}
              onClick={() => setParam("gender", genderFilter === g ? null : g)}
              className={cn(
                "text-left text-sm py-1.5 px-3 rounded-control border transition-colors cursor-pointer",
                genderFilter === g
                  ? "border-brand-primary bg-brand-primary-soft text-brand-primary font-bold"
                  : "border-border-light text-text-secondary hover:bg-bg-secondary"
              )}
            >
              {g === "men" ? "Men's Collection" : "Women's Collection"}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider">Category</h4>
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-2">
          {categories
            .filter((c) => !genderFilter || c.gender === genderFilter || c.gender === "unisex")
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => setParam("category", categoryFilter === cat.id ? null : cat.id)}
                className={cn(
                  "text-left text-xs py-1.5 px-3 rounded-control border transition-colors cursor-pointer",
                  categoryFilter === cat.id
                    ? "border-brand-primary bg-brand-primary-soft text-brand-primary font-bold"
                    : "border-border-light text-text-secondary hover:bg-bg-secondary"
                )}
              >
                {cat.name}
              </button>
            ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider">Size</h4>
        <div className="flex flex-wrap gap-2">
          {uniqueSizes.map((sz) => (
            <button
              key={sz}
              onClick={() => setParam("size", sizeFilter === sz ? null : sz)}
              className={cn(
                "h-8 px-3 rounded-control border text-xs font-semibold font-heading transition-colors cursor-pointer",
                sizeFilter === sz
                  ? "border-brand-primary bg-brand-primary-soft text-brand-primary"
                  : "border-border-light text-text-secondary hover:bg-bg-secondary"
              )}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider">Color</h4>
        <div className="flex flex-wrap gap-2">
          {uniqueColors.map((col) => (
            <button
              key={col}
              onClick={() => setParam("color", colorFilter === col ? null : col)}
              className={cn(
                "px-3 py-1.5 rounded-full border text-xs font-semibold font-heading transition-colors cursor-pointer",
                colorFilter === col
                  ? "border-brand-primary bg-brand-primary-soft text-brand-primary"
                  : "border-border-light text-text-secondary hover:bg-bg-secondary"
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-body">
      {/* Header / Title controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border-light pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
            EXPLORE PRODUCTS
          </h1>
          <p className="text-xs text-text-secondary">
            Showing {sortedProducts.length} results {searchFilter ? `for "${searchFilter}"` : ""}
          </p>
        </div>

        {/* Sort & Grid settings */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1 cursor-pointer">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <FiltersContent />
                <Button className="mt-8 w-full" onClick={() => setMobileFilterOpen(false)}>
                  Apply Filters
                </Button>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-secondary whitespace-nowrap">Sort by</span>
            <Select value={sortOption} onValueChange={(val) => setParam("sort", val)}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Recommended" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="popular">Trending & Popular</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="name-desc">Name: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Filter chips / Active filters summary */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-text-secondary">
          <span className="font-semibold text-text-primary">Active filters:</span>
          {genderFilter && (
            <span className="inline-flex items-center gap-1 bg-bg-secondary px-2.5 py-1 rounded-full border border-border-light">
              Gender: {genderFilter}
              <X className="h-3.5 w-3.5 cursor-pointer text-text-muted hover:text-text-primary" onClick={() => setParam("gender", null)} />
            </span>
          )}
          {categoryFilter && (
            <span className="inline-flex items-center gap-1 bg-bg-secondary px-2.5 py-1 rounded-full border border-border-light">
              Category: {categoryFilter}
              <X className="h-3.5 w-3.5 cursor-pointer text-text-muted hover:text-text-primary" onClick={() => setParam("category", null)} />
            </span>
          )}
          {comboFilter && (
            <span className="inline-flex items-center gap-1 bg-bg-secondary px-2.5 py-1 rounded-full border border-border-light">
              Combo: {comboFilter} Items
              <X className="h-3.5 w-3.5 cursor-pointer text-text-muted hover:text-text-primary" onClick={() => setParam("combo", null)} />
            </span>
          )}
          {sizeFilter && (
            <span className="inline-flex items-center gap-1 bg-bg-secondary px-2.5 py-1 rounded-full border border-border-light">
              Size: {sizeFilter}
              <X className="h-3.5 w-3.5 cursor-pointer text-text-muted hover:text-text-primary" onClick={() => setParam("size", null)} />
            </span>
          )}
          {colorFilter && (
            <span className="inline-flex items-center gap-1 bg-bg-secondary px-2.5 py-1 rounded-full border border-border-light">
              Color: {colorFilter}
              <X className="h-3.5 w-3.5 cursor-pointer text-text-muted hover:text-text-primary" onClick={() => setParam("color", null)} />
            </span>
          )}
          {searchFilter && (
            <span className="inline-flex items-center gap-1 bg-bg-secondary px-2.5 py-1 rounded-full border border-border-light">
              Search: "{searchFilter}"
              <X className="h-3.5 w-3.5 cursor-pointer text-text-muted hover:text-text-primary" onClick={() => setParam("q", null)} />
            </span>
          )}
          <button onClick={handleClearFilters} className="text-brand-primary font-bold hover:underline cursor-pointer ml-1">
            Clear All
          </button>
        </div>
      )}

      {/* Main layout */}
      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block border-r border-border-light pr-6 space-y-6 self-start">
          <div className="flex items-center justify-between border-b border-border-light pb-3">
            <span className="font-heading font-bold text-sm text-text-primary tracking-wide">Filters</span>
            {activeFiltersCount > 0 && (
              <button onClick={handleClearFilters} className="text-xs text-brand-primary hover:underline cursor-pointer font-bold">
                Reset
              </button>
            )}
          </div>
          <FiltersContent />
        </aside>

        {/* Product Grid */}
        <div className="space-y-6">
          {sortedProducts.length > 0 ? (
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-promo border border-dashed border-border-medium p-12 text-center space-y-4 max-w-md mx-auto mt-8 font-body">
              <div className="text-4xl text-text-muted">🔍</div>
              <h3 className="font-heading font-bold text-lg text-text-primary">No products found</h3>
              <p className="text-xs text-text-secondary">
                We couldn't find any products matching your current search criteria. Try modifying your filters or clearing search keys.
              </p>
              <Button onClick={handleClearFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl text-center py-20 px-4 space-y-4 font-body text-xs text-text-secondary">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
