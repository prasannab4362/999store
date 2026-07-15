import { Product } from "@/types/product";

export const menShorts: Product[] = [
  {
    id: "prod-m-shorts-1",
    slug: "slate-cotton-casual-shorts",
    name: "Slate Cotton Casual Shorts",
    shortName: "Slate Cotton Shorts",
    productCode: "MC-SH-011",
    sku: "999-MC-SH-011",
    gender: "men",
    categoryId: "shorts",
    subcategory: "Cotton Shorts",
    collectionIds: ["weekend-casuals"],
    description: "Keep it easy with these combed twill cotton shorts. Featuring an elasticated drawstring waistband, 2 slash pockets, and a buttoned back pocket, it offers relaxed comfort.",
    shortDescription: "Combed twill cotton shorts with drawstring waistband.",
    fabric: "Twill Cotton",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Machine wash warm. Warm iron.",
    comboEligible: true,
    featured: true,
    trending: true,
    newArrival: false,
    rating: 4.5,
    reviewCount: 18,
    media: [
      { id: "m-slate-co-m1", type: "image", viewType: "front", url: "/products/men/slate-cotton-casual-shorts/front.webp", alt: "Slate Cotton Casual Shorts Front View", sortOrder: 1 },
      { id: "m-slate-co-m2", type: "image", viewType: "back", url: "/products/men/slate-cotton-casual-shorts/back.webp", alt: "Slate Cotton Casual Shorts Back View", sortOrder: 2 },
      { id: "m-slate-co-m3", type: "image", viewType: "detail", url: "/products/men/slate-cotton-casual-shorts/detail.webp", alt: "Slate Cotton Casual Shorts Fabric Close-up", sortOrder: 3 },
      { id: "m-slate-co-v1", type: "video", viewType: "video", url: "/products/men/slate-cotton-casual-shorts/product-preview.mp4", posterUrl: "/products/men/slate-cotton-casual-shorts/video-poster.webp", alt: "Slate Cotton Casual Shorts Showcase Video", sortOrder: 4 }
    ],
    variants: [
      { id: "v-m-shs-1-gry-s", sku: "999-MC-SH-011-GRY-S", color: { name: "Slate Grey", hex: "#708090" }, size: "S", stock: 12, enabled: true },
      { id: "v-m-shs-1-gry-m", sku: "999-MC-SH-011-GRY-M", color: { name: "Slate Grey", hex: "#708090" }, size: "M", stock: 18, enabled: true },
      { id: "v-m-shs-1-gry-l", sku: "999-MC-SH-011-GRY-L", color: { name: "Slate Grey", hex: "#708090" }, size: "L", stock: 15, enabled: true },
      { id: "v-m-shs-1-gry-xl", sku: "999-MC-SH-011-GRY-XL", color: { name: "Slate Grey", hex: "#708090" }, size: "XL", stock: 6, enabled: true }
    ],
    tags: ["shorts", "cotton", "grey", "weekend"]
  },
  {
    id: "prod-m-shorts-2",
    slug: "active-dry-fit-sports-shorts",
    name: "Active Dry-Fit Sports Shorts",
    shortName: "Sports Shorts",
    productCode: "MC-SH-012",
    sku: "999-MC-SH-012",
    gender: "men",
    categoryId: "shorts",
    subcategory: "Sports Shorts",
    collectionIds: ["daily-essentials"],
    description: "Move freely in our ultra-light active sports shorts. Side vents offer range of movement while dry-fit micro-mesh channels perspiration away from the skin.",
    shortDescription: "Lightweight dry-fit active micro-mesh shorts.",
    fabric: "Polyester Mesh",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Cold wash. Do not tumble dry. Do not iron.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: true,
    rating: 4.6,
    reviewCount: 22,
    media: [
      { id: "m-active-d-m1", type: "image", viewType: "front", url: "/products/men/active-dry-fit-sports-shorts/front.webp", alt: "Active Dry-Fit Sports Shorts Front View", sortOrder: 1 },
      { id: "m-active-d-m2", type: "image", viewType: "back", url: "/products/men/active-dry-fit-sports-shorts/back.webp", alt: "Active Dry-Fit Sports Shorts Back View", sortOrder: 2 },
      { id: "m-active-d-m3", type: "image", viewType: "detail", url: "/products/men/active-dry-fit-sports-shorts/detail.webp", alt: "Active Dry-Fit Sports Shorts Fabric Close-up", sortOrder: 3 },
      { id: "m-active-d-v1", type: "video", viewType: "video", url: "/products/men/active-dry-fit-sports-shorts/product-preview.mp4", posterUrl: "/products/men/active-dry-fit-sports-shorts/video-poster.webp", alt: "Active Dry-Fit Sports Shorts Showcase Video", sortOrder: 4 }
    ],
    variants: [
      { id: "v-m-shs-2-blk-m", sku: "999-MC-SH-012-BLK-M", color: { name: "Active Black", hex: "#1A1A1A" }, size: "M", stock: 15, enabled: true },
      { id: "v-m-shs-2-blk-l", sku: "999-MC-SH-012-BLK-L", color: { name: "Active Black", hex: "#1A1A1A" }, size: "L", stock: 22, enabled: true },
      { id: "v-m-shs-2-blk-xl", sku: "999-MC-SH-012-BLK-XL", color: { name: "Active Black", hex: "#1A1A1A" }, size: "XL", stock: 12, enabled: true }
    ],
    tags: ["sports", "shorts", "black", "workout"]
  },
  {
    id: "prod-m-shorts-3",
    slug: "indigo-denim-frayed-shorts",
    name: "Indigo Denim Frayed Shorts",
    shortName: "Denim Shorts",
    productCode: "MC-SH-013",
    sku: "999-MC-SH-013",
    gender: "men",
    categoryId: "shorts",
    subcategory: "Denim Shorts",
    collectionIds: ["college-styles", "weekend-casuals"],
    description: "Classic five-pocket denim shorts in medium indigo wash. Finished with subtle whiskering and raw frayed hems for a cool, worn-in beach aesthetic.",
    shortDescription: "Medium wash denim shorts with frayed hems.",
    fabric: "Denim Cotton",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Machine wash cold separately inside out.",
    comboEligible: true,
    featured: true,
    trending: false,
    newArrival: true,
    rating: 4.3,
    reviewCount: 14,
    media: [
      { id: "m-indigo-d-m1", type: "image", viewType: "front", url: "/products/men/indigo-denim-frayed-shorts/front.webp", alt: "Indigo Denim Frayed Shorts Front View", sortOrder: 1 },
      { id: "m-indigo-d-m2", type: "image", viewType: "back", url: "/products/men/indigo-denim-frayed-shorts/back.webp", alt: "Indigo Denim Frayed Shorts Back View", sortOrder: 2 },
      { id: "m-indigo-d-m3", type: "image", viewType: "detail", url: "/products/men/indigo-denim-frayed-shorts/detail.webp", alt: "Indigo Denim Frayed Shorts Fabric Close-up", sortOrder: 3 },
      { id: "m-indigo-d-v1", type: "video", viewType: "video", url: "/products/men/indigo-denim-frayed-shorts/product-preview.mp4", posterUrl: "/products/men/indigo-denim-frayed-shorts/video-poster.webp", alt: "Indigo Denim Frayed Shorts Showcase Video", sortOrder: 4 }
    ],
    variants: [
      { id: "v-m-shs-3-den-s", sku: "999-MC-SH-013-DEN-S", color: { name: "Indigo Blue", hex: "#2E5894" }, size: "S", stock: 5, enabled: true },
      { id: "v-m-shs-3-den-m", sku: "999-MC-SH-013-DEN-M", color: { name: "Indigo Blue", hex: "#2E5894" }, size: "M", stock: 12, enabled: true },
      { id: "v-m-shs-3-den-l", sku: "999-MC-SH-013-DEN-L", color: { name: "Indigo Blue", hex: "#2E5894" }, size: "L", stock: 10, enabled: true }
    ],
    tags: ["denim", "shorts", "blue", "beach"]
  },
  {
    id: "prod-m-shorts-4",
    slug: "camo-printed-cargo-shorts",
    name: "Camo Printed Cargo Shorts",
    shortName: "Camo Cargo Shorts",
    productCode: "MC-SH-014",
    sku: "999-MC-SH-014",
    gender: "men",
    categoryId: "shorts",
    subcategory: "Cargo Shorts",
    collectionIds: ["weekend-casuals"],
    description: "Heavy twill utility cargo shorts in desert camouflage print. Featuring multiple secure cargo pockets for storing coordinates during treks.",
    shortDescription: "Heavy cotton cargo shorts in desert camouflage print.",
    fabric: "Heavy Cotton Twill",
    pattern: "Printed",
    fit: "Regular Fit",
    washCare: "Wash inside out. Iron normal.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: false,
    rating: 4.4,
    reviewCount: 16,
    media: [
      { id: "m-camo-pri-m1", type: "image", viewType: "front", url: "/products/men/camo-printed-cargo-shorts/front.webp", alt: "Camo Printed Cargo Shorts Front View", sortOrder: 1 },
      { id: "m-camo-pri-m2", type: "image", viewType: "back", url: "/products/men/camo-printed-cargo-shorts/back.webp", alt: "Camo Printed Cargo Shorts Back View", sortOrder: 2 },
      { id: "m-camo-pri-m3", type: "image", viewType: "detail", url: "/products/men/camo-printed-cargo-shorts/detail.webp", alt: "Camo Printed Cargo Shorts Fabric Close-up", sortOrder: 3 },
      { id: "m-camo-pri-v1", type: "video", viewType: "video", url: "/products/men/camo-printed-cargo-shorts/product-preview.mp4", posterUrl: "/products/men/camo-printed-cargo-shorts/video-poster.webp", alt: "Camo Printed Cargo Shorts Showcase Video", sortOrder: 4 }
    ],
    variants: [
      { id: "v-m-shs-4-cam-m", sku: "999-MC-SH-014-CAM-M", color: { name: "Desert Camo", hex: "#8A9A86" }, size: "M", stock: 10, enabled: true },
      { id: "v-m-shs-4-cam-l", sku: "999-MC-SH-014-CAM-L", color: { name: "Desert Camo", hex: "#8A9A86" }, size: "L", stock: 15, enabled: true },
      { id: "v-m-shs-4-cam-xl", sku: "999-MC-SH-014-CAM-XL", color: { name: "Desert Camo", hex: "#8A9A86" }, size: "XL", stock: 8, enabled: true }
    ],
    tags: ["cargo", "shorts", "camo", "trekking"]
  }
];
