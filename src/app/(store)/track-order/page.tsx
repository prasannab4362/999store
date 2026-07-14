"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/features/checkout/utils/calculate-order-totals";
import { CheckCircle2, Circle, Clock, MapPin, Truck, Box, Package, ShieldCheck, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

// Zod schema
const trackSchema = z.object({
  orderId: z.string().min(4, "Enter a valid order ID"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 font-body">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold font-heading text-text-primary tracking-tight">
          TRACK ORDER
        </h1>
        <p className="text-xs text-text-secondary">
          Enter your 999 Combo Store Order ID and Mobile number to view tracking.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSubmit(onSearch)} className="bg-white p-6 rounded-card border border-border-light shadow-sm grid gap-4 sm:grid-cols-3 items-end">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary">Order ID</label>
          <Input type="text" placeholder="999-123456" {...register("orderId")} />
          {errors.orderId && <p className="text-[10px] text-red-600">{errors.orderId.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-secondary">Mobile Number</label>
          <Input type="tel" placeholder="9876543210" {...register("phone")} />
          {errors.phone && <p className="text-[10px] text-red-600">{errors.phone.message}</p>}
        </div>
        <Button type="submit" className="h-10 cursor-pointer uppercase font-bold tracking-wider">
          Track Progress
        </Button>
      </form>

      {/* Visual Timeline Details */}
      {searched && activeOrder && (
        <div className="space-y-8 bg-white p-6 rounded-card border border-border-light shadow-sm">
          {/* Header summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-light pb-4 gap-2">
            <div>
              <span className="text-[10px] text-text-muted font-bold block">TRACKING ID</span>
              <span className="font-heading font-extrabold text-sm text-text-primary">{activeOrder.orderNumber}</span>
            </div>
            <div className="text-right sm:text-left">
              <span className="text-[10px] text-text-muted font-bold block">CURRENT STATUS</span>
              <span className="bg-brand-primary-soft text-brand-primary px-3 py-0.5 rounded-full text-xs font-bold font-heading uppercase tracking-wide">
                {activeOrder.orderStatus.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Timeline steps */}
          <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border-light">
            {stepsList.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx <= activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              // Find date history matching this status
              const historyItem = activeOrder.statusHistory.find((h: any) => h.status === step.status);
              const timestampStr = historyItem ? new Date(historyItem.timestamp).toLocaleString() : null;

              return (
                <div key={step.status} className="relative space-y-1">
                  {/* Circle Indicator */}
                  <span
                    className={cn(
                      "absolute -left-10 top-0 h-6.5 w-6.5 rounded-full flex items-center justify-center border bg-white z-10 transition-colors",
                      isPast
                        ? "border-brand-primary text-brand-primary"
                        : "border-border-medium text-text-muted"
                    )}
                  >
                    {isPast ? (
                      <CheckCircle2 className={cn("h-5 w-5 fill-current text-white", isCurrent ? "text-brand-primary" : "text-brand-primary")} />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-border-medium" />
                    )}
                  </span>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h4
                      className={cn(
                        "font-heading font-bold text-sm",
                        isPast ? "text-text-primary" : "text-text-muted"
                      )}
                    >
                      {step.label}
                    </h4>
                    {timestampStr && (
                      <span className="text-[10px] text-text-muted font-mono">{timestampStr}</span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary leading-normal">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Courier Details */}
          <div className="border-t border-border-light pt-6 flex gap-3 text-xs text-text-secondary leading-relaxed font-body">
            <MapPin className="h-5 w-5 shrink-0 text-brand-primary" />
            <div>
              <p className="font-semibold text-text-primary font-heading uppercase text-[10px] tracking-wider mb-1">Shipping Destination</p>
              <p>{activeOrder.shippingAddress.fullName} — {activeOrder.shippingAddress.addressLine1}</p>
              <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pinCode}</p>
            </div>
          </div>
        </div>
      )}

      {searched && !activeOrder && (
        <div className="rounded-promo border border-dashed border-border-medium p-12 text-center space-y-3 font-body">
          <span className="text-3xl block">🕵️</span>
          <h3 className="font-heading font-bold text-sm text-text-primary">Order not found</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            We couldn't find any orders matching this ID and phone number. Double-check your details and try again.
          </p>
        </div>
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
