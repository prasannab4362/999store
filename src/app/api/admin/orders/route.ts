import { NextRequest, NextResponse } from "next/server";
import { StoreBackendDB } from "@/lib/db/store-db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const orders = StoreBackendDB.getOrders(status, search);
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, trackingNumber } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: orderId and status." },
        { status: 400 }
      );
    }

    const result = StoreBackendDB.updateOrderStatus(orderId, status, trackingNumber);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: result.order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update order status." },
      { status: 500 }
    );
  }
}
