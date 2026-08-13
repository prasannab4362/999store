export type OrderFulfillmentStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatusType = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface AdminOrderItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  colorName: string;
  colorHex: string;
  size: string;
  image: string;
}

export interface AdminOrderComboGroup {
  id: string;
  comboId: string;
  comboName: string;
  itemLimit: number;
  basePriceMinor: number;
  items: AdminOrderItem[];
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: "COD" | "RAZORPAY" | "UPI";
  paymentStatus: PaymentStatusType;
  orderStatus: OrderFulfillmentStatus;
  subtotalMinor: number;
  deliveryFeeMinor: number;
  discountMinor: number;
  totalMinor: number;
  comboGroups: AdminOrderComboGroup[];
  createdAt: string;
  trackingNumber?: string;
  notes?: string;
}

export interface AdminStats {
  totalRevenueMinor: number;
  totalCombosSold: number;
  pendingOrdersCount: number;
  shippedOrdersCount: number;
  deliveredOrdersCount: number;
  lowStockItemsCount: number;
  popularTierName: string;
}
