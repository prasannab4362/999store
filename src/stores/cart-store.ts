import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartComboGroup, AppliedCoupon } from "@/types/cart";

export interface CartStoreState {
  comboGroups: CartComboGroup[];
  coupon: AppliedCoupon | null;
  addComboGroup: (group: Omit<CartComboGroup, "id" | "createdAt">) => void;
  removeComboGroup: (groupId: string) => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      comboGroups: [],
      coupon: null,
      isHydrated: false,

      setHydrated: (state) => set({ isHydrated: state }),

      addComboGroup: (group) => {
        // Deep copy items to create an immutable snapshot
        const itemsSnapshot = group.items.map((item) => ({ ...item }));

        const newGroup: CartComboGroup = {
          id: `group-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          comboId: group.comboId,
          comboSlug: group.comboSlug,
          comboName: group.comboName,
          itemLimit: group.itemLimit,
          basePriceMinor: group.basePriceMinor,
          items: itemsSnapshot,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          comboGroups: [...state.comboGroups, newGroup],
        }));
      },

      removeComboGroup: (groupId) => {
        set((state) => ({
          comboGroups: state.comboGroups.filter((g) => g.id !== groupId),
        }));
      },

      applyCoupon: (coupon) => {
        set({ coupon });
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      clearCart: () => {
        set({ comboGroups: [], coupon: null });
      },
    }),
    {
      name: "999-combo-store-cart",
      skipHydration: true,
      partialize: (state) => ({
        comboGroups: state.comboGroups,
        coupon: state.coupon,
      }),
    }
  )
);
