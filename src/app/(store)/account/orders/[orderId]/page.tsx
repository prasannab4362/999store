"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { Button } from "@/components/ui/button";
import { PolicyNotice } from "@/components/commerce/policy-notice";
import { ArrowLeft, MapPin, CreditCard, BadgeAlert } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

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
      <div className="text-center py-16 space-y-4 font-body">
        <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <div className="h-4 w-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
          Loading order details...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-body">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E0D0] pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/account/orders"
            className="p-2.5 rounded-xl bg-[#F5F0E8] border border-[#E8E0D0] text-text-secondary hover:text-text-primary hover:border-[#D4AF37]/40 active:scale-95 transition-all shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] font-ui">Order</p>
              <span className="text-[10px] font-black text-text-muted font-ui">{order.orderNumber}</span>
            </div>
            <h1 className="text-xl font-black font-heading text-text-primary uppercase tracking-tight">
              Order Details
            </h1>
            <p className="text-xs text-text-secondary font-ui">
              Placed {new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        <Button size="sm" variant="outline" asChild className="h-10 px-4 rounded-full text-[10px] font-black border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 cursor-pointer flex items-center gap-2 uppercase tracking-widest self-start sm:self-auto shrink-0 shadow-xs">
          <Link href={`/account/returns/new?orderId=${order.id}`}>
            <BadgeAlert className="h-4 w-4 text-red-500" />
            <span>File Damage Claim</span>
          </Link>
        </Button>
      </div>

      {/* Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-4"
      >
        <h3 className="text-[11px] font-black font-heading uppercase text-text-primary tracking-[0.15em]">
          Purchased Styles
        </h3>
        <div className="rounded-[24px] bg-white border border-[rgba(0,0,0,0.06)] overflow-hidden shadow-sm">
          {order.comboGroups.map((group: any, idx: number) => (
            <div key={idx} className={cn("p-5 space-y-3", idx > 0 && "border-t border-border-medium/30")}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold font-heading text-text-primary uppercase tracking-wider">
                  {group.comboName}
                </p>
                <span className="text-[11px] font-bold text-text-muted font-ui">₹999 Base</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((item: any, itemIdx: number) => (
                  <div key={itemIdx} className="flex gap-3 bg-bg-secondary p-3 rounded-xl border border-border-light">
                    <div className="relative h-16 w-12 rounded-xl overflow-hidden bg-white border border-border-light shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.productName} fill sizes="48px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-bg-secondary flex items-center justify-center text-[10px] text-text-muted">999</div>
                      )}
                    </div>
                    <div className="text-xs space-y-1 min-w-0 flex-1">
                      <h4 className="font-bold font-heading text-text-primary truncate">{item.productName}</h4>
                      <div className="flex items-center gap-2 text-text-secondary text-[10px] font-ui">
                        <span>Size: <strong className="text-text-primary">{item.size}</strong></span>
                        <span>·</span>
                        <span>Color: <strong className="text-text-primary">{item.colorName}</strong></span>
                      </div>
                      <p className="text-[9px] text-text-muted font-mono">SKU: {item.sku}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Shipping + Payment */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="grid gap-5 sm:grid-cols-2"
      >
        {/* Shipping */}
        <div className="bg-white rounded-[24px] border border-[rgba(0,0,0,0.06)] p-5 space-y-3 hover:shadow-md transition-all shadow-sm">
          <h4 className="font-heading font-black text-text-primary uppercase tracking-widest text-[10px] flex items-center gap-2">
            <MapPin className="h-4 w-4 text-text-primary" />
            Delivery Destination
          </h4>
          <div className="space-y-1 text-sm font-body text-text-secondary">
            <p className="font-black text-text-primary font-heading uppercase text-xs tracking-wide pb-1">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            {order.shippingAddress.landmark && <p className="text-text-muted">Near: {order.shippingAddress.landmark}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.district}</p>
            <p>{order.shippingAddress.state} — {order.shippingAddress.pinCode}</p>
            <p className="pt-2 font-bold text-text-primary">📱 {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-[24px] border border-[rgba(0,0,0,0.06)] p-5 space-y-3 hover:shadow-md transition-all shadow-sm">
          <h4 className="font-heading font-black text-text-primary uppercase tracking-widest text-[10px] flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-text-primary" />
            Payment Breakdown
          </h4>
          <div className="space-y-2 font-body text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Method:</span>
              <strong className="uppercase text-text-primary text-xs">{order.paymentMethod.replace("_", " ")}</strong>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Status:</span>
              <strong className="capitalize text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-100 uppercase tracking-wide">
                {order.paymentStatus.replace("_", " ")}
              </strong>
            </div>
            <div className="border-t border-[#E8E0D0] pt-3 mt-2 space-y-2 text-[12px]">
              <div className="flex justify-between text-text-secondary">
                <span>Combo Subtotal:</span>
                <span className="font-bold text-text-primary">{formatCurrency(order.subtotalMinor)}</span>
              </div>
              {order.discountMinor > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount Applied:</span>
                  <span className="font-bold">-{formatCurrency(order.discountMinor)}</span>
                </div>
              )}
              <div className="flex justify-between text-text-secondary">
                <span>Courier Charge:</span>
                <span className="font-bold text-text-primary">{formatCurrency(order.shippingMinor)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-text-primary pt-2 border-t border-[#E8E0D0]">
                <span>Grand Total:</span>
                <span className="font-heading text-[#D4AF37]">{formatCurrency(order.grandTotalMinor)}</span>
              </div>
              {order.paymentMethod === "cod_advance" && (
                <div className="flex justify-between text-[#D4AF37] font-bold text-xs">
                  <span>COD Advance Paid (20%):</span>
                  <span>{formatCurrency(order.advanceMinor)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Policy Notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        <PolicyNotice variant="alert" />
      </motion.div>
    </div>
  );
}
