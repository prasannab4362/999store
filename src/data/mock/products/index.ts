import { Product, ComboTierId } from "@/types/product";
import { menShirts } from "./men-shirts";
import { menTshirts } from "./men-tshirts";
import { menPants } from "./men-pants";
import { menLowers } from "./men-lowers";
import { menShorts } from "./men-shorts";
import { menVesti } from "./men-vesti";
import { womenTops } from "./women-tops";
import { womenLeggings } from "./women-leggings";
import { womenJeans } from "./women-jeans";
import { womenPalazzo } from "./women-palazzo";
import { womenStraightPants } from "./women-straight-pants";
import { womenLehenga } from "./women-lehenga";
import { womenCottonSets } from "./women-cotton-sets";
import { womenChudidar } from "./women-chudidar";

// Base un-enriched items
const rawProducts: Product[] = [
  ...menShirts,
  ...menTshirts,
  ...menPants,
  ...menLowers,
  ...menShorts,
  ...menVesti,
  ...womenTops,
  ...womenLeggings,
  ...womenJeans,
  ...womenPalazzo,
  ...womenStraightPants,
  ...womenLehenga,
  ...womenCottonSets,
  ...womenChudidar,
];

// Fictional brand distribution list
const demoBrands = [
  { id: "b1", name: "Urban Thread" },
  { id: "b2", name: "North Nine" },
  { id: "b3", name: "Everyday Co." },
  { id: "b4", name: "Nexa Wear" },
  { id: "b5", name: "Threadline" },
  { id: "b6", name: "Studio Nine" },
  { id: "b7", name: "Core 999" },
];

// Deterministically enrich raw products with brand values and 5-tier eligibility assignments
export const products: Product[] = rawProducts.map((p, idx) => {
  // 1. Assign brand
  const brand = demoBrands[idx % demoBrands.length];

  // 2. Assign multiple combo tiers to ensure each has a strong assortment
  // We want to test that some items are in combo-2, some in combo-3, some in 5, etc.
  const comboTierIds: ComboTierId[] = [];
  
  // Distribute based on index
  if (idx % 2 === 0) {
    comboTierIds.push("combo-2");
  }
  if (idx % 3 === 0 || idx % 5 === 0) {
    comboTierIds.push("combo-3");
  }
  if (idx % 2 !== 0 || idx % 4 === 0) {
    comboTierIds.push("combo-5");
  }
  if (idx % 3 !== 0 || idx % 7 === 0) {
    comboTierIds.push("combo-8");
  }
  if (idx % 5 !== 0 || idx % 6 === 0) {
    comboTierIds.push("combo-10");
  }

  // Ensure every product is in at least one tier
  if (comboTierIds.length === 0) {
    comboTierIds.push("combo-3", "combo-5");
  }

  return {
    ...p,
    brandId: brand.id,
    brandName: brand.name,
    comboTierIds,
  };
});

// Pre-computed slices — avoids full-array iteration at render time
export const featuredProducts: Product[] = products.filter((p) => p.featured).slice(0, 4);

export type { Product };
