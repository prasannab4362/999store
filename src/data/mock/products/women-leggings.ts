import { Product } from "@/types/product";

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
      { id: "m-black-fl-m1", type: "image", viewType: "front", url: "/products/women/black-flex-ankle-length-leggings/front.webp", alt: "Black Flex Ankle Length Leggings Front View", sortOrder: 1 },
      { id: "m-black-fl-m2", type: "image", viewType: "back", url: "/products/women/black-flex-ankle-length-leggings/back.webp", alt: "Black Flex Ankle Length Leggings Back View", sortOrder: 2 },
      { id: "m-black-fl-m3", type: "image", viewType: "detail", url: "/products/women/black-flex-ankle-length-leggings/detail.webp", alt: "Black Flex Ankle Length Leggings Fabric Close-up", sortOrder: 3 },
      { id: "m-black-fl-v1", type: "video", viewType: "video", url: "/products/women/black-flex-ankle-length-leggings/product-preview.mp4", posterUrl: "/products/women/black-flex-ankle-length-leggings/video-poster.webp", alt: "Black Flex Ankle Length Leggings Showcase Video", sortOrder: 4 }
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
      { id: "m-classic--m1", type: "image", viewType: "front", url: "/products/women/classic-maroon-cotton-lycra-leggings/front.webp", alt: "Classic Maroon Cotton Lycra Leggings Front View", sortOrder: 1 },
      { id: "m-classic--m2", type: "image", viewType: "back", url: "/products/women/classic-maroon-cotton-lycra-leggings/back.webp", alt: "Classic Maroon Cotton Lycra Leggings Back View", sortOrder: 2 },
      { id: "m-classic--m3", type: "image", viewType: "detail", url: "/products/women/classic-maroon-cotton-lycra-leggings/detail.webp", alt: "Classic Maroon Cotton Lycra Leggings Fabric Close-up", sortOrder: 3 },
      { id: "m-classic--v1", type: "video", viewType: "video", url: "/products/women/classic-maroon-cotton-lycra-leggings/product-preview.mp4", posterUrl: "/products/women/classic-maroon-cotton-lycra-leggings/video-poster.webp", alt: "Classic Maroon Cotton Lycra Leggings Showcase Video", sortOrder: 4 }
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
      { id: "m-desert-b-m1", type: "image", viewType: "front", url: "/products/women/desert-beige-full-length-leggings/front.webp", alt: "Desert Beige Full Length Leggings Front View", sortOrder: 1 },
      { id: "m-desert-b-m2", type: "image", viewType: "back", url: "/products/women/desert-beige-full-length-leggings/back.webp", alt: "Desert Beige Full Length Leggings Back View", sortOrder: 2 },
      { id: "m-desert-b-m3", type: "image", viewType: "detail", url: "/products/women/desert-beige-full-length-leggings/detail.webp", alt: "Desert Beige Full Length Leggings Fabric Close-up", sortOrder: 3 },
      { id: "m-desert-b-v1", type: "video", viewType: "video", url: "/products/women/desert-beige-full-length-leggings/product-preview.mp4", posterUrl: "/products/women/desert-beige-full-length-leggings/video-poster.webp", alt: "Desert Beige Full Length Leggings Showcase Video", sortOrder: 4 }
    ],
    variants: [
      { id: "v-w-le-3-beg-s", sku: "999-WC-LE-003-BEG-S", color: { name: "Desert Beige", hex: "#E1C699" }, size: "S", stock: 10, enabled: true },
      { id: "v-w-le-3-beg-m", sku: "999-WC-LE-003-BEG-M", color: { name: "Desert Beige", hex: "#E1C699" }, size: "M", stock: 12, enabled: true },
      { id: "v-w-le-3-beg-l", sku: "999-WC-LE-003-BEG-L", color: { name: "Desert Beige", hex: "#E1C699" }, size: "L", stock: 15, enabled: true }
    ],
    tags: ["leggings", "beige", "daily", "stretch"]
  }
];
