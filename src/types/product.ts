export type AlphaSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "3XL" | "4XL";
export type NumericSize = "26" | "28" | "30" | "32" | "34" | "36" | "38" | "40" | "42" | "44";
export type ProductSize = AlphaSize | NumericSize | "FREE_SIZE";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color: ProductColor;
  size: ProductSize;
  stock: number;
  enabled: boolean;
}

export type ProductMediaView = "front" | "back" | "side" | "detail" | "fabric" | "model" | "video";

export interface ProductMedia {
  id: string;
  type: "image" | "video";
  viewType: ProductMediaView;
  url: string;
  alt: string;
  sortOrder: number;
  posterUrl?: string;
}

export type ComboTierId = "combo-2" | "combo-3" | "combo-5" | "combo-8" | "combo-10";

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  productCode: string;
  sku: string;
  gender: "men" | "women" | "unisex";
  categoryId: string;
  subcategory: string;
  collectionIds: string[];
  description: string;
  shortDescription: string;
  fabric: string;
  pattern: string;
  fit: string;
  sleeve?: string;
  neck?: string;
  washCare?: string;
  comboEligible: boolean;
  comboTierIds?: ComboTierId[];
  brandId?: string;
  brandName?: string;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  media: ProductMedia[];
  variants: ProductVariant[];
  tags: string[];
}

export function isVariantAvailable(variant: ProductVariant): boolean {
  return variant.enabled && variant.stock > 0;
}

export interface ProductMediaValidationResult {
  valid: boolean;
  hasFrontImage: boolean;
  hasBackImage: boolean;
  hasVideo: boolean;
  missing: ProductMediaView[];
}

export function validateProductMedia(product: Product): ProductMediaValidationResult {
  const media = product.media;
  const hasFrontImage = media.some((m) => m.viewType === "front");
  const hasBackImage = media.some((m) => m.viewType === "back");
  const hasVideo = media.some((m) => m.viewType === "video");
  const missing: ProductMediaView[] = [];
  
  if (!hasFrontImage) missing.push("front");
  if (!hasBackImage) missing.push("back");
  if (!hasVideo) missing.push("video");

  return {
    valid: missing.length === 0,
    hasFrontImage,
    hasBackImage,
    hasVideo,
    missing,
  };
}

export interface ComboSelectedItem {
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

export interface ComboSlot {
  slotId: string;
  position: number;
  item: ComboSelectedItem | null;
}

export interface ActiveCombo {
  comboId: string;
  comboSlug: string;
  comboName: string;
  itemLimit: number;
  basePriceMinor: number;
  selectedCategory?: string;
  editingGroupId?: string;
  slots: ComboSlot[];
  startedAt?: string;
}

export interface ComboActionResult {
  success: boolean;
  error?: "COMBO_FULL" | "SLOT_NOT_FOUND" | "VARIANT_UNAVAILABLE" | "INVALID_VARIANT" | string;
}

export interface ComboValidationResult {
  valid: boolean;
  selectedCount: number;
  requiredCount: number;
  remainingCount: number;
  errors: string[];
}

