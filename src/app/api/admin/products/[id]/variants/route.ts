import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";

// POST /api/admin/products/[id]/variants — add a new variant
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  try {
    const body = await request.json();
    const { colorName, colorHex, size, stock } = body;

    if (!colorName || !colorHex || !size) {
      return NextResponse.json(
        { success: false, error: "colorName, colorHex and size are required." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
    }

    const sku = `${product.productCode}-${colorName.slice(0, 3).toUpperCase()}-${size}-${Date.now()}`;

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        sku,
        colorName,
        colorHex,
        size,
        stock: stock ?? 50,
        enabled: true,
      },
    });

    return NextResponse.json({ success: true, variant });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to add variant." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id]/variants?variantId=xxx
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params; // required to await even if not used
  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get("variantId");
  if (!variantId) {
    return NextResponse.json({ success: false, error: "variantId is required." }, { status: 400 });
  }
  try {
    await prisma.productVariant.delete({ where: { id: variantId } });
    return NextResponse.json({ success: true, message: "Variant removed." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete variant." },
      { status: 500 }
    );
  }
}
