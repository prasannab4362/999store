import { NextRequest, NextResponse } from "next/server";
import { StoreBackendDB } from "@/lib/db/store-db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, comboGroups } = body;

    if (!customerName || !customerPhone || !shippingAddress || !comboGroups || comboGroups.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required order details." },
        { status: 400 }
      );
    }

    // Calculate totals based on flat ₹999 rate per combo group
    const subtotalMinor = comboGroups.length * 99900;
    const totalMinor = subtotalMinor;

    const newOrder = StoreBackendDB.createOrder({
      customerName,
      customerEmail: customerEmail || "guest@999store.com",
      customerPhone,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "RAZORPAY" ? "PAID" : "PENDING",
      orderStatus: "PENDING",
      subtotalMinor,
      deliveryFeeMinor: 0,
      discountMinor: 0,
      totalMinor,
      comboGroups,
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      totalMinor: newOrder.totalMinor,
      message: "Order placed successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process order creation." },
      { status: 500 }
    );
  }
}
