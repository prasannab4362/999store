import { Order } from "@/types/order";

const LATENCY = 300;

const delay = <T>(value: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
};

export class MockOrderService {
  async getOrder(orderId: string, phone: string): Promise<Order | null> {
    if (typeof window === "undefined") return delay(null);
    const orders = JSON.parse(localStorage.getItem("999-store-orders") || "[]");
    const found = orders.find((o: any) => o.id === orderId && o.customer.phone === phone);
    return delay(found || null);
  }

  async getCustomerOrders(): Promise<Order[]> {
    if (typeof window === "undefined") return delay([]);
    const orders = JSON.parse(localStorage.getItem("999-store-orders") || "[]");
    return delay(orders);
  }

  async placeOrder(order: Omit<Order, "id">): Promise<Order> {
    const orderId = `999-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullOrder: Order = {
      ...order,
      id: orderId,
      orderNumber: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      const orders = JSON.parse(localStorage.getItem("999-store-orders") || "[]");
      localStorage.setItem("999-store-orders", JSON.stringify([fullOrder, ...orders]));
    }

    return delay(fullOrder);
  }
}

export const orderService = new MockOrderService();
export default orderService;
