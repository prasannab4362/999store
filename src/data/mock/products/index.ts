import { Product } from "@/types/product";
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

export const products: Product[] = [
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
export type { Product };
