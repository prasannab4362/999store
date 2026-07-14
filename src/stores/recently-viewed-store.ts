import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentlyViewedStoreState {
  items: string[]; // Product slugs
  addRecentlyViewed: (slug: string) => void;
  clearRecentlyViewed: () => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,

      setHydrated: (state) => set({ isHydrated: state }),

      addRecentlyViewed: (slug) => {
        const { items } = get();
        // Remove existing to push to the front
        const filtered = items.filter((s) => s !== slug);
        // Add to front and limit to 12 items
        const updated = [slug, ...filtered].slice(0, 12);
        set({ items: updated });
      },

      clearRecentlyViewed: () => set({ items: [] }),
    }),
    {
      name: "999-combo-store-recently-viewed",
      skipHydration: true,
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
export default useRecentlyViewedStore;
