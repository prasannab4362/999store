import { getPlaceholderSvg } from "@/lib/utils/placeholders";

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
}

export const collections: Collection[] = [
  {
    id: "daily-essentials",
    slug: "daily-essentials",
    name: "Daily Essentials",
    description: "Comfortable, durable fabrics built for your everyday routine.",
    image: getPlaceholderSvg("Daily Essentials Collection", 600, 400, "FFF9F4", "16131A"),
  },
  {
    id: "college-styles",
    slug: "college-styles",
    name: "College Styles",
    description: "Street-inspired oversized cuts, cargos, and bold graphic prints.",
    image: getPlaceholderSvg("College Styles Collection", 600, 400, "F4F0FF", "6D28D9"),
  },
  {
    id: "office-edit",
    slug: "office-edit",
    name: "Office Edit",
    description: "Crease-resistant formal shirts, slim trousers, and straight-cut pants.",
    image: getPlaceholderSvg("Office Edit Collection", 600, 400, "F5F5F7", "16131A"),
  },
  {
    id: "weekend-casuals",
    slug: "weekend-casuals",
    name: "Weekend Casuals",
    description: "Laid-back printed shirts, crop tops, denim shorts, and lounge joggers.",
    image: getPlaceholderSvg("Weekend Casuals Collection", 600, 400, "FFF9F4", "6D28D9"),
  },
  {
    id: "traditional-edit",
    slug: "traditional-edit",
    name: "Traditional Edit",
    description: "Festive dhotis, cotton-silk vesti sets, chudidars, and georgette lehengas.",
    image: getPlaceholderSvg("Traditional Edit Collection", 600, 400, "FFF9F4", "FF5A5F"),
  },
  {
    id: "cotton-comfort",
    slug: "cotton-comfort",
    name: "Cotton Comfort",
    description: "Pure, light, and airy cotton pieces made for maximum breathability.",
    image: getPlaceholderSvg("Cotton Comfort Collection", 600, 400, "FFF9F4", "6D28D9"),
  },
];
