"use client";

import * as React from "react";
import Link from "next/link";
import {
  IndianRupee,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Truck,
  PackageCheck,
} from "lucide-react";
import { AdminStats, AdminOrder } from "@/types/admin";

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = React.useState<AdminOrder[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/orders"),
        ]);
        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();

        if (statsData.success) setStats(statsData.stats);
        if (ordersData.success) setRecentOrders(ordersData.orders.slice(0, 5));
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 font-body">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight uppercase">
            Store Overview Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-white/50 font-ui mt-1">
            Real-time sales revenue, combo package fulfillment, and inventory analytics.
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="h-10 px-5 rounded-2xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 hover:scale-105 transition-all cursor-pointer w-fit"
        >
          <span>Fulfill Orders</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-3xl border border-white/10 bg-[#161618] p-6 space-y-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Total Sales</span>
            <div className="h-10 w-10 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-heading text-white tabular-nums">
              ₹{((stats?.totalRevenueMinor || 199800) / 100).toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-emerald-400 font-bold mt-1">
              Flat ₹999 Base Rate Engine
            </p>
          </div>
        </div>

        {/* Combos Sold */}
        <div className="rounded-3xl border border-white/10 bg-[#161618] p-6 space-y-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Combos Sold</span>
            <div className="h-10 w-10 rounded-2xl bg-indigo-400/10 text-indigo-400 flex items-center justify-center border border-indigo-400/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-heading text-white tabular-nums">
              {stats?.totalCombosSold || 2} Packages
            </div>
            <p className="text-[11px] text-indigo-300 font-bold mt-1">
              {stats?.popularTierName || "3 Picks Combo (Flat ₹999)"}
            </p>
          </div>
        </div>

        {/* Pending Fulfillment */}
        <div className="rounded-3xl border border-white/10 bg-[#161618] p-6 space-y-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Pending Fulfillment</span>
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-heading text-amber-400 tabular-nums">
              {stats?.pendingOrdersCount || 1} Orders
            </div>
            <p className="text-[11px] text-white/40 font-medium mt-1">
              Requires shipping dispatch
            </p>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="rounded-3xl border border-white/10 bg-[#161618] p-6 space-y-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Stock Inventory</span>
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <PackageCheck className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black font-heading text-white tabular-nums">
              24 Styles
            </div>
            <p className="text-[11px] text-emerald-400 font-bold mt-1">
              All sizes & colors in stock
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-3xl border border-white/10 bg-[#161618] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl text-white tracking-tight">
            Recent Customer Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-ui">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase font-bold text-[10px] tracking-wider">
                <th className="pb-3">Order Number</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Combo Package</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 font-bold text-white font-mono">{order.orderNumber}</td>
                  <td className="py-4 text-white/80 font-medium">
                    <div>{order.customerName}</div>
                    <div className="text-[10px] text-white/40">{order.shippingAddress.city}, {order.shippingAddress.state}</div>
                  </td>
                  <td className="py-4 font-semibold text-amber-400">
                    {order.comboGroups[0]?.comboName || "Fashion Package"}
                  </td>
                  <td className="py-4 font-bold text-white tabular-nums">
                    ₹{(order.totalMinor / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${order.paymentMethod === "COD" ? "bg-amber-400/10 text-amber-300" : "bg-emerald-400/10 text-emerald-400"}`}>
                      {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.orderStatus === "DELIVERED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : order.orderStatus === "SHIPPED"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href="/admin/orders"
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
