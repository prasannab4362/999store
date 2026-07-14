export interface ComboConfig {
  id: string;
  slug: string;
  name: string;
  itemLimit: number;
  basePriceMinor: number;
  description: string;
  badge: string;
  activeStatus: boolean;
  displayOrder: number;
  themeMetadata?: {
    colorClass: string;
    bgClass: string;
  };
}

export const comboConfigs: ComboConfig[] = [
  {
    id: "combo-2",
    slug: "2-items",
    name: "2 Items Combo",
    itemLimit: 2,
    basePriceMinor: 99900,
    description: "Perfect for a quick style upgrade. Pick any 2 items.",
    badge: "QUICK PICK",
    activeStatus: true,
    displayOrder: 1,
    themeMetadata: {
      colorClass: "text-emerald-700",
      bgClass: "bg-emerald-50",
    },
  },
  {
    id: "combo-3",
    slug: "3-items",
    name: "3 Items Combo",
    itemLimit: 3,
    basePriceMinor: 99900,
    description: "Create a basic mixed set. Pick any 3 items.",
    badge: "EVERYDAY MIX",
    activeStatus: true,
    displayOrder: 2,
    themeMetadata: {
      colorClass: "text-blue-700",
      bgClass: "bg-blue-50",
    },
  },
  {
    id: "combo-5",
    slug: "5-items",
    name: "5 Items Combo",
    itemLimit: 5,
    basePriceMinor: 99900,
    description: "Great value for a mini seasonal wardrobe refresh. Pick any 5 items.",
    badge: "STYLE EDIT",
    activeStatus: true,
    displayOrder: 3,
    themeMetadata: {
      colorClass: "text-indigo-700",
      bgClass: "bg-indigo-50",
    },
  },
  {
    id: "combo-8",
    slug: "8-items",
    name: "8 Items Combo",
    itemLimit: 8,
    basePriceMinor: 99900,
    description: "Stock up on combinations for yourself or your family. Pick any 8 items.",
    badge: "FAMILY MIX",
    activeStatus: true,
    displayOrder: 4,
    themeMetadata: {
      colorClass: "text-amber-700",
      bgClass: "bg-amber-50",
    },
  },
  {
    id: "combo-10",
    slug: "10-items",
    name: "10 Items Combo",
    itemLimit: 10,
    basePriceMinor: 99900,
    description: "The ultimate mix & match experience. Pick any 10 items.",
    badge: "MAX COMBO",
    activeStatus: true,
    displayOrder: 5,
    themeMetadata: {
      colorClass: "text-rose-700",
      bgClass: "bg-rose-50",
    },
  },
].sort((a, b) => a.displayOrder - b.displayOrder);
