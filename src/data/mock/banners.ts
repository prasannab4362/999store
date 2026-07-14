import { getPlaceholderSvg } from "@/lib/utils/placeholders";

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
}

export const homeHeroBanner: Banner = {
  id: "banner-home-hero",
  title: "BUILD YOUR OWN FASHION COMBO",
  subtitle: "Mix men's and women's fashion. Choose your combo size. Pick your styles, colours and sizes.",
  image: "/banners/home_hero_banner.png",
  ctaText: "START YOUR COMBO",
  ctaLink: "/combo",
  badge: "ANY COMBO TIER FOR ₹999",
};

export const menHeroBanner: Banner = {
  id: "banner-men-hero",
  title: "MEN'S COMBO COLLECTION",
  subtitle: "Upgrade your look with smart chinos, crisp formal shirts, relaxed joggers, and traditional vestis.",
  image: "/banners/men_fashion_hero.png",
  ctaText: "BUILD MEN'S COMBO",
  ctaLink: "/combo/5-items",
  badge: "MIX & MATCH",
};

export const womenHeroBanner: Banner = {
  id: "banner-women-hero",
  title: "WOMEN'S COMBO COLLECTION",
  subtitle: "Explore flowy palazzos, wide leg denim, cotton sets, festive lehengas, and crop tops.",
  image: "/banners/women_fashion_hero.png",
  ctaText: "BUILD WOMEN'S COMBO",
  ctaLink: "/combo/5-items",
  badge: "MIX & MATCH",
};
