import { Product } from "@/types/product";
import { getProductPlaceholder, mockVideoUrl } from "@/lib/utils/placeholders";

export const womenStraightPants: Product[] = [
  {
    id: "prod-w-spant-1",
    slug: "office-classic-black-straight-pant",
    name: "Office Classic Black Straight Pant",
    shortName: "Black Straight Pant",
    productCode: "WC-SP-001",
    sku: "999-WC-SP-001",
    gender: "women",
    categoryId: "straight-pants",
    subcategory: "Office Straight Pants",
    collectionIds: ["office-edit", "daily-essentials"],
    description: "Look polished and feel comfortable all day. Tailored with a premium stretch-cotton blend, these straight pants feature functional side pockets and a clean flat-front waistband.",
    shortDescription: "Tailored flat-front black stretch-cotton trousers.",
    fabric: "Cotton Spandex Blend",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Machine wash cold with dark colors. Warm iron.",
    comboEligible: true,
    featured: true,
    trending: true,
    newArrival: false,
    rating: 4.6,
    reviewCount: 25,
    media: [
      { id: "w-sp-1-m1", type: "image", viewType: "front", url: getProductPlaceholder("Black Straight Pant", "Front"), alt: "Black Straight Pant Front View", sortOrder: 1 },
      { id: "w-sp-1-m2", type: "image", viewType: "back", url: getProductPlaceholder("Black Straight Pant", "Back"), alt: "Black Straight Pant Back View", sortOrder: 2 },
      { id: "w-sp-1-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Black Straight Pant Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-sp-1-blk-28", sku: "999-WC-SP-001-BLK-28", color: { name: "Midnight Black", hex: "#111111" }, size: "28", stock: 12, enabled: true },
      { id: "v-w-sp-1-blk-30", sku: "999-WC-SP-001-BLK-30", color: { name: "Midnight Black", hex: "#111111" }, size: "30", stock: 15, enabled: true },
      { id: "v-w-sp-1-blk-32", sku: "999-WC-SP-001-BLK-32", color: { name: "Midnight Black", hex: "#111111" }, size: "32", stock: 18, enabled: true },
      { id: "v-w-sp-1-blk-34", sku: "999-WC-SP-001-BLK-34", color: { name: "Midnight Black", hex: "#111111" }, size: "34", stock: 10, enabled: true }
    ],
    tags: ["cotton", "straightpants", "black", "office", "stretch"]
  },
  {
    id: "prod-w-spant-2",
    slug: "desert-beige-cotton-straight-pant",
    name: "Desert Beige Cotton Straight Pant",
    shortName: "Beige Straight Pant",
    productCode: "WC-SP-002",
    sku: "999-WC-SP-002",
    gender: "women",
    categoryId: "straight-pants",
    subcategory: "Cotton Straight Pants",
    collectionIds: ["daily-essentials", "traditional-edit"],
    description: "Classic utility trousers. Fabricated from heavy-washed premium combed cotton, these straight-fit pants offer ultimate comfort and easily match with short tops or kurtas.",
    shortDescription: "Combed cotton desert beige straight trousers.",
    fabric: "100% Cotton",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Machine wash warm inside out. Tumble dry low.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: true,
    rating: 4.4,
    reviewCount: 18,
    media: [
      { id: "w-sp-2-m1", type: "image", viewType: "front", url: getProductPlaceholder("Beige Straight Pant", "Front"), alt: "Beige Straight Pant Front View", sortOrder: 1 },
      { id: "w-sp-2-m2", type: "image", viewType: "back", url: getProductPlaceholder("Beige Straight Pant", "Back"), alt: "Beige Straight Pant Back View", sortOrder: 2 },
      { id: "w-sp-2-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Beige Straight Pant Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-sp-2-beg-28", sku: "999-WC-SP-002-BEG-28", color: { name: "Desert Beige", hex: "#F5F5DC" }, size: "28", stock: 15, enabled: true },
      { id: "v-w-sp-2-beg-30", sku: "999-WC-SP-002-BEG-30", color: { name: "Desert Beige", hex: "#F5F5DC" }, size: "30", stock: 15, enabled: true },
      { id: "v-w-sp-2-beg-32", sku: "999-WC-SP-002-BEG-32", color: { name: "Desert Beige", hex: "#F5F5DC" }, size: "32", stock: 12, enabled: true }
    ],
    tags: ["cotton", "straightpants", "beige", "casual"]
  },
  {
    id: "prod-w-spant-3",
    slug: "rosewood-stretch-formal-straight-pant",
    name: "Rosewood Stretch Formal Straight Pant",
    shortName: "Rosewood Straight Pant",
    productCode: "WC-SP-003",
    sku: "999-WC-SP-003",
    gender: "women",
    categoryId: "straight-pants",
    subcategory: "Formal Straight Pants",
    collectionIds: ["office-edit"],
    description: "Break away from basic colors. These stretch formal straight pants in beautiful rosewood offer sleek contours, smart-casual dressiness, and dual utility pockets.",
    shortDescription: "Tailored rosewood stretch formal straight pants.",
    fabric: "Poly-Viscose Spandex Blend",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Dry clean recommended. Cool iron.",
    comboEligible: true,
    featured: false,
    trending: false,
    newArrival: true,
    rating: 4.5,
    reviewCount: 12,
    media: [
      { id: "w-sp-3-m1", type: "image", viewType: "front", url: getProductPlaceholder("Rosewood Straight Pant", "Front"), alt: "Rosewood Straight Pant Front View", sortOrder: 1 },
      { id: "w-sp-3-m2", type: "image", viewType: "back", url: getProductPlaceholder("Rosewood Straight Pant", "Back"), alt: "Rosewood Straight Pant Back View", sortOrder: 2 },
      { id: "w-sp-3-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Rosewood Straight Pant Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-sp-3-rwd-28", sku: "999-WC-SP-003-RWD-28", color: { name: "Rosewood Pink", hex: "#8A5A5C" }, size: "28", stock: 8, enabled: true },
      { id: "v-w-sp-3-rwd-30", sku: "999-WC-SP-003-RWD-30", color: { name: "Rosewood Pink", hex: "#8A5A5C" }, size: "30", stock: 10, enabled: true },
      { id: "v-w-sp-3-rwd-32", sku: "999-WC-SP-003-RWD-32", color: { name: "Rosewood Pink", hex: "#8A5A5C" }, size: "32", stock: 12, enabled: true }
    ],
    tags: ["formal", "straightpants", "rosewood", "pink", "office"]
  }
];
