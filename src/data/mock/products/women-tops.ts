import { Product } from "@/types/product";
import { getProductPlaceholder, mockVideoUrl } from "@/lib/utils/placeholders";

export const womenTops: Product[] = [
  {
    id: "prod-w-top-1",
    slug: "rosewood-printed-rayon-top",
    name: "Rosewood Printed Rayon Top",
    shortName: "Rosewood Top",
    productCode: "WC-TP-001",
    sku: "999-WC-TP-001",
    gender: "women",
    categoryId: "tops",
    subcategory: "Printed Tops",
    collectionIds: ["daily-essentials", "weekend-casuals"],
    description: "Experience relaxed luxury. Crafted from fluid, breathable rayon, this regular fit top features an abstract floral pattern, a smart keyhole neck detail, and three-quarter sleeves.",
    shortDescription: "Fluid and breathable printed rayon top.",
    fabric: "Rayon",
    pattern: "Printed",
    fit: "Regular Fit",
    sleeve: "3/4 Sleeve",
    neck: "Round Neck",
    washCare: "Cold machine wash with like colors. Dry in shade.",
    comboEligible: true,
    featured: true,
    trending: true,
    newArrival: false,
    rating: 4.5,
    reviewCount: 30,
    media: [
      { id: "w-tp-1-m1", type: "image", viewType: "front", url: getProductPlaceholder("Rosewood Top", "Front"), alt: "Rosewood Printed Rayon Top Front View", sortOrder: 1 },
      { id: "w-tp-1-m2", type: "image", viewType: "back", url: getProductPlaceholder("Rosewood Top", "Back"), alt: "Rosewood Printed Rayon Top Back View", sortOrder: 2 },
      { id: "w-tp-1-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Rosewood Printed Rayon Top Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-tp-1-pnk-s", sku: "999-WC-TP-001-PNK-S", color: { name: "Rosewood Pink", hex: "#B76E79" }, size: "S", stock: 12, enabled: true },
      { id: "v-w-tp-1-pnk-m", sku: "999-WC-TP-001-PNK-M", color: { name: "Rosewood Pink", hex: "#B76E79" }, size: "M", stock: 15, enabled: true },
      { id: "v-w-tp-1-pnk-l", sku: "999-WC-TP-001-PNK-L", color: { name: "Rosewood Pink", hex: "#B76E79" }, size: "L", stock: 20, enabled: true },
      { id: "v-w-tp-1-pnk-xl", sku: "999-WC-TP-001-PNK-XL", color: { name: "Rosewood Pink", hex: "#B76E79" }, size: "XL", stock: 8, enabled: true }
    ],
    tags: ["rayon", "printed", "pink", "tops"]
  },
  {
    id: "prod-w-top-2",
    slug: "olive-linen-sleeveless-crop-top",
    name: "Olive Linen Sleeveless Crop Top",
    shortName: "Olive Crop Top",
    productCode: "WC-TP-002",
    sku: "999-WC-TP-002",
    gender: "women",
    categoryId: "tops",
    subcategory: "Crop Tops",
    collectionIds: ["college-styles", "weekend-casuals"],
    description: "Soak in the summer sun with this sleeveless crop top. Knit from high-quality pure linen, it features a square neck outline and side tie detail for standard adjustment.",
    shortDescription: "Pure linen sleeveless summer crop top.",
    fabric: "Linen",
    pattern: "Solid",
    fit: "Slim Fit",
    sleeve: "Sleeveless",
    neck: "Square Neck",
    washCare: "Hand wash cold. Iron on high heat with damp cloth.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: true,
    rating: 4.3,
    reviewCount: 22,
    media: [
      { id: "w-tp-2-m1", type: "image", viewType: "front", url: getProductPlaceholder("Olive Crop Top", "Front"), alt: "Olive Crop Top Front View", sortOrder: 1 },
      { id: "w-tp-2-m2", type: "image", viewType: "back", url: getProductPlaceholder("Olive Crop Top", "Back"), alt: "Olive Crop Top Back View", sortOrder: 2 },
      { id: "w-tp-2-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Olive Crop Top Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-tp-2-olv-s", sku: "999-WC-TP-002-OLV-S", color: { name: "Olive Green", hex: "#556B2F" }, size: "S", stock: 10, enabled: true },
      { id: "v-w-tp-2-olv-m", sku: "999-WC-TP-002-OLV-M", color: { name: "Olive Green", hex: "#556B2F" }, size: "M", stock: 12, enabled: true },
      { id: "v-w-tp-2-olv-l", sku: "999-WC-TP-002-OLV-L", color: { name: "Olive Green", hex: "#556B2F" }, size: "L", stock: 0, enabled: true } // Out of stock
    ],
    tags: ["linen", "crop", "olive", "sleeveless"]
  },
  {
    id: "prod-w-top-3",
    slug: "ivory-schiffli-cotton-long-top",
    name: "Ivory Schiffli Cotton Long Top",
    shortName: "Schiffli Long Top",
    productCode: "WC-TP-003",
    sku: "999-WC-TP-003",
    gender: "women",
    categoryId: "tops",
    subcategory: "Long Tops",
    collectionIds: ["daily-essentials"],
    description: "An elegant traditional-fusion piece. Made with soft cotton featuring intricate Schiffli embroidery cutwork, this longline top pairs excellently with leggings or denim.",
    shortDescription: "Embroidered cotton Schiffli longline top.",
    fabric: "Cotton",
    pattern: "Schiffli Embroidery",
    fit: "Regular Fit",
    sleeve: "3/4 Sleeve",
    neck: "V-Neck",
    washCare: "Gentle machine wash in laundry bag. Do not bleach.",
    comboEligible: true,
    featured: true,
    trending: false,
    newArrival: true,
    rating: 4.6,
    reviewCount: 15,
    media: [
      { id: "w-tp-3-m1", type: "image", viewType: "front", url: getProductPlaceholder("Schiffli Long Top", "Front"), alt: "Ivory Schiffli Long Top Front View", sortOrder: 1 },
      { id: "w-tp-3-m2", type: "image", viewType: "back", url: getProductPlaceholder("Schiffli Long Top", "Back"), alt: "Ivory Schiffli Long Top Back View", sortOrder: 2 },
      { id: "w-tp-3-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Ivory Schiffli Long Top Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-tp-3-ivr-m", sku: "999-WC-TP-003-IVR-M", color: { name: "Ivory White", hex: "#FFFFF0" }, size: "M", stock: 8, enabled: true },
      { id: "v-w-tp-3-ivr-l", sku: "999-WC-TP-003-IVR-L", color: { name: "Ivory White", hex: "#FFFFF0" }, size: "L", stock: 14, enabled: true },
      { id: "v-w-tp-3-ivr-xl", sku: "999-WC-TP-003-IVR-XL", color: { name: "Ivory White", hex: "#FFFFF0" }, size: "XL", stock: 12, enabled: true }
    ],
    tags: ["cotton", "schiffli", "embroidery", "ivory", "longtop"]
  }
];
