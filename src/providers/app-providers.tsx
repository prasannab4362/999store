"use client";

import * as React from "react";
import { QueryProvider } from "./query-provider";
import { useComboStore } from "@/stores/combo-store";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Rehydrate stores on client mount to prevent SSR mismatch
    const hydrateStores = async () => {
      await Promise.all([
        useComboStore.persist.rehydrate(),
        useCartStore.persist.rehydrate(),
        useWishlistStore.persist.rehydrate(),
        useRecentlyViewedStore.persist.rehydrate(),
      ]);

      useComboStore.setState({ isHydrated: true });
      useCartStore.setState({ isHydrated: true });
      useWishlistStore.setState({ isHydrated: true });
      useRecentlyViewedStore.setState({ isHydrated: true });
    };

    hydrateStores();
  }, []);

  return <QueryProvider>{children}</QueryProvider>;
}
