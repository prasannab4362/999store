import { describe, test, expect } from "vitest";
import { products } from "@/data/mock/products";
import { validateProductMedia, isVariantAvailable } from "./product";

describe("Product Catalog and Variant Integrity Tests", () => {
  // 1. exactly 48 products exist
  test("catalog contains exactly 48 products", () => {
    expect(products.length).toBe(48);
  });

  // 2. exactly 24 Men's products exist
  test("catalog contains exactly 24 Men's products", () => {
    const mens = products.filter((p) => p.gender === "men");
    expect(mens.length).toBe(24);
  });

  // 3. exactly 24 Women's products exist
  test("catalog contains exactly 24 Women's products", () => {
    const womens = products.filter((p) => p.gender === "women");
    expect(womens.length).toBe(24);
  });

  // 4. every product ID is unique
  test("every product ID is unique", () => {
    const ids = products.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  // 5. every slug is unique
  test("every product slug is unique", () => {
    const slugs = products.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(slugs.length).toBe(uniqueSlugs.size);
  });

  // 6. every product code is unique
  test("every product code is unique", () => {
    const codes = products.map((p) => p.productCode);
    const uniqueCodes = new Set(codes);
    expect(codes.length).toBe(uniqueCodes.size);
  });

  // 7. every variant ID is unique
  test("every variant ID is globally unique", () => {
    const variantIds: string[] = [];
    products.forEach((p) => {
      p.variants.forEach((v) => {
        variantIds.push(v.id);
      });
    });
    const uniqueVariantIds = new Set(variantIds);
    expect(variantIds.length).toBe(uniqueVariantIds.size);
  });

  // 8. every variant SKU is globally unique
  test("every variant SKU is globally unique", () => {
    const skus: string[] = [];
    products.forEach((p) => {
      p.variants.forEach((v) => {
        skus.push(v.sku);
      });
    });
    const uniqueSkus = new Set(skus);
    expect(skus.length).toBe(uniqueSkus.size);
  });

  // 9. every product contains at least one variant
  test("every product contains at least one variant", () => {
    products.forEach((p) => {
      expect(p.variants.length).toBeGreaterThan(0);
    });
  });

  // 10. every product contains front, back, and video media, and passes validateProductMedia
  test("every product contains required media structures and passes validation", () => {
    products.forEach((p) => {
      const validation = validateProductMedia(p);
      expect(validation.valid).toBe(true);
      expect(validation.hasFrontImage).toBe(true);
      expect(validation.hasBackImage).toBe(true);
      expect(validation.hasVideo).toBe(true);
    });
  });

  // 11. enabled variant with stock > 0 is available, disabled or zero-stock is unavailable
  test("variant availability logic functions correctly", () => {
    const mockEnabledInStock = {
      id: "v-1",
      sku: "SKU-1",
      color: { name: "Green", hex: "#000000" },
      size: "M" as const,
      stock: 10,
      enabled: true,
    };

    const mockDisabled = {
      ...mockEnabledInStock,
      enabled: false,
    };

    const mockZeroStock = {
      ...mockEnabledInStock,
      stock: 0,
    };

    expect(isVariantAvailable(mockEnabledInStock)).toBe(true);
    expect(isVariantAvailable(mockDisabled)).toBe(false);
    expect(isVariantAvailable(mockZeroStock)).toBe(false);
  });

  // 12. 5-tier combo eligibility distribution
  test("5-tier combo eligibility assortments function correctly", () => {
    const combo2Items = products.filter((p) => p.comboTierIds?.includes("combo-2"));
    const combo3Items = products.filter((p) => p.comboTierIds?.includes("combo-3"));
    const combo5Items = products.filter((p) => p.comboTierIds?.includes("combo-5"));
    const combo8Items = products.filter((p) => p.comboTierIds?.includes("combo-8"));
    const combo10Items = products.filter((p) => p.comboTierIds?.includes("combo-10"));

    expect(combo2Items.length).toBeGreaterThan(0);
    expect(combo3Items.length).toBeGreaterThan(0);
    expect(combo5Items.length).toBeGreaterThan(0);
    expect(combo8Items.length).toBeGreaterThan(0);
    expect(combo10Items.length).toBeGreaterThan(0);
  });
});
