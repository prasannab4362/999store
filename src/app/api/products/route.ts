import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";

// GET /api/products — public product catalog, optionally filtered by combo tier, gender, or category
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const comboTier = searchParams.get("comboTier"); // e.g. "combo-10"
  const gender = searchParams.get("gender"); // "men" | "women" | "unisex"
  const featured = searchParams.get("featured"); // "true"
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "100"), 200);

  try {
    const products = await prisma.product.findMany({
      include: { variants: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Apply filters in JS (Prisma doesn't support array contains filter on SQLite-style arrays well)
    let filtered = products;

    if (comboTier) {
      filtered = filtered.filter((p) => p.comboTierIds.includes(comboTier));
    }

    if (gender && gender !== "all") {
      filtered = filtered.filter((p) => p.gender === gender || p.gender === "unisex");
    }

    // Format to match frontend Product type shape
    const formatted = filtered.map((p) => ({
      id: p.id,
      slug: p.slug,
      productCode: p.productCode,
      name: p.name,
      shortName: p.shortName,
      brandName: p.brandName,
      category: p.category,
      categoryId: p.category,
      subcategory: p.subcategory,
      gender: p.gender,
      fabric: p.fabric,
      fit: p.fit,
      pattern: p.pattern,
      description: p.description,
      shortDescription: p.description.slice(0, 100),
      comboTierIds: p.comboTierIds,
      comboEligible: true,
      rating: p.rating,
      reviewCount: p.reviewCount,
      featured: p.trending || p.newArrival,
      trending: p.trending,
      newArrival: p.newArrival,
      tags: [p.subcategory, p.gender, p.pattern ?? ""].filter(Boolean),
      collectionIds: [],
      media: [
        {
          id: `m-${p.id}`,
          type: "image",
          viewType: "front",
          url: `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80`,
          alt: p.name,
          sortOrder: 0,
        },
      ],
      variants: p.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        color: { name: v.colorName, hex: v.colorHex },
        size: v.size,
        stock: v.stock,
        enabled: v.enabled,
      })),
    }));

    return NextResponse.json({ success: true, products: formatted, total: formatted.length });
  } catch (error: any) {
    console.error("[API /products] Error:", error?.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products.", products: [] },
      { status: 500 }
    );
  }
}
