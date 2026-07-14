import { describe, it, expect } from "vitest";
import { calculateOrderTotals } from "./calculate-order-totals";
import { CartComboGroup } from "@/types/cart";

describe("calculateOrderTotals", () => {
  const mockComboGroup: CartComboGroup = {
    id: "cart-g1",
    comboId: "combo-10",
    comboSlug: "10-items",
    comboName: "10 Items Combo",
    itemLimit: 10,
    basePriceMinor: 99900, // ₹999
    items: [],
    createdAt: new Date().toISOString(),
  };

  it("should calculate correct totals for a single combo without discounts", () => {
    const result = calculateOrderTotals({
      comboGroups: [mockComboGroup],
      shippingMinor: 12000, // ₹120
      paymentMethod: "online",
    });

    expect(result.subtotalMinor).toBe(99900);
    expect(result.discountMinor).toBe(0);
    expect(result.discountedSubtotalMinor).toBe(99900);
    expect(result.shippingMinor).toBe(12000);
    expect(result.grandTotalMinor).toBe(111900); // ₹1119.00
    expect(result.advanceMinor).toBe(111900);
    expect(result.balanceDueMinor).toBe(0);
  });

  it("should calculate correct 20% advance and remaining balance for COD payment method", () => {
    const result = calculateOrderTotals({
      comboGroups: [mockComboGroup],
      shippingMinor: 12000, // ₹120
      paymentMethod: "cod_advance",
    });

    // Subtotal: ₹999.00 (99900 paise)
    // 20% of 99900 = 19980 paise (₹199.80)
    // Grand Total: 99900 + 12000 = 111900 paise
    // Balance Due: 111900 - 19980 = 91920 paise (₹919.20)
    expect(result.subtotalMinor).toBe(99900);
    expect(result.discountedSubtotalMinor).toBe(99900);
    expect(result.advanceMinor).toBe(19980); // ₹199.80
    expect(result.balanceDueMinor).toBe(91920); // ₹919.20
  });

  it("should calculate coupon percentage discount on subtotal correctly", () => {
    const result = calculateOrderTotals({
      comboGroups: [mockComboGroup, mockComboGroup], // 2 combos = ₹1998.00 (199800 paise)
      coupon: { code: "WELCOME10", discountPercentage: 10 },
      shippingMinor: 12000, // ₹120
      paymentMethod: "cod_advance",
    });

    // Subtotal = 199800
    // Discount = 199800 * 10% = 19980 paise (₹199.80)
    // Discounted Subtotal = 179820 paise (₹1798.20)
    // Grand Total = 179820 + 12000 = 191820 paise (₹1918.20)
    // COD Advance = 20% of Discounted Subtotal = 20% of 179820 = 35964 paise (₹359.64)
    // Balance Due = Grand Total - Advance = 191820 - 35964 = 155856 paise (₹1558.56)
    expect(result.subtotalMinor).toBe(199800);
    expect(result.discountMinor).toBe(19980);
    expect(result.discountedSubtotalMinor).toBe(179820);
    expect(result.grandTotalMinor).toBe(191820);
    expect(result.advanceMinor).toBe(35964);
    expect(result.balanceDueMinor).toBe(155856);
  });
});
