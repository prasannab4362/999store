"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/commerce/product-card";
import { products } from "@/data/mock/products";
import { categories } from "@/data/mock/categories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";
import { Suspense } from "react";

function CategoryContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const category = React.useMemo(() => categories.find((c) => c.id === slug), [slug]);

  // Filters state
  const sizeFilter = searchParams.get("size");
  const colorFilter = searchParams.get("color");
  const sortOption = searchParams.get("sort") || "recommended";

  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  // Set URL parameter helper
  const setParam = (key: string, value: string | null) => {
    const p = new URLSearchParams(searchParams.toString());
    if (value) {
      p.set(key, value);
    } else {
      p.delete(key);
    }
    router.push(`/categories/${slug}?${p.toString()}`);
  };

  const handleClearFilters = () => {
    router.push(`/categories/${slug}`);
  };

  // Filter products for category
  const filteredProducts = React.useMemo(() => {
    if (!category) return [];

    return products.filter((product) => {
      // Category check
      if (product.categoryId !== category.id) return false;

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
  }, [category, sizeFilter, colorFilter]);

  // Sort products
  const sortedProducts = React.useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortOption === "newest") {
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

  // Derived unique sizes
  const uniqueSizes = React.useMemo(() => {
    if (!category) return [];
    const sizes = new Set<string>();
    products
      .filter((p) => p.categoryId === category.id)
      .forEach((p) => p.variants.forEach((v) => sizes.add(v.size)));
    return Array.from(sizes).sort();
  }, [category]);

  // Derived unique colors
  const uniqueColors = React.useMemo(() => {
    if (!category) return [];
    const colorNames = new Set<string>();
    products
      .filter((p) => p.categoryId === category.id)
      .forEach((p) => p.variants.forEach((v) => colorNames.add(v.color.name)));
    return Array.from(colorNames).sort();
  }, [category]);

  const activeFiltersCount = [sizeFilter, colorFilter].filter(Boolean).length;

  if (!category) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4 space-y-4 font-body">
        <h1 className="text-3xl font-extrabold font-heading text-text-primary">Category Not Found</h1>
        <p className="text-sm text-text-secondary">
          The category you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => router.push("/products")}>Back to Products</Button>
      </div>
    );
  }

  const FiltersContent = () => (
    <div className="space-y-6 font-body">
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-body">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-3 border-b border-border-light pb-4">
        <Link href="/products" className="p-2 -ml-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
            {category.name}
          </h1>
          <p className="text-xs text-text-secondary">
            Explore our curated selection of {category.name.toLowerCase()}. Eligible for the flat ₹999 combo store model!
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between border-b border-border-light pb-3">
        <span className="text-xs text-text-secondary font-semibold">
          Showing {sortedProducts.length} styles
        </span>

        <div className="flex items-center gap-3">
          {/* Mobile Filter */}
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
                  <SheetTitle>Filter {category.name}</SheetTitle>
                </SheetHeader>
                <FiltersContent />
                <Button className="mt-8 w-full" onClick={() => setMobileFilterOpen(false)}>
                  Apply Filters
                </Button>
              </SheetContent>
            </Sheet>
          </div>

          <Select value={sortOption} onValueChange={(val) => setParam("sort", val)}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Recommended" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="popular">Trending & Popular</SelectItem>
              <SelectItem value="rating">Highest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
          <span className="font-semibold text-text-primary">Active filters:</span>
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
          <button onClick={handleClearFilters} className="text-brand-primary font-bold hover:underline cursor-pointer ml-1">
            Clear All
          </button>
        </div>
      )}

      {/* Main layout */}
      <div className="grid md:grid-cols-[200px_1fr] gap-8">
        <aside className="hidden md:block border-r border-border-light pr-6 space-y-6 self-start">
          <div className="flex items-center justify-between border-b border-border-light pb-2">
            <span className="font-heading font-bold text-sm text-text-primary tracking-wide">Filters</span>
            {activeFiltersCount > 0 && (
              <button onClick={handleClearFilters} className="text-xs text-brand-primary hover:underline cursor-pointer font-bold">
                Reset
              </button>
            )}
          </div>
          <FiltersContent />
        </aside>

        <div>
          {sortedProducts.length > 0 ? (
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-promo border border-dashed border-border-medium p-12 text-center text-xs text-text-muted max-w-sm mx-auto">
              No styles currently match these filters. Try resetting them.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CategoryDetailPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl text-center py-20 font-body text-xs text-text-secondary">Loading category details...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
