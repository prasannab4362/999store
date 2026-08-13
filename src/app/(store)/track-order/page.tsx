"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { CheckCircle2, Circle, Clock, MapPin, Truck, Box, Package, ShieldCheck, HelpCircle, Search, Hash, Phone } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

// Zod schema
const trackSchema = z.object({
  orderId: z.string().min(3, "Enter a valid order ID or Order Number"),
  phone: z.string().optional(),
});

type TrackFormValues = z.infer<typeof trackSchema>;

// Status configurations
const stepsList = [
  { status: "confirmed", label: "Order Confirmed", icon: ShieldCheck, desc: "Order details reviewed and confirmed." },
  { status: "processing", label: "Processing", icon: Clock, desc: "Order details sent to inventory warehousing." },
  { status: "quality_check", label: "Quality Check", icon: HelpCircle, desc: "Clothes check for sizing/color mismatch and stitches." },
  { status: "packed", label: "Packed", icon: Box, desc: "Combo packaged cleanly with unboxing policy label." },
  { status: "shipped", label: "Shipped", icon: Package, desc: "Dispatched via standard courier service." },
  { status: "out_for_delivery", label: "Out for Delivery", icon: Truck, desc: "Courier partner delivery boy is near your location." },
  { status: "delivered", label: "Delivered", icon: CheckCircle2, desc: "Parcel handed over. Keep parcel opening video safe." },
];

import { Suspense } from "react";

function TrackOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("orderId");
  const urlPhone = searchParams.get("phone");

  const [activeOrder, setActiveOrder] = React.useState<any | null>(null);
  const [searched, setSearched] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TrackFormValues>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      orderId: "",
      phone: "",
    },
  });

  // Hydrate fields from URL search parameters if present
  React.useEffect(() => {
    if (urlOrderId) setValue("orderId", urlOrderId);
    if (urlPhone) setValue("phone", urlPhone);

    if (urlOrderId && urlPhone && typeof window !== "undefined") {
      const orders = JSON.parse(localStorage.getItem("999-store-orders") || "[]");
      const found = orders.find(
        (o: any) => o.id === urlOrderId && o.customer.phone === urlPhone
      );
      if (found) {
        setActiveOrder(found);
      } else {
        // Fallback: create mock order details if not found (for demonstration/testing)
        setActiveOrder({
          id: urlOrderId,
          orderNumber: urlOrderId,
          customer: { name: "Demo Customer", phone: urlPhone },
          shippingAddress: { fullName: "Demo Customer", addressLine1: "123 Demo St", city: "Chennai", state: "Tamil Nadu", pinCode: "600001", phone: urlPhone },
          comboGroups: [
            { comboName: "5 Items Combo", items: [{ productName: "Emerald Check Shirt", size: "M", colorName: "Green", image: "" }] }
          ],
          paymentMethod: "cod_advance",
          paymentStatus: "advance_paid",
          orderStatus: "shipped",
          statusHistory: [
            { status: "confirmed", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: "Order confirmed." },
            { status: "processing", timestamp: new Date(Date.now() - 86400000).toISOString(), note: "Sent to warehouse." },
            { status: "shipped", timestamp: new Date().toISOString(), note: "Dispatched via BlueDart." },
          ],
          subtotalMinor: 99900,
          discountMinor: 0,
          shippingMinor: 12000,
          advanceMinor: 19980,
          balanceDueMinor: 91920,
          grandTotalMinor: 111900,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        });
      }
      setSearched(true);
    }
  }, [urlOrderId, urlPhone, setValue]);

  const onSearch = (data: TrackFormValues) => {
    router.push(`/track-order?orderId=${data.orderId}&phone=${data.phone}`);
  };

  // Get active step index
  const activeStepIndex = React.useMemo(() => {
    if (!activeOrder) return -1;
    return stepsList.findIndex((step) => step.status === activeOrder.orderStatus);
  }, [activeOrder]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-12 font-body min-h-[70vh]">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-4xl sm:text-5xl font-black font-heading text-text-primary tracking-tight">
          TRACK ORDER
        </h1>
        <p className="text-sm font-ui text-text-secondary">
          Enter your 999 Combo Store Order ID and Mobile number to view tracking.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSubmit(onSearch)} className="bg-white p-6 sm:p-8 rounded-[var(--radius-card)] border border-border-medium/40 shadow-[var(--shadow-md)] grid gap-6 sm:grid-cols-3 items-end relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-primary-light" />
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold font-ui uppercase tracking-widest text-text-secondary pl-1 flex items-center gap-1.5"><Hash className="h-3 w-3" /> Order ID</label>
          <Input 
            type="text" 
            placeholder="999-123456" 
            {...register("orderId")} 
            className="h-12 bg-bg-secondary border-border-medium/40 font-ui font-medium rounded-[var(--radius-control)] px-4 focus-visible:ring-brand-primary/20 transition-all shadow-sm"
          />
          {errors.orderId && <p className="text-[10px] text-red-600 font-bold ml-1">{errors.orderId.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold font-ui uppercase tracking-widest text-text-secondary pl-1 flex items-center gap-1.5"><Phone className="h-3 w-3" /> Mobile Number</label>
          <Input 
            type="tel" 
            placeholder="9876543210" 
            {...register("phone")} 
            className="h-12 bg-bg-secondary border-border-medium/40 font-ui font-medium rounded-[var(--radius-control)] px-4 focus-visible:ring-brand-primary/20 transition-all shadow-sm"
          />
          {errors.phone && <p className="text-[10px] text-red-600 font-bold ml-1">{errors.phone.message}</p>}
        </div>
        <Button type="submit" className="h-12 cursor-pointer uppercase font-bold tracking-widest font-ui rounded-[var(--radius-control)] shadow-[var(--shadow-md)] flex gap-2">
          <Search className="h-4 w-4" /> Track Progress
        </Button>
      </form>

      {/* Visual Timeline Details */}
      {searched && activeOrder && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 bg-white p-6 sm:p-10 rounded-[var(--radius-card)] border border-border-medium/40 shadow-[var(--shadow-lg)]"
        >
          {/* Header summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-medium/40 pb-6 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-text-muted font-bold font-ui uppercase tracking-widest block">Tracking ID</span>
              <span className="font-heading font-black text-xl text-text-primary tracking-tight">{activeOrder.orderNumber}</span>
            </div>
            <div className="text-left sm:text-right space-y-1">
              <span className="text-[11px] text-text-muted font-bold font-ui uppercase tracking-widest block">Current Status</span>
              <span className="bg-brand-primary-soft text-brand-primary px-4 py-1.5 rounded-full text-xs font-black font-ui uppercase tracking-widest inline-flex items-center gap-1.5 border border-brand-primary/20 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                </span>
                {activeOrder.orderStatus.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Timeline steps */}
          <div className="relative pl-10 space-y-10 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-1 before:bg-bg-secondary before:rounded-full">
            {stepsList.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              const isFuture = idx > activeStepIndex;

              // Find date history matching this status
              const historyItem = activeOrder.statusHistory.find((h: any) => h.status === step.status);
              const timestampStr = historyItem ? new Date(historyItem.timestamp).toLocaleString() : null;

              return (
                <div key={step.status} className="relative space-y-1.5 group">
                  {/* Connecting Line active fill */}
                  {idx < stepsList.length - 1 && !isFuture && (
                     <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className={cn("absolute -left-[37px] top-6 w-1 rounded-full", isCurrent ? "bg-gradient-to-b from-brand-primary to-transparent" : "bg-brand-primary")}
                     />
                  )}

                  {/* Circle Indicator */}
                  <span
                    className={cn(
                      "absolute -left-[54px] top-0 h-10 w-10 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-300 shadow-sm",
                      isPast
                        ? "border-brand-primary bg-brand-primary text-white"
                        : isCurrent
                        ? "border-brand-primary bg-white text-brand-primary scale-110 shadow-md"
                        : "border-border-medium/40 bg-bg-secondary text-text-muted"
                    )}
                  >
                    {isCurrent && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full bg-brand-primary/20"
                      />
                    )}
                    {isPast ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4.5 w-4.5" />}
                  </span>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h4
                      className={cn(
                        "font-heading font-black text-base uppercase tracking-wide",
                        isPast || isCurrent ? "text-text-primary" : "text-text-muted"
                      )}
                    >
                      {step.label}
                    </h4>
                    {timestampStr && (
                      <span className="text-[11px] font-ui font-semibold text-text-muted bg-bg-secondary px-2 py-0.5 rounded-sm border border-border-medium/20">{timestampStr}</span>
                    )}
                  </div>
                  <p className={cn("text-[13px] font-ui leading-relaxed", isPast || isCurrent ? "text-text-secondary" : "text-text-muted")}>{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Courier Details */}
          <div className="border border-border-medium/40 bg-bg-secondary/30 rounded-[var(--radius-card)] p-6 mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center text-sm font-ui text-text-secondary">
            <div className="h-12 w-12 rounded-full bg-white border border-border-medium/40 flex items-center justify-center shrink-0 shadow-sm">
              <MapPin className="h-5 w-5 text-brand-primary" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-text-primary font-heading uppercase text-xs tracking-widest mb-2">Shipping Destination</p>
              <p><strong className="text-text-primary font-semibold">{activeOrder.shippingAddress.fullName}</strong> — {activeOrder.shippingAddress.addressLine1}</p>
              <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pinCode}</p>
            </div>
          </div>
        </motion.div>
      )}

      {searched && !activeOrder && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[var(--radius-card)] border-2 border-dashed border-border-medium/60 p-12 text-center space-y-4 font-body bg-bg-secondary/30"
        >
          <span className="text-4xl block opacity-80">🕵️</span>
          <h3 className="font-heading font-black text-xl text-text-primary uppercase tracking-wide">Order Not Found</h3>
          <p className="text-sm font-ui text-text-secondary max-w-sm mx-auto">
            We couldn't find any orders matching this ID and phone number. Double-check your details and try again.
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl text-center py-20 px-4 space-y-4 font-body text-xs text-text-secondary">Loading tracking details...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
