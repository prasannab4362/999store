import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ActiveCombo, ComboSlot, ComboSelectedItem, ComboActionResult, ProductVariant } from "@/types/product";
import { ComboConfig } from "@/config/combo";
import { validateComboSlots } from "@/features/combo/utils/combo-validation";

export interface ComboStoreState {
  activeCombo: ActiveCombo | null;
  startCombo: (config: ComboConfig) => void;
  addItem: (item: Omit<ComboSelectedItem, "lineId">) => ComboActionResult;
  addItemToSlot: (slotId: string, item: Omit<ComboSelectedItem, "lineId">) => ComboActionResult;
  updateItemVariant: (slotId: string, variant: ProductVariant) => ComboActionResult;
  removeItem: (slotId: string) => void;
  replaceItem: (slotId: string, item: Omit<ComboSelectedItem, "lineId">) => ComboActionResult;
  resetCombo: () => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
}

export const useComboStore = create<ComboStoreState>()(
  persist(
    (set, get) => ({
      activeCombo: null,
      isHydrated: false,

      setHydrated: (state) => set({ isHydrated: state }),

      startCombo: (config) => {
        const slots: ComboSlot[] = Array.from({ length: config.itemLimit }, (_, i) => ({
          slotId: `slot-${i + 1}`,
          position: i + 1,
          item: null,
        }));

        set({
          activeCombo: {
            comboId: config.id,
            comboSlug: config.slug,
            comboName: config.name,
            itemLimit: config.itemLimit,
            basePriceMinor: config.basePriceMinor,
            slots,
            startedAt: new Date().toISOString(),
          },
        });
      },

      addItem: (item) => {
        const { activeCombo } = get();
        if (!activeCombo) {
          return { success: false, error: "NO_ACTIVE_COMBO" };
        }

        // Find first empty slot
        const emptySlot = activeCombo.slots.find((slot) => slot.item === null);
        if (!emptySlot) {
          return { success: false, error: "COMBO_FULL" };
        }

        return get().addItemToSlot(emptySlot.slotId, item);
      },

      addItemToSlot: (slotId, item) => {
        const { activeCombo } = get();
        if (!activeCombo) {
          return { success: false, error: "NO_ACTIVE_COMBO" };
        }

        const slotIndex = activeCombo.slots.findIndex((s) => s.slotId === slotId);
        if (slotIndex === -1) {
          return { success: false, error: "SLOT_NOT_FOUND" };
        }

        // Generate a unique lineId for this combo slot selection
        const lineId = `${item.productId}-${item.variantId}-${Date.now()}`;
        const itemWithLineId: ComboSelectedItem = {
          ...item,
          lineId,
        };

        const updatedSlots = [...activeCombo.slots];
        updatedSlots[slotIndex] = {
          ...updatedSlots[slotIndex],
          item: itemWithLineId,
        };

        set({
          activeCombo: {
            ...activeCombo,
            slots: updatedSlots,
          },
        });

        return { success: true };
      },

      updateItemVariant: (slotId, variant) => {
        const { activeCombo } = get();
        if (!activeCombo) {
          return { success: false, error: "NO_ACTIVE_COMBO" };
        }

        const slotIndex = activeCombo.slots.findIndex((s) => s.slotId === slotId);
        if (slotIndex === -1) {
          return { success: false, error: "SLOT_NOT_FOUND" };
        }

        const currentSlot = activeCombo.slots[slotIndex];
        if (!currentSlot.item) {
          return { success: false, error: "INVALID_PRODUCT" };
        }

        if (!variant.enabled) {
          return { success: false, error: "VARIANT_DISABLED" };
        }

        if (variant.stock <= 0) {
          return { success: false, error: "OUT_OF_STOCK" };
        }

        const updatedItem: ComboSelectedItem = {
          ...currentSlot.item,
          variantId: variant.id,
          sku: variant.sku,
          colorName: variant.color.name,
          colorHex: variant.color.hex,
          size: variant.size,
        };

        const updatedSlots = [...activeCombo.slots];
        updatedSlots[slotIndex] = {
          ...updatedSlots[slotIndex],
          item: updatedItem,
        };

        set({
          activeCombo: {
            ...activeCombo,
            slots: updatedSlots,
          },
        });

        return { success: true };
      },

      removeItem: (slotId) => {
        const { activeCombo } = get();
        if (!activeCombo) return;

        const updatedSlots = activeCombo.slots.map((slot) => {
          if (slot.slotId === slotId) {
            return { ...slot, item: null };
          }
          return slot;
        });

        set({
          activeCombo: {
            ...activeCombo,
            slots: updatedSlots,
          },
        });
      },

      replaceItem: (slotId, item) => {
        const { activeCombo } = get();
        if (!activeCombo) {
          return { success: false, error: "NO_ACTIVE_COMBO" };
        }

        const slotIndex = activeCombo.slots.findIndex((s) => s.slotId === slotId);
        if (slotIndex === -1) {
          return { success: false, error: "SLOT_NOT_FOUND" };
        }

        const lineId = `${item.productId}-${item.variantId}-${Date.now()}`;
        const itemWithLineId: ComboSelectedItem = {
          ...item,
          lineId,
        };

        const updatedSlots = [...activeCombo.slots];
        updatedSlots[slotIndex] = {
          ...updatedSlots[slotIndex],
          item: itemWithLineId,
        };

        set({
          activeCombo: {
            ...activeCombo,
            slots: updatedSlots,
          },
        });

        return { success: true };
      },

      resetCombo: () => {
        const { activeCombo } = get();
        if (!activeCombo) return;

        const updatedSlots = activeCombo.slots.map((slot) => ({
          ...slot,
          item: null,
        }));

        set({
          activeCombo: {
            ...activeCombo,
            slots: updatedSlots,
          },
        });
      },
    }),
    {
      name: "999-combo-store-active-combo",
      skipHydration: true,
      partialize: (state) => ({
        activeCombo: state.activeCombo,
      }),
    }
  )
);

// Derived state hooks to avoid subscription overhead
export function useActiveComboDetails() {
  const activeCombo = useComboStore((state) => state.activeCombo);

  if (!activeCombo) {
    return {
      activeCombo: null,
      selectedCount: 0,
      remainingCount: 0,
      isComplete: false,
      validation: null,
    };
  }

  const validation = validateComboSlots(activeCombo.slots, activeCombo.itemLimit);

  return {
    activeCombo,
    selectedCount: validation.selectedCount,
    remainingCount: validation.remainingCount,
    isComplete: validation.valid,
    validation,
  };
}
