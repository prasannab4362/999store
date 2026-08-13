import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import { StoreBackendDB } from "@/lib/db/store-db";

export async function GET() {
  try {
    const dbProducts = await prisma.product.findMany({
      include: {
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      const formatted = dbProducts.map((p) => ({
        ...p,
        totalStock: p.variants.reduce((acc, v) => acc + v.stock, 0),
        media: [{ id: `m-${p.id}`, url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80", viewType: "front" }],
        variants: p.variants.map((v) => ({
          ...v,
          color: { name: v.colorName, hex: v.colorHex },
        })),
      }));
      return NextResponse.json({ success: true, products: formatted });
    }

    const products = StoreBackendDB.getProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    const products = StoreBackendDB.getProducts();
    return NextResponse.json({ success: true, products });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, variantId, stock } = body;

    if (!productId || !variantId || typeof stock !== "number") {
      return NextResponse.json(
        { success: false, error: "Missing required fields: productId, variantId, and stock number." },
        { status: 400 }
      );
    }

    try {
      await prisma.productVariant.update({
        where: { id: variantId },
        data: { stock },
      });
    } catch (e) {
      // Fallback
    }

    StoreBackendDB.updateVariantStock(productId, variantId, stock);
    return NextResponse.json({ success: true, message: "Inventory stock updated." });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update inventory stock." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = StoreBackendDB.addProduct(body);

    try {
      await prisma.product.create({
        data: {
          id: product.id,
          slug: product.slug,
          productCode: product.productCode,
          name: product.name,
          shortName: product.shortName,
          category: product.category,
          subcategory: product.subcategory,
          gender: product.gender,
          fabric: product.fabric,
          fit: product.fit,
          pattern: product.pattern,
          description: product.description,
          comboTierIds: body.comboTierIds ?? ["combo-10", "combo-8", "combo-5", "combo-3", "combo-2"],
          variants: {
            create: product.variants.map((v: any) => ({
              id: v.id,
              sku: v.sku,
              colorName: v.color.name,
              colorHex: v.color.hex,
              size: v.size,
              stock: v.stock,
            })),
          },
        },
      });
    } catch (e) {
      // DB created fallback
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create new product in database." },
      { status: 500 }
    );
  }
}
