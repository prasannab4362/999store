import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://999combostore.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/checkout",
        "/checkout/success",
        "/cart",
        "/account",
        "/account/*",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
