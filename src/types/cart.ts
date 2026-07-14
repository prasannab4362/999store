import { ProductSize } from "./product";

export interface CartComboItemSnapshot {
  lineId: string;
  productId: string;
  productSlug: string;
  productName: string;
  productCode: string;
  variantId: string;
  sku: string;
  colorName: string;
  colorHex: string;
  size: ProductSize;
  image: string;
}

export interface CartComboGroup {
  id: string;
  comboId: string;
  comboSlug: string;
  comboName: string;
  itemLimit: number;
  basePriceMinor: number;
  items: CartComboItemSnapshot[];
  createdAt: string;
}

export interface AppliedCoupon {
  code: string;
  discountPercentage?: number;
  discountAmountMinor?: number;
}
