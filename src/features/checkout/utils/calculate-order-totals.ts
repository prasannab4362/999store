import { CartComboGroup, AppliedCoupon } from "@/types/cart";
import { PaymentMethod } from "@/types/order";
import { siteConfig } from "@/config/site";

export interface CalculateOrderTotalsInput {
  comboGroups: CartComboGroup[];
  coupon?: AppliedCoupon;
  shippingMinor: number;
  paymentMethod: PaymentMethod;
}

export interface OrderTotals {
  subtotalMinor: number;
  discountMinor: number;
  discountedSubtotalMinor: number;
  shippingMinor: number;
  grandTotalMinor: number;
  advanceMinor: number;
  balanceDueMinor: number;
}

export function calculateOrderTotals({
  comboGroups,
  coupon,
  shippingMinor,
  paymentMethod,
}: CalculateOrderTotalsInput): OrderTotals {
  // 1. Calculate merchandise subtotal
  const subtotalMinor = comboGroups.reduce((acc, group) => acc + group.basePriceMinor, 0);

  // 2. Calculate coupon discount
  let discountMinor = 0;
  if (coupon) {
    if (coupon.discountPercentage !== undefined) {
      discountMinor = Math.round((subtotalMinor * coupon.discountPercentage) / 100);
    } else if (coupon.discountAmountMinor !== undefined) {
      discountMinor = Math.min(coupon.discountAmountMinor, subtotalMinor);
    }
  }

  // 3. Discounted subtotal
  const discountedSubtotalMinor = subtotalMinor - discountMinor;

  // 4. Grand total (items + courier)
  const grandTotalMinor = discountedSubtotalMinor + shippingMinor;

  // 5. COD calculations
  let advanceMinor = 0;
  let balanceDueMinor = grandTotalMinor;

  if (paymentMethod === "cod_advance") {
    // 20% advance calculation on subtotal after discount
    advanceMinor = Math.round((discountedSubtotalMinor * siteConfig.cod.advancePercentage) / 100);
    balanceDueMinor = grandTotalMinor - advanceMinor;
  } else {
    // For online/UPI, the whole amount is paid upfront
    advanceMinor = grandTotalMinor;
    balanceDueMinor = 0;
  }

  return {
    subtotalMinor,
    discountMinor,
    discountedSubtotalMinor,
    shippingMinor,
    grandTotalMinor,
    advanceMinor,
    balanceDueMinor,
  };
}

export function formatCurrency(amountMinor: number): string {
  return new Intl.NumberFormat(siteConfig.locale, {
    style: "currency",
    currency: siteConfig.currency,
  }).format(amountMinor / 100);
}
