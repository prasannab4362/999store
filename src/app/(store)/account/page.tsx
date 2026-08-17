"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";
import { formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { ArrowRight, ShoppingBag, Heart, RotateCcw, ChevronRight, Truck } from "lucide-react";
import { products } from "@/data/mock/products";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export default function AccountOverviewPage() {
  const [sessionUser, setSessionUser] = React.useState<any | null>(null);
  const [recentOrder, setRecentOrder] = React.useState<any | null>(null);
  const [claimsCount, setClaimsCount] = React.useState(0);

  const wishlistCount = useWishlistStore((state) => state.isHydrated ? state.items.length : 0);
  const recentlyViewedSlugs = useRecentlyViewedStore((state) => state.isHydrated ? state.items : []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const user =
        JSON.parse(localStorage.getItem("999-user-session") || "null") ||
        JSON.parse(localStorage.getItem("999-store-session") || "null") || {
          name: "Valued Customer",
          email: "customer@999store.com",
        };
      setSessionUser(user);
      const orders = JSON.parse(localStorage.getItem("999-store-orders") || "[]");
      if (orders.length > 0) setRecentOrder(orders[0]);
      const claims = JSON.parse(localStorage.getItem("999-store-claims") || "[]");
      setClaimsCount(claims.length);
    }
  }, []);

  const recentlyViewedProducts = React.useMemo(() => {
    return recentlyViewedSlugs
      .map((slug) => products.find((p) => p.slug === slug))
      .filter((p): p is typeof p & object => !!p)
      .slice(0, 4);
  }, [recentlyViewedSlugs]);

  const userName = sessionUser?.name || "Customer";

  const statCards = [
    {
      icon: Heart,
      value: wishlistCount,
      label: "Wishlist Styles",
      gradient: "from-red-500/10 to-transparent",
      iconColor: "text-red-500",
      delay: 0.1,
    },
    {
      icon: ShoppingBag,
      value: recentOrder ? "1+" : "0",
      label: "Total Orders",
      gradient: "from-[#D4AF37]/10 to-transparent",
      iconColor: "text-[#D4AF37]",
      delay: 0.2,
    },
    {
      icon: RotateCcw,
      value: claimsCount,
      label: "Damage Claims",
      gradient: "from-amber-600/10 to-transparent",
      iconColor: "text-amber-600",
      delay: 0.3,
    },
  ];

  return (
    <div className="space-y-10 font-body">

      {/* Header */}
      <div className="space-y-2 border-b border-[#E8E0D0] pb-6">
        <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] font-ui">Welcome Back</p>
        <h1 className="text-3xl font-black font-heading text-text-primary uppercase tracking-tight">
          Account Overview
        </h1>
        <p className="text-sm font-ui text-text-secondary">
          Manage your profile, track order logistics, and submit damage claims.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: stat.delay }}
              className={cn(
                "relative overflow-hidden rounded-2xl border border-[#E8E0D0] bg-white p-5 text-center space-y-2 group hover:border-[#D4AF37]/40 hover:shadow-md transition-all",
                i === 2 && "col-span-2 sm:col-span-1"
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", stat.gradient)} />
              <Icon className={cn("h-6 w-6 mx-auto relative z-10", stat.iconColor)} />
              <span className="block text-3xl font-black font-heading text-text-primary tracking-tight relative z-10">{stat.value}</span>
              <span className="block text-[11px] text-text-secondary font-black font-ui uppercase tracking-widest relative z-10">{stat.label}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Order */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] font-black font-heading uppercase text-text-primary tracking-widest">
            Recent Order
          </h3>
          {recentOrder && (
            <Link
              href="/account/orders"
              className="text-[11px] text-[#D4AF37] hover:text-[#A67C1E] font-black font-ui uppercase tracking-widest flex items-center gap-1.5 transition-colors group"
            >
              <span>All Orders</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {recentOrder ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-[24px] bg-white border border-[rgba(0,0,0,0.06)] p-6 shadow-sm space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-[rgba(0,0,0,0.06)] pb-4 gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-black block mb-1">Order Number</span>
                <strong className="font-heading font-black text-xl text-text-primary tracking-wide">{recentOrder.orderNumber}</strong>
              </div>
              <span className="bg-bg-secondary text-text-secondary border border-[rgba(0,0,0,0.06)] px-3 py-1 rounded-full font-bold font-ui text-[10px] uppercase tracking-widest self-start sm:self-center">
                {recentOrder.orderStatus.replace("_", " ")}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-12 shrink-0 rounded-xl bg-bg-secondary border border-[rgba(0,0,0,0.06)] overflow-hidden relative">
                  {recentOrder.comboGroups[0].items[0]?.image && (
                    <Image src={recentOrder.comboGroups[0].items[0].image} alt="Combo item" fill sizes="48px" className="object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-black font-heading text-base uppercase text-text-primary">{recentOrder.comboGroups[0].comboName}</p>
                  <p className="text-[11px] font-ui text-text-muted">{recentOrder.comboGroups[0].items.length} items purchased</p>
                </div>
              </div>
              <span className="font-black font-heading text-2xl text-text-primary shrink-0">{formatCurrency(recentOrder.grandTotalMinor)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[rgba(0,0,0,0.06)]">
              <Button size="sm" variant="outline" asChild className="flex-1 h-10 rounded-full font-semibold text-text-primary tracking-wider border-border-medium/60 hover:bg-bg-secondary text-[11px] transition-all">
                <Link href={`/track-order?orderId=${recentOrder.id}&phone=${recentOrder.customer.phone}`} className="flex items-center justify-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" />
                  Track Progress
                </Link>
              </Button>
              <Button size="sm" asChild className="flex-1 h-10 rounded-full font-semibold tracking-wider bg-[#1D1D1F] text-white hover:-translate-y-[2px] shadow-sm text-[11px] transition-all">
                <Link href={`/account/orders/${recentOrder.id}`} className="flex items-center justify-center gap-1.5">
                  View Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-[#D4AF37]/20 p-10 text-center space-y-3 bg-[#FAFAF9]">
            <span className="text-4xl block">🛍️</span>
            <p className="text-sm font-black font-ui text-text-secondary uppercase tracking-widest">No orders placed yet</p>
            <Button asChild size="sm" className="h-10 px-6 rounded-full font-black uppercase tracking-widest text-[10px] bg-gradient-to-r from-[#D4AF37] to-[#A67C1E] text-black hover:opacity-90">
              <Link href="/combo">Build Your First Combo</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <div className="space-y-5 pt-8 border-t border-[#E8E0D0]">
          <h3 className="text-[12px] font-black font-heading uppercase text-text-primary tracking-widest">
            Recently Viewed Styles
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {recentlyViewedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group border border-[#E8E0D0] rounded-2xl overflow-hidden bg-white hover:border-[#D4AF37]/40 hover:shadow-md transition-all"
              >
                <div className="relative aspect-[3/4] bg-[#F5F0E8] w-full overflow-hidden">
                  <Image
                    src={p.media.find((m) => m.viewType === "front")?.url || p.media[0].url}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="p-3 sm:p-4 space-y-1">
                  <h4 className="text-[11px] font-black font-ui uppercase tracking-wider text-text-primary truncate">{p.name}</h4>
                  <span className="text-xs font-black font-heading text-[#D4AF37] block">₹999</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
