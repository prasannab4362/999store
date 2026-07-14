import { getPlaceholderSvg } from "@/lib/utils/placeholders";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  gender: "men" | "women" | "unisex";
  image: string;
}

export const categories: Category[] = [
  // Men's categories
  {
    id: "shirts",
    slug: "shirts",
    name: "Shirts",
    description: "Premium casual, formal, printed, and oversized shirts.",
    gender: "men",
    image: getPlaceholderSvg("Men's Shirts Category", 400, 500, "6D28D9", "ffffff"),
  },
  {
    id: "t-shirts",
    slug: "t-shirts",
    name: "T-Shirts",
    description: "Graphic tees, plain cottons, Henleys, and collared polos.",
    gender: "men",
    image: getPlaceholderSvg("Men's T-Shirts Category", 400, 500, "1D2A44", "ffffff"),
  },
  {
    id: "pants",
    slug: "pants",
    name: "Pants",
    description: "Tailored chinos, utility cargos, and crisp formal trousers.",
    gender: "men",
    image: getPlaceholderSvg("Men's Pants Category", 400, 500, "C2B280", "ffffff"),
  },
  {
    id: "lowers",
    slug: "lowers",
    name: "Lowers",
    description: "Flex running tracks, slim-fit joggers, and sports lowers.",
    gender: "men",
    image: getPlaceholderSvg("Men's Lowers Category", 400, 500, "36454F", "ffffff"),
  },
  {
    id: "shorts",
    slug: "shorts",
    name: "Shorts",
    description: "Drawstring twill cotton, denim, and dry-fit sports shorts.",
    gender: "men",
    image: getPlaceholderSvg("Men's Shorts Category", 400, 500, "708090", "ffffff"),
  },
  {
    id: "vesti-sets",
    slug: "vesti-sets",
    name: "Vesti & Shirt Sets",
    description: "Traditional gold and silver borders, wedding and festival sets.",
    gender: "men",
    image: getPlaceholderSvg("Men's Vesti Sets Category", 400, 500, "FFFDD0", "111111"),
  },
  // Women's categories
  {
    id: "tops",
    slug: "tops",
    name: "Tops",
    description: "Breathable rayon printed tops, summer crop tops, and long tops.",
    gender: "women",
    image: getPlaceholderSvg("Women's Tops Category", 400, 500, "B76E79", "ffffff"),
  },
  {
    id: "leggings",
    slug: "leggings",
    name: "Leggings",
    description: "Super-stretch ankle and full-length churidar cotton lycra leggings.",
    gender: "women",
    image: getPlaceholderSvg("Women's Leggings Category", 400, 500, "800020", "ffffff"),
  },
  {
    id: "jeans",
    slug: "jeans",
    name: "Jeans",
    description: "Retro wide legs, shape-retaining skinny fits, and vintage mom fits.",
    gender: "women",
    image: getPlaceholderSvg("Women's Jeans Category", 400, 500, "2E5894", "ffffff"),
  },
  {
    id: "palazzo",
    slug: "palazzo",
    name: "Palazzo",
    description: "Flowy printed rayons, solid summer cottons, and zari party wears.",
    gender: "women",
    image: getPlaceholderSvg("Women's Palazzo Category", 400, 500, "1F305E", "ffffff"),
  },
  {
    id: "straight-pants",
    slug: "straight-pants",
    name: "Straight Pants",
    description: "Flat-front office slacks, basic cotton straight-cuts, and stretch rosewoods.",
    gender: "women",
    image: getPlaceholderSvg("Women's Straight Pants Category", 400, 500, "111111", "ffffff"),
  },
  {
    id: "lehenga",
    slug: "lehenga",
    name: "Lehenga",
    description: "Embroidered georgettes, floral printed silks, and bandhani rayons.",
    gender: "women",
    image: getPlaceholderSvg("Women's Lehenga Category", 400, 500, "FFD700", "111111"),
  },
  {
    id: "cotton-sets",
    slug: "cotton-sets",
    name: "Cotton Sets",
    description: "Daily floral sets, block printed office edits, and gota festive kurtas.",
    gender: "women",
    image: getPlaceholderSvg("Women's Cotton Sets Category", 400, 500, "FFFFF0", "111111"),
  },
  {
    id: "chudidar",
    slug: "chudidar",
    name: "3 Piece Chudidar",
    description: "Classic floral cottons, rich Banarasi silks, and soft daily rayons.",
    gender: "women",
    image: getPlaceholderSvg("Women's Chudidar Category", 400, 500, "CD5C5C", "ffffff"),
  },
];
