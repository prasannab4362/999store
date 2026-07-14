import { describe, it, expect, beforeEach } from "vitest";
import { useComboStore } from "./combo-store";
import { ComboConfig } from "@/config/combo";

describe("Combo Store", () => {
  const mockConfig2: ComboConfig = {
    id: "combo-2",
    slug: "2-items",
    name: "2 Items Combo",
    itemLimit: 2,
    basePriceMinor: 99900,
    description: "2 items test",
    badge: "TEST",
    activeStatus: true,
    displayOrder: 1,
  };

  const mockConfig10: ComboConfig = {
    id: "combo-10",
    slug: "10-items",
    name: "10 Items Combo",
    itemLimit: 10,
    basePriceMinor: 99900,
    description: "10 items test",
    badge: "TEST",
    activeStatus: true,
    displayOrder: 2,
  };

  const mockItem = {
    productId: "prod-1",
    productSlug: "emerald-shirt",
    productName: "Emerald Shirt",
    productCode: "MC-SH-001",
    variantId: "v-grn-m",
    sku: "999-MC-SH-001-GRN-M",
    colorName: "Emerald Green",
    colorHex: "#0F9D58",
    size: "M" as const,
    image: "emerald.jpg",
  };

  beforeEach(() => {
    useComboStore.setState({ activeCombo: null });
  });

  it("should initialize empty slots on startCombo", () => {
    useComboStore.getState().startCombo(mockConfig2);
    const state = useComboStore.getState();

    expect(state.activeCombo).not.toBeNull();
    expect(state.activeCombo?.itemLimit).toBe(2);
    expect(state.activeCombo?.slots.length).toBe(2);
    expect(state.activeCombo?.slots[0].item).toBeNull();
    expect(state.activeCombo?.slots[1].item).toBeNull();
  });

  it("should auto-allocate items to empty slots", () => {
    useComboStore.getState().startCombo(mockConfig2);
    
    // Add first item
    const res1 = useComboStore.getState().addItem(mockItem);
    expect(res1.success).toBe(true);
    expect(useComboStore.getState().activeCombo?.slots[0].item).not.toBeNull();
    expect(useComboStore.getState().activeCombo?.slots[0].item?.productId).toBe("prod-1");
    expect(useComboStore.getState().activeCombo?.slots[1].item).toBeNull();

    // Add second item
    const res2 = useComboStore.getState().addItem({ ...mockItem, productId: "prod-2" });
    expect(res2.success).toBe(true);
    expect(useComboStore.getState().activeCombo?.slots[1].item).not.toBeNull();
  });

  it("should prevent adding more items than the combo limit", () => {
    useComboStore.getState().startCombo(mockConfig2);
    
    useComboStore.getState().addItem(mockItem);
    useComboStore.getState().addItem({ ...mockItem, productId: "prod-2" });
    
    // Try to add a third item
    const res3 = useComboStore.getState().addItem({ ...mockItem, productId: "prod-3" });
    expect(res3.success).toBe(false);
    if (!res3.success) {
      expect(res3.error).toBe("COMBO_FULL");
    }
  });

  it("should reject updating a slot with a disabled or out-of-stock variant", () => {
    useComboStore.getState().startCombo(mockConfig2);
    useComboStore.getState().addItem(mockItem);
    const slotId = "slot-1";

    // Disabled variant
    const disabledVariant = {
      id: "v-grn-m",
      sku: "999-MC-SH-001-GRN-M",
      color: { name: "Green", hex: "#000" },
      size: "M" as const,
      stock: 10,
      enabled: false,
    };
    const res1 = useComboStore.getState().updateItemVariant(slotId, disabledVariant);
    expect(res1.success).toBe(false);

    // Out of stock variant
    const oosVariant = {
      id: "v-grn-m",
      sku: "999-MC-SH-001-GRN-M",
      color: { name: "Green", hex: "#000" },
      size: "M" as const,
      stock: 0,
      enabled: true,
    };
    const res2 = useComboStore.getState().updateItemVariant(slotId, oosVariant);
    expect(res2.success).toBe(false);
  });
});
