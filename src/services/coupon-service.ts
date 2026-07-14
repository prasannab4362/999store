import { AppliedCoupon } from "@/types/cart";

const LATENCY = 200;

const delay = <T>(value: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
};

export class MockCouponService {
  async validateCoupon(code: string): Promise<AppliedCoupon | null> {
    const formattedCode = code.trim().toUpperCase();

    if (formattedCode === "WELCOME50") {
      return delay({ code: "WELCOME50", discountAmountMinor: 5000 });
    }

    if (formattedCode === "COMBO99") {
      return delay({ code: "COMBO99", discountAmountMinor: 9900 });
    }

    return delay(null);
  }
}

export const couponService = new MockCouponService();
export default couponService;
