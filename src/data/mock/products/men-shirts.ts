import { Product } from "@/types/product";
import { getProductPlaceholder, mockVideoUrl } from "@/lib/utils/placeholders";

export const menShirts: Product[] = [
  {
    id: "prod-m-shirt-1",
    slug: "emerald-check-casual-shirt",
    name: "Emerald Check Cotton Casual Shirt",
    shortName: "Emerald Check Shirt",
    productCode: "MC-SH-001",
    sku: "999-MC-SH-001",
    gender: "men",
    categoryId: "shirts",
    subcategory: "Casual Shirts",
    collectionIds: ["daily-essentials", "weekend-casuals"],
    description: "Upgrade your weekend style with this premium check casual shirt. Made from 100% breathable combed cotton, it offers regular fit comfort and effortless styling.",
    shortDescription: "Breathable 100% cotton check shirt, perfect for casual outings.",
    fabric: "Cotton",
    pattern: "Checked",
    fit: "Regular Fit",
    sleeve: "Full Sleeve",
    neck: "Collar",
    washCare: "Machine wash cold. Tumble dry low. Warm iron if needed.",
    comboEligible: true,
    featured: true,
    trending: true,
    newArrival: false,
    rating: 4.6,
    reviewCount: 34,
    media: [
      { id: "m-sh-1-m1", type: "image", viewType: "front", url: getProductPlaceholder("Emerald Check Shirt", "Front"), alt: "Emerald Check Casual Shirt Front View", sortOrder: 1 },
      { id: "m-sh-1-m2", type: "image", viewType: "back", url: getProductPlaceholder("Emerald Check Shirt", "Back"), alt: "Emerald Check Casual Shirt Back View", sortOrder: 2 },
      { id: "m-sh-1-m3", type: "image", viewType: "detail", url: getProductPlaceholder("Emerald Check Shirt", "Fabric Detail"), alt: "Emerald Check Casual Shirt Fabric Close-up", sortOrder: 3 },
      { id: "m-sh-1-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Emerald Check Casual Shirt Showcase Video", sortOrder: 4 }
    ],
    variants: [
      { id: "v-m-sh-1-grn-s", sku: "999-MC-SH-001-GRN-S", color: { name: "Emerald Green", hex: "#0F9D58" }, size: "S", stock: 12, enabled: true },
      { id: "v-m-sh-1-grn-m", sku: "999-MC-SH-001-GRN-M", color: { name: "Emerald Green", hex: "#0F9D58" }, size: "M", stock: 15, enabled: true },
      { id: "v-m-sh-1-grn-l", sku: "999-MC-SH-001-GRN-L", color: { name: "Emerald Green", hex: "#0F9D58" }, size: "L", stock: 0, enabled: true }, // Out of stock
      { id: "v-m-sh-1-grn-xl", sku: "999-MC-SH-001-GRN-XL", color: { name: "Emerald Green", hex: "#0F9D58" }, size: "XL", stock: 8, enabled: true }
    ],
    tags: ["cotton", "casual", "checks", "emerald"]
  },
  {
    id: "prod-m-shirt-2",
    slug: "classic-crisp-white-formal-shirt",
    name: "Classic Crisp White Formal Shirt",
    shortName: "Crisp White Shirt",
    productCode: "MC-SH-002",
    sku: "999-MC-SH-002",
    gender: "men",
    categoryId: "shirts",
    subcategory: "Formal Shirts",
    collectionIds: ["office-edit"],
    description: "Every wardrobe needs a premium white shirt. Designed for a sleek, formal look, this shirt is crafted with high-grade Egyptian cotton with an easy-iron finish.",
    shortDescription: "Easy-iron Egyptian cotton white formal shirt.",
    fabric: "Egyptian Cotton",
    pattern: "Solid",
    fit: "Slim Fit",
    sleeve: "Full Sleeve",
    neck: "Collar",
    washCare: "Warm machine wash. Line dry in shade. Hot iron.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: true,
    rating: 4.8,
    reviewCount: 52,
    media: [
      { id: "m-sh-2-m1", type: "image", viewType: "front", url: getProductPlaceholder("Crisp White Shirt", "Front"), alt: "Crisp White Formal Shirt Front View", sortOrder: 1 },
      { id: "m-sh-2-m2", type: "image", viewType: "back", url: getProductPlaceholder("Crisp White Shirt", "Back"), alt: "Crisp White Formal Shirt Back View", sortOrder: 2 },
      { id: "m-sh-2-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Crisp White Formal Shirt Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-m-sh-2-wht-m", sku: "999-MC-SH-002-WHT-M", color: { name: "Crisp White", hex: "#FFFFFF" }, size: "M", stock: 20, enabled: true },
      { id: "v-m-sh-2-wht-l", sku: "999-MC-SH-002-WHT-L", color: { name: "Crisp White", hex: "#FFFFFF" }, size: "L", stock: 18, enabled: true },
      { id: "v-m-sh-2-wht-xl", sku: "999-MC-SH-002-WHT-XL", color: { name: "Crisp White", hex: "#FFFFFF" }, size: "XL", stock: 10, enabled: true }
    ],
    tags: ["cotton", "formal", "white", "office"]
  },
  {
    id: "prod-m-shirt-3",
    slug: "midnight-linen-printed-casual-shirt",
    name: "Midnight Linen Printed Casual Shirt",
    shortName: "Linen Printed Shirt",
    productCode: "MC-SH-003",
    sku: "999-MC-SH-003",
    gender: "men",
    categoryId: "shirts",
    subcategory: "Printed Shirts",
    collectionIds: ["weekend-casuals"],
    description: "Stay cool and stylish with this pure linen casual shirt. Featuring a subtle floral print on a navy blue backdrop, it is the perfect vacation staple.",
    shortDescription: "Pure linen casual shirt featuring a midnight leaf print.",
    fabric: "Linen",
    pattern: "Printed",
    fit: "Regular Fit",
    sleeve: "Half Sleeve",
    neck: "Collar",
    washCare: "Hand wash cold. Dry flat. Cool iron on reverse.",
    comboEligible: true,
    featured: true,
    trending: false,
    newArrival: true,
    rating: 4.3,
    reviewCount: 15,
    media: [
      { id: "m-sh-3-m1", type: "image", viewType: "front", url: getProductPlaceholder("Linen Printed Shirt", "Front"), alt: "Linen Printed Casual Shirt Front View", sortOrder: 1 },
      { id: "m-sh-3-m2", type: "image", viewType: "back", url: getProductPlaceholder("Linen Printed Shirt", "Back"), alt: "Linen Printed Casual Shirt Back View", sortOrder: 2 },
      { id: "m-sh-3-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Linen Printed Casual Shirt Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-m-sh-3-nvy-m", sku: "999-MC-SH-003-NVY-M", color: { name: "Midnight Navy", hex: "#1D2A44" }, size: "M", stock: 14, enabled: true },
      { id: "v-m-sh-3-nvy-l", sku: "999-MC-SH-003-NVY-L", color: { name: "Midnight Navy", hex: "#1D2A44" }, size: "L", stock: 22, enabled: true },
      { id: "v-m-sh-3-nvy-xl", sku: "999-MC-SH-003-NVY-XL", color: { name: "Midnight Navy", hex: "#1D2A44" }, size: "XL", stock: 12, enabled: true }
    ],
    tags: ["linen", "printed", "navy", "vacation"]
  },
  {
    id: "prod-m-shirt-4",
    slug: "sandstone-oversized-cotton-shirt",
    name: "Sandstone Oversized Cotton Shirt",
    shortName: "Oversized Shirt",
    productCode: "MC-SH-004",
    sku: "999-MC-SH-004",
    gender: "men",
    categoryId: "shirts",
    subcategory: "Oversized Shirts",
    collectionIds: ["college-styles", "weekend-casuals"],
    description: "Designed for a laid-back look, this oversized twill cotton shirt features drop shoulders, dual chest pockets, and a heavy-washed texture.",
    shortDescription: "Heavy-wash utility oversized cotton shirt.",
    fabric: "Cotton Twill",
    pattern: "Solid",
    fit: "Oversized",
    sleeve: "Full Sleeve",
    neck: "Collar",
    washCare: "Cold machine wash with similar colors. Warm iron.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: false,
    rating: 4.5,
    reviewCount: 29,
    media: [
      { id: "m-sh-4-m1", type: "image", viewType: "front", url: getProductPlaceholder("Oversized Shirt", "Front"), alt: "Oversized Cotton Shirt Front View", sortOrder: 1 },
      { id: "m-sh-4-m2", type: "image", viewType: "back", url: getProductPlaceholder("Oversized Shirt", "Back"), alt: "Oversized Cotton Shirt Back View", sortOrder: 2 },
      { id: "m-sh-4-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Oversized Cotton Shirt Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-m-sh-4-snd-s", sku: "999-MC-SH-004-SND-S", color: { name: "Sandstone Beige", hex: "#D2C5B3" }, size: "S", stock: 5, enabled: true },
      { id: "v-m-sh-4-snd-m", sku: "999-MC-SH-004-SND-M", color: { name: "Sandstone Beige", hex: "#D2C5B3" }, size: "M", stock: 12, enabled: true },
      { id: "v-m-sh-4-snd-l", sku: "999-MC-SH-004-SND-L", color: { name: "Sandstone Beige", hex: "#D2C5B3" }, size: "L", stock: 15, enabled: true },
      { id: "v-m-sh-4-snd-xl", sku: "999-MC-SH-004-SND-XL", color: { name: "Sandstone Beige", hex: "#D2C5B3" }, size: "XL", stock: 6, enabled: true }
    ],
    tags: ["cotton", "oversized", "beige", "streetwear"]
  }
];
