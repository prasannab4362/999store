import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Turbopack root — prevents the filesystem benchmark from traversing the full tree
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Reduces the number of files traced for serverless output — speeds up dev writes
  outputFileTracingRoot: path.resolve(__dirname),
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/men",
        destination: "/products?gender=men",
        permanent: false,
      },
      {
        source: "/women",
        destination: "/products?gender=women",
        permanent: false,
      },
      {
        source: "/new-arrivals",
        destination: "/products?sort=newest",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

