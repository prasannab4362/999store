import { Product } from "@/types/product";
import { getProductPlaceholder, mockVideoUrl } from "@/lib/utils/placeholders";

export const menPants: Product[] = [
  {
    id: "prod-m-pant-1",
    slug: "sandstone-stretch-chino-pant",
    name: "Sandstone Stretch Chino Pant",
    shortName: "Sandstone Chinos",
    productCode: "MC-PA-001",
    sku: "999-MC-PA-001",
    gender: "men",
    categoryId: "pants",
    subcategory: "Chinos",
    collectionIds: ["office-edit", "weekend-casuals"],
    description: "Look sharp with these mid-weight stretch chinos. Made with high-tensile cotton twill blended with elastane, it gives you comfortable stretch and smart structural definition.",
    shortDescription: "Mid-weight stretch cotton twill casual chinos.",
    fabric: "Cotton Elastane Blend",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Machine wash cold inside out. Tumble dry normal.",
    comboEligible: true,
    featured: true,
    trending: true,
    newArrival: false,
    rating: 4.5,
    reviewCount: 30,
    media: [
      { id: "m-pa-1-m1", type: "image", viewType: "front", url: getProductPlaceholder("Sandstone Chinos", "Front"), alt: "Sandstone Stretch Chino Pant Front View", sortOrder: 1 },
      { id: "m-pa-1-m2", type: "image", viewType: "back", url: getProductPlaceholder("Sandstone Chinos", "Back"), alt: "Sandstone Stretch Chino Pant Back View", sortOrder: 2 },
      { id: "m-pa-1-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Sandstone Stretch Chino Pant Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-m-pa-1-snd-30", sku: "999-MC-PA-001-SND-30", color: { name: "Sandstone Beige", hex: "#D2C5B3" }, size: "30", stock: 10, enabled: true },
      { id: "v-m-pa-1-snd-32", sku: "999-MC-PA-001-SND-32", color: { name: "Sandstone Beige", hex: "#D2C5B3" }, size: "32", stock: 15, enabled: true },
      { id: "v-m-pa-1-snd-34", sku: "999-MC-PA-001-SND-34", color: { name: "Sandstone Beige", hex: "#D2C5B3" }, size: "34", stock: 12, enabled: true },
      { id: "v-m-pa-1-snd-36", sku: "999-MC-PA-001-SND-36", color: { name: "Sandstone Beige", hex: "#D2C5B3" }, size: "36", stock: 8, enabled: true }
    ],
    tags: ["cotton", "chinos", "beige", "casual", "stretch"]
  },
  {
    id: "prod-m-pant-2",
    slug: "classic-slate-grey-formal-pant",
    name: "Classic Slate Grey Formal Pant",
    shortName: "Slate Grey Pants",
    productCode: "MC-PA-002",
    sku: "999-MC-PA-002",
    gender: "men",
    categoryId: "pants",
    subcategory: "Formal Pants",
    collectionIds: ["office-edit"],
    description: "Step into your meetings with confidence. Crafted with poly-viscose blend, this flat-front formal trouser resists creases and offers structured elegance all day.",
    shortDescription: "Crease-resistant flat-front poly-viscose formal pants.",
    fabric: "Poly-Viscose Blend",
    pattern: "Solid",
    fit: "Slim Fit",
    washCare: "Dry clean recommended. Cool iron.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: true,
    rating: 4.7,
    reviewCount: 28,
    media: [
      { id: "m-pa-2-m1", type: "image", viewType: "front", url: getProductPlaceholder("Slate Grey Pants", "Front"), alt: "Slate Grey Formal Pant Front View", sortOrder: 1 },
      { id: "m-pa-2-m2", type: "image", viewType: "back", url: getProductPlaceholder("Slate Grey Pants", "Back"), alt: "Slate Grey Formal Pant Back View", sortOrder: 2 },
      { id: "m-pa-2-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Slate Grey Formal Pant Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-m-pa-2-gry-30", sku: "999-MC-PA-002-GRY-30", color: { name: "Slate Grey", hex: "#708090" }, size: "30", stock: 12, enabled: true },
      { id: "v-m-pa-2-gry-32", sku: "999-MC-PA-002-GRY-32", color: { name: "Slate Grey", hex: "#708090" }, size: "32", stock: 14, enabled: true },
      { id: "v-m-pa-2-gry-34", sku: "999-MC-PA-002-GRY-34", color: { name: "Slate Grey", hex: "#708090" }, size: "34", stock: 10, enabled: true },
      { id: "v-m-pa-2-gry-36", sku: "999-MC-PA-002-GRY-36", color: { name: "Slate Grey", hex: "#708090" }, size: "36", stock: 5, enabled: true }
    ],
    tags: ["formal", "grey", "office", "trousers"]
  },
  {
    id: "prod-m-pant-3",
    slug: "midnight-blue-cargo-denim-pant",
    name: "Midnight Blue Cargo Denim Pant",
    shortName: "Cargo Denim",
    productCode: "MC-PA-003",
    sku: "999-MC-PA-003",
    gender: "men",
    categoryId: "pants",
    subcategory: "Cargo Pants",
    collectionIds: ["college-styles", "weekend-casuals"],
    description: "Combine utility and classic ruggedness with these multi-pocket denim cargo pants. Features relaxed thigh space, tapered legs, and side-flap utility pockets.",
    shortDescription: "Multi-pocket rugged denim cargo pants.",
    fabric: "Denim Cotton",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Cold wash separately. Colors may bleed slightly.",
    comboEligible: true,
    featured: true,
    trending: false,
    newArrival: true,
    rating: 4.4,
    reviewCount: 19,
    media: [
      { id: "m-pa-3-m1", type: "image", viewType: "front", url: getProductPlaceholder("Cargo Denim", "Front"), alt: "Cargo Denim Front View", sortOrder: 1 },
      { id: "m-pa-3-m2", type: "image", viewType: "back", url: getProductPlaceholder("Cargo Denim", "Back"), alt: "Cargo Denim Back View", sortOrder: 2 },
      { id: "m-pa-3-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Cargo Denim Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-m-pa-3-den-30", sku: "999-MC-PA-003-DEN-30", color: { name: "Indigo Blue", hex: "#4B0082" }, size: "30", stock: 8, enabled: true },
      { id: "v-m-pa-3-den-32", sku: "999-MC-PA-003-DEN-32", color: { name: "Indigo Blue", hex: "#4B0082" }, size: "32", stock: 12, enabled: true },
      { id: "v-m-pa-3-den-34", sku: "999-MC-PA-003-DEN-34", color: { name: "Indigo Blue", hex: "#4B0082" }, size: "34", stock: 10, enabled: true }
    ],
    tags: ["denim", "cargos", "blue", "rugged", "streetwear"]
  },
  {
    id: "prod-m-pant-4",
    slug: "twill-cotton-khaki-casual-pant",
    name: "Twill Cotton Khaki Casual Pant",
    shortName: "Khaki Casual Pants",
    productCode: "MC-PA-004",
    sku: "999-MC-PA-004",
    gender: "men",
    categoryId: "pants",
    subcategory: "Cotton Pants",
    collectionIds: ["daily-essentials"],
    description: "Clean flat-front trousers made from pre-washed twill cotton. Heavy fabric weights offer structural resilience, making it an excellent everyday option.",
    shortDescription: "Washed flat-front twill cotton khaki trousers.",
    fabric: "Twill Cotton",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Machine wash warm. Wash with like colors.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: false,
    rating: 4.3,
    reviewCount: 17,
    media: [
      { id: "m-pa-4-m1", type: "image", viewType: "front", url: getProductPlaceholder("Khaki Casual Pants", "Front"), alt: "Khaki Casual Pant Front View", sortOrder: 1 },
      { id: "m-pa-4-m2", type: "image", viewType: "back", url: getProductPlaceholder("Khaki Casual Pants", "Back"), alt: "Khaki Casual Pant Back View", sortOrder: 2 },
      { id: "m-pa-4-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Khaki Casual Pant Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-m-pa-4-khk-30", sku: "999-MC-PA-004-KHK-30", color: { name: "Desert Khaki", hex: "#C2B280" }, size: "30", stock: 15, enabled: true },
      { id: "v-m-pa-4-khk-32", sku: "999-MC-PA-004-KHK-32", color: { name: "Desert Khaki", hex: "#C2B280" }, size: "32", stock: 15, enabled: true },
      { id: "v-m-pa-4-khk-34", sku: "999-MC-PA-004-KHK-34", color: { name: "Desert Khaki", hex: "#C2B280" }, size: "34", stock: 15, enabled: true },
      { id: "v-m-pa-4-khk-36", sku: "999-MC-PA-004-KHK-36", color: { name: "Desert Khaki", hex: "#C2B280" }, size: "36", stock: 15, enabled: true }
    ],
    tags: ["cotton", "khaki", "desert", "casual"]
  }
];
