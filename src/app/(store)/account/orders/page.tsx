"use client";

import * as React from "react";
import Link from "next/link";
import { formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { Button } from "@/components/ui/button";

export default function AccountOrdersPage() {
  const [orders, setOrders] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrders(JSON.parse(localStorage.getItem("999-store-orders") || "[]"));
    }
  }, []);

  return (
    <div className="space-y-6 font-body">
      <div className="space-y-1 border-b border-border-light pb-4">
        <h1 className="text-xl font-extrabold font-heading text-text-primary uppercase tracking-tight">
          MY ORDERS
        </h1>
        <p className="text-xs text-text-secondary">
          Track and review details of all your placed orders.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-border-light rounded-promo p-5 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-1.5 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-text-primary">
                    {order.orderNumber}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>Combo: <strong>{order.comboGroups[0].comboName}</strong> ({order.comboGroups[0].items.length} items)</p>
                <div className="flex items-center gap-2">
                  <span>Method: <strong className="uppercase">{order.paymentMethod.replace("_", " ")}</strong></span>
                  <span>|</span>
                  <span>Payment: <strong className="capitalize">{order.paymentStatus.replace("_", " ")}</strong></span>
                </div>
              </div>

              <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-border-light">
                <div className="text-right">
                  <span className="text-[10px] text-text-muted block">TOTAL AMOUNT</span>
                  <span className="font-heading font-extrabold text-sm text-brand-primary">
                    {formatCurrency(order.grandTotalMinor)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/track-order?orderId=${order.id}&phone=${order.customer.phone}`} passHref legacyBehavior>
                    <Button size="sm" variant="outline" className="h-8">Track</Button>
                  </Link>
                  <Link href={`/account/orders/${order.id}`} passHref legacyBehavior>
                    <Button size="sm" className="h-8">Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-promo border border-dashed border-border-medium p-12 text-center space-y-4 max-w-sm mx-auto">
          <div className="text-4xl">📦</div>
          <h3 className="font-heading font-bold text-base text-text-primary">No orders placed yet</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Ready to find your look? Pick a combo size and start adding styles to get began.
          </p>
          <Link href="/combo" passHref legacyBehavior>
            <Button className="w-full cursor-pointer">Build Your Combo</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
