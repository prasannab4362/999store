import { Product } from "@/types/product";
import { getProductPlaceholder, mockVideoUrl } from "@/lib/utils/placeholders";

export const womenCottonSets: Product[] = [
  {
    id: "prod-w-cset-1",
    slug: "ivory-daily-cotton-kurta-set",
    name: "Ivory Daily Cotton Kurta Set",
    shortName: "Ivory Kurta Set",
    productCode: "WC-CS-001",
    sku: "999-WC-CS-001",
    gender: "women",
    categoryId: "cotton-sets",
    subcategory: "Daily Cotton Sets",
    collectionIds: ["cotton-comfort", "daily-essentials"],
    description: "Your go-to comfort wear. This pure cotton daily kurta set features a matching straight-fit kurta, comfortable pants, and a soft printed cotton dupatta, finished with a classic floral pattern.",
    shortDescription: "Comfy daily wear 100% cotton floral kurta set.",
    fabric: "100% Cotton",
    pattern: "Printed",
    fit: "Regular Fit",
    sleeve: "3/4 Sleeve",
    neck: "Round Neck",
    washCare: "Gentle machine wash cold with similar colors. Line dry.",
    comboEligible: true,
    featured: true,
    trending: true,
    newArrival: false,
    rating: 4.6,
    reviewCount: 28,
    media: [
      { id: "w-cs-1-m1", type: "image", viewType: "front", url: getProductPlaceholder("Ivory Kurta Set", "Front"), alt: "Ivory Daily Cotton Kurta Set Front View", sortOrder: 1 },
      { id: "w-cs-1-m2", type: "image", viewType: "back", url: getProductPlaceholder("Ivory Kurta Set", "Back"), alt: "Ivory Daily Cotton Kurta Set Back View", sortOrder: 2 },
      { id: "w-cs-1-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Ivory Daily Cotton Kurta Set Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-cs-1-ivr-s", sku: "999-WC-CS-001-IVR-S", color: { name: "Ivory White", hex: "#FFFFF0" }, size: "S", stock: 10, enabled: true },
      { id: "v-w-cs-1-ivr-m", sku: "999-WC-CS-001-IVR-M", color: { name: "Ivory White", hex: "#FFFFF0" }, size: "M", stock: 15, enabled: true },
      { id: "v-w-cs-1-ivr-l", sku: "999-WC-CS-001-IVR-L", color: { name: "Ivory White", hex: "#FFFFF0" }, size: "L", stock: 18, enabled: true },
      { id: "v-w-cs-1-ivr-xl", sku: "999-WC-CS-001-IVR-XL", color: { name: "Ivory White", hex: "#FFFFF0" }, size: "XL", stock: 8, enabled: true }
    ],
    tags: ["cotton", "kurtaset", "ivory", "printed", "daily"]
  },
  {
    id: "prod-w-cset-2",
    slug: "classic-blue-office-cotton-kurta-set",
    name: "Classic Blue Office Cotton Kurta Set",
    shortName: "Blue Office Kurta Set",
    productCode: "WC-CS-002",
    sku: "999-WC-CS-002",
    gender: "women",
    categoryId: "cotton-sets",
    subcategory: "Office Cotton Sets",
    collectionIds: ["office-edit", "cotton-comfort"],
    description: "Look sharp yet stay comfortable in the office. Features a navy blue straight cotton kurta with geometric block prints, paired with matching off-white straight trousers.",
    shortDescription: "Block printed office cotton kurta with straight trousers.",
    fabric: "High-Count Cotton",
    pattern: "Geometric Block Print",
    fit: "Slim Fit",
    sleeve: "3/4 Sleeve",
    neck: "Mandarin Collar",
    washCare: "Machine wash warm. Warm iron.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: true,
    rating: 4.5,
    reviewCount: 22,
    media: [
      { id: "w-cs-2-m1", type: "image", viewType: "front", url: getProductPlaceholder("Blue Office Kurta Set", "Front"), alt: "Blue Office Kurta Set Front View", sortOrder: 1 },
      { id: "w-cs-2-m2", type: "image", viewType: "back", url: getProductPlaceholder("Blue Office Kurta Set", "Back"), alt: "Blue Office Kurta Set Back View", sortOrder: 2 },
      { id: "w-cs-2-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Blue Office Kurta Set Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-cs-2-blu-m", sku: "999-WC-CS-002-BLU-M", color: { name: "Indigo Navy", hex: "#1D2A44" }, size: "M", stock: 12, enabled: true },
      { id: "v-w-cs-2-blu-l", sku: "999-WC-CS-002-BLU-L", color: { name: "Indigo Navy", hex: "#1D2A44" }, size: "L", stock: 15, enabled: true },
      { id: "v-w-cs-2-blu-xl", sku: "999-WC-CS-002-BLU-XL", color: { name: "Indigo Navy", hex: "#1D2A44" }, size: "XL", stock: 10, enabled: true }
    ],
    tags: ["cotton", "office", "navy", "straightpants", "kurtaset"]
  },
  {
    id: "prod-w-cset-3",
    slug: "pastel-pink-festive-cotton-kurta-set",
    name: "Pastel Pink Festive Cotton Kurta Set",
    shortName: "Festive Kurta Set",
    productCode: "WC-CS-003",
    sku: "999-WC-CS-003",
    gender: "women",
    categoryId: "cotton-sets",
    subcategory: "Festival Cotton Sets",
    collectionIds: ["traditional-edit", "cotton-comfort"],
    description: "Celebrate family functions with ease. Made with premium glazed cotton fabric featuring subtle gota patti border embellishments around the neck and matching palazzo pants.",
    shortDescription: "Gota-embellished glazed cotton kurta set with palazzo.",
    fabric: "Glazed Cotton",
    pattern: "Solid with Gota Border",
    fit: "Regular Fit",
    sleeve: "3/4 Sleeve",
    neck: "V-Neck",
    washCare: "Hand wash cold inside out. Medium iron on reverse.",
    comboEligible: true,
    featured: false,
    trending: false,
    newArrival: true,
    rating: 4.7,
    reviewCount: 15,
    media: [
      { id: "w-cs-3-m1", type: "image", viewType: "front", url: getProductPlaceholder("Festive Kurta Set", "Front"), alt: "Festive Kurta Set Front View", sortOrder: 1 },
      { id: "w-cs-3-m2", type: "image", viewType: "back", url: getProductPlaceholder("Festive Kurta Set", "Back"), alt: "Festive Kurta Set Back View", sortOrder: 2 },
      { id: "w-cs-3-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Festive Kurta Set Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-cs-3-pnk-s", sku: "999-WC-CS-003-PNK-S", color: { name: "Pastel Pink", hex: "#FFC0CB" }, size: "S", stock: 8, enabled: true },
      { id: "v-w-cs-3-pnk-m", sku: "999-WC-CS-003-PNK-M", color: { name: "Pastel Pink", hex: "#FFC0CB" }, size: "M", stock: 12, enabled: true },
      { id: "v-w-cs-3-pnk-l", sku: "999-WC-CS-003-PNK-L", color: { name: "Pastel Pink", hex: "#FFC0CB" }, size: "L", stock: 10, enabled: true }
    ],
    tags: ["cotton", "festive", "pink", "traditional", "gotapatti"]
  }
];
