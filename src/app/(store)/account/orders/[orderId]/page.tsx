"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { Button } from "@/components/ui/button";
import { PolicyNotice } from "@/components/commerce/policy-notice";
import { ArrowLeft, Clock, MapPin, CreditCard, ShieldAlert, BadgeAlert } from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = React.useState<any | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const orders = JSON.parse(localStorage.getItem("999-store-orders") || "[]");
      const found = orders.find((o: any) => o.id === orderId);
      setOrder(found);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="text-center py-12 space-y-4 font-body">
        <p className="text-sm text-text-secondary">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-body">
      {/* Title & Back */}
      <div className="flex items-center justify-between border-b border-border-light pb-4">
        <div className="flex items-center gap-3">
          <Link href="/account/orders" className="p-2 -ml-2 text-text-secondary hover:text-brand-primary active:scale-95 transition-transform">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold font-heading text-text-primary uppercase tracking-tight">
              Order Details
            </h1>
            <p className="text-xs text-text-secondary">
              ID: {order.orderNumber} | Placed {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Damage claim CTA */}
        <Link href={`/account/returns/new?orderId=${order.id}`} passHref legacyBehavior>
          <Button size="sm" variant="outline" className="text-xs border-red-200 text-red-700 hover:bg-red-50 cursor-pointer flex items-center gap-1.5 font-semibold">
            <BadgeAlert className="h-4 w-4" />
            <span>File Damage Claim</span>
          </Button>
        </Link>
      </div>

      {/* Items list */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider">
          Purchased Styles
        </h3>
        <div className="divide-y divide-border-light border border-border-light rounded-promo bg-white overflow-hidden shadow-sm">
          {order.comboGroups.map((group: any, idx: number) => (
            <div key={idx} className="p-4 space-y-3">
              <p className="text-xs font-bold font-heading text-brand-primary uppercase">
                {group.comboName} (₹999.00 Base)
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.items.map((item: any, itemIdx: number) => (
                  <div key={itemIdx} className="flex gap-3 bg-bg-secondary/30 p-3 rounded-card border border-border-light/50">
                    <div className="relative h-14 w-10 rounded-sm overflow-hidden bg-bg-secondary border border-border-light shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.productName} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[10px]">999</div>
                      )}
                    </div>
                    <div className="text-xs space-y-0.5 min-w-0">
                      <h4 className="font-heading font-semibold text-text-primary truncate">{item.productName}</h4>
                      <p className="text-text-secondary text-[10px]">Size: {item.size} | Color: {item.colorName}</p>
                      <p className="text-[9px] text-text-muted font-mono">SKU: {item.sku}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address and Payment details */}
      <div className="grid gap-6 sm:grid-cols-2 text-xs text-text-secondary">
        <div className="bg-bg-secondary/40 p-5 rounded-promo border border-border-light space-y-3">
          <h4 className="font-heading font-bold text-text-primary uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brand-primary" />
            <span>Delivery Destination</span>
          </h4>
          <div className="space-y-0.5 font-body">
            <p className="font-semibold text-text-primary">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            {order.shippingAddress.landmark && <p>Landmark: {order.shippingAddress.landmark}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.district}</p>
            <p>{order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        <div className="bg-bg-secondary/40 p-5 rounded-promo border border-border-light space-y-3">
          <h4 className="font-heading font-bold text-text-primary uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-brand-primary" />
            <span>Payment Breakdown</span>
          </h4>
          <div className="space-y-1.5 font-body">
            <p>Method: <strong className="uppercase">{order.paymentMethod.replace("_", " ")}</strong></p>
            <p>Status: <strong className="capitalize">{order.paymentStatus.replace("_", " ")}</strong></p>
            <div className="border-t border-border-light pt-2 mt-2 space-y-1">
              <div className="flex justify-between">
                <span>Combo Subtotal:</span>
                <span>{formatCurrency(order.subtotalMinor)}</span>
              </div>
              {order.discountMinor > 0 && (
                <div className="flex justify-between text-brand-primary">
                  <span>Discount Applied:</span>
                  <span>-{formatCurrency(order.discountMinor)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Courier Charge:</span>
                <span>{formatCurrency(order.shippingMinor)}</span>
              </div>
              <div className="flex justify-between font-heading font-extrabold text-sm text-text-primary pt-2 border-t border-border-light">
                <span>Grand Total:</span>
                <span>{formatCurrency(order.grandTotalMinor)}</span>
              </div>
              {order.paymentMethod === "cod_advance" && (
                <div className="flex justify-between text-brand-primary font-bold">
                  <span>COD Advance Paid (20%):</span>
                  <span>{formatCurrency(order.advanceMinor)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Policies */}
      <PolicyNotice variant="alert" />
    </div>
  );
}
