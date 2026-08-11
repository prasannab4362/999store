"use client";

import * as React from "react";
import { QueryProvider } from "./query-provider";
import { useComboStore } from "@/stores/combo-store";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";

import { PromoToast } from "@/components/commerce/promo-toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Rehydrate stores synchronously on client mount to prevent SSR mismatch & render lag
    useComboStore.persist.rehydrate();
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
    useRecentlyViewedStore.persist.rehydrate();

    useComboStore.setState({ isHydrated: true });
    useCartStore.setState({ isHydrated: true });
    useWishlistStore.setState({ isHydrated: true });
    useRecentlyViewedStore.setState({ isHydrated: true });
  }, []);

  return (
    <QueryProvider>
      {children}
      <PromoToast />
    </QueryProvider>
  );
}
