/**
 * Product Media Manifest
 *
 * Single source of truth for all local product media asset paths.
 * Priority products (16) have: front, back, detail, video-poster.
 * Standard products (32) have: front, back.
 *
 * Fallback order (used in ProductCard & gallery):
 *   LOCAL_ASSET → CATEGORY_SVG_PLACEHOLDER → GENERIC_999_FALLBACK
 */

export interface ProductMediaEntry {
  slug: string;
  front: string;
  back: string;
  detail?: string;
  videoPoster?: string;
}

const BASE = "/products";

function asset(gender: "men" | "women", slug: string, view: string): string {
  return `${BASE}/${gender}/${slug}/${view}.webp`;
}

// ============================================================
// MEN'S PRODUCTS — 24 products
// ============================================================

const menProducts: ProductMediaEntry[] = [
  // SHIRTS
  {
    slug: "emerald-check-casual-shirt",
    front: asset("men", "emerald-check-casual-shirt", "front"),
    back: asset("men", "emerald-check-casual-shirt", "back"),
    detail: asset("men", "emerald-check-casual-shirt", "detail"),
    videoPoster: asset("men", "emerald-check-casual-shirt", "video-poster"),
  },
  {
    slug: "classic-crisp-white-formal-shirt",
    front: asset("men", "classic-crisp-white-formal-shirt", "front"),
    back: asset("men", "classic-crisp-white-formal-shirt", "back"),
  },
  {
    slug: "midnight-linen-printed-casual-shirt",
    front: asset("men", "midnight-linen-printed-casual-shirt", "front"),
    back: asset("men", "midnight-linen-printed-casual-shirt", "back"),
  },
  {
    slug: "sandstone-oversized-cotton-shirt",
    front: asset("men", "sandstone-oversized-cotton-shirt", "front"),
    back: asset("men", "sandstone-oversized-cotton-shirt", "back"),
    detail: asset("men", "sandstone-oversized-cotton-shirt", "detail"),
    videoPoster: asset("men", "sandstone-oversized-cotton-shirt", "video-poster"),
  },
  // T-SHIRTS
  {
    slug: "midnight-black-oversized-graphic-tee",
    front: asset("men", "midnight-black-oversized-graphic-tee", "front"),
    back: asset("men", "midnight-black-oversized-graphic-tee", "back"),
    detail: asset("men", "midnight-black-oversized-graphic-tee", "detail"),
    videoPoster: asset("men", "midnight-black-oversized-graphic-tee", "video-poster"),
  },
  {
    slug: "classic-olive-green-polo-tshirt",
    front: asset("men", "classic-olive-green-polo-tshirt", "front"),
    back: asset("men", "classic-olive-green-polo-tshirt", "back"),
  },
  {
    slug: "crimson-red-henley-neck-tee",
    front: asset("men", "crimson-red-henley-neck-tee", "front"),
    back: asset("men", "crimson-red-henley-neck-tee", "back"),
  },
  {
    slug: "athletic-heather-grey-sports-tee",
    front: asset("men", "athletic-heather-grey-sports-tee", "front"),
    back: asset("men", "athletic-heather-grey-sports-tee", "back"),
  },
  // PANTS
  {
    slug: "sandstone-stretch-chino-pant",
    front: asset("men", "sandstone-stretch-chino-pant", "front"),
    back: asset("men", "sandstone-stretch-chino-pant", "back"),
  },
  {
    slug: "classic-slate-grey-formal-pant",
    front: asset("men", "classic-slate-grey-formal-pant", "front"),
    back: asset("men", "classic-slate-grey-formal-pant", "back"),
  },
  {
    slug: "midnight-blue-cargo-denim-pant",
    front: asset("men", "midnight-blue-cargo-denim-pant", "front"),
    back: asset("men", "midnight-blue-cargo-denim-pant", "back"),
    detail: asset("men", "midnight-blue-cargo-denim-pant", "detail"),
    videoPoster: asset("men", "midnight-blue-cargo-denim-pant", "video-poster"),
  },
  {
    slug: "twill-cotton-khaki-casual-pant",
    front: asset("men", "twill-cotton-khaki-casual-pant", "front"),
    back: asset("men", "twill-cotton-khaki-casual-pant", "back"),
  },
  // LOWERS
  {
    slug: "navy-active-track-lower",
    front: asset("men", "navy-active-track-lower", "front"),
    back: asset("men", "navy-active-track-lower", "back"),
  },
  {
    slug: "charcoal-grey-slim-jogger",
    front: asset("men", "charcoal-grey-slim-jogger", "front"),
    back: asset("men", "charcoal-grey-slim-jogger", "back"),
  },
  {
    slug: "black-flex-running-track-pant",
    front: asset("men", "black-flex-running-track-pant", "front"),
    back: asset("men", "black-flex-running-track-pant", "back"),
  },
  {
    slug: "olive-utility-gym-lower",
    front: asset("men", "olive-utility-gym-lower", "front"),
    back: asset("men", "olive-utility-gym-lower", "back"),
  },
  // SHORTS
  {
    slug: "slate-cotton-casual-shorts",
    front: asset("men", "slate-cotton-casual-shorts", "front"),
    back: asset("men", "slate-cotton-casual-shorts", "back"),
  },
  {
    slug: "active-dry-fit-sports-shorts",
    front: asset("men", "active-dry-fit-sports-shorts", "front"),
    back: asset("men", "active-dry-fit-sports-shorts", "back"),
  },
  {
    slug: "indigo-denim-frayed-shorts",
    front: asset("men", "indigo-denim-frayed-shorts", "front"),
    back: asset("men", "indigo-denim-frayed-shorts", "back"),
  },
  {
    slug: "camo-printed-cargo-shorts",
    front: asset("men", "camo-printed-cargo-shorts", "front"),
    back: asset("men", "camo-printed-cargo-shorts", "back"),
  },
  // VESTI SETS
  {
    slug: "traditional-gold-border-vesti-shirt-set",
    front: asset("men", "traditional-gold-border-vesti-shirt-set", "front"),
    back: asset("men", "traditional-gold-border-vesti-shirt-set", "back"),
    detail: asset("men", "traditional-gold-border-vesti-shirt-set", "detail"),
    videoPoster: asset("men", "traditional-gold-border-vesti-shirt-set", "video-poster"),
  },
  {
    slug: "classic-pure-cotton-wedding-vesti-set",
    front: asset("men", "classic-pure-cotton-wedding-vesti-set", "front"),
    back: asset("men", "classic-pure-cotton-wedding-vesti-set", "back"),
  },
  {
    slug: "premium-mayilkan-border-traditional-vesti-set",
    front: asset("men", "premium-mayilkan-border-traditional-vesti-set", "front"),
    back: asset("men", "premium-mayilkan-border-traditional-vesti-set", "back"),
  },
  {
    slug: "elegant-jari-border-festival-vesti-set",
    front: asset("men", "elegant-jari-border-festival-vesti-set", "front"),
    back: asset("men", "elegant-jari-border-festival-vesti-set", "back"),
  },
];

// ============================================================
// WOMEN'S PRODUCTS — 24 products
// ============================================================

const womenProducts: ProductMediaEntry[] = [
  // TOPS
  {
    slug: "rosewood-printed-rayon-top",
    front: asset("women", "rosewood-printed-rayon-top", "front"),
    back: asset("women", "rosewood-printed-rayon-top", "back"),
    detail: asset("women", "rosewood-printed-rayon-top", "detail"),
    videoPoster: asset("women", "rosewood-printed-rayon-top", "video-poster"),
  },
  {
    slug: "olive-linen-sleeveless-crop-top",
    front: asset("women", "olive-linen-sleeveless-crop-top", "front"),
    back: asset("women", "olive-linen-sleeveless-crop-top", "back"),
  },
  {
    slug: "ivory-schiffli-cotton-long-top",
    front: asset("women", "ivory-schiffli-cotton-long-top", "front"),
    back: asset("women", "ivory-schiffli-cotton-long-top", "back"),
  },
  // LEGGINGS
  {
    slug: "black-flex-ankle-length-leggings",
    front: asset("women", "black-flex-ankle-length-leggings", "front"),
    back: asset("women", "black-flex-ankle-length-leggings", "back"),
    detail: asset("women", "black-flex-ankle-length-leggings", "detail"),
    videoPoster: asset("women", "black-flex-ankle-length-leggings", "video-poster"),
  },
  {
    slug: "classic-maroon-cotton-lycra-leggings",
    front: asset("women", "classic-maroon-cotton-lycra-leggings", "front"),
    back: asset("women", "classic-maroon-cotton-lycra-leggings", "back"),
  },
  {
    slug: "desert-beige-full-length-leggings",
    front: asset("women", "desert-beige-full-length-leggings", "front"),
    back: asset("women", "desert-beige-full-length-leggings", "back"),
  },
  // JEANS
  {
    slug: "indigo-wide-leg-denim-jeans",
    front: asset("women", "indigo-wide-leg-denim-jeans", "front"),
    back: asset("women", "indigo-wide-leg-denim-jeans", "back"),
    detail: asset("women", "indigo-wide-leg-denim-jeans", "detail"),
    videoPoster: asset("women", "indigo-wide-leg-denim-jeans", "video-poster"),
  },
  {
    slug: "midnight-black-skinny-fit-jeans",
    front: asset("women", "midnight-black-skinny-fit-jeans", "front"),
    back: asset("women", "midnight-black-skinny-fit-jeans", "back"),
  },
  {
    slug: "retro-light-blue-mom-fit-jeans",
    front: asset("women", "retro-light-blue-mom-fit-jeans", "front"),
    back: asset("women", "retro-light-blue-mom-fit-jeans", "back"),
  },
  // LEHENGA
  {
    slug: "festival-golden-embroidered-georgette-lehenga",
    front: asset("women", "festival-golden-embroidered-georgette-lehenga", "front"),
    back: asset("women", "festival-golden-embroidered-georgette-lehenga", "back"),
    detail: asset("women", "festival-golden-embroidered-georgette-lehenga", "detail"),
    videoPoster: asset("women", "festival-golden-embroidered-georgette-lehenga", "video-poster"),
  },
  {
    slug: "wedding-silk-floral-printed-lehenga",
    front: asset("women", "wedding-silk-floral-printed-lehenga", "front"),
    back: asset("women", "wedding-silk-floral-printed-lehenga", "back"),
  },
  {
    slug: "vibrant-party-wear-rayon-lehenga-set",
    front: asset("women", "vibrant-party-wear-rayon-lehenga-set", "front"),
    back: asset("women", "vibrant-party-wear-rayon-lehenga-set", "back"),
  },
  // PALAZZO
  {
    slug: "indigo-floral-printed-rayon-palazzo",
    front: asset("women", "indigo-floral-printed-rayon-palazzo", "front"),
    back: asset("women", "indigo-floral-printed-rayon-palazzo", "back"),
    detail: asset("women", "indigo-floral-printed-rayon-palazzo", "detail"),
    videoPoster: asset("women", "indigo-floral-printed-rayon-palazzo", "video-poster"),
  },
  {
    slug: "premium-cream-cotton-wide-palazzo",
    front: asset("women", "premium-cream-cotton-wide-palazzo", "front"),
    back: asset("women", "premium-cream-cotton-wide-palazzo", "back"),
  },
  {
    slug: "vibrant-red-rayon-party-palazzo",
    front: asset("women", "vibrant-red-rayon-party-palazzo", "front"),
    back: asset("women", "vibrant-red-rayon-party-palazzo", "back"),
  },
  // STRAIGHT PANTS
  {
    slug: "office-classic-black-straight-pant",
    front: asset("women", "office-classic-black-straight-pant", "front"),
    back: asset("women", "office-classic-black-straight-pant", "back"),
    detail: asset("women", "office-classic-black-straight-pant", "detail"),
    videoPoster: asset("women", "office-classic-black-straight-pant", "video-poster"),
  },
  {
    slug: "desert-beige-cotton-straight-pant",
    front: asset("women", "desert-beige-cotton-straight-pant", "front"),
    back: asset("women", "desert-beige-cotton-straight-pant", "back"),
  },
  {
    slug: "rosewood-stretch-formal-straight-pant",
    front: asset("women", "rosewood-stretch-formal-straight-pant", "front"),
    back: asset("women", "rosewood-stretch-formal-straight-pant", "back"),
  },
  // CHUDIDAR / KURTA SETS
  {
    slug: "elegant-floral-cotton-chudidar-set",
    front: asset("women", "elegant-floral-cotton-chudidar-set", "front"),
    back: asset("women", "elegant-floral-cotton-chudidar-set", "back"),
    detail: asset("women", "elegant-floral-cotton-chudidar-set", "detail"),
    videoPoster: asset("women", "elegant-floral-cotton-chudidar-set", "video-poster"),
  },
  {
    slug: "banarasi-silk-festive-chudidar-set",
    front: asset("women", "banarasi-silk-festive-chudidar-set", "front"),
    back: asset("women", "banarasi-silk-festive-chudidar-set", "back"),
  },
  {
    slug: "comfort-solid-rayon-chudidar-set",
    front: asset("women", "comfort-solid-rayon-chudidar-set", "front"),
    back: asset("women", "comfort-solid-rayon-chudidar-set", "back"),
  },
  {
    slug: "ivory-daily-cotton-kurta-set",
    front: asset("women", "ivory-daily-cotton-kurta-set", "front"),
    back: asset("women", "ivory-daily-cotton-kurta-set", "back"),
  },
  {
    slug: "classic-blue-office-cotton-kurta-set",
    front: asset("women", "classic-blue-office-cotton-kurta-set", "front"),
    back: asset("women", "classic-blue-office-cotton-kurta-set", "back"),
  },
  {
    slug: "pastel-pink-festive-cotton-kurta-set",
    front: asset("women", "pastel-pink-festive-cotton-kurta-set", "front"),
    back: asset("women", "pastel-pink-festive-cotton-kurta-set", "back"),
  },
];

// ============================================================
// COMBINED MANIFEST & LOOKUP UTILITIES
// ============================================================

export const productMediaManifest: ProductMediaEntry[] = [
  ...menProducts,
  ...womenProducts,
];

const _manifest = new Map<string, ProductMediaEntry>(
  productMediaManifest.map((e) => [e.slug, e])
);

export function getProductMedia(slug: string): ProductMediaEntry | undefined {
  return _manifest.get(slug);
}

export function getProductFrontImage(slug: string): string | undefined {
  return _manifest.get(slug)?.front;
}

export function getProductBackImage(slug: string): string | undefined {
  return _manifest.get(slug)?.back;
}
