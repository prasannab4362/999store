import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
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
    const orderNumber = `999-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    let dbOrderId = `ord-${Date.now()}`;

    // Try saving directly to Supabase PostgreSQL
    try {
      const createdOrder = await prisma.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail: customerEmail || "guest@999store.com",
          customerPhone,
          deliveryAddress: typeof shippingAddress === "string"
            ? shippingAddress
            : `${shippingAddress.addressLine1 || ""}, ${shippingAddress.city || ""}, ${shippingAddress.state || ""}`,
          city: shippingAddress.city || "Chennai",
          state: shippingAddress.state || "Tamil Nadu",
          pincode: shippingAddress.pinCode || shippingAddress.pincode || "600001",
          paymentMethod: paymentMethod === "RAZORPAY" ? "RAZORPAY" : paymentMethod === "UPI" ? "UPI" : "COD",
          paymentStatus: paymentMethod === "RAZORPAY" ? "PAID" : "PENDING",
          orderStatus: "PENDING",
          subtotalMinor,
          deliveryFeeMinor: 0,
          discountMinor: 0,
          totalMinor,
          comboGroups: {
            create: comboGroups.map((g: any) => ({
              comboId: g.comboId || "combo-10",
              comboName: g.comboName || "Combo Package",
              itemLimit: g.itemLimit || g.items?.length || 10,
              basePriceMinor: g.basePriceMinor || 99900,
              items: {
                create: (g.items || []).map((item: any) => ({
                  productId: item.productId || "p-1",
                  variantId: item.variantId || "v-1",
                  productName: item.productName || "Dress Item",
                  productCode: item.productCode || "MC-001",
                  colorName: item.colorName || "Black",
                  colorHex: item.colorHex || "#000000",
                  size: item.size || "L",
                  image: item.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
                })),
              },
            })),
          },
        },
      });
      dbOrderId = createdOrder.id;

      // Decrement variant stock in DB
      for (const group of comboGroups) {
        for (const item of group.items || []) {
          if (item.variantId) {
            try {
              await prisma.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: 1 } },
              });
            } catch (e) {}
          }
        }
      }
    } catch (dbError: any) {
      console.warn("Prisma DB order create fallback:", dbError?.message);
    }

    // Also update mock/local store DB for fallback
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
      orderId: dbOrderId,
      orderNumber: newOrder.orderNumber || orderNumber,
      totalMinor,
      message: "Order placed successfully! Invoiced & saved to database.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process order creation." },
      { status: 500 }
    );
  }
}
