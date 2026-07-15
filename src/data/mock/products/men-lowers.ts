import { Product } from "@/types/product";

export const menLowers: Product[] = [
  {
    id: "prod-m-lower-1",
    slug: "navy-active-track-lower",
    name: "Navy Active Track Lower",
    shortName: "Navy Track Pant",
    productCode: "MC-LO-001",
    sku: "999-MC-LO-001",
    gender: "men",
    categoryId: "lowers",
    subcategory: "Track Pants",
    collectionIds: ["daily-essentials"],
    description: "Stay in motion with these navy track pants. Engineered from flexible dry-fit polyester with deep side zipper pockets, it provides maximum ventilation and utility during workouts.",
    shortDescription: "Dry-fit active navy blue track pants.",
    fabric: "Polyester",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Cold machine wash. Do not iron.",
    comboEligible: true,
    featured: true,
    trending: true,
    newArrival: false,
    rating: 4.4,
    reviewCount: 32,
    media: [
      { id: "m-navy-act-m1", type: "image", viewType: "front", url: "/products/men/navy-active-track-lower/front.webp", alt: "Navy Active Track Lower Front View", sortOrder: 1 },
      { id: "m-navy-act-m2", type: "image", viewType: "back", url: "/products/men/navy-active-track-lower/back.webp", alt: "Navy Active Track Lower Back View", sortOrder: 2 },
      { id: "m-navy-act-m3", type: "image", viewType: "detail", url: "/products/men/navy-active-track-lower/detail.webp", alt: "Navy Active Track Lower Fabric Close-up", sortOrder: 3 },
      { id: "m-navy-act-v1", type: "video", viewType: "video", url: "/products/men/navy-active-track-lower/product-preview.mp4", posterUrl: "/products/men/navy-active-track-lower/video-poster.webp", alt: "Navy Active Track Lower Showcase Video", sortOrder: 4 }
    ],
    variants: [
      { id: "v-m-lo-1-nvy-s", sku: "999-MC-LO-001-NVY-S", color: { name: "Navy Blue", hex: "#1D2A44" }, size: "S", stock: 12, enabled: true },
      { id: "v-m-lo-1-nvy-m", sku: "999-MC-LO-001-NVY-M", color: { name: "Navy Blue", hex: "#1D2A44" }, size: "M", stock: 15, enabled: true },
      { id: "v-m-lo-1-nvy-l", sku: "999-MC-LO-001-NVY-L", color: { name: "Navy Blue", hex: "#1D2A44" }, size: "L", stock: 18, enabled: true },
      { id: "v-m-lo-1-nvy-xl", sku: "999-MC-LO-001-NVY-XL", color: { name: "Navy Blue", hex: "#1D2A44" }, size: "XL", stock: 8, enabled: true }
    ],
    tags: ["activewear", "sports", "trackpant", "navy"]
  },
  {
    id: "prod-m-lower-2",
    slug: "charcoal-grey-slim-jogger",
    name: "Charcoal Grey Slim Jogger",
    shortName: "Charcoal Joggers",
    productCode: "MC-LO-002",
    sku: "999-MC-LO-002",
    gender: "men",
    categoryId: "lowers",
    subcategory: "Joggers",
    collectionIds: ["daily-essentials", "weekend-casuals"],
    description: "Relaxed comfort redefined. Knitted from ultra-soft loopback cotton French terry, these slim-fit joggers feature an elasticated waistband and snug ankle cuffs.",
    shortDescription: "Loopback cotton French terry slim-fit joggers.",
    fabric: "Cotton French Terry",
    pattern: "Solid",
    fit: "Slim Fit",
    washCare: "Machine wash warm inside out. Iron medium.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: true,
    rating: 4.6,
    reviewCount: 29,
    media: [
      { id: "m-charcoal-m1", type: "image", viewType: "front", url: "/products/men/charcoal-grey-slim-jogger/front.webp", alt: "Charcoal Grey Slim Jogger Front View", sortOrder: 1 },
      { id: "m-charcoal-m2", type: "image", viewType: "back", url: "/products/men/charcoal-grey-slim-jogger/back.webp", alt: "Charcoal Grey Slim Jogger Back View", sortOrder: 2 },
      { id: "m-charcoal-m3", type: "image", viewType: "detail", url: "/products/men/charcoal-grey-slim-jogger/detail.webp", alt: "Charcoal Grey Slim Jogger Fabric Close-up", sortOrder: 3 },
      { id: "m-charcoal-v1", type: "video", viewType: "video", url: "/products/men/charcoal-grey-slim-jogger/product-preview.mp4", posterUrl: "/products/men/charcoal-grey-slim-jogger/video-poster.webp", alt: "Charcoal Grey Slim Jogger Showcase Video", sortOrder: 4 }
    ],
    variants: [
      { id: "v-m-lo-2-gry-m", sku: "999-MC-LO-002-GRY-M", color: { name: "Charcoal Grey", hex: "#36454F" }, size: "M", stock: 20, enabled: true },
      { id: "v-m-lo-2-gry-l", sku: "999-MC-LO-002-GRY-L", color: { name: "Charcoal Grey", hex: "#36454F" }, size: "L", stock: 16, enabled: true },
      { id: "v-m-lo-2-gry-xl", sku: "999-MC-LO-002-GRY-XL", color: { name: "Charcoal Grey", hex: "#36454F" }, size: "XL", stock: 10, enabled: true }
    ],
    tags: ["joggers", "cotton", "charcoal", "lounge"]
  },
  {
    id: "prod-m-lower-3",
    slug: "black-flex-running-track-pant",
    name: "Black Flex Running Track Pant",
    shortName: "Black Running Pants",
    productCode: "MC-LO-003",
    sku: "999-MC-LO-003",
    gender: "men",
    categoryId: "lowers",
    subcategory: "Track Pants",
    collectionIds: ["daily-essentials"],
    description: "Designed for cold mornings and high-intensity running. Lightweight poly-lycra fabric stretches 4-ways, offering zero restriction and wind-resistant insulation.",
    shortDescription: "4-way stretch wind-resistant active running track pants.",
    fabric: "Poly-Lycra Blend",
    pattern: "Solid",
    fit: "Regular Fit",
    washCare: "Hand wash or gentle cycle. Dry in shade.",
    comboEligible: true,
    featured: true,
    trending: false,
    newArrival: true,
    rating: 4.5,
    reviewCount: 22,
    media: [
      { id: "m-black-fl-m1", type: "image", viewType: "front", url: "/products/men/black-flex-running-track-pant/front.webp", alt: "Black Flex Running Track Pant Front View", sortOrder: 1 },
      { id: "m-black-fl-m2", type: "image", viewType: "back", url: "/products/men/black-flex-running-track-pant/back.webp", alt: "Black Flex Running Track Pant Back View", sortOrder: 2 },
      { id: "m-black-fl-m3", type: "image", viewType: "detail", url: "/products/men/black-flex-running-track-pant/detail.webp", alt: "Black Flex Running Track Pant Fabric Close-up", sortOrder: 3 },
      { id: "m-black-fl-v1", type: "video", viewType: "video", url: "/products/men/black-flex-running-track-pant/product-preview.mp4", posterUrl: "/products/men/black-flex-running-track-pant/video-poster.webp", alt: "Black Flex Running Track Pant Showcase Video", sortOrder: 4 }
    ],
    variants: [
      { id: "v-m-lo-3-blk-s", sku: "999-MC-LO-003-BLK-S", color: { name: "Midnight Black", hex: "#111111" }, size: "S", stock: 8, enabled: true },
      { id: "v-m-lo-3-blk-m", sku: "999-MC-LO-003-BLK-M", color: { name: "Midnight Black", hex: "#111111" }, size: "M", stock: 12, enabled: true },
      { id: "v-m-lo-3-blk-l", sku: "999-MC-LO-003-BLK-L", color: { name: "Midnight Black", hex: "#111111" }, size: "L", stock: 14, enabled: true }
    ],
    tags: ["activewear", "running", "black", "stretch"]
  },
  {
    id: "prod-m-lower-4",
    slug: "olive-utility-gym-lower",
    name: "Olive Utility Gym Lower",
    shortName: "Olive Gym Lower",
    productCode: "MC-LO-004",
    sku: "999-MC-LO-004",
    gender: "men",
    categoryId: "lowers",
    subcategory: "Gym Lowers",
    collectionIds: ["college-styles"],
    description: "Built for heavy lifting sessions. Ribbed gusset crotch allows deep squat flexibility, while knee panel stitching resists wear. Drawcord lets you adjust fit.",
    shortDescription: "Reinforced panels heavy-duty cotton sports lower.",
    fabric: "Cotton Polyester Blend",
    pattern: "Solid",
    fit: "Slim Fit",
    washCare: "Machine wash cold. Warm iron on reverse.",
    comboEligible: true,
    featured: false,
    trending: true,
    newArrival: false,
    rating: 4.3,
    reviewCount: 15,
    media: [
      { id: "m-olive-ut-m1", type: "image", viewType: "front", url: "/products/men/olive-utility-gym-lower/front.webp", alt: "Olive Utility Gym Lower Front View", sortOrder: 1 },
      { id: "m-olive-ut-m2", type: "image", viewType: "back", url: "/products/men/olive-utility-gym-lower/back.webp", alt: "Olive Utility Gym Lower Back View", sortOrder: 2 },
      { id: "m-olive-ut-m3", type: "image", viewType: "detail", url: "/products/men/olive-utility-gym-lower/detail.webp", alt: "Olive Utility Gym Lower Fabric Close-up", sortOrder: 3 },
      { id: "m-olive-ut-v1", type: "video", viewType: "video", url: "/products/men/olive-utility-gym-lower/product-preview.mp4", posterUrl: "/products/men/olive-utility-gym-lower/video-poster.webp", alt: "Olive Utility Gym Lower Showcase Video", sortOrder: 4 }
    ],
    variants: [
      { id: "v-m-lo-4-olv-m", sku: "999-MC-LO-004-OLV-M", color: { name: "Olive Drab", hex: "#6B8E23" }, size: "M", stock: 15, enabled: true },
      { id: "v-m-lo-4-olv-l", sku: "999-MC-LO-004-OLV-L", color: { name: "Olive Drab", hex: "#6B8E23" }, size: "L", stock: 15, enabled: true },
      { id: "v-m-lo-4-olv-xl", sku: "999-MC-LO-004-OLV-XL", color: { name: "Olive Drab", hex: "#6B8E23" }, size: "XL", stock: 15, enabled: true }
    ],
    tags: ["activewear", "gym", "olive", "squatproof"]
  }
];
