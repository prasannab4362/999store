import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "./cart-store";
import { CartComboItemSnapshot } from "@/types/cart";

describe("Cart Store", () => {
  const mockItem: CartComboItemSnapshot = {
    lineId: "line-1",
    productId: "prod-1",
    productSlug: "emerald-shirt",
    productName: "Emerald Shirt",
    productCode: "MC-SH-001",
    variantId: "v-grn-m",
    sku: "999-MC-SH-001-GRN-M",
    colorName: "Emerald Green",
    colorHex: "#0F9D58",
    size: "M",
    image: "emerald.jpg",
  };

  beforeEach(() => {
    useCartStore.setState({ comboGroups: [], coupon: null });
  });

  it("should add a combo group as an immutable snapshot", () => {
    const groupData = {
      comboId: "combo-2",
      comboSlug: "2-items",
      comboName: "2 Items Combo",
      itemLimit: 2,
      basePriceMinor: 99900,
      items: [mockItem, { ...mockItem, lineId: "line-2", productId: "prod-2" }],
    };

    useCartStore.getState().addComboGroup(groupData);
    const state = useCartStore.getState();

    expect(state.comboGroups.length).toBe(1);
    expect(state.comboGroups[0].id).toBeDefined();
    expect(state.comboGroups[0].items.length).toBe(2);
    expect(state.comboGroups[0].items[0].productId).toBe("prod-1");

    // Mutation test: changing original groupData items should not affect stored state
    groupData.items[0].productName = "Mutated Product Name";
    expect(useCartStore.getState().comboGroups[0].items[0].productName).toBe("Emerald Shirt");
  });

  it("should apply and remove coupons correctly", () => {
    useCartStore.getState().applyCoupon({ code: "WELCOME50", discountPercentage: 5 });
    expect(useCartStore.getState().coupon).toEqual({ code: "WELCOME50", discountPercentage: 5 });

    useCartStore.getState().removeCoupon();
    expect(useCartStore.getState().coupon).toBeNull();
  });

  it("should clear the cart correctly", () => {
    useCartStore.getState().addComboGroup({
      comboId: "combo-2",
      comboSlug: "2-items",
      comboName: "2 Items Combo",
      itemLimit: 2,
      basePriceMinor: 99900,
      items: [mockItem],
    });
    useCartStore.getState().applyCoupon({ code: "WELCOME50" });

    useCartStore.getState().clearCart();
    expect(useCartStore.getState().comboGroups.length).toBe(0);
    expect(useCartStore.getState().coupon).toBeNull();
  });
});
