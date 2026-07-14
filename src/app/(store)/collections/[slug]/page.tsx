"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/commerce/product-card";
import { products } from "@/data/mock/products";
import { collections } from "@/data/mock/collections";

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const collection = React.useMemo(() => collections.find((c) => c.id === slug), [slug]);

  const collectionProducts = React.useMemo(() => {
    return products.filter((p) => p.collectionIds.includes(slug));
  }, [slug]);

  if (!collection) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4 space-y-4 font-body">
        <h1 className="text-3xl font-extrabold font-heading text-text-primary">Collection Not Found</h1>
        <p className="text-sm text-text-secondary">
          The style capsule you are looking for may have moved or is expired.
        </p>
        <Button onClick={() => router.push("/collections")}>Back to Collections</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-body">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border-light pb-4">
        <Link href="/collections" className="p-2 -ml-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight uppercase">
            Collection: {collection.name}
          </h1>
          <p className="text-xs text-text-secondary">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Grid */}
      {collectionProducts.length > 0 ? (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {collectionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-promo border border-dashed border-border-medium p-12 text-center text-xs text-text-muted">
          No styles currently in this collection. Check back soon!
        </div>
      )}
    </div>
  );
}
