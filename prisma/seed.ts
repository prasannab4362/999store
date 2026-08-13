import { PrismaClient } from "@prisma/client";
import { products } from "../src/data/mock/products/index";
import { comboConfigs } from "../src/config/combo";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Supabase PostgreSQL Database Seed...");

  // 1. Seed Combo Tier Configs
  console.log("📦 Seeding ComboTierConfig table...");
  for (const config of comboConfigs) {
    await prisma.comboTierConfig.upsert({
      where: { id: config.id },
      update: {
        slug: config.slug,
        name: config.name,
        itemLimit: config.itemLimit,
        basePriceMinor: config.basePriceMinor,
      },
      create: {
        id: config.id,
        slug: config.slug,
        name: config.name,
        itemLimit: config.itemLimit,
        basePriceMinor: config.basePriceMinor,
        active: true,
      },
    });
  }
  console.log("✅ ComboTierConfig seeded!");

  // 2. Seed Products & Variants
  console.log("👗 Seeding Products and ProductVariants into Supabase...");
  for (const p of products) {
    const existingProduct = await prisma.product.findUnique({
      where: { id: p.id },
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          id: p.id,
          slug: p.slug,
          productCode: p.productCode,
          name: p.name,
          shortName: p.shortName,
          brandName: p.brandName || "999 Edit",
          category: "clothing",
          subcategory: p.subcategory || "Shirts",
          gender: p.gender || "men",
          fabric: p.fabric || "100% Cotton",
          fit: p.fit || "Regular Fit",
          pattern: p.pattern || "Solid",
          description: p.description || "Premium fashion style eligible for flat ₹999 combo package.",
          rating: p.rating || 4.5,
          reviewCount: p.reviewCount || 10,
          newArrival: Boolean(p.tags?.includes("New Arrival")),
          trending: Boolean(p.tags?.includes("Trending")),
          variants: {
            create: p.variants.map((v) => ({
              id: v.id,
              sku: v.sku,
              colorName: v.color.name,
              colorHex: v.color.hex,
              size: v.size,
              stock: v.stock || 50,
              enabled: v.enabled !== false,
            })),
          },
        },
      });
    }
  }
  console.log("✅ All 24 Products and ProductVariants populated in Supabase!");

  // 3. Seed Initial Sample Orders
  console.log("🛒 Seeding initial sample Order snapshots...");
  const existingOrder = await prisma.order.findFirst();
  if (!existingOrder) {
    const sampleProduct = products[0];
    const sampleVariant = sampleProduct.variants[0];

    await prisma.order.create({
      data: {
        id: "ord-1001",
        orderNumber: "999-ORD-88219",
        customerName: "Priya Sharma",
        customerEmail: "priya.sharma@example.com",
        customerPhone: "+91 98765 43210",
        deliveryAddress: "Flat 402, Lotus Towers, MG Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001",
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        subtotalMinor: 99900,
        deliveryFeeMinor: 0,
        discountMinor: 0,
        totalMinor: 99900,
        comboGroups: {
          create: [
            {
              id: "cg-1001",
              comboId: "combo-3",
              comboName: "3 Picks Combo",
              itemLimit: 3,
              basePriceMinor: 99900,
              items: {
                create: [
                  {
                    id: "item-1001",
                    productId: sampleProduct.id,
                    variantId: sampleVariant.id,
                    productName: sampleProduct.name,
                    productCode: sampleProduct.productCode,
                    colorName: sampleVariant.color.name,
                    colorHex: sampleVariant.color.hex,
                    size: sampleVariant.size,
                    image: sampleProduct.media[0]?.url || "",
                  },
                ],
              },
            },
          ],
        },
      },
    });
  }
  console.log("🎉 Database Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
