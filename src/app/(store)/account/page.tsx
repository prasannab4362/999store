"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";
import { formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { ArrowRight, ShoppingBag, Heart, Clock, UserCheck, RotateCcw } from "lucide-react";
import { products } from "@/data/mock/products";
import { Button } from "@/components/ui/button";

export default function AccountOverviewPage() {
  const [sessionUser, setSessionUser] = React.useState<any | null>(null);
  const [recentOrder, setRecentOrder] = React.useState<any | null>(null);
  const [claimsCount, setClaimsCount] = React.useState(0);

  const wishlistCount = useWishlistStore((state) => state.isHydrated ? state.items.length : 0);
  const recentlyViewedSlugs = useRecentlyViewedStore((state) => state.isHydrated ? state.items : []);

  // Hydrate local data
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setSessionUser(JSON.parse(localStorage.getItem("999-store-session") || "null"));
      const orders = JSON.parse(localStorage.getItem("999-store-orders") || "[]");
      if (orders.length > 0) {
        setRecentOrder(orders[0]);
      }
      const claims = JSON.parse(localStorage.getItem("999-store-claims") || "[]");
      setClaimsCount(claims.length);
    }
  }, []);

  // Resolve recently viewed products
  const recentlyViewedProducts = React.useMemo(() => {
    return recentlyViewedSlugs
      .map((slug) => products.find((p) => p.slug === slug))
      .filter((p): p is typeof p & object => !!p)
      .slice(0, 4);
  }, [recentlyViewedSlugs]);

  if (!sessionUser) return null;

  return (
    <div className="space-y-8 font-body">
      {/* Greetings */}
      <div className="space-y-1 border-b border-border-light pb-4">
        <h1 className="text-xl font-extrabold font-heading text-text-primary uppercase tracking-tight">
          ACCOUNT OVERVIEW
        </h1>
        <p className="text-xs text-text-secondary">
          Manage your account profile, track order logistics, and submit damage claims.
        </p>
      </div>

      {/* Analytics stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        <div className="bg-bg-secondary/40 border border-border-light p-4 rounded-card text-center space-y-1">
          <Heart className="h-5 w-5 text-red-500 mx-auto fill-current" />
          <span className="block text-lg font-bold font-heading text-text-primary">{wishlistCount}</span>
          <span className="block text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Wishlist Styles</span>
        </div>

        <div className="bg-bg-secondary/40 border border-border-light p-4 rounded-card text-center space-y-1">
          <ShoppingBag className="h-5 w-5 text-brand-primary mx-auto" />
          <span className="block text-lg font-bold font-heading text-text-primary">{recentOrder ? "1+" : "0"}</span>
          <span className="block text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Total Orders</span>
        </div>

        <div className="bg-bg-secondary/40 border border-border-light p-4 rounded-card text-center space-y-1 col-span-2 sm:col-span-1">
          <RotateCcw className="h-5 w-5 text-amber-600 mx-auto" />
          <span className="block text-lg font-bold font-heading text-text-primary">{claimsCount}</span>
          <span className="block text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Damage Claims</span>
        </div>
      </div>

      {/* Recent Order */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider">
            Recent Order
          </h3>
          {recentOrder && (
            <Link href="/account/orders" className="text-xs text-brand-primary hover:underline font-semibold font-heading flex items-center gap-1">
              <span>All Orders</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {recentOrder ? (
          <div className="border border-border-light p-4 rounded-promo space-y-4">
            <div className="flex justify-between text-xs text-text-secondary border-b border-border-light pb-3">
              <div>
                <span>Order: <strong>{recentOrder.orderNumber}</strong></span>
              </div>
              <div>
                <span className="bg-brand-primary-soft text-brand-primary px-2.5 py-0.5 rounded-full font-bold capitalize">
                  {recentOrder.orderStatus.replace("_", " ")}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-semibold text-text-primary">{recentOrder.comboGroups[0].comboName}</p>
                <p className="text-[10px] text-text-muted">{recentOrder.comboGroups[0].items.length} items purchased</p>
              </div>
              <span className="font-bold text-text-primary">{formatCurrency(recentOrder.grandTotalMinor)}</span>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button size="sm" variant="outline" asChild className="h-8">
                <Link href={`/track-order?orderId=${recentOrder.id}&phone=${recentOrder.customer.phone}`}>Track Details</Link>
              </Button>
              <Button size="sm" asChild className="h-8">
                <Link href={`/account/orders/${recentOrder.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-promo border border-dashed border-border-medium p-8 text-center text-xs text-text-muted">
            You haven't placed any orders yet.
          </div>
        )}
      </div>

      {/* Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border-light">
          <h3 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider">
            Recently Viewed Styles
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentlyViewedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group border border-border-light rounded-card overflow-hidden bg-white hover:border-brand-primary transition-colors flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-bg-secondary w-full">
                  <Image
                    src={p.media.find((m) => m.viewType === "front")?.url || p.media[0].url}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-200"
                    unoptimized
                  />
                </div>
                <div className="p-2 space-y-0.5">
                  <h4 className="text-[10px] font-semibold text-text-primary truncate">{p.name}</h4>
                  <span className="text-[10px] font-bold text-brand-primary">₹999</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
