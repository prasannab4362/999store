import { AdminOrder, AdminStats, OrderFulfillmentStatus } from "@/types/admin";
import { products } from "@/data/mock/products";

// Initial mock orders database
let mockOrders: AdminOrder[] = [
  {
    id: "ord-1001",
    orderNumber: "999-ORD-88219",
    customerName: "Priya Sharma",
    customerEmail: "priya.sharma@example.com",
    customerPhone: "+91 98765 43210",
    shippingAddress: {
      street: "Flat 402, Lotus Towers, MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    orderStatus: "PENDING",
    subtotalMinor: 99900,
    deliveryFeeMinor: 0,
    discountMinor: 0,
    totalMinor: 99900,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    comboGroups: [
      {
        id: "cg-1",
        comboId: "combo-3",
        comboName: "3 Picks Combo",
        itemLimit: 3,
        basePriceMinor: 99900,
        items: [
          {
            id: "item-1",
            productId: "prod-1",
            productName: "Banarasi Silk Festive Chudidar Set",
            productCode: "WSS-001",
            colorName: "Mustard Gold",
            colorHex: "#D4AF37",
            size: "M",
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
          },
          {
            id: "item-2",
            productId: "prod-2",
            productName: "Comfort Solid Rayon Chudidar Set",
            productCode: "WSS-002",
            colorName: "Teal Green",
            colorHex: "#0D9488",
            size: "L",
            image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
          },
          {
            id: "item-3",
            productId: "prod-3",
            productName: "Emerald Check Cotton Casual Shirt",
            productCode: "MSC-001",
            colorName: "Emerald Green",
            colorHex: "#059669",
            size: "L",
            image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "ord-1002",
    orderNumber: "999-ORD-88220",
    customerName: "Rahul Verma",
    customerEmail: "rahul.v@example.com",
    customerPhone: "+91 91234 56789",
    shippingAddress: {
      street: "12/A Park View Apartments, T Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600017",
    },
    paymentMethod: "RAZORPAY",
    paymentStatus: "PAID",
    orderStatus: "SHIPPED",
    subtotalMinor: 99900,
    deliveryFeeMinor: 0,
    discountMinor: 0,
    totalMinor: 99900,
    trackingNumber: "IND9988220EX",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    comboGroups: [
      {
        id: "cg-2",
        comboId: "combo-5",
        comboName: "5 Picks Combo",
        itemLimit: 5,
        basePriceMinor: 99900,
        items: [
          {
            id: "item-4",
            productId: "prod-4",
            productName: "Classic Crisp White Formal Shirt",
            productCode: "MSF-001",
            colorName: "Crisp White",
            colorHex: "#FFFFFF",
            size: "XL",
            image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
          },
        ],
      },
    ],
  },
];

// Product Stock Store
let mockInventory = products.map((p) => ({
  ...p,
  totalStock: p.variants.reduce((acc, v) => acc + v.stock, 0),
}));

export class StoreBackendDB {
  static getStats(): AdminStats {
    const totalRevenueMinor = mockOrders
      .filter((o) => o.paymentStatus === "PAID" || o.orderStatus === "DELIVERED")
      .reduce((acc, o) => acc + o.totalMinor, 0);

    const totalCombosSold = mockOrders.reduce(
      (acc, o) => acc + o.comboGroups.length,
      0
    );

    return {
      totalRevenueMinor,
      totalCombosSold,
      pendingOrdersCount: mockOrders.filter((o) => o.orderStatus === "PENDING").length,
      shippedOrdersCount: mockOrders.filter((o) => o.orderStatus === "SHIPPED").length,
      deliveredOrdersCount: mockOrders.filter((o) => o.orderStatus === "DELIVERED").length,
      lowStockItemsCount: mockInventory.filter((p) => p.totalStock < 20).length,
      popularTierName: "3 Picks Combo (Flat ₹999)",
    };
  }

  static getOrders(filterStatus?: string, search?: string): AdminOrder[] {
    let result = [...mockOrders];

    if (filterStatus && filterStatus !== "ALL") {
      result = result.filter((o) => o.orderStatus === filterStatus);
    }

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(query) ||
          o.customerName.toLowerCase().includes(query) ||
          o.customerPhone.includes(query) ||
          o.shippingAddress.city.toLowerCase().includes(query)
      );
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  static updateOrderStatus(
    orderId: string,
    status: OrderFulfillmentStatus,
    trackingNumber?: string
  ): { success: boolean; order?: AdminOrder } {
    const orderIndex = mockOrders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);

    if (orderIndex === -1) {
      return { success: false };
    }

    mockOrders[orderIndex].orderStatus = status;
    if (trackingNumber) {
      mockOrders[orderIndex].trackingNumber = trackingNumber;
    }
    if (status === "DELIVERED") {
      mockOrders[orderIndex].paymentStatus = "PAID";
    }

    return { success: true, order: mockOrders[orderIndex] };
  }

  static getProducts() {
    return mockInventory;
  }

  static updateVariantStock(productId: string, variantId: string, newStock: number) {
    const pIndex = mockInventory.findIndex((p) => p.id === productId);
    if (pIndex !== -1) {
      const vIndex = mockInventory[pIndex].variants.findIndex((v) => v.id === variantId);
      if (vIndex !== -1) {
        mockInventory[pIndex].variants[vIndex].stock = newStock;
        mockInventory[pIndex].totalStock = mockInventory[pIndex].variants.reduce(
          (acc, v) => acc + v.stock,
          0
        );
      }
    }
  }

  static addProduct(productData: any) {
    const newId = `prod-${Date.now()}`;
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const code = `${productData.gender === "women" ? "WS" : "MS"}-${Math.floor(100 + Math.random() * 900)}`;

    const formattedProduct = {
      id: newId,
      slug,
      productCode: code,
      name: productData.name,
      shortName: productData.name.split(" ").slice(0, 3).join(" "),
      brandName: "999 Edit",
      category: "clothing",
      subcategory: productData.subcategory || "Shirts",
      gender: productData.gender || "men",
      fabric: productData.fabric || "100% Cotton",
      fit: productData.fit || "Regular Fit",
      pattern: "Solid",
      description: productData.description || "Premium fashion style eligible for 999 Combo package.",
      rating: 4.8,
      reviewCount: 1,
      pricing: {
        priceMinor: 0,
        flatRateRule: "INCLUDED_IN_999_COMBO",
      },
      media: [
        { id: `m-${Date.now()}-1`, url: productData.imageUrl, viewType: "front" as const, alt: productData.name },
      ],
      variants: (productData.variants || []).map((v: any, idx: number) => ({
        id: `var-${Date.now()}-${idx}`,
        sku: `${code}-${v.size}-${v.colorName.toUpperCase()}`,
        color: { name: v.colorName, hex: v.colorHex },
        size: v.size,
        stock: v.stock,
        enabled: true,
      })),
      combos: [
        { comboId: "combo-10", comboName: "10 Picks Combo", minItemsRequired: 10, flatRatePriceMinor: 99900 },
        { comboId: "combo-8", comboName: "8 Picks Combo", minItemsRequired: 8, flatRatePriceMinor: 99900 },
        { comboId: "combo-5", comboName: "5 Picks Combo", minItemsRequired: 5, flatRatePriceMinor: 99900 },
        { comboId: "combo-3", comboName: "3 Picks Combo", minItemsRequired: 3, flatRatePriceMinor: 99900 },
        { comboId: "combo-2", comboName: "2 Picks Combo", minItemsRequired: 2, flatRatePriceMinor: 99900 },
      ],
      tags: ["New Arrival", "Combo Item"],
      totalStock: (productData.variants || []).reduce((acc: number, v: any) => acc + (v.stock || 0), 0),
    };

    mockInventory.unshift(formattedProduct as any);
    products.unshift(formattedProduct as any);
    return formattedProduct;
  }

  static createOrder(newOrderData: Omit<AdminOrder, "id" | "orderNumber" | "createdAt">): AdminOrder {
    const id = `ord-${Date.now()}`;
    const orderNumber = `999-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: AdminOrder = {
      ...newOrderData,
      id,
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    mockOrders.unshift(newOrder);
    return newOrder;
  }

  static checkPincode(code: string) {
    const isDeliverable = /^[1-9][0-9]{5}$/.test(code);
    return {
      pincode: code,
      isDeliverable,
      codAvailable: isDeliverable,
      estimatedDays: isDeliverable ? (code.startsWith("5") || code.startsWith("6") ? 2 : 4) : 0,
      state: code.startsWith("5") ? "Karnataka" : code.startsWith("6") ? "Tamil Nadu" : "India",
    };
  }
}
