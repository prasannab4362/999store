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
  const orderNumberParam = searchParams.get("orderNumber");

  const order = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    const orders = JSON.parse(localStorage.getItem("999-store-orders") || "[]");
    if (orderId) {
      const found = orders.find((o: any) => o.id === orderId);
      if (found) return found;
    }
    if (orderNumberParam) {
      const found = orders.find((o: any) => o.orderNumber === orderNumberParam);
      if (found) return found;
    }
    return orders.length > 0 ? orders[0] : null;
  }, [orderId, orderNumberParam]);

  const handlePrintInvoice = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (!order) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4 space-y-6 font-body">
        <div className="h-20 w-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto mb-6 relative shadow-sm">📦</div>
        <h1 className="text-2xl font-black font-heading text-text-primary uppercase tracking-tight">Order Session Active</h1>
        <p className="text-xs text-text-secondary font-ui">Your order details have been processed. Visit your account page or track order below.</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => router.push("/")} className="h-12 px-8 rounded-full font-black uppercase tracking-widest bg-[#1D1D1F] text-white">Go Home</Button>
          <Button onClick={() => router.push("/track-order")} className="h-12 px-8 rounded-full font-black uppercase tracking-widest border border-gray-300">Track Logistics</Button>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentMethod === "RAZORPAY" || order.paymentStatus === "PAID";
  const address = order.shippingAddress || {};

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 font-body min-h-[75vh]">
      {/* Printable Invoice Header (Hidden except in print) */}
      <style jsx global>{`
        @media print {
          header, footer, nav, button, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print-card {
            border: 1px solid #ccc !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* 1. Apple-Style Success Banner */}
      <div className="text-center space-y-4 no-print">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative inline-flex items-center justify-center"
        >
          <div className="h-20 w-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center relative z-10 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <p className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-[0.25em] font-ui">Payment & Order Confirmed</p>
          <h1 className="text-3xl md:text-5xl font-black font-heading text-text-primary tracking-tight">
            Thank You For Your Order
          </h1>
          <p className="text-xs sm:text-sm font-ui text-text-secondary max-w-md mx-auto leading-relaxed">
            Your ₹999 flat combo has been successfully issued. Below is your official Tax Invoice and package tracking timeline.
          </p>
        </div>
      </div>

      {/* 2. Package Tracking Progress Bar */}
      <div className="bg-[#1D1D1F] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl no-print">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-400/20 flex items-center justify-center">
              <Truck className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Package Logistics Status</p>
              <h3 className="text-base font-bold text-white">Order Confirmed & Preparing Dispatch</h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Order # {order.orderNumber}
          </span>
        </div>

        {/* 5-Step Progress Bar */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          {[
            { label: "Placed", active: true, done: true },
            { label: "Confirmed", active: true, done: true },
            { label: "Packed", active: true, done: false },
            { label: "Shipped", active: false, done: false },
            { label: "Delivered", active: false, done: false },
          ].map((step, idx) => (
            <div key={idx} className="space-y-2 text-center">
              <div className={`h-2 rounded-full transition-all ${step.done ? "bg-amber-400" : step.active ? "bg-amber-400/50 animate-pulse" : "bg-white/10"}`} />
              <p className={`text-[10px] font-bold ${step.done ? "text-amber-400" : "text-white/30"}`}>{step.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Official Tax Invoice Card (Apple Clean Receipt UI) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="print-card rounded-3xl bg-white border border-border-medium/60 shadow-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden"
      >
        {/* Top Gold Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#D4AF37] to-amber-500" />

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-medium/60 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black font-heading text-text-primary uppercase tracking-tight">Tax Invoice / Bill Receipt</h2>
            <p className="text-xs text-text-muted font-ui">999 Combo Store Pvt Ltd · GSTIN: 33AAAAA9999A1Z5</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintInvoice}
              className="no-print h-10 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-text-primary text-xs font-bold transition-all cursor-pointer border border-gray-300"
            >
              🖨 Print / Download PDF
            </button>
            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-amber-50 text-amber-700 border-amber-300"}`}>
              {isPaid ? "Payment Verified ✓" : "COD Order - ₹999 Due"}
            </span>
          </div>
        </div>

        {/* Invoice Meta Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-ui bg-bg-secondary p-4 rounded-2xl border border-border-medium/40">
          <div>
            <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider">Invoice No.</span>
            <strong className="text-text-primary font-mono text-xs">{`INV-${order.orderNumber}`}</strong>
          </div>
          <div>
            <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider">Order No.</span>
            <strong className="text-text-primary font-mono text-xs">{order.orderNumber}</strong>
          </div>
          <div>
            <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider">Date</span>
            <strong className="text-text-primary">{new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong>
          </div>
          <div>
            <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider">Payment Mode</span>
            <strong className="text-text-primary uppercase">{order.paymentMethod?.replace("_", " ") || "COD"}</strong>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold font-ui uppercase tracking-wider text-text-muted">Package Selections Breakdown</h3>
          <div className="border border-border-medium/60 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs font-ui">
              <thead className="bg-bg-secondary border-b border-border-medium/60">
                <tr>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-text-muted">Combo Package</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-text-muted">Items Included</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-text-muted text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-medium/40">
                {(order.comboGroups || []).map((group: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-3.5 font-bold text-text-primary">
                      {group.comboName || "10 Items Combo Package"}
                      <span className="block text-[10px] font-normal text-text-muted">{group.items?.length || 10} Custom Selections</span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {(group.items || []).map((item: any, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg bg-gray-100 text-[10px] text-text-primary font-medium border border-gray-200">
                            {item.productName || item.name} ({item.size})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-bold text-text-primary font-mono">
                      {formatCurrency(group.basePriceMinor || 99900)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Address & Invoice Totals */}
        <div className="grid sm:grid-cols-2 gap-6 border-t border-border-medium/60 pt-6">
          {/* Customer Delivery Info */}
          <div className="space-y-2 text-xs font-ui bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <p className="font-bold text-text-primary uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" /> Deliver To:
            </p>
            <p className="font-bold text-text-primary">{address.fullName || order.customerName}</p>
            <p className="text-text-secondary">{address.addressLine1 || order.deliveryAddress}</p>
            {address.addressLine2 && <p className="text-text-secondary">{address.addressLine2}</p>}
            <p className="text-text-secondary">{address.city || order.city}, {address.state || order.state} — {address.pinCode || address.pincode || order.pincode}</p>
            <p className="text-text-primary font-bold pt-1">📞 Phone: {address.phone || order.customerPhone}</p>
          </div>

          {/* Totals Summary */}
          <div className="space-y-2 text-xs font-ui bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal:</span>
              <span className="font-mono font-bold">{formatCurrency(order.subtotalMinor || 99900)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Pan India Delivery Fee:</span>
              <span className="text-emerald-600 font-bold">FREE (₹0)</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>GST Included (18%):</span>
              <span className="font-mono">₹152.38</span>
            </div>
            <div className="border-t border-amber-200/80 pt-2 flex justify-between text-sm font-bold text-text-primary">
              <span>Total Paid / Payable:</span>
              <span className="text-base font-black font-mono text-amber-700">{formatCurrency(order.totalMinor || 99900)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
        <Button
          onClick={() => router.push("/")}
          className="h-12 px-8 rounded-full font-bold uppercase tracking-widest text-xs bg-[#1D1D1F] text-white hover:bg-[#2C2C2E] shadow-lg"
        >
          <span>Return To Store</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>

        <Button
          onClick={() => router.push("/track-order")}
          className="h-12 px-8 rounded-full font-bold uppercase tracking-widest text-xs bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg shadow-amber-400/20"
        >
          <span>Track Live Package</span>
        </Button>
      </div>
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
