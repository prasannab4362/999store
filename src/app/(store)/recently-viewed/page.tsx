"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";
import { products } from "@/data/mock/products";
import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function RecentlyViewedPage() {
  const router = useRouter();
  const { items, isHydrated, clearRecentlyViewed } = useRecentlyViewedStore();

  const recentlyViewedProducts = React.useMemo(() => {
    return items
      .map((slug) => products.find((p) => p.slug === slug))
      .filter((p): p is typeof p & object => !!p);
  }, [items]);

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 font-body">
        <p className="text-sm text-text-secondary">Loading recently viewed styles...</p>
      </div>
    );
  }

  if (recentlyViewedProducts.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4 space-y-6 font-body">
        <Clock className="h-12 w-12 text-text-muted mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
            No Recently Viewed Styles
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Styles you look at will show up here so you can find them again easily. Explore the catalog to start viewing!
          </p>
        </div>
        <Button size="lg" className="w-full uppercase font-bold tracking-wider" onClick={() => router.push("/products")}>
          Explore Collection
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-body">
      <div className="flex items-center justify-between border-b border-border-light pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
            RECENTLY VIEWED
          </h1>
          <p className="text-xs text-text-secondary">
            Your recently visited products (showing last {recentlyViewedProducts.length} items)
          </p>
        </div>
        <button onClick={clearRecentlyViewed} className="text-xs text-text-muted hover:text-red-500 font-semibold cursor-pointer">
          Clear History
        </button>
      </div>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {recentlyViewedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
