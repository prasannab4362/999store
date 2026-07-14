import { MetadataRoute } from "next";
import { products } from "@/data/mock/products";
import { categories } from "@/data/mock/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://999combostore.com";

  // Static routes
  const staticRoutes = [
    "",
    "/products",
    "/combo",
    "/offers",
    "/wishlist",
    "/recently-viewed",
    "/track-order",
    "/about",
    "/contact",
    "/faq",
    "/policies/shipping",
    "/policies/cod",
    "/policies/damage-return",
    "/policies/privacy",
    "/policies/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic product routes
  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Dynamic category routes
  const categoryRoutes = categories.map((c) => ({
    url: `${baseUrl}/categories/${c.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
