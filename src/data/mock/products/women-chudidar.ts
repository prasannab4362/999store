import { Product } from "@/types/product";

export const womenChudidar: Product[] = [
  {
    id: "prod-w-chudidar-1",
    slug: "elegant-floral-cotton-chudidar-set",
    name: "Elegant Floral Cotton Chudidar Set",
    shortName: "Floral Chudidar Set",
    productCode: "WC-CH-001",
    sku: "999-WC-CH-001",
    gender: "women",
    categoryId: "chudidar",
    subcategory: "Cotton Chudidar Sets",
    collectionIds: ["traditional-edit", "cotton-comfort"],
    description: "Classic ethnic comfort. Made with high-count cotton, this 3-piece chudidar set features a detailed straight-fit printed kurta, a matching solid chudidar bottom, and a lightweight block-printed cotton dupatta.",
    shortDescription: "Printed cotton 3-piece chudidar set.",
    fabric: "High-Count Cotton",
    pattern: "Floral Print",
    fit: "Regular Fit",
    sleeve: "3/4 Sleeve",
    neck: "Round Neck",
    washCare: "Gentle wash with mild soap. Iron on medium. Dry in shade.",
    comboEligible: true,
    featured: true,
    trending: true,
    newArrival: false,
    rating: 4.6,
    reviewCount: 30,
    media: [
      { id: "w-ch-1-m1", type: "image", viewType: "front", url: "/products/women/elegant-floral-cotton-chudidar-set/front.webp", alt: "Floral Cotton Chudidar Set Front View", sortOrder: 1 },
      { id: "w-ch-1-m2", type: "image", viewType: "back", url: "/products/women/elegant-floral-cotton-chudidar-set/back.webp", alt: "Floral Cotton Chudidar Set Back View", sortOrder: 2 },
      { id: "w-ch-1-v1", type: "video", viewType: "video", url: "/products/men/placeholder/product-preview.mp4", alt: "Floral Cotton Chudidar Set Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-ch-1-red-s", sku: "999-WC-CH-001-RED-S", color: { name: "Indian Red", hex: "#CD5C5C" }, size: "S", stock: 12, enabled: true },
      { id: "v-w-ch-1-red-m", sku: "999-WC-CH-001-RED-M", color: { name: "Indian Red", hex: "#CD5C5C" }, size: "M", stock: 15, enabled: true },
      { id: "v-w-ch-1-red-l", sku: "999-WC-CH-001-RED-L", color: { name: "Indian Red", hex: "#CD5C5C" }, size: "L", stock: 20, enabled: true },
      { id: "v-w-ch-1-red-xl", sku: "999-WC-CH-001-RED-XL", color: { name: "Indian Red", hex: "#CD5C5C" }, size: "XL", stock: 8, enabled: true }
    ],
    tags: ["cotton", "chudidar", "red", "printed", "traditional"]
  },
  {
    id: "prod-w-chudidar-2",
    slug: "banarasi-silk-festive-chudidar-set",
    name: "Banarasi Silk Festive Chudidar Set",
    shortName: "Banarasi Chudidar Set",
    productCode: "WC-CH-002",
    sku: "999-WC-CH-002",
    gender: "women",
    categoryId: "chudidar",
    subcategory: "Silk Chudidar Sets",
    collectionIds: ["traditional-edit"],
    description: "Look majestic for weddings. Formulated with pure Banarasi art silk, this set pairs a rich woven-jacquard kurta, smooth silk chudidar bottom, and matching zari dupatta.",
    shortDescription: "Woven art silk Banarasi 3-piece chudidar set.",
    fabric: "Art Silk",
    pattern: "Woven Jacquard",
    fit: "Regular Fit",
    sleeve: "3/4 Sleeve",
    neck: "Mandarin Collar",
    washCare: "Dry clean only. Cool iron on reverse using protection.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: true,
    rating: 4.8,
    reviewCount: 25,
    media: [
      { id: "w-ch-2-m1", type: "image", viewType: "front", url: "/products/women/banarasi-silk-festive-chudidar-set/front.webp", alt: "Banarasi Silk Chudidar Set Front View", sortOrder: 1 },
      { id: "w-ch-2-m2", type: "image", viewType: "back", url: "/products/women/banarasi-silk-festive-chudidar-set/back.webp", alt: "Banarasi Silk Chudidar Set Back View", sortOrder: 2 },
      { id: "w-ch-2-v1", type: "video", viewType: "video", url: "/products/men/placeholder/product-preview.mp4", alt: "Banarasi Silk Chudidar Set Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-ch-2-gld-m", sku: "999-WC-CH-002-GLD-M", color: { name: "Deep Gold", hex: "#DAA520" }, size: "M", stock: 8, enabled: true },
      { id: "v-w-ch-2-gld-l", sku: "999-WC-CH-002-GLD-L", color: { name: "Deep Gold", hex: "#DAA520" }, size: "L", stock: 12, enabled: true },
      { id: "v-w-ch-2-gld-xl", sku: "999-WC-CH-002-GLD-XL", color: { name: "Deep Gold", hex: "#DAA520" }, size: "XL", stock: 5, enabled: true }
    ],
    tags: ["silk", "banarasi", "gold", "traditional", "wedding"]
  },
  {
    id: "prod-w-chudidar-3",
    slug: "comfort-solid-rayon-chudidar-set",
    name: "Comfort Solid Rayon Chudidar Set",
    shortName: "Solid Rayon Chudidar",
    productCode: "WC-CH-003",
    sku: "999-WC-CH-003",
    gender: "women",
    categoryId: "chudidar",
    subcategory: "Rayon Chudidar Sets",
    collectionIds: ["daily-essentials"],
    description: "A highly comfortable daily wear set. Fabricated from smooth, soft rayon fiber, it pairs a solid straight kurta, stretchable chudidar leggings bottom, and a tie-dye chiffon dupatta.",
    shortDescription: "Soft solid rayon chudidar set with chiffon dupatta.",
    fabric: "Premium Rayon",
    pattern: "Solid",
    fit: "Regular Fit",
    sleeve: "3/4 Sleeve",
    neck: "Round Neck",
    washCare: "Machine wash cold. Turn inside out. Warm iron.",
    comboEligible: true,
    featured: false,
    trending: false,
    newArrival: true,
    rating: 4.4,
    reviewCount: 16,
    media: [
      { id: "w-ch-3-m1", type: "image", viewType: "front", url: "/products/women/comfort-solid-rayon-chudidar-set/front.webp", alt: "Rayon Chudidar Set Front View", sortOrder: 1 },
      { id: "w-ch-3-m2", type: "image", viewType: "back", url: "/products/women/comfort-solid-rayon-chudidar-set/back.webp", alt: "Rayon Chudidar Set Back View", sortOrder: 2 },
      { id: "w-ch-3-v1", type: "video", viewType: "video", url: "/products/men/placeholder/product-preview.mp4", alt: "Rayon Chudidar Set Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-ch-3-grn-s", sku: "999-WC-CH-003-GRN-S", color: { name: "Teal Green", hex: "#008080" }, size: "S", stock: 10, enabled: true },
      { id: "v-w-ch-3-grn-m", sku: "999-WC-CH-003-GRN-M", color: { name: "Teal Green", hex: "#008080" }, size: "M", stock: 15, enabled: true },
      { id: "v-w-ch-3-grn-l", sku: "999-WC-CH-003-GRN-L", color: { name: "Teal Green", hex: "#008080" }, size: "L", stock: 12, enabled: true }
    ],
    tags: ["rayon", "chudidar", "teal", "daily", "plain"]
  }
];
