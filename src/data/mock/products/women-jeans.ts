import { Product } from "@/types/product";

export const womenJeans: Product[] = [
  {
    id: "prod-w-jeans-1",
    slug: "indigo-wide-leg-denim-jeans",
    name: "Indigo Wide Leg Denim Jeans",
    shortName: "Wide Leg Jeans",
    productCode: "WC-JN-001",
    sku: "999-WC-JN-001",
    gender: "women",
    categoryId: "jeans",
    subcategory: "Wide Leg Jeans",
    collectionIds: ["college-styles", "weekend-casuals"],
    description: "Get that effortless retro look with our wide-leg jeans. Made from 100% premium heavy denim, it features a high-rise waist, standard five pockets, and a classic indigo fade.",
    shortDescription: "High-rise 100% cotton denim wide-leg jeans.",
    fabric: "100% Cotton Denim",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Cold machine wash separately. Turn inside out before washing.",
    comboEligible: true,
    featured: true,
    trending: true,
    newArrival: false,
    rating: 4.7,
    reviewCount: 32,
    media: [
      { id: "m-indigo-w-m1", type: "image", viewType: "front", url: "/products/women/indigo-wide-leg-denim-jeans/front.webp", alt: "Indigo Wide Leg Denim Jeans Front View", sortOrder: 1 },
      { id: "m-indigo-w-m2", type: "image", viewType: "back", url: "/products/women/indigo-wide-leg-denim-jeans/back.webp", alt: "Indigo Wide Leg Denim Jeans Back View", sortOrder: 2 },
      { id: "m-indigo-w-m3", type: "image", viewType: "detail", url: "/products/women/indigo-wide-leg-denim-jeans/detail.webp", alt: "Indigo Wide Leg Denim Jeans Fabric Close-up", sortOrder: 3 },
      { id: "m-indigo-w-v1", type: "video", viewType: "video", url: "/products/women/indigo-wide-leg-denim-jeans/product-preview.mp4", posterUrl: "/products/women/indigo-wide-leg-denim-jeans/video-poster.webp", alt: "Indigo Wide Leg Denim Jeans Showcase Video", sortOrder: 4 }
    ],
    variants: [
      { id: "v-w-jn-1-den-28", sku: "999-WC-JN-001-DEN-28", color: { name: "Indigo Faded", hex: "#2E5894" }, size: "28", stock: 10, enabled: true },
      { id: "v-w-jn-1-den-30", sku: "999-WC-JN-001-DEN-30", color: { name: "Indigo Faded", hex: "#2E5894" }, size: "30", stock: 14, enabled: true },
      { id: "v-w-jn-1-den-32", sku: "999-WC-JN-001-DEN-32", color: { name: "Indigo Faded", hex: "#2E5894" }, size: "32", stock: 12, enabled: true },
      { id: "v-w-jn-1-den-34", sku: "999-WC-JN-001-DEN-34", color: { name: "Indigo Faded", hex: "#2E5894" }, size: "34", stock: 5, enabled: true }
    ],
    tags: ["denim", "wideleg", "blue", "streetwear"]
  },
  {
    id: "prod-w-jeans-2",
    slug: "midnight-black-skinny-fit-jeans",
    name: "Midnight Black Skinny Fit Jeans",
    shortName: "Black Skinny Jeans",
    productCode: "WC-JN-002",
    sku: "999-WC-JN-002",
    gender: "women",
    categoryId: "jeans",
    subcategory: "Skinny Jeans",
    collectionIds: ["daily-essentials", "college-styles"],
    description: "Sleek and contouring. These high-waist black skinny jeans are crafted from super-stretch cotton polyester lycra blend to retain shape and fit like a second skin.",
    shortDescription: "Super-stretch high-rise black skinny jeans.",
    fabric: "Cotton Poly Lycra Stretch",
    pattern: "Solid",
    fit: "Slim Fit",
    washCare: "Machine wash cold with like colors inside out.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: true,
    rating: 4.5,
    reviewCount: 28,
    media: [
      { id: "m-midnight-m1", type: "image", viewType: "front", url: "/products/women/midnight-black-skinny-fit-jeans/front.webp", alt: "Midnight Black Skinny Fit Jeans Front View", sortOrder: 1 },
      { id: "m-midnight-m2", type: "image", viewType: "back", url: "/products/women/midnight-black-skinny-fit-jeans/back.webp", alt: "Midnight Black Skinny Fit Jeans Back View", sortOrder: 2 },
      { id: "m-midnight-m3", type: "image", viewType: "detail", url: "/products/women/midnight-black-skinny-fit-jeans/detail.webp", alt: "Midnight Black Skinny Fit Jeans Fabric Close-up", sortOrder: 3 },
      { id: "m-midnight-v1", type: "video", viewType: "video", url: "/products/women/midnight-black-skinny-fit-jeans/product-preview.mp4", posterUrl: "/products/women/midnight-black-skinny-fit-jeans/video-poster.webp", alt: "Midnight Black Skinny Fit Jeans Showcase Video", sortOrder: 4 }
    ],
    variants: [
      { id: "v-w-jn-2-blk-28", sku: "999-WC-JN-002-BLK-28", color: { name: "Midnight Black", hex: "#111111" }, size: "28", stock: 12, enabled: true },
      { id: "v-w-jn-2-blk-30", sku: "999-WC-JN-002-BLK-30", color: { name: "Midnight Black", hex: "#111111" }, size: "30", stock: 15, enabled: true },
      { id: "v-w-jn-2-blk-32", sku: "999-WC-JN-002-BLK-32", color: { name: "Midnight Black", hex: "#111111" }, size: "32", stock: 10, enabled: true }
    ],
    tags: ["denim", "skinny", "black", "stretch"]
  },
  {
    id: "prod-w-jeans-3",
    slug: "retro-light-blue-mom-fit-jeans",
    name: "Retro Light Blue Mom Fit Jeans",
    shortName: "Light Mom Jeans",
    productCode: "WC-JN-003",
    sku: "999-WC-JN-003",
    gender: "women",
    categoryId: "jeans",
    subcategory: "Mom Fit Jeans",
    collectionIds: ["weekend-casuals"],
    description: "Classic 90s vintage style. High-rise fit that is slightly relaxed through the hips and tapered at the ankles. Features a light stonewash texture for casual days.",
    shortDescription: "Vintage-style light stone wash high-rise mom jeans.",
    fabric: "Rigid Cotton Denim",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Wash inside out. Do not tumble dry.",
    comboEligible: true,
    featured: false,
    trending: false,
    newArrival: true,
    rating: 4.4,
    reviewCount: 16,
    media: [
      { id: "m-retro-li-m1", type: "image", viewType: "front", url: "/products/women/retro-light-blue-mom-fit-jeans/front.webp", alt: "Retro Light Blue Mom Fit Jeans Front View", sortOrder: 1 },
      { id: "m-retro-li-m2", type: "image", viewType: "back", url: "/products/women/retro-light-blue-mom-fit-jeans/back.webp", alt: "Retro Light Blue Mom Fit Jeans Back View", sortOrder: 2 },
      { id: "m-retro-li-m3", type: "image", viewType: "detail", url: "/products/women/retro-light-blue-mom-fit-jeans/detail.webp", alt: "Retro Light Blue Mom Fit Jeans Fabric Close-up", sortOrder: 3 },
      { id: "m-retro-li-v1", type: "video", viewType: "video", url: "/products/women/retro-light-blue-mom-fit-jeans/product-preview.mp4", posterUrl: "/products/women/retro-light-blue-mom-fit-jeans/video-poster.webp", alt: "Retro Light Blue Mom Fit Jeans Showcase Video", sortOrder: 4 }
    ],
    variants: [
      { id: "v-w-jn-3-lbl-28", sku: "999-WC-JN-003-LBL-28", color: { name: "Light Blue Wash", hex: "#ADD8E6" }, size: "28", stock: 8, enabled: true },
      { id: "v-w-jn-3-lbl-30", sku: "999-WC-JN-003-LBL-30", color: { name: "Light Blue Wash", hex: "#ADD8E6" }, size: "30", stock: 12, enabled: true },
      { id: "v-w-jn-3-lbl-32", sku: "999-WC-JN-003-LBL-32", color: { name: "Light Blue Wash", hex: "#ADD8E6" }, size: "32", stock: 10, enabled: true }
    ],
    tags: ["denim", "momfit", "vintage", "lightblue"]
  }
];
