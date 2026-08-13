import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";

// ─── GET /api/admin/products/[id] ─────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch product." }, { status: 500 });
  }
}

// ─── PUT /api/admin/products/[id] ─────────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const {
      name,
      subcategory,
      gender,
      imageUrl,
      fabric,
      fit,
      pattern,
      description,
      comboTierIds,
      newArrival,
      trending,
    } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name, shortName: name.length > 30 ? name.slice(0, 30) : name }),
        ...(subcategory && { subcategory }),
        ...(gender && { gender }),
        ...(fabric && { fabric }),
        ...(fit && { fit }),
        ...(pattern && { pattern }),
        ...(description && { description }),
        ...(Array.isArray(comboTierIds) && { comboTierIds }),
        ...(typeof newArrival === "boolean" && { newArrival }),
        ...(typeof trending === "boolean" && { trending }),
        // Store imageUrl as first variant media — update product media via separate media field if needed
      },
      include: { variants: true },
    });

    // Update imageUrl in the product's metadata (stored as pattern for now, or we just return it)
    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update product." },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/admin/products/[id] ──────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Cascade delete is configured in schema (variants -> onDelete: Cascade)
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Product and all its variants deleted." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete product." },
      { status: 500 }
    );
  }
}
