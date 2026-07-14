import { Product } from "@/types/product";
import { getProductPlaceholder, mockVideoUrl } from "@/lib/utils/placeholders";

export const womenLehenga: Product[] = [
  {
    id: "prod-w-lehenga-1",
    slug: "festival-golden-embroidered-georgette-lehenga",
    name: "Festival Golden Embroidered Georgette Lehenga",
    shortName: "Embroidered Lehenga",
    productCode: "WC-LH-001",
    sku: "999-WC-LH-001",
    gender: "women",
    categoryId: "lehenga",
    subcategory: "Festival Lehenga",
    collectionIds: ["traditional-edit"],
    description: "Shine bright during celebrations. Crafted with flowing georgette, this semi-stitched lehenga features exquisite golden thread embroidery, a matching blouse piece, and a sheer net dupatta.",
    shortDescription: "Embroidered georgette lehenga with net dupatta.",
    fabric: "Georgette",
    pattern: "Embroidered",
    fit: "Regular Fit",
    washCare: "Dry clean only. Cool iron on reverse using a protective sheet.",
    comboEligible: true,
    featured: true,
    trending: true,
    newArrival: false,
    rating: 4.8,
    reviewCount: 35,
    media: [
      { id: "w-lh-1-m1", type: "image", viewType: "front", url: getProductPlaceholder("Embroidered Lehenga", "Front"), alt: "Golden Embroidered Lehenga Front View", sortOrder: 1 },
      { id: "w-lh-1-m2", type: "image", viewType: "back", url: getProductPlaceholder("Embroidered Lehenga", "Back"), alt: "Golden Embroidered Lehenga Back View", sortOrder: 2 },
      { id: "w-lh-1-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Golden Embroidered Lehenga Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-lh-1-gld-m", sku: "999-WC-LH-001-GLD-M", color: { name: "Marigold Gold", hex: "#FFD700" }, size: "M", stock: 10, enabled: true },
      { id: "v-w-lh-1-gld-l", sku: "999-WC-LH-001-GLD-L", color: { name: "Marigold Gold", hex: "#FFD700" }, size: "L", stock: 12, enabled: true },
      { id: "v-w-lh-1-gld-xl", sku: "999-WC-LH-001-GLD-XL", color: { name: "Marigold Gold", hex: "#FFD700" }, size: "XL", stock: 8, enabled: true }
    ],
    tags: ["georgette", "lehenga", "gold", "traditional", "embroidery"]
  },
  {
    id: "prod-w-lehenga-2",
    slug: "wedding-silk-floral-printed-lehenga",
    name: "Wedding Silk Floral Printed Lehenga",
    shortName: "Floral Silk Lehenga",
    productCode: "WC-LH-002",
    sku: "999-WC-LH-002",
    gender: "women",
    categoryId: "lehenga",
    subcategory: "Wedding Lehenga",
    collectionIds: ["traditional-edit"],
    description: "Traditional silk lehenga featuring beautiful modern floral print detailing. Soft art silk fabric offers luxurious shine, paired with a rich banarasi silk dupatta.",
    shortDescription: "Floral printed art silk lehenga with banarasi dupatta.",
    fabric: "Art Silk",
    pattern: "Printed",
    fit: "Regular Fit",
    washCare: "Dry clean recommended. Hang dry.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: true,
    rating: 4.7,
    reviewCount: 22,
    media: [
      { id: "w-lh-2-m1", type: "image", viewType: "front", url: getProductPlaceholder("Floral Silk Lehenga", "Front"), alt: "Floral Silk Lehenga Front View", sortOrder: 1 },
      { id: "w-lh-2-m2", type: "image", viewType: "back", url: getProductPlaceholder("Floral Silk Lehenga", "Back"), alt: "Floral Silk Lehenga Back View", sortOrder: 2 },
      { id: "w-lh-2-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Floral Silk Lehenga Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-lh-2-pnk-m", sku: "999-WC-LH-002-PNK-M", color: { name: "Silk Pink", hex: "#FC8EAC" }, size: "M", stock: 8, enabled: true },
      { id: "v-w-lh-2-pnk-l", sku: "999-WC-LH-002-PNK-L", color: { name: "Silk Pink", hex: "#FC8EAC" }, size: "L", stock: 10, enabled: true },
      { id: "v-w-lh-2-pnk-xl", sku: "999-WC-LH-002-PNK-XL", color: { name: "Silk Pink", hex: "#FC8EAC" }, size: "XL", stock: 5, enabled: true }
    ],
    tags: ["silk", "lehenga", "pink", "traditional", "wedding"]
  },
  {
    id: "prod-w-lehenga-3",
    slug: "vibrant-party-wear-rayon-lehenga-set",
    name: "Vibrant Party Wear Rayon Lehenga Set",
    shortName: "Rayon Lehenga Set",
    productCode: "WC-LH-003",
    sku: "999-WC-LH-003",
    gender: "women",
    categoryId: "lehenga",
    subcategory: "Party Lehenga",
    collectionIds: ["traditional-edit"],
    description: "Lightweight and easy-to-wear lehenga designed for dance nights. Constructed from soft heavy rayon fabric with colorful bandhani prints and mirror foil borders.",
    shortDescription: "Printed rayon bandhani lehenga with mirror border.",
    fabric: "Rayon",
    pattern: "Printed",
    fit: "Regular Fit",
    washCare: "Dry clean or hand wash cold separately. Cool iron.",
    comboEligible: true,
    featured: false,
    trending: false,
    newArrival: true,
    rating: 4.5,
    reviewCount: 16,
    media: [
      { id: "w-lh-3-m1", type: "image", viewType: "front", url: getProductPlaceholder("Rayon Lehenga Set", "Front"), alt: "Rayon Lehenga Front View", sortOrder: 1 },
      { id: "w-lh-3-m2", type: "image", viewType: "back", url: getProductPlaceholder("Rayon Lehenga Set", "Back"), alt: "Rayon Lehenga Back View", sortOrder: 2 },
      { id: "w-lh-3-v1", type: "video", viewType: "video", url: mockVideoUrl, alt: "Rayon Lehenga Video", sortOrder: 3 }
    ],
    variants: [
      { id: "v-w-lh-3-red-s", sku: "999-WC-LH-003-RED-S", color: { name: "Vibrant Red", hex: "#FF0000" }, size: "S", stock: 10, enabled: true },
      { id: "v-w-lh-3-red-m", sku: "999-WC-LH-003-RED-M", color: { name: "Vibrant Red", hex: "#FF0000" }, size: "M", stock: 12, enabled: true },
      { id: "v-w-lh-3-red-l", sku: "999-WC-LH-003-RED-L", color: { name: "Vibrant Red", hex: "#FF0000" }, size: "L", stock: 15, enabled: true }
    ],
    tags: ["rayon", "lehenga", "red", "partywear", "bandhani"]
  }
];
