import { ProductSize } from "./product";

export type OrderStatus =
  | "confirmed"
  | "processing"
  | "quality_check"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "upi" | "online" | "cod_advance";

export type PaymentStatus =
  | "pending"
  | "advance_pending"
  | "advance_paid"
  | "paid"
  | "partially_paid"
  | "failed";

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderComboItemSnapshot {
  productId: string;
  productName: string;
  productCode: string;
  sku: string;
  colorName: string;
  size: ProductSize;
  image: string;
}

export interface OrderComboGroupSnapshot {
  comboId: string;
  comboName: string;
  itemLimit: number;
  basePriceMinor: number;
  items: OrderComboItemSnapshot[];
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  shippingAddress: Address;
  comboGroups: OrderComboGroupSnapshot[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistory[];
  subtotalMinor: number;
  discountMinor: number;
  shippingMinor: number;
  advanceMinor: number;
  balanceDueMinor: number;
  grandTotalMinor: number;
  createdAt: string;
  updatedAt: string;
}
