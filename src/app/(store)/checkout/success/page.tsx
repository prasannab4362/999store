"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ShoppingBag, Eye, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { motion } from "framer-motion";
import Link from "next/link";

import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const order = React.useMemo(() => {
    if (!orderId || typeof window === "undefined") return null;
    const orders = JSON.parse(localStorage.getItem("999-store-orders") || "[]");
    return orders.find((o: any) => o.id === orderId);
  }, [orderId]);

  if (!order) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4 space-y-4 font-body">
        <h1 className="text-2xl font-extrabold font-heading text-text-primary">Order Not Found</h1>
        <p className="text-xs text-text-secondary">
          We couldn't retrieve the details for this order session.
        </p>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 font-body">
      {/* 1. Visual Success Animation Banner */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600"
        >
          <CheckCircle2 className="h-10 w-10" />
        </motion.div>
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold font-heading text-text-primary uppercase tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-xs text-text-secondary">
            Thank you for shopping with us. Your mock order details are saved.
          </p>
        </div>
      </div>

      {/* 2. Order Summary Card */}
      <div className="rounded-promo border border-border-light bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-light pb-4 gap-2">
          <div className="space-y-0.5">
            <span className="text-[10px] text-text-muted font-bold block">ORDER NUMBER</span>
            <span className="font-heading font-extrabold text-sm text-text-primary">{order.orderNumber}</span>
          </div>
          <div className="space-y-0.5 text-right sm:text-left">
            <span className="text-[10px] text-text-muted font-bold block">DATE</span>
            <span className="text-xs text-text-secondary">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Selected Combo groups list */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold font-heading uppercase text-text-primary tracking-wider">
            Items Purchased
          </h3>
          <div className="space-y-4 divide-y divide-border-light">
            {order.comboGroups.map((group: any, idx: number) => (
              <div key={idx} className="pt-4 first:pt-0 space-y-3">
                <p className="text-xs font-bold font-heading text-brand-primary uppercase">
                  {group.comboName} (₹999.00 Base)
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {group.items.map((item: any, itemIdx: number) => (
                    <div key={itemIdx} className="flex gap-2.5 items-center">
                      <div className="relative h-10 w-8 rounded-sm overflow-hidden bg-bg-secondary shrink-0 border border-border-light">
                        <img src={item.image} alt={item.productName} className="object-cover w-full h-full" />
                      </div>
                      <div className="text-[11px] min-w-0">
                        <h4 className="font-heading font-semibold text-text-primary truncate">{item.productName}</h4>
                        <p className="text-text-secondary text-[10px]">Sz: {item.size} | Color: {item.colorName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address and payment info */}
        <div className="grid gap-6 sm:grid-cols-2 border-t border-border-light pt-6 text-xs text-text-secondary">
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-text-primary uppercase tracking-wider text-[10px]">
              Delivery Address
            </h4>
            <div className="space-y-0.5 font-body">
              <p className="font-semibold text-text-primary">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-heading font-bold text-text-primary uppercase tracking-wider text-[10px]">
              Payment Details
            </h4>
            <div className="space-y-0.5 font-body">
              <p>Method: <strong className="uppercase">{order.paymentMethod.replace("_", " ")}</strong></p>
              <p>Status: <strong className="capitalize">{order.paymentStatus.replace("_", " ")}</strong></p>
              <div className="border-t border-border-light pt-2 mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(order.grandTotalMinor)}</span>
                </div>
                {order.paymentMethod === "cod_advance" ? (
                  <>
                    <div className="flex justify-between text-brand-primary font-semibold">
                      <span>Advance paid (20%):</span>
                      <span>{formatCurrency(order.advanceMinor)}</span>
                    </div>
                    <div className="flex justify-between text-text-primary font-bold">
                      <span>Balance on Delivery:</span>
                      <span>{formatCurrency(order.balanceDueMinor)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-brand-primary font-bold">
                    <span>Paid online:</span>
                    <span>{formatCurrency(order.grandTotalMinor)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Action Navigation CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={`/track-order?orderId=${order.id}&phone=${order.customer.phone}`} passHref legacyBehavior>
          <Button size="lg" className="flex-grow gap-2 cursor-pointer">
            <Truck className="h-4.5 w-4.5" />
            <span>Track Order</span>
          </Button>
        </Link>
        <Link href="/" passHref legacyBehavior>
          <Button size="lg" variant="outline" className="flex-grow gap-2 cursor-pointer">
            <span>Continue Shopping</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl text-center py-20 px-4 space-y-4 font-body text-xs text-text-secondary">Loading success details...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
