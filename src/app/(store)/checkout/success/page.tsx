"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Truck, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
      <div className="mx-auto max-w-xl text-center py-20 px-4 space-y-6 font-body">
            <div className="h-20 w-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto mb-6 relative shadow-sm">📦</div>
        <h1 className="text-2xl font-black font-heading text-text-primary uppercase tracking-tight">Order Not Found</h1>
        <p className="text-xs text-text-secondary font-ui">We couldn't retrieve the details for this order session.</p>
        <Button onClick={() => router.push("/")} className="h-12 px-8 rounded-full font-black uppercase tracking-widest bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-black">Go Home</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-10 font-body min-h-[70vh]">

      {/* 1. Success Banner */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative inline-flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ delay: 0.3, duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="absolute h-20 w-20 rounded-full bg-emerald-500/20"
          />
          <div className="h-20 w-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center relative z-10">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
        </motion.div>

        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.25em] font-ui mb-2">Thank You!</p>
            <h1 className="text-3xl md:text-4xl font-semibold font-heading text-text-primary tracking-tight mb-3">
              Order Confirmed
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm font-ui text-text-secondary max-w-md mx-auto leading-relaxed"
          >
            Your luxury fashion combo has been placed successfully. We'll notify you when it ships.
          </motion.p>
        </div>
      </div>

      {/* 2. Order Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-[24px] bg-white border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden"
      >
        {/* Top accent */}
        <div className="h-0.5 bg-gray-100" />

        <div className="p-6 md:p-8 space-y-8">
          {/* Order meta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <span className="text-[10px] font-black font-ui uppercase tracking-widest text-gray-400 block mb-1">Order Number</span>
              <p className="text-sm font-ui text-text-secondary">Order Reference ID</p>
              <p className="text-xl md:text-2xl font-black font-mono text-text-primary tracking-wider mt-1 select-all bg-gray-50 inline-block px-4 py-2 rounded-xl border border-[rgba(0,0,0,0.06)]">{order.orderNumber}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-black font-ui uppercase tracking-widest text-gray-400 block mb-1">Date Placed</span>
              <span className="font-ui font-semibold text-gray-600">
                {new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black font-ui uppercase tracking-widest text-gray-400">Items Purchased</h3>
            <div className="space-y-3">
              {order.comboGroups.map((group: any, idx: number) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-[rgba(0,0,0,0.06)] space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-black font-heading text-text-primary uppercase tracking-wide">{group.comboName}</p>
                    <span className="font-black text-[#D4AF37] text-sm font-ui">
                      {group.basePriceMinor ? formatCurrency(group.basePriceMinor) : "₹999.00"}
                    </span>
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {group.items.map((item: any, itemIdx: number) => (
                      <div key={itemIdx} className="flex gap-3 items-center bg-white p-2.5 rounded-xl border border-[rgba(0,0,0,0.06)]">
                        <div className="relative h-12 w-10 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-[rgba(0,0,0,0.06)]">
                          {item.image ? (
                            <Image src={item.image} alt={item.productName} fill sizes="40px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <div className="text-[11px] min-w-0 font-ui">
                          <h4 className="font-bold text-text-primary truncate">{item.productName}</h4>
                          <p className="text-gray-500 text-[10px] mt-0.5">
                            Size: <strong className="text-text-primary">{item.size}</strong> · Color: <strong className="text-text-primary">{item.colorName}</strong>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address & Payment Grid */}
          <div className="grid gap-6 sm:grid-cols-2 border-t border-gray-100 pt-8">

            {/* Shipping */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" /> Delivery Address
              </h4>
              <div className="space-y-1 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-[rgba(0,0,0,0.06)]">
                <p className="font-black text-text-primary font-heading uppercase text-xs tracking-wide pb-1">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pinCode}</p>
                <p className="pt-2 text-[#D4AF37] font-bold">📱 {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5 text-[#D4AF37]" /> Payment Details
              </h4>
              <div className="bg-gray-50 p-4 rounded-xl border border-[rgba(0,0,0,0.06)] space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span className="text-xs">Method:</span>
                  <strong className="uppercase text-text-primary text-xs">{order.paymentMethod.replace("_", " ")}</strong>
                </div>
                
                {order.paymentMethod === "cod_advance" && (
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                        <span className="text-xl">💳</span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-emerald-800">20% Advance Received</p>
                        <p className="text-[11px] font-ui text-emerald-600 mt-0.5 leading-relaxed">
                          Balance will be collected by courier upon delivery. 
                        </p>
                      </div>
                    </div>
                )}
                
                <div className="border-t border-gray-200 pt-3 mt-2 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Grand Total:</span>
                    <span className="font-heading font-black text-text-primary">{formatCurrency(order.grandTotalMinor)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Action CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
      >
        <Button
          className="w-full sm:w-auto h-12 px-8 rounded-full font-semibold uppercase tracking-widest text-[13px] bg-[#1D1D1F] text-white hover:-translate-y-[2px] shadow-sm hover:shadow-md transition-all active:scale-95 group"
          onClick={() => router.push("/")}
        >
          <span>Continue Shopping</span>
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        <Button
          variant="outline"
          className="w-full sm:w-auto h-12 px-8 rounded-full font-semibold uppercase tracking-widest text-[13px] text-text-primary hover:bg-gray-50 transition-all active:scale-95 group border-gray-200"
          onClick={() => router.push(`/account/orders/${orderId}`)}
        >
          <span>Track Order Status</span>
        </Button>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-xl text-center py-20 px-4 font-body">
        <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <div className="h-4 w-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
          Loading success details...
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
