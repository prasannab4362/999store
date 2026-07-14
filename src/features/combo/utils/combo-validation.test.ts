import { describe, it, expect } from "vitest";
import { validateComboSlots } from "./combo-validation";
import { ComboSlot, ComboSelectedItem } from "@/types/product";

describe("validateComboSlots", () => {
  const mockItem: ComboSelectedItem = {
    lineId: "line-1",
    productId: "prod-1",
    productSlug: "test-slug",
    productName: "Test Item",
    productCode: "T-01",
    variantId: "v-1",
    sku: "SKU-1",
    colorName: "Red",
    colorHex: "#ff0000",
    size: "M",
    image: "test.jpg",
  };

  it("should mark combo incomplete if selected items are less than required count", () => {
    const slots: ComboSlot[] = [
      { slotId: "s1", position: 1, item: mockItem },
      { slotId: "s2", position: 2, item: null },
      { slotId: "s3", position: 3, item: null },
    ];

    const result = validateComboSlots(slots, 3);
    expect(result.valid).toBe(false);
    expect(result.selectedCount).toBe(1);
    expect(result.remainingCount).toBe(2);
    expect(result.errors).toContain("Combo is incomplete. Select 2 more items.");
  });

  it("should mark combo complete when exact count matches", () => {
    const slots: ComboSlot[] = [
      { slotId: "s1", position: 1, item: mockItem },
      { slotId: "s2", position: 2, item: { ...mockItem, lineId: "line-2" } },
      { slotId: "s3", position: 3, item: { ...mockItem, lineId: "line-3" } },
    ];

    const result = validateComboSlots(slots, 3);
    expect(result.valid).toBe(true);
    expect(result.selectedCount).toBe(3);
    expect(result.remainingCount).toBe(0);
    expect(result.errors.length).toBe(0);
  });

  it("should check for duplicate lineId instances", () => {
    const slots: ComboSlot[] = [
      { slotId: "s1", position: 1, item: mockItem },
      { slotId: "s2", position: 2, item: mockItem }, // duplicate lineId
    ];

    const result = validateComboSlots(slots, 2);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Duplicate item instances detected in slots.");
  });
});
