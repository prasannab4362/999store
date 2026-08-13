"use client";

import * as React from "react";
import { ProductCard } from "@/components/commerce/product-card";
import { Product } from "@/types/product";

export function FeaturedProductsSection() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/products?limit=8")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products.slice(0, 8));
        }
      })
      .catch(() => {
        // silently handle; products stay empty
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl bg-[#F5F5F7] animate-pulse"
            style={{ height: 340 }}
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted text-sm font-ui">
        No products available yet. Check back soon!
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
