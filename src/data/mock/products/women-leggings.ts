import { Product } from "@/types/product";
import { getProductPlaceholder, mockVideoUrl } from "@/lib/utils/placeholders";

export const womenLeggings: Product[] = [
  {
    id: "prod-w-leggings-1",
    slug: "black-flex-ankle-length-leggings",
    name: "Black Flex Ankle Length Leggings",
    shortName: "Black Leggings",
    productCode: "WC-LE-001",
    sku: "999-WC-LE-001",
    gender: "women",
    categoryId: "leggings",
    subcategory: "Ankle Length Leggings",
    collectionIds: ["daily-essentials"],
    description: "Get comfort that stretches with you. Made with premium cotton lycra 4-way stretch fabric, these ankle-length leggings feature a soft elastic waistband and zero pilling.",
    shortDescription: "4-way stretch cotton lycra ankle-length leggings.",
    fabric: "Cotton Lycra",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Machine wash warm inside out. Tumble dry low.",
    comboEligible: true,
    featured: true,
    trending: true,
    newArrival: false,
    rating: 4.6,
    reviewCount: 38,
    media: [
      { id: "w-le-1-m1", type: "image", viewType: "front", url: getProductPlaceholder("Black Leggings", "Front"), alt: "Black Ankle Leggings Front View", sortOrder: 1 },
      { id: "w-le-1-m2", type: "image", viewType: "back", url: getProductPlaceholder("Black Leggings", "Back"), alt: "Black Ankle Leggings Back View", sortOrder: 2 },
      { id: "w-le-1-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Black Ankle Leggings Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-le-1-blk-s", sku: "999-WC-LE-001-BLK-S", color: { name: "Midnight Black", hex: "#111111" }, size: "S", stock: 20, enabled: true },
      { id: "v-w-le-1-blk-m", sku: "999-WC-LE-001-BLK-M", color: { name: "Midnight Black", hex: "#111111" }, size: "M", stock: 25, enabled: true },
      { id: "v-w-le-1-blk-l", sku: "999-WC-LE-001-BLK-L", color: { name: "Midnight Black", hex: "#111111" }, size: "L", stock: 30, enabled: true },
      { id: "v-w-le-1-blk-xl", sku: "999-WC-LE-001-BLK-XL", color: { name: "Midnight Black", hex: "#111111" }, size: "XL", stock: 15, enabled: true }
    ],
    tags: ["leggings", "lycra", "black", "daily"]
  },
  {
    id: "prod-w-leggings-2",
    slug: "classic-maroon-cotton-lycra-leggings",
    name: "Classic Maroon Cotton Lycra Leggings",
    shortName: "Maroon Leggings",
    productCode: "WC-LE-002",
    sku: "999-WC-LE-002",
    gender: "women",
    categoryId: "leggings",
    subcategory: "Full Length Leggings",
    collectionIds: ["daily-essentials", "traditional-edit"],
    description: "Match your kurtis elegantly. Full-length churidar-style leggings in vibrant maroon, built from soft, non-translucent combed cotton elastic blend.",
    shortDescription: "Combed cotton full-length churidar leggings.",
    fabric: "Combed Cotton Lycra",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Wash dark colors separately. Cool iron if needed.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: true,
    rating: 4.4,
    reviewCount: 19,
    media: [
      { id: "w-le-2-m1", type: "image", viewType: "front", url: getProductPlaceholder("Maroon Leggings", "Front"), alt: "Maroon Full Leggings Front View", sortOrder: 1 },
      { id: "w-le-2-m2", type: "image", viewType: "back", url: getProductPlaceholder("Maroon Leggings", "Back"), alt: "Maroon Full Leggings Back View", sortOrder: 2 },
      { id: "w-le-2-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Maroon Full Leggings Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-le-2-mar-m", sku: "999-WC-LE-002-MAR-M", color: { name: "Deep Maroon", hex: "#800020" }, size: "M", stock: 15, enabled: true },
      { id: "v-w-le-2-mar-l", sku: "999-WC-LE-002-MAR-L", color: { name: "Deep Maroon", hex: "#800020" }, size: "L", stock: 15, enabled: true },
      { id: "v-w-le-2-mar-xl", sku: "999-WC-LE-002-MAR-XL", color: { name: "Deep Maroon", hex: "#800020" }, size: "XL", stock: 10, enabled: true }
    ],
    tags: ["leggings", "lycra", "maroon", "traditional"]
  },
  {
    id: "prod-w-leggings-3",
    slug: "desert-beige-full-length-leggings",
    name: "Desert Beige Full Length Leggings",
    shortName: "Beige Leggings",
    productCode: "WC-LE-003",
    sku: "999-WC-LE-003",
    gender: "women",
    categoryId: "leggings",
    subcategory: "Full Length Leggings",
    collectionIds: ["daily-essentials"],
    description: "Versatile desert beige leggings designed for maximum daily utility. Lightweight yet durable cotton-stretch fibers offer moisture control and comfort.",
    shortDescription: "Lightweight beige cotton stretch full-length leggings.",
    fabric: "Cotton Lycra Blend",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Machine wash cold. Line dry in shade.",
    comboEligible: true,
    featured: false,
    trending: false,
    newArrival: false,
    rating: 4.3,
    reviewCount: 14,
    media: [
      { id: "w-le-3-m1", type: "image", viewType: "front", url: getProductPlaceholder("Beige Leggings", "Front"), alt: "Beige Leggings Front View", sortOrder: 1 },
      { id: "w-le-3-m2", type: "image", viewType: "back", url: getProductPlaceholder("Beige Leggings", "Back"), alt: "Beige Leggings Back View", sortOrder: 2 },
      { id: "w-le-3-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Beige Leggings Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-le-3-beg-s", sku: "999-WC-LE-003-BEG-S", color: { name: "Desert Beige", hex: "#E1C699" }, size: "S", stock: 10, enabled: true },
      { id: "v-w-le-3-beg-m", sku: "999-WC-LE-003-BEG-M", color: { name: "Desert Beige", hex: "#E1C699" }, size: "M", stock: 12, enabled: true },
      { id: "v-w-le-3-beg-l", sku: "999-WC-LE-003-BEG-L", color: { name: "Desert Beige", hex: "#E1C699" }, size: "L", stock: 15, enabled: true }
    ],
    tags: ["leggings", "beige", "daily", "stretch"]
  }
];
