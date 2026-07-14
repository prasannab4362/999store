import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistStoreState {
  items: string[]; // Product slugs
  toggleWishlist: (slug: string) => void;
  addWishlist: (slug: string) => void;
  removeWishlist: (slug: string) => void;
  clearWishlist: () => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
}

export const useWishlistStore = create<WishlistStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,

      setHydrated: (state) => set({ isHydrated: state }),

      toggleWishlist: (slug) => {
        const { items } = get();
        const exists = items.includes(slug);
        set({
          items: exists ? items.filter((s) => s !== slug) : [...items, slug],
        });
      },

      addWishlist: (slug) => {
        const { items } = get();
        if (!items.includes(slug)) {
          set({ items: [...items, slug] });
        }
      },

      removeWishlist: (slug) => {
        set((state) => ({
          items: state.items.filter((s) => s !== slug),
        }));
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "999-combo-store-wishlist",
      skipHydration: true,
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
