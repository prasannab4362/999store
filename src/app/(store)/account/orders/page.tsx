"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { Button } from "@/components/ui/button";
import { Truck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export default function AccountOrdersPage() {
  const [orders, setOrders] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrders(JSON.parse(localStorage.getItem("999-store-orders") || "[]"));
    }
  }, []);

  return (
    <div className="space-y-8 font-body">

      {/* Header */}
      <div className="space-y-2 border-b border-[#E8E0D0] pb-6">
        <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] font-ui">History</p>
        <h1 className="text-3xl font-black font-heading text-text-primary uppercase tracking-tight">
          My Orders
        </h1>
        <p className="text-sm font-ui text-text-secondary">
          Track and review details of all your placed orders.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.35 }}
              className="rounded-2xl bg-white border border-[#E8E0D0] p-6 shadow-sm hover:shadow-md hover:border-[#D4AF37]/30 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Order Info */}
                <div className="space-y-3 font-ui text-sm flex-1 min-w-0">
                  {/* Order number + date + status */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-heading font-black text-lg text-text-primary tracking-wide">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] font-black text-text-muted bg-[#F5F0E8] px-2 py-0.5 rounded-full uppercase tracking-widest border border-[#E8E0D0]">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-widest hidden sm:inline-block">
                      {order.orderStatus.replace("_", " ")}
                    </span>
                  </div>

                  {/* First combo thumb */}
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-12 shrink-0 rounded-xl bg-[#F5F0E8] border border-[#E8E0D0] overflow-hidden relative">
                      {order.comboGroups[0].items[0]?.image && (
                        <Image src={order.comboGroups[0].items[0].image} alt="Combo item" fill sizes="48px" className="object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-black font-heading text-sm uppercase text-text-primary tracking-wide">{order.comboGroups[0].comboName}</p>
                      <p className="text-[11px] text-text-secondary mt-0.5">{order.comboGroups[0].items.length} items purchased</p>
                    </div>
                  </div>

                  {/* Payment meta */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <span className="uppercase tracking-widest font-black text-[10px]">Method:</span>
                      <strong className="text-text-primary bg-[#F5F0E8] px-2 py-0.5 rounded-md border border-[#E8E0D0] uppercase text-[10px]">
                        {order.paymentMethod.replace("_", " ")}
                      </strong>
                    </div>
                    <span className="text-[#E8E0D0]">|</span>
                    <div className="flex items-center gap-1.5">
                      <span className="uppercase tracking-widest font-black text-[10px]">Payment:</span>
                      <strong className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase text-[10px]">
                        {order.paymentStatus.replace("_", " ")}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Right: Total + Actions */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#E8E0D0] shrink-0">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] font-black font-ui text-text-muted uppercase tracking-widest block mb-0.5">Total</span>
                    <span className="font-heading font-black text-2xl text-[#D4AF37] tracking-tight">
                      {formatCurrency(order.grandTotalMinor)}
                    </span>
                  </div>
                  <div className="flex gap-2.5">
                    <Button size="sm" variant="outline" asChild className="h-10 rounded-xl uppercase font-black font-ui tracking-wider border-[#E8E0D0] shadow-sm hidden sm:flex text-[10px] hover:border-[#D4AF37]/40">
                      <Link href={`/track-order?orderId=${order.id}&phone=${order.customer.phone}`} className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5" /> Track
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="h-10 rounded-xl uppercase font-black font-ui tracking-wider text-[10px] flex-1 sm:flex-none bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-black hover:opacity-90 shadow-sm group/btn">
                      <Link href={`/account/orders/${order.id}`} className="flex items-center gap-1.5">
                        Details <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-[#D4AF37]/20 p-12 text-center space-y-5 max-w-lg mx-auto bg-[#FAFAF9]">
          <span className="text-5xl block">📦</span>
          <div className="space-y-2">
            <h3 className="font-heading font-black text-xl text-text-primary uppercase tracking-wide">No orders placed yet</h3>
            <p className="text-sm font-ui text-text-secondary leading-relaxed">
              Ready to find your look? Pick a combo size and start adding styles.
            </p>
          </div>
          <Button asChild className="h-12 px-8 uppercase font-black tracking-widest font-ui rounded-full bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-black hover:opacity-90 shadow-md cursor-pointer">
            <Link href="/combo">Build Your Combo</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
