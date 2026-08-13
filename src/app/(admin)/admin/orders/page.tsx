"use client";

import * as React from "react";
import {
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Package,
  Printer,
  X,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { AdminOrder, OrderFulfillmentStatus } from "@/types/admin";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const statusTabs = [
  { id: "ALL", label: "All Orders" },
  { id: "PENDING", label: "Pending" },
  { id: "SHIPPED", label: "Shipped" },
  { id: "DELIVERED", label: "Delivered" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  // Selected Order for Label / Detail Modal
  const [selectedOrder, setSelectedOrder] = React.useState<AdminOrder | null>(null);
  const [trackingInput, setTrackingInput] = React.useState("");

  const fetchOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders?status=${activeTab}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderFulfillmentStatus, tracking?: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          trackingNumber: tracking || trackingInput || undefined,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Order ${orderId} updated to ${newStatus}!`);
        setSelectedOrder(null);
        setTrackingInput("");
        fetchOrders();
      } else {
        toast.error(data.error || "Failed to update order status.");
      }
    } catch (err) {
      toast.error("Server error while updating status.");
    }
  };

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight uppercase">
            Order Fulfillment & Shipping
          </h1>
          <p className="text-xs sm:text-sm text-white/50 font-ui mt-1">
            Manage customer combo packages, update dispatch tracking, and print shipping labels.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#161618] p-4 rounded-3xl border border-white/10">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl overflow-x-auto w-full sm:w-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by Order # or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-white/10 bg-[#161618] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-ui">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase font-bold text-[10px] tracking-wider bg-white/5">
                <th className="p-4 sm:p-5">Order #</th>
                <th className="p-4 sm:p-5">Customer & Address</th>
                <th className="p-4 sm:p-5">Combo Package</th>
                <th className="p-4 sm:p-5">Amount</th>
                <th className="p-4 sm:p-5">Payment</th>
                <th className="p-4 sm:p-5">Status</th>
                <th className="p-4 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white font-mono">
                    {order.orderNumber}
                    <div className="text-[10px] text-white/40 font-sans font-normal mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 text-white/80">
                    <div className="font-bold text-white">{order.customerName}</div>
                    <div className="text-[11px] text-white/60 mt-0.5">{order.shippingAddress.street}</div>
                    <div className="text-[10px] text-amber-400 font-bold mt-0.5">
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </div>
                  </td>
                  <td className="p-4 sm:p-5">
                    <div className="font-bold text-amber-400">{order.comboGroups[0]?.comboName || "Combo Set"}</div>
                    <div className="text-[10px] text-white/50 mt-0.5">
                      {order.comboGroups[0]?.items?.length || 0} Dresses included
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 font-bold text-white tabular-nums text-sm">
                    ₹{(order.totalMinor / 100).toLocaleString("en-IN")}
                  </td>
                  <td className="p-4 sm:p-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${order.paymentMethod === "COD" ? "bg-amber-400/10 text-amber-300 border border-amber-400/20" : "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"}`}>
                      {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </td>
                  <td className="p-4 sm:p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.orderStatus === "DELIVERED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : order.orderStatus === "SHIPPED"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-right space-x-2">
                    <button
                      onClick={() => { setSelectedOrder(order); setTrackingInput(order.trackingNumber || ""); }}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer transition-all inline-flex items-center gap-1"
                    >
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Shipping Label Modal */}
      {selectedOrder && (
        <Dialog open={Boolean(selectedOrder)} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-xl bg-[#161618] text-white border-white/10 font-body">
            <DialogHeader>
              <DialogTitle className="font-heading font-extrabold text-xl text-white tracking-tight flex items-center justify-between">
                <span>Fulfill Order #{selectedOrder.orderNumber}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-white/50">
                Customer: {selectedOrder.customerName} ({selectedOrder.customerPhone})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-3">
              {/* Shipping Address */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">Delivery Address</span>
                <p className="text-xs text-white/90 font-medium">{selectedOrder.shippingAddress.street}</p>
                <p className="text-xs text-white/60">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
              </div>

              {/* Items in Combo */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Combo Contents ({selectedOrder.comboGroups[0]?.comboName})
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.comboGroups[0]?.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-slate-800 overflow-hidden relative shrink-0">
                          <img src={item.image} alt={item.productName} className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{item.productName}</div>
                          <div className="text-[10px] text-white/50">Size: {item.size} · Color: {item.colorName}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-400">Included in Combo</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Update Status Form */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <label className="text-xs font-bold text-white block">Update Order Fulfillment Status</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "CONFIRMED")}
                    className={`h-10 rounded-xl font-bold text-xs cursor-pointer border transition-all ${selectedOrder.orderStatus === "CONFIRMED" ? "bg-amber-400 text-slate-950 border-amber-400" : "bg-white/5 text-white border-white/10 hover:bg-white/10"}`}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "SHIPPED")}
                    className={`h-10 rounded-xl font-bold text-xs cursor-pointer border transition-all ${selectedOrder.orderStatus === "SHIPPED" ? "bg-indigo-600 text-white border-indigo-500" : "bg-white/5 text-white border-white/10 hover:bg-white/10"}`}
                  >
                    Ship Order
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "DELIVERED")}
                    className={`h-10 rounded-xl font-bold text-xs cursor-pointer border transition-all ${selectedOrder.orderStatus === "DELIVERED" ? "bg-emerald-500 text-slate-950 border-emerald-400" : "bg-white/5 text-white border-white/10 hover:bg-white/10"}`}
                  >
                    Delivered
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
