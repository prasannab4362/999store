import { NextRequest, NextResponse } from "next/server";
import { StoreBackendDB } from "@/lib/db/store-db";

export async function GET() {
  try {
    const products = StoreBackendDB.getProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products inventory." },
      { status: 500 }
    );
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
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create new product in database." },
      { status: 500 }
    );
  }
}
