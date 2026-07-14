"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlistStore } from "@/stores/wishlist-store";
import { products } from "@/data/mock/products";
import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const router = useRouter();
  const { items, isHydrated, clearWishlist } = useWishlistStore();

  const wishlistedProducts = React.useMemo(() => {
    return items
      .map((slug) => products.find((p) => p.slug === slug))
      .filter((p): p is typeof p & object => !!p);
  }, [items]);

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 font-body">
        <p className="text-sm text-text-secondary">Loading your wishlist...</p>
      </div>
    );
  }

  if (wishlistedProducts.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4 space-y-6 font-body">
        <Heart className="h-12 w-12 text-text-muted mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold font-heading text-text-primary tracking-tight">
            Your Wishlist Is Empty
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Save your favorite styles to review later. Click the heart icon on any product cards to add styles here.
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
            MY WISHLIST
          </h1>
          <p className="text-xs text-text-secondary">
            Your saved styles ({wishlistedProducts.length} items)
          </p>
        </div>
        <button onClick={clearWishlist} className="text-xs text-text-muted hover:text-red-500 font-semibold cursor-pointer">
          Remove All
        </button>
      </div>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {wishlistedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
